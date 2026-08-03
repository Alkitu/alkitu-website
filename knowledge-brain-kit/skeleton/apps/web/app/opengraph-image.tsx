import { ImageResponse } from "next/og";

// OG por defecto (Historia 4-4 / FR-22, decisión OQ-1): imagen generada que Next
// inyecta en toda página sin `openGraph.images` propio (home, wiki, sobre-mi,
// contacto, listados). Las plantillas con portada real (blog/casos/reviews) la
// sobreescriben con su imagen del frontmatter/datos.
export const alt = "[Concepto]";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colores en literal (este archivo NO renderiza en el navegador; es una imagen
// generada en build, fuera del sistema de tokens del guard). Ajústalos a tu marca.
const PRIMARY = "#3b3b3b";
const FONDO = "#f4f4f2";
const TINTA = "#2b2b2b";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: FONDO,
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: TINTA, fontSize: 30 }}>
          <div style={{ width: 22, height: 22, borderRadius: 22, background: PRIMARY, display: "flex" }} />
          <span>tuconcepto.com</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: TINTA,
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          <div style={{ display: "flex" }}>[Concepto]</div>
          <div style={{ display: "flex" }}>
            <span>en un solo sitio</span>
            <span style={{ color: PRIMARY }}>.</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: TINTA, fontSize: 34 }}>
          <span>[Concepto]</span>
          <span style={{ color: PRIMARY }}>·</span>
          <span>[Tagline]</span>
        </div>
      </div>
    ),
    size,
  );
}
