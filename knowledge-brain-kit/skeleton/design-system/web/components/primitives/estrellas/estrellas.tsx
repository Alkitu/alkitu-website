/**
 * Rating en estrellas con soporte de medias (p. ej. 4.5) sin glifos exóticos.
 * En vez del carácter de "media estrella" (que muchas fuentes no tienen y pintan
 * como tofu/rayas), superpone una capa de estrellas llenas recortada por ancho %.
 * Relleno en color de marca (token primary). ds:primitives/estrellas.
 */
export function Estrellas({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const cls = size === "md" ? "text-base" : "text-sm";
  return (
    <span
      className={`inline-flex items-center gap-2 ${cls}`}
      aria-label={`Valoración ${rating} de 5`}
    >
      <span
        className="relative inline-block whitespace-nowrap leading-none"
        aria-hidden="true"
      >
        <span className="text-neutral-300">★★★★★</span>
        <span
          className="absolute inset-0 overflow-hidden whitespace-nowrap"
          style={{ width: `${pct}%`, color: "var(--primary)" }}
        >
          ★★★★★
        </span>
      </span>
      <span className="text-neutral-500">
        {size === "md" ? `${rating.toFixed(1)} / 5` : rating.toFixed(1)}
      </span>
    </span>
  );
}
