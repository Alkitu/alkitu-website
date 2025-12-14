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
import { Search, Filter, X, User } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_login_at: string | null;
}

type SortOrder = 'desc' | 'asc';

export function UsersList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filters
  const [searchEmail, setSearchEmail] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, sortOrder, searchEmail]);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      // Fetch users from API endpoint instead of direct Supabase call
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: itemsPerPage.toString(),
        sortOrder,
        ...(searchEmail && { email: searchEmail }),
      });

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to fetch users');
      }

      const result = await response.json();

      setUsers(result.data.users || []);
      setTotalCount(result.data.total || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleClearFilters = () => {
    setSearchEmail('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchEmail;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>
              {totalCount} usuarios encontrados
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Search Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo Electrónico</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email..."
                    value={searchEmail}
                    onChange={(e) => {
                      setSearchEmail(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
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
                    Usuario
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Fecha de Creación
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Último Inicio de Sesión
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Rol
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {user.full_name || user.email?.split('@')[0]}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{formatDate(user.created_at)}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{formatDate(user.last_login_at)}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Admin
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            Cargando usuarios...
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {hasActiveFilters ? 'No se encontraron usuarios con los filtros aplicados' : 'No se encontraron usuarios'}
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
  );
}
