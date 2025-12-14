'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { CreateProjectCategoryInput, UpdateProjectCategoryInput, CategoryWithProjectCount } from '@/lib/types';

interface ProjectCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectCategoryInput | UpdateProjectCategoryInput) => Promise<void>;
  category?: CategoryWithProjectCount | null;
}

/**
 * Helper function to generate slug from text
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProjectCategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category,
}: ProjectCategoryFormModalProps) {
  const isEditMode = !!category;

  const [formData, setFormData] = useState({
    name_en: '',
    name_es: '',
    slug: '',
    autoGenerateSlug: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when category changes (edit mode)
  useEffect(() => {
    if (category) {
      setFormData({
        name_en: category.name_en,
        name_es: category.name_es,
        slug: category.slug,
        autoGenerateSlug: false, // Disable auto-generation in edit mode by default
      });
    } else {
      // Reset form for create mode
      setFormData({
        name_en: '',
        name_es: '',
        slug: '',
        autoGenerateSlug: true,
      });
    }
    setErrors({});
  }, [category, isOpen]);

  // Auto-generate slug when name_en changes
  const handleNameEnChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name_en: value,
    }));
  };

  const handleNameEnBlur = () => {
    if (formData.autoGenerateSlug && formData.name_en) {
      const generatedSlug = generateSlug(formData.name_en);
      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  };

  const handleAutoGenerateToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      autoGenerateSlug: checked,
    }));

    // If enabled, immediately generate slug from current name_en
    if (checked && formData.name_en) {
      const generatedSlug = generateSlug(formData.name_en);
      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name_en.trim()) {
      newErrors.name_en = 'English name is required';
    }

    if (!formData.name_es.trim()) {
      newErrors.name_es = 'Spanish name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must be in kebab-case format (lowercase, numbers, and hyphens only)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: CreateProjectCategoryInput | UpdateProjectCategoryInput = {
        name_en: formData.name_en.trim(),
        name_es: formData.name_es.trim(),
        slug: formData.slug.trim(),
      };

      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error('Error submitting category:', error);
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name_en: '',
      name_es: '',
      slug: '',
      autoGenerateSlug: true,
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Project Category' : 'Create New Project Category'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the category details below.'
              : 'Add a new category for organizing projects.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Name (English) */}
            <div className="space-y-2">
              <Label htmlFor="name_en">
                Name (English) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => handleNameEnChange(e.target.value)}
                onBlur={handleNameEnBlur}
                placeholder="e.g., Web Development"
                disabled={isSubmitting}
              />
              {errors.name_en && (
                <p className="text-sm text-red-500">{errors.name_en}</p>
              )}
            </div>

            {/* Name (Spanish) */}
            <div className="space-y-2">
              <Label htmlFor="name_es">
                Name (Spanish) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name_es"
                value={formData.name_es}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name_es: e.target.value }))
                }
                placeholder="e.g., Desarrollo Web"
                disabled={isSubmitting}
              />
              {errors.name_es && (
                <p className="text-sm text-red-500">{errors.name_es}</p>
              )}
            </div>

            {/* Auto-generate Slug Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoGenerateSlug"
                checked={formData.autoGenerateSlug}
                onCheckedChange={handleAutoGenerateToggle}
                disabled={isSubmitting}
              />
              <Label
                htmlFor="autoGenerateSlug"
                className="text-sm font-normal cursor-pointer"
              >
                Auto-generate slug from English name
              </Label>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="e.g., web-development"
                disabled={isSubmitting || formData.autoGenerateSlug}
                className={formData.autoGenerateSlug ? 'bg-muted' : ''}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug}</p>
              )}
              {formData.slug && !errors.slug && (
                <p className="text-sm text-muted-foreground">
                  Preview: <code className="px-1 py-0.5 bg-muted rounded">{formData.slug}</code>
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                ? 'Update Category'
                : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
