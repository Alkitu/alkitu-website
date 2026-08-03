'use client';

import * as React from 'react';
import type { FloorLevel } from '../types';
import { parseSvgToAreas } from '../utils/svg-parser';
import { Button } from '~/components/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/primitives/card';
import { Input } from '~/components/primitives/input';
import { Label } from '~/components/primitives/label';
import { Badge } from '~/components/primitives/badge';
import { Upload, FileUp } from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// SvgImporter — upload and parse an SVG floor plan
// ---------------------------------------------------------------------------

export interface SvgImporterProps {
  onImport: (floor: FloorLevel) => void;
  floorName?: string;
  floorOrder?: number;
  className?: string;
}

export function SvgImporter({
  onImport,
  floorName = 'Ground Floor',
  floorOrder = 0,
  className,
}: SvgImporterProps) {
  const [name, setName] = React.useState(floorName);
  const [svgContent, setSvgContent] = React.useState<string | null>(null);
  const [parseResult, setParseResult] = React.useState<{
    areaCount: number;
    totalShapes: number;
    skippedShapes: number;
    viewBox: string;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const text = await file.text();
      if (!text.includes('<svg')) {
        throw new Error('File does not appear to be a valid SVG');
      }
      setSvgContent(text);
      const result = parseSvgToAreas(text);
      setParseResult({
        areaCount: result.areas.length,
        totalShapes: result.totalShapes,
        skippedShapes: result.skippedShapes,
        viewBox: result.viewBox,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse SVG');
      setSvgContent(null);
      setParseResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/svg+xml' || file.name.endsWith('.svg'))) {
      handleFile(file);
    } else {
      setError('Please drop an SVG file');
    }
  };

  const handleImport = () => {
    if (!svgContent) return;
    const { areas, viewBox } = parseSvgToAreas(svgContent);
    const floor: FloorLevel = {
      id: `floor-${Date.now()}`,
      name,
      order: floorOrder,
      svgContent,
      areas,
      viewBox,
    };
    onImport(floor);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileUp size={16} />
          Import SVG Floor Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Floor Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            'hover:border-primary/50 hover:bg-primary/5',
            svgContent ? 'border-success/50 bg-success/5' : 'border-border',
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {svgContent ? 'SVG loaded — click to replace' : 'Drop an SVG file here or click to browse'}
          </p>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Parse result */}
        {parseResult && (
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{parseResult.areaCount} areas detected</Badge>
              {parseResult.skippedShapes > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {parseResult.skippedShapes} shapes filtered out of {parseResult.totalShapes}
                </Badge>
              )}
            </div>
            <span className="text-muted-foreground text-xs">
              viewBox: {parseResult.viewBox} — Small shapes, outlines, and decorations are auto-filtered
            </span>
          </div>
        )}

        <Button onClick={handleImport} disabled={!svgContent} className="w-full">
          Import Floor
        </Button>
      </CardContent>
    </Card>
  );
}
