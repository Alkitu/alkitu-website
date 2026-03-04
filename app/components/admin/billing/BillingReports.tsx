'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface IncomeRow {
  label: string;
  subtotal: number;
  tax: number;
  total: number;
  count: number;
}

interface TaxBreakdown {
  tax_rate: number;
  tax_type: string;
  base: number;
  cuota: number;
}

interface TaxPeriodRow {
  period: string;
  taxes: TaxBreakdown[];
}

type Tab = 'income' | 'tax';

export function BillingReports() {
  const currentYear = new Date().getFullYear();
  const [tab, setTab] = useState<Tab>('income');
  const [year, setYear] = useState(String(currentYear));
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [incomeData, setIncomeData] = useState<IncomeRow[]>([]);
  const [taxData, setTaxData] = useState<TaxPeriodRow[]>([]);

  useEffect(() => {
    fetchReport();
  }, [tab, year, period]);

  async function fetchReport() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/billing/reports?type=${tab}&year=${year}&period=${period}`);
      const json = await res.json();
      if (json.success) {
        if (tab === 'income') {
          setIncomeData(json.data.data || []);
        } else {
          setTaxData(json.data.data || []);
        }
      } else {
        toast.error('Error al cargar informe');
      }
    } catch {
      toast.error('Error al cargar informe');
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
  }

  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

  // Totals for income report
  const incomeTotals = incomeData.reduce(
    (acc, row) => ({
      subtotal: acc.subtotal + row.subtotal,
      tax: acc.tax + row.tax,
      total: acc.total + row.total,
      count: acc.count + row.count,
    }),
    { subtotal: 0, tax: 0, total: 0, count: 0 }
  );

  const periodLabels: Record<string, string> = {
    'Q1': 'T1 (Ene-Mar)',
    'Q2': 'T2 (Abr-Jun)',
    'Q3': 'T3 (Jul-Sep)',
    'Q4': 'T4 (Oct-Dic)',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Informes de facturacion</h2>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-1 bg-muted p-1 rounded-md">
          <Button
            variant={tab === 'income' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTab('income')}
          >
            Ingresos
          </Button>
          <Button
            variant={tab === 'tax' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTab('tax')}
          >
            Impuestos (IVA)
          </Button>
        </div>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensual</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : tab === 'income' ? (
        <Card>
          <CardHeader>
            <CardTitle>Ingresos {year} ({period === 'monthly' ? 'Mensual' : period === 'quarterly' ? 'Trimestral' : 'Anual'})</CardTitle>
          </CardHeader>
          <CardContent>
            {incomeData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No hay datos para el periodo seleccionado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periodo</TableHead>
                    <TableHead className="text-right">Facturas</TableHead>
                    <TableHead className="text-right">Base imponible</TableHead>
                    <TableHead className="text-right">Impuestos</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.label}</TableCell>
                      <TableCell className="text-right">{row.count}</TableCell>
                      <TableCell className="text-right">{formatPrice(row.subtotal)}</TableCell>
                      <TableCell className="text-right">{formatPrice(row.tax)}</TableCell>
                      <TableCell className="text-right font-bold">{formatPrice(row.total)}</TableCell>
                    </TableRow>
                  ))}
                  {/* Totals row */}
                  <TableRow className="border-t-2 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">{incomeTotals.count}</TableCell>
                    <TableCell className="text-right">{formatPrice(incomeTotals.subtotal)}</TableCell>
                    <TableCell className="text-right">{formatPrice(incomeTotals.tax)}</TableCell>
                    <TableCell className="text-right">{formatPrice(incomeTotals.total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Desglose IVA {year} ({period === 'monthly' ? 'Mensual' : period === 'quarterly' ? 'Trimestral' : 'Anual'})</CardTitle>
          </CardHeader>
          <CardContent>
            {taxData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No hay datos para el periodo seleccionado.</p>
            ) : (
              <div className="space-y-6">
                {taxData.map((periodRow, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold mb-2 text-sm">
                      {periodLabels[periodRow.period] || `Mes ${periodRow.period}`}
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Tipo impositivo</TableHead>
                          <TableHead className="text-right">Base imponible</TableHead>
                          <TableHead className="text-right">Cuota</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {periodRow.taxes.map((tax, tidx) => (
                          <TableRow key={tidx}>
                            <TableCell>{tax.tax_type}</TableCell>
                            <TableCell className="text-right">{tax.tax_rate}%</TableCell>
                            <TableCell className="text-right">{formatPrice(tax.base)}</TableCell>
                            <TableCell className="text-right font-bold">{formatPrice(tax.cuota)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t font-bold">
                          <TableCell colSpan={2}>Subtotal periodo</TableCell>
                          <TableCell className="text-right">
                            {formatPrice(periodRow.taxes.reduce((s, t) => s + t.base, 0))}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPrice(periodRow.taxes.reduce((s, t) => s + t.cuota, 0))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}

                {/* Grand totals */}
                <div className="border-t-2 pt-4">
                  <div className="flex justify-end gap-8 text-sm font-bold">
                    <span>Total Base: {formatPrice(taxData.reduce((s, p) => s + p.taxes.reduce((ts, t) => ts + t.base, 0), 0))}</span>
                    <span>Total Cuota: {formatPrice(taxData.reduce((s, p) => s + p.taxes.reduce((ts, t) => ts + t.cuota, 0), 0))}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
