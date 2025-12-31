/**
 * Photo Upload Component
 *
 * Handles profile photo upload with preview, progress, and delete functionality.
 * Integrates with Vercel Blob Storage API.
 */

'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoUploadProps {
  currentPhotoUrl: string | null;
  onPhotoChange: (newPhotoUrl: string | null) => void;
  maxSizeMB?: number;
}

export function PhotoUpload({
  currentPhotoUrl,
  onPhotoChange,
  maxSizeMB = 10,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  /**
   * Sync preview URL when currentPhotoUrl changes from parent
   * This ensures the component updates when the profile data is loaded
   */
  useEffect(() => {
    setPreviewUrl(currentPhotoUrl);
    // If there's a URL, mark as loading until image loads
    if (currentPhotoUrl) {
      setImageLoading(true);
    } else {
      setImageLoading(false);
    }
  }, [currentPhotoUrl]);

  /**
   * Handle file selection
   */
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      toast.error(`El archivo debe ser menor a ${maxSizeMB}MB`);
      return;
    }

    // Show preview immediately with loading state
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setImageLoading(true);

    // Upload to server
    await uploadPhoto(file);

    // Clean up object URL
    URL.revokeObjectURL(objectUrl);
  };

  /**
   * Upload photo to Vercel Blob
   */
  const uploadPhoto = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/profiles/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al subir la foto');
      }

      // Update parent component and preview
      onPhotoChange(result.data.url);
      setPreviewUrl(result.data.url);
      // imageLoading will be set to false by onLoad event

      toast.success('Foto subida exitosamente');
    } catch (error) {
      console.error('[PhotoUpload] Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al subir la foto');

      // Reset preview and loading state on error
      setPreviewUrl(currentPhotoUrl);
      setImageLoading(false);
    } finally {
      setUploading(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Delete current photo
   */
  const handleDelete = async () => {
    if (!currentPhotoUrl) return;

    setDeleting(true);

    try {
      const response = await fetch('/api/admin/profiles/delete-photo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: currentPhotoUrl }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al eliminar la foto');
      }

      // Update parent component and reset states
      onPhotoChange(null);
      setPreviewUrl(null);
      setImageLoading(false);

      toast.success('Foto eliminada exitosamente');
    } catch (error) {
      console.error('[PhotoUpload] Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar la foto');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">
        Foto de Perfil
      </label>

      {/* Preview */}
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative h-32 w-32">
            {/* Show skeleton while image is loading */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-secondary ring-2 ring-border animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            <Image
              src={previewUrl}
              alt="Profile photo preview"
              fill
              className={`rounded-full object-cover ring-2 ring-border transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                toast.error('Error al cargar la imagen');
              }}
            />

            {/* Show overlay during upload/delete operations */}
            {(uploading || deleting) && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary ring-2 ring-border">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || deleting}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {previewUrl ? 'Cambiar Foto' : 'Subir Foto'}
              </>
            )}
          </button>

          {/* Delete Button */}
          {previewUrl && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={uploading || deleting}
              className="inline-flex items-center gap-2 rounded-md border border-destructive bg-transparent px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Eliminar Foto
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        Formatos permitidos: JPEG, PNG, WebP, GIF. Tamaño máximo: {maxSizeMB}MB.
      </p>
    </div>
  );
}
