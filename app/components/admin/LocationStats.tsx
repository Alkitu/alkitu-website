'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin } from "lucide-react";
import countriesData from '@/lib/data/countries.json';

interface LocationData {
  country: string;
  region: string;
  count: number;
}

interface AggregatedStats {
  byCountry: { country: string; count: number }[];
  byRegion: { region: string; country: string; count: number }[];
}

const getCountryEmoji = (code: string) => {
  const country = countriesData.countries.find(c => c.code === code);
  return country?.emoji || '🌍';
};

const getCountryName = (code: string) => {
  try {
    return new Intl.DisplayNames(['es'], { type: 'region' }).of(code) || code;
  } catch (e) {
    return code;
  }
};

export function LocationStats() {
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchLocationStats();
  }, []);

  const fetchLocationStats = async () => {
    setLoading(true);

    try {
      // Fetch sessions with location data (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data } = await supabase
        .from('sessions')
        .select('country, region')
        .gte('started_at', thirtyDaysAgo.toISOString())
        .not('country', 'is', null);

      if (!data) {
        setStats({ byCountry: [], byRegion: [] });
        return;
      }

      // Aggregate by Country
      const countryCounts: { [key: string]: number } = {};
      // Aggregate by Region
      const regionCounts: { [key: string]: { country: string, count: number } } = {};

      data.forEach(session => {
        const country = session.country || 'Desconocido';
        const region = session.region || 'Desconocido';
        
        // Country
        countryCounts[country] = (countryCounts[country] || 0) + 1;

        // Region (Key: "Country - Region" to avoid collisions)
        const regionKey = `${country} - ${region}`;
        if (!regionCounts[regionKey]) {
          regionCounts[regionKey] = { country, count: 0 };
        }
        regionCounts[regionKey].count++;
      });

      const byCountry = Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 countries

      const byRegion = Object.keys(regionCounts)
        .map(key => {
          const [country, region] = key.split(' - ');
          return {
            country,
            region,
            count: regionCounts[key].count
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 regions

      setStats({ byCountry, byRegion });

    } catch (error) {
      console.error('Error fetching location stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Cargando datos de ubicación...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-muted-foreground">No hay datos de ubicación disponibles</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Countries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Países</CardTitle>
              <CardDescription>Visitantes por país (últimos 30 días)</CardDescription>
            </div>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.byCountry.length > 0 ? (
              stats.byCountry.map((item, index) => (
                <div key={item.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{getCountryEmoji(item.country)}</span>
                        <span className="text-sm font-medium">{getCountryName(item.country)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.country}</span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.count} sesiones</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No hay datos disponibles</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Regions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Regiones</CardTitle>
              <CardDescription>Visitantes por estado/región (últimos 30 días)</CardDescription>
            </div>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.byRegion.length > 0 ? (
              stats.byRegion.map((item, index) => (
                <div key={`${item.country}-${item.region}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">{item.region}</span>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs">{getCountryEmoji(item.country)}</span>
                        <span className="text-xs text-muted-foreground truncate">{getCountryName(item.country)}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{item.count} sesiones</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No hay datos disponibles</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
