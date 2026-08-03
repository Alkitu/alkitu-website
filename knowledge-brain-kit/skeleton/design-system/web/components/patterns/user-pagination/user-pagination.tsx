'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '~/components/primitives/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/primitives/select';
import { cn } from '~/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PaginationLabels {
  showing: string;
  to: string;
  of: string;
  results: string;
  rowsPerPage: string;
  page: string;
  previous: string;
  next: string;
}

export interface UserPaginationProps {
  /** Current active page (1-indexed) */
  currentPage: number;

  /** Total number of pages available */
  totalPages: number;

  /** Total number of items in the dataset */
  totalItems: number;

  /** Number of items displayed per page */
  pageSize: number;

  /** Callback fired when page changes */
  onPageChange: (page: number) => void;

  /** Callback fired when page size changes */
  onPageSizeChange: (size: number) => void;

  /** Optional CSS class name */
  className?: string;

  /** Available page size options for the select dropdown */
  pageSizeOptions?: number[];

  /** Translated labels for pagination text */
  labels?: Partial<PaginationLabels>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const defaultLabels: PaginationLabels = {
  showing: 'Mostrando',
  to: 'a',
  of: 'de',
  results: 'resultados',
  rowsPerPage: 'Filas por p\u00e1gina',
  page: 'P\u00e1gina',
  previous: 'Anterior',
  next: 'Siguiente',
};

/**
 * UserPagination - Pagination control for data tables and lists
 *
 * A complete pagination control with page size selector,
 * page navigation, and result summary display.
 *
 * @example
 * ```tsx
 * <UserPagination
 *   currentPage={1}
 *   totalPages={10}
 *   totalItems={100}
 *   pageSize={10}
 *   onPageChange={(page) => setPage(page)}
 *   onPageSizeChange={(size) => setPageSize(size)}
 *   pageSizeOptions={[10, 20, 50, 100]}
 * />
 * ```
 */
export function UserPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
  pageSizeOptions = [10, 20, 50, 100],
  labels: labelsProp,
}: UserPaginationProps) {
  const l = { ...defaultLabels, ...labelsProp };
  const startParam = (currentPage - 1) * pageSize + 1;
  const endParam = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      data-slot="user-pagination"
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 py-4',
        className,
      )}
    >
      <div
        data-slot="user-pagination-summary"
        className="text-sm text-muted-foreground order-2 sm:order-1"
      >
        {l.showing}{' '}
        <span className="font-medium">{Math.max(0, startParam)}</span> {l.to}{' '}
        <span className="font-medium">{endParam}</span> {l.of}{' '}
        <span className="font-medium">{totalItems}</span> {l.results}
      </div>

      <div
        data-slot="user-pagination-controls"
        className="flex items-center gap-6 order-1 sm:order-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {l.rowsPerPage}
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground w-[100px] text-right mr-2">
            {l.page} {currentPage} {l.of} {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 !border-input !text-foreground hover:!bg-accent"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            <span className="sr-only">{l.previous}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 !border-input !text-foreground hover:!bg-accent"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            <span className="sr-only">{l.next}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
