'use client';

/**
 * DiceRoller — mesa de dados (control de tipo y cantidad).
 * Controles a la izquierda (tipo d6/d20/d100 + cantidad para el d6) y un dado
 * grande al centro que GIRA y cambia de número al pulsarlo. Panel marca, dado
 * blanco, número en marca. Plegable. Local por dispositivo (Math.random, sin SSR).
 * Sin canvas: CSS puro (nítido, animable con transform, hereda tokens, accesible).
 */

import * as React from 'react';
import { ChevronUp, Dices } from 'lucide-react';

type DieType = 'd4' | 'd6' | 'd20' | 'd100';

type Roll = { id: number; label: string; results: number[]; total: number };

const SIDES: Record<DieType, number> = { d4: 4, d6: 6, d20: 20, d100: 100 };
/** Dados pequeños con control de cantidad (varios de golpe). */
const CON_CANTIDAD: DieType[] = ['d4', 'd6'];

/** Silueta del dado según el tipo (esquinas redondeadas). d6 = cuadrado. */
const FORMA: Record<DieType, { puntos?: string; nudge?: number }> = {
  d4: { puntos: '50,16 88,80 12,80', nudge: 0.13 }, // triángulo
  d6: {}, // cuadrado (rect redondeado)
  d20: { puntos: '50,8 86,29 86,71 50,92 14,71 14,29' }, // hexágono (icosaedro en 2D)
  d100: { puntos: '50,8 92,50 50,92 8,50' }, // diamante
};

/** Dibuja la silueta blanca del dado en un SVG que llena el botón. */
function DieShape({ type }: { type: DieType }) {
  const f = FORMA[type];
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 h-full w-full"
      style={{ filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.18))' }}
      aria-hidden
    >
      {f.puntos ? (
        <polygon points={f.puntos} fill="#fff" stroke="#fff" strokeWidth={12} strokeLinejoin="round" />
      ) : (
        <rect x="6" y="6" width="88" height="88" rx="18" fill="#fff" />
      )}
    </svg>
  );
}
const PRIMARY = 'var(--primary)';

export interface DiceRollerProps {
  className?: string;
  labels?: { titulo?: string; total?: string; historial?: string; tirar?: string };
}

export function DiceRoller({ className, labels }: DiceRollerProps) {
  const [open, setOpen] = React.useState(true);
  const [type, setType] = React.useState<DieType>('d6');
  const [d6count, setD6count] = React.useState(1);
  const [display, setDisplay] = React.useState<number | null>(null);
  const [rolling, setRolling] = React.useState(false);
  const [rot, setRot] = React.useState(0);
  const [last, setLast] = React.useState<Roll | null>(null);
  const [history, setHistory] = React.useState<Roll[]>([]);
  const idRef = React.useRef(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const titulo = labels?.titulo ?? 'Dados';
  const totalLbl = labels?.total ?? 'Total';
  const historialLbl = labels?.historial ?? 'Últimas tiradas';
  const tirarLbl = labels?.tirar ?? 'Toca el dado para tirar';

  React.useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  function settle(r: Roll) {
    setDisplay(r.total);
    setLast(r);
    setHistory((h) => [r, ...h].slice(0, 8));
    setRolling(false);
  }

  function roll() {
    if (rolling) return;
    const count = CON_CANTIDAD.includes(type) ? d6count : 1;
    const sides = SIDES[type];
    const results = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides));
    const total = results.reduce((a, b) => a + b, 0);
    const label = count > 1 ? `${count}${type}` : type;
    const r: Roll = { id: (idRef.current += 1), label, results, total };

    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      settle(r);
      return;
    }

    setRolling(true);
    setRot((v) => v + 720);
    let ticks = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDisplay(1 + Math.floor(Math.random() * sides)); // parpadeo mientras gira
      ticks += 1;
      if (ticks >= 9) {
        if (timerRef.current) clearInterval(timerRef.current);
        settle(r);
      }
    }, 55);
  }

  const tipos: DieType[] = ['d4', 'd6', 'd20', 'd100'];

  return (
    <div className={`bg-background ${className ?? ''}`}>
      {/* Mesa de dados (panel rojo) — zona de datos plegable */}
      {open && (
        <div className="p-3">
          <div
            className="flex items-stretch gap-4 rounded-2xl p-4"
            style={{ backgroundColor: PRIMARY }}
          >
            {/* IZQUIERDA — controles */}
            <div className="flex w-32 flex-col gap-2">
              {tipos.map((t) => {
                const sel = t === type;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    aria-pressed={sel}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      sel ? 'border-white bg-white' : 'border-white/50 text-white hover:border-white'
                    }`}
                    style={sel ? { color: PRIMARY } : undefined}
                  >
                    {t}
                  </button>
                );
              })}

              {CON_CANTIDAD.includes(type) && (
                <div className="mt-1 flex items-center justify-between rounded-full border border-white/50 px-1">
                  <button
                    type="button"
                    onClick={() => setD6count((c) => Math.max(1, c - 1))}
                    className="px-2 py-1 text-white/90 hover:text-white"
                    aria-label="Menos dados"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold tabular-nums text-white">{d6count}</span>
                  <button
                    type="button"
                    onClick={() => setD6count((c) => Math.min(6, c + 1))}
                    className="px-2 py-1 text-white/90 hover:text-white"
                    aria-label="Más dados"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* CENTRO — el dado */}
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
              <button
                type="button"
                onClick={roll}
                aria-label={tirarLbl}
                className="relative grid h-24 w-24 place-items-center rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-white/40 md:h-28 md:w-28"
                style={{
                  transform: `rotate(${rot}deg)`,
                  transition: 'transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                <DieShape type={type} />
                <span
                  className="relative z-10 text-5xl font-bold tabular-nums md:text-6xl"
                  style={{
                    color: PRIMARY,
                    transform: FORMA[type].nudge ? `translateY(${FORMA[type].nudge! * 100}%)` : undefined,
                  }}
                >
                  {display ?? '·'}
                </span>
              </button>
              <span className="text-xs text-white/80">
                {last && !rolling ? (
                  <>
                    {totalLbl} {CON_CANTIDAD.includes(type) && d6count > 1 ? `· ${last.results.join(' + ')}` : `· ${last.label}`}
                  </>
                ) : (
                  tirarLbl
                )}
              </span>
            </div>
          </div>

          {/* Historial — una sola línea con scroll horizontal */}
          {history.length > 1 && (
            <div className="mt-3 px-1">
              <p className="text-xs uppercase tracking-wide text-neutral-400">{historialLbl}</p>
              <ul className="mt-1.5 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {history.map((r) => (
                  <li
                    key={r.id}
                    className="shrink-0 whitespace-nowrap rounded-full bg-accent px-2.5 py-1 text-xs tabular-nums text-neutral-600"
                  >
                    {r.label}: <span className="font-semibold text-foreground">{r.total}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Línea de división = botón de plegado (icono de dados + flecha) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={titulo}
        className="flex w-full items-center justify-center gap-2 border-b border-neutral-300/70 py-2 text-neutral-400 transition-colors hover:text-foreground"
      >
        <Dices className="h-4 w-4" style={{ color: PRIMARY }} />
        <ChevronUp className={`h-4 w-4 transition-transform ${open ? '' : 'rotate-180'}`} />
      </button>
    </div>
  );
}

export default DiceRoller;
