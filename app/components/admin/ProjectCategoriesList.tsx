'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProjectCategoryFormModal from './ProjectCategoryFormModal';
import type {
  CategoryWithProjectCount,
  CreateProjectCategoryInput,
  UpdateProjectCategoryInput,
} from '@/lib/types';

export default function ProjectCategoriesList() {
  const [categories, setCategories] = useState<CategoryWithProjectCount[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryWithProjectCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithProjectCount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories when search term or categories change
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = categories.filter(
        (category) =>
          category.name_en.toLowerCase().includes(term) ||
          category.name_es.toLowerCase().includes(term) ||
          category.slug.toLowerCase().includes(term)
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories?include_count=true');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data.categories);
      } else {
        console.error('Failed to fetch categories:', data.error);
        alert('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('An error occurred while loading categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateProjectCategoryInput | UpdateProjectCategoryInput) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert('Category created successfully!');
        fetchCategories(); // Refresh list
      } else {
        alert(`Failed to create category: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('An error occurred while creating the category');
    }
  };

  const handleUpdate = async (data: CreateProjectCategoryInput | UpdateProjectCategoryInput) => {
    if (!editingCategory) return;

    try {
      const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert('Category updated successfully!');
        fetchCategories(); // Refresh list
      } else {
        alert(`Failed to update category: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('An error occurred while updating the category');
    }
  };

  const handleDelete = async (category: CategoryWithProjectCount) => {
    // Show warning if category has associated projects
    if (category.project_count > 0) {
      const confirmed = confirm(
        `Warning: This category is used by ${category.project_count} project(s).\n\n` +
        `You cannot delete a category that is in use. Please remove this category from all projects first.`
      );

      if (!confirmed) return;

      // Even if confirmed, the API will reject the deletion
      // This is just to inform the user
      alert('Cannot delete category. It is still in use by projects.');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete the category "${category.name_en}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('Category deleted successfully!');
        fetchCategories(); // Refresh list
      } else {
        alert(`Failed to delete category: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred while deleting the category');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: CategoryWithProjectCount) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (data: CreateProjectCategoryInput | UpdateProjectCategoryInput) => {
    if (editingCategory) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage categories for organizing projects
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>New Category</Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by name or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {searchTerm && (
          <Button variant="outline" onClick={() => setSearchTerm('')}>
            Clear
          </Button>
        )}
      </div>

      {/* Categories Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCategories.length} of {categories.length} categories
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Name (EN)</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Name (ES)</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Projects</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    {searchTerm ? 'No categories found matching your search' : 'No categories yet'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{category.name_en}</td>
                    <td className="px-4 py-3 text-sm">{category.name_es}</td>
                    <td className="px-4 py-3 text-sm">
                      <code className="px-2 py-1 bg-muted rounded text-xs">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {category.project_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditModal(category)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <ProjectCategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        category={editingCategory}
      />
    </div>
  );
}
