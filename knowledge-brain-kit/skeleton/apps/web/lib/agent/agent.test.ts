import { describe, expect, it } from "vitest";

import { searchContent } from "./content";
import { getTermino, queryGlosario, totalTerminos } from "./glosario";
import { getNode } from "./nodes";
import { listSecciones } from "./secciones";

// Tests de la capa de conocimiento del agente (PRD-web-agentica E2): las
// funciones puras leen los assets reales del repo y devuelven datos citables.

describe("glosario", () => {
  it("carga el glosario y encuentra el término plantilla", () => {
    expect(totalTerminos()).toBeGreaterThan(0);
    const r = queryGlosario("ejemplo");
    expect(r.length).toBeGreaterThan(0);
    expect(r[0]).toHaveProperty("url");
  });

  it("devuelve un término completo por slug con taxonomía", () => {
    const t = getTermino("termino-ejemplo");
    expect(t).not.toBeNull();
    expect(t!.definicion.length).toBeGreaterThan(10);
    expect(t!.url).toBe("/wiki/termino-ejemplo");
  });

  it("devuelve null ante slug inexistente (respuesta honesta)", () => {
    expect(getTermino("no-existe")).toBeNull();
  });
});

describe("nodes", () => {
  it("lee la capa GEO del nodo de una sección", () => {
    const n = getNode("wiki");
    expect(n).not.toHaveProperty("error");
    expect(n).toHaveProperty("respuestaCorta");
  });

  it("rechaza secciones desconocidas listando las disponibles", () => {
    const n = getNode("nada");
    expect(n).toHaveProperty("error");
  });
});

describe("content", () => {
  it("encuentra el artículo plantilla del blog con URL fuente", () => {
    const r = searchContent("plantilla", "blog");
    expect(r.length).toBeGreaterThan(0);
    expect(r[0]!.url).toMatch(/^\/blog\//);
  });
});

describe("secciones", () => {
  it("lista el mapa del sitio", () => {
    const s = listSecciones();
    expect(s.map((x) => x.seccion)).toContain("wiki");
  });
});
