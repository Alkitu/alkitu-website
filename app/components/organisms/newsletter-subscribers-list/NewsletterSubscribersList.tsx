'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Download, Trash2, Search, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Subscriber {
  id: string;
  email: string;
  status: 'pending' | 'active' | 'inactive' | 'unsubscribed';
  locale: 'en' | 'es';
  created_at: string;
  verified_at: string | null;
  unsubscribed_at: string | null;
}

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

/**
 * NewsletterSubscribersList Component
 *
 * Displays and manages newsletter subscribers with filtering, search, export, and delete functionality.
 */
export function NewsletterSubscribersList() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20,
  });
  const [filters, setFilters] = useState({
    status: 'all',
    locale: 'all',
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteEmail, setDeleteEmail] = useState<string>('');

  // Fetch subscribers
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
        status: filters.status,
        locale: filters.locale,
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/newsletter-subscribers?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSubscribers(data.data.subscribers);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.error || 'Failed to fetch subscribers');
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('An error occurred while fetching subscribers');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSubscribers();
  }, [pagination.currentPage, filters]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle search
  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle export to CSV
  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/newsletter-subscribers/export');

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('CSV exported successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to export subscribers');
      }
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      toast.error('An error occurred while exporting');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/newsletter-subscribers/${deleteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Subscriber deleted successfully');
        setDeleteId(null);
        setDeleteEmail('');
        fetchSubscribers();
      } else {
        toast.error(data.error || 'Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('An error occurred while deleting');
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'unsubscribed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Locale Filter */}
          <Select value={filters.locale} onValueChange={(value) => handleFilterChange('locale', value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Export Button */}
        <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Subscribed</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : subscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                        subscriber.status
                      )}`}
                    >
                      {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="uppercase">{subscriber.locale}</TableCell>
                  <TableCell>{formatDate(subscriber.created_at)}</TableCell>
                  <TableCell>{formatDate(subscriber.verified_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteId(subscriber.id);
                        setDeleteEmail(subscriber.email);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {!loading && subscribers.length > 0 && (
            <TableCaption>
              Showing {subscribers.length} of {pagination.total} subscribers
            </TableCaption>
          )}
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))
              }
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))
              }
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subscriber <strong>{deleteEmail}</strong>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
