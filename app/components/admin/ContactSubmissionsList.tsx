'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Mail, Eye, Calendar } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

type SortOrder = 'desc' | 'asc';
type StatusFilter = 'all' | 'pending' | 'read' | 'replied' | 'archived';

export function ContactSubmissionsList() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Detail modal
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage, itemsPerPage, sortOrder, searchTerm, statusFilter]);

  const fetchSubmissions = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: itemsPerPage.toString(),
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/contact-submissions?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to fetch submissions');
      }

      const result = await response.json();

      setSubmissions(result.data.submissions || []);
      setTotalCount(result.data.total || 0);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ContactSubmission['status']) => {
    try {
      const response = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh submissions
      await fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleViewDetail = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);

    // Mark as read if it's pending
    if (submission.status === 'pending') {
      handleStatusChange(submission.id, 'read');
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: ContactSubmission['status']) => {
    const variants = {
      pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      read: { label: 'Leído', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      replied: { label: 'Respondido', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      archived: { label: 'Archivado', className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
    };

    const variant = variants[status];
    return (
      <Badge className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mensajes de Contacto</CardTitle>
              <CardDescription>
                {totalCount} mensajes encontrados
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="mt-4 space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nombre, email o asunto..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select value={statusFilter} onValueChange={(value: StatusFilter) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="read">Leídos</SelectItem>
                      <SelectItem value="replied">Respondidos</SelectItem>
                      <SelectItem value="archived">Archivados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ordenar por</label>
                  <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Más recientes</SelectItem>
                      <SelectItem value="asc">Más antiguos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Items Per Page */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Mostrar</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">por página</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages || 1}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Remitente
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Asunto
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Estado
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Fecha
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Idioma
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {submission.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {submission.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm max-w-xs truncate">
                          {submission.subject}
                        </div>
                      </td>
                      <td className="p-4">
                        <Select
                          value={submission.status}
                          onValueChange={(value: ContactSubmission['status']) =>
                            handleStatusChange(submission.id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue>
                              {getStatusBadge(submission.status)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="read">Leído</SelectItem>
                            <SelectItem value="replied">Respondido</SelectItem>
                            <SelectItem value="archived">Archivado</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(submission.created_at)}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {submission.locale.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(submission)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8 text-muted-foreground">
              Cargando mensajes...
            </div>
          )}

          {!loading && submissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {hasActiveFilters ? 'No se encontraron mensajes con los filtros aplicados' : 'No se encontraron mensajes'}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {renderPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === '...' ? (
                        <span className="px-4 py-2 text-muted-foreground">...</span>
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(page as number)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Mensaje</DialogTitle>
            <DialogDescription>
              Información completa del mensaje de contacto
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="text-sm mt-1">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm mt-1">{selectedSubmission.email}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Asunto</label>
                <p className="text-sm mt-1">{selectedSubmission.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Mensaje</label>
                <div className="text-sm mt-1 p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Idioma</label>
                  <p className="text-sm mt-1">{selectedSubmission.locale.toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP</label>
                  <p className="text-sm mt-1 font-mono">{selectedSubmission.ip_address || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                <p className="text-xs mt-1 font-mono text-muted-foreground break-all">
                  {selectedSubmission.user_agent || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Envío</label>
                  <p className="text-sm mt-1">{formatDate(selectedSubmission.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                  <p className="text-sm mt-1">{formatDate(selectedSubmission.updated_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <Select
                  value={selectedSubmission.status}
                  onValueChange={(value: ContactSubmission['status']) => {
                    handleStatusChange(selectedSubmission.id, value);
                    setSelectedSubmission({ ...selectedSubmission, status: value });
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="read">Leído</SelectItem>
                    <SelectItem value="replied">Respondido</SelectItem>
                    <SelectItem value="archived">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
