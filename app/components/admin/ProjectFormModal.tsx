'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TagManager from './TagManager';
import URLManager from './URLManager';
import GalleryManager from './GalleryManager';
import type { ProjectWithCategories, Category, CreateProjectInput, UpdateProjectInput } from '@/lib/types';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProjectInput | UpdateProjectInput) => Promise<void>;
  project?: ProjectWithCategories | null;
  categories: Category[];
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  project,
  categories,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState<CreateProjectInput>({
    slug: '',
    title_en: '',
    title_es: '',
    description_en: '',
    description_es: '',
    about_en: '',
    about_es: '',
    image: '',
    gallery: [],
    tags: [],
    urls: [],
    is_active: true,
    display_order: 0,
    category_ids: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        slug: project.slug,
        title_en: project.title_en,
        title_es: project.title_es,
        description_en: project.description_en,
        description_es: project.description_es,
        about_en: project.about_en || '',
        about_es: project.about_es || '',
        image: project.image,
        gallery: project.gallery || [],
        tags: project.tags || [],
        urls: project.urls || [],
        is_active: project.is_active,
        display_order: project.display_order,
        category_ids: project.categories.map((c) => c.id),
      });
    } else {
      setFormData({
        slug: '',
        title_en: '',
        title_es: '',
        description_en: '',
        description_es: '',
        about_en: '',
        about_es: '',
        image: '',
        gallery: [],
        tags: [],
        urls: [],
        is_active: true,
        display_order: 0,
        category_ids: [],
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter((id) => id !== categoryId)
        : [...prev.category_ids, categoryId],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>
            {project ? 'Update project information' : 'Add a new project to your portfolio'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Slug <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="proyect_1"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Main Image URL <span className="text-destructive">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Localized Content */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Content</h3>

            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="es">Spanish</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title (EN) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (EN) <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">About (EN)</label>
                  <textarea
                    value={formData.about_en || ''}
                    onChange={(e) => setFormData({ ...formData, about_en: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </TabsContent>

              <TabsContent value="es" className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title (ES) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title_es}
                    onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (ES) <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description_es}
                    onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">About (ES)</label>
                  <textarea
                    value={formData.about_es || ''}
                    onChange={(e) => setFormData({ ...formData, about_es: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              Categories <span className="text-destructive">*</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 px-3 py-2 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.category_ids.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{category.name_en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tags</h3>
            <TagManager
              tags={formData.tags || []}
              onChange={(tags) => setFormData({ ...formData, tags })}
            />
          </div>

          {/* Gallery */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Gallery</h3>
            <GalleryManager
              images={formData.gallery || []}
              onChange={(gallery) => setFormData({ ...formData, gallery })}
            />
          </div>

          {/* URLs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">URLs</h3>
            <URLManager
              urls={formData.urls || []}
              onChange={(urls) => setFormData({ ...formData, urls })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.category_ids.length === 0}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
