/**
 * Banner Upload Component
 *
 * Handles profile banner/cover image upload with preview and delete functionality.
 * Similar to PhotoUpload but optimized for wide banner format (16:9 or 21:9).
 */

'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface BannerUploadProps {
  currentBannerUrl: string | null;
  onBannerChange: (newBannerUrl: string | null) => void;
  maxSizeMB?: number;
}

export function BannerUpload({
  currentBannerUrl,
  onBannerChange,
  maxSizeMB = 10,
}: BannerUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentBannerUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

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

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to server
    await uploadBanner(file);

    // Clean up object URL
    URL.revokeObjectURL(objectUrl);
  };

  /**
   * Upload banner to server
   */
  const uploadBanner = async (file: File) => {
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
        throw new Error(result.message || 'Error al subir el banner');
      }

      // Update parent component
      onBannerChange(result.data.url);
      setPreviewUrl(result.data.url);

      toast.success('Banner subido exitosamente');
    } catch (error) {
      console.error('[BannerUpload] Upload error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error al subir el banner'
      );
      setPreviewUrl(currentBannerUrl);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Delete banner
   */
  const handleDelete = async () => {
    if (!previewUrl) return;

    setDeleting(true);

    try {
      const response = await fetch('/api/admin/profiles/delete-photo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: previewUrl }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al eliminar el banner');
      }

      // Update parent component
      onBannerChange(null);
      setPreviewUrl(null);

      toast.success('Banner eliminado');
    } catch (error) {
      console.error('[BannerUpload] Delete error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar el banner'
      );
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Trigger file input click
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Banner de Perfil
      </label>
      <p className="text-xs text-muted-foreground">
        Imagen de portada para tu perfil. Recomendado: 1200x400px o 1920x400px
        (16:9 / 21:9)
      </p>

      {/* Banner Preview or Upload Area */}
      <div className="relative w-full aspect-[21/6] rounded-lg border-2 border-dashed border-border overflow-hidden bg-secondary/20">
        {previewUrl ? (
          <>
            {/* Banner Image */}
            <Image
              src={previewUrl}
              alt="Banner de perfil"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={uploading || deleting}
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Cambiar
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={uploading || deleting}
                className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Upload Placeholder */
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={uploading}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin" />
                <span className="text-sm font-medium">Subiendo banner...</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12" />
                <span className="text-sm font-medium">
                  Click para subir banner
                </span>
                <span className="text-xs">
                  PNG, JPG, WEBP (max {maxSizeMB}MB)
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
