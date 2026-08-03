'use client';

import { Plus, X, HelpCircle } from 'lucide-react';

interface GeoQAManagerProps {
  preguntas: string[];
  respuestas: string[];
  onChange: (preguntas: string[], respuestas: string[]) => void;
}

/**
 * Question/answer pairs for the GEO layer.
 *
 * Edited as pairs on purpose: the two arrays must stay index-aligned or the
 * FAQPage schema is suppressed entirely. Managing them as separate lists is
 * exactly how they drift apart, so the UI never lets them.
 */
export function GeoQAManager({ preguntas, respuestas, onChange }: GeoQAManagerProps) {
  const pairs = preguntas.map((pregunta, i) => ({
    pregunta,
    respuesta: respuestas[i] ?? '',
  }));

  const emit = (next: Array<{ pregunta: string; respuesta: string }>) =>
    onChange(next.map((p) => p.pregunta), next.map((p) => p.respuesta));

  const add = () => emit([...pairs, { pregunta: '', respuesta: '' }]);

  const update = (index: number, field: 'pregunta' | 'respuesta', value: string) =>
    emit(pairs.map((p, i) => (i === index ? { ...p, [field]: value } : p)));

  const remove = (index: number) => emit(pairs.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Preguntas y respuestas (GEO)
            <span className="ml-2 text-xs text-muted-foreground">({pairs.length})</span>
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Generan el schema <code>FAQPage</code>. Cada pregunta necesita su respuesta: si
            falta alguna, el schema no se emite.
          </p>
        </div>
        <button
          type="button"
          onClick={add}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3 w-3" />
          Agregar
        </button>
      </div>

      {pairs.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-8 text-center">
          <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Sin preguntas. Este post no será citable como FAQ por motores generativos.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pairs.map((pair, index) => {
            const incomplete = !pair.pregunta.trim() || !pair.respuesta.trim();
            return (
              <div
                key={index}
                className={`space-y-2 rounded-md border p-4 ${
                  incomplete ? 'border-amber-500/50 bg-amber-500/5' : 'border-border bg-background'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-3 w-3" />
                    Eliminar
                  </button>
                </div>
                <input
                  type="text"
                  value={pair.pregunta}
                  onChange={(e) => update(index, 'pregunta', e.target.value)}
                  placeholder="¿Qué es un certificado SSL?"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <textarea
                  value={pair.respuesta}
                  onChange={(e) => update(index, 'respuesta', e.target.value)}
                  placeholder="Respuesta breve y citable, autocontenida."
                  rows={2}
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
