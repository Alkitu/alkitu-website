'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SessionDetail } from './SessionDetail';
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
import { ChevronDown, ChevronUp, Search, Filter, X } from "lucide-react";

interface Session {
  id: string;
  session_fingerprint: string;
  ip_address: string | null;
  user_agent: string;
  started_at: string;
  last_activity_at: string;
  total_page_views: number;
  country?: string; // Added country field
}

import countriesData from '@/lib/data/countries.json';

const getCountryEmoji = (code?: string | null) => {
  if (!code) return '🌍';
  const country = countriesData.countries.find(c => c.code === code);
  return country?.emoji || '🌍';
};

type SortOrder = 'desc' | 'asc';

export function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filters
  const [searchIP, setSearchIP] = useState('');
  const [searchUserAgent, setSearchUserAgent] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchSessions();
  }, [currentPage, itemsPerPage, sortOrder, searchIP, searchUserAgent]);

  const fetchSessions = async () => {
    setLoading(true);

    try {
      // Build query - select sessions and count related page_views
      let query = supabase
        .from('sessions')
        .select(`
          *,
          page_views:page_views(count)
        `, { count: 'exact' });

      // Apply filters
      if (searchIP) {
        query = query.ilike('ip_address', `%${searchIP}%`);
      }
      if (searchUserAgent) {
        query = query.ilike('user_agent', `%${searchUserAgent}%`);
      }

      // Apply sorting
      query = query.order('started_at', { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Transform data to add total_page_views
      const sessionsWithCount = (data || []).map(session => ({
        ...session,
        total_page_views: session.page_views?.[0]?.count || 0
      }));

      setSessions(sessionsWithCount);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleClearFilters = () => {
    setSearchIP('');
    setSearchUserAgent('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchIP || searchUserAgent;

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

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return '< 1 min';
    if (diffMins < 60) return `${diffMins} min`;

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
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
            <CardTitle>Sesiones de Usuario</CardTitle>
            <CardDescription>
              {totalCount} sesiones encontradas
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Search IP */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Dirección IP</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por IP..."
                    value={searchIP}
                    onChange={(e) => {
                      setSearchIP(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Search User Agent */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Navegador</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar navegador..."
                    value={searchUserAgent}
                    onChange={(e) => {
                      setSearchUserAgent(e.target.value);
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
                    <SelectItem value="asc">Más antiguas</SelectItem>
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
        <div className="space-y-3">
          {sessions.map(session => (
            <Card
              key={session.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedSessionId(
                selectedSessionId === session.id ? null : session.id
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium flex items-center gap-2">
                        <span>{getCountryEmoji(session.country)}</span>
                        <span>{session.ip_address || 'IP Desconocida'}</span>
                      </span>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {session.total_page_views} páginas
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {session.user_agent}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Inicio: {formatDate(session.started_at)}</span>
                      <span>•</span>
                      <span>Duración: {formatDuration(session.started_at, session.last_activity_at)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {selectedSessionId === session.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {selectedSessionId === session.id && (
                  <div className="mt-4 pt-4 border-t">
                    <SessionDetail sessionId={session.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            Cargando sesiones...
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {hasActiveFilters ? 'No se encontraron sesiones con los filtros aplicados' : 'No se encontraron sesiones'}
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
