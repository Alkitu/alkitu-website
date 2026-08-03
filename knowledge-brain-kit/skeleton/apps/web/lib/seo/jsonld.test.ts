import { describe, it, expect } from "vitest";

import { articleLd, personLd, definedTermLd, reviewLd, breadcrumbLd, faqLd } from "./jsonld";

describe("builders JSON-LD", () => {
  it("articleLd absolutiza url/image y marca autor", () => {
    const a = articleLd({ title: "X", url: "/blog/x", image: "/blog/x/p.png", datePublished: "2026-01-01" });
    expect(a["@type"]).toBe("Article");
    expect(a.url).toBe("https://tuconcepto.com/blog/x");
    expect(a.image).toBe("https://tuconcepto.com/blog/x/p.png");
    expect(a.author.name).toBe("[Concepto]");
  });

  it("personLd es un Person con jobTitle", () => {
    const p = personLd();
    expect(p["@type"]).toBe("Person");
    expect(p.jobTitle).toBe("[Rol]");
  });

  it("definedTermLd incluye inDefinedTermSet", () => {
    const d = definedTermLd({ term: "A/B Testing", definition: "…", url: "/wiki/a-b-testing", aliases: ["Split Testing"] });
    expect(d["@type"]).toBe("DefinedTerm");
    expect(d.inDefinedTermSet["@type"]).toBe("DefinedTermSet");
    expect(d.alternateName).toEqual(["Split Testing"]);
  });

  it("reviewLd proyecta rating y pros/contras", () => {
    const r = reviewLd({ name: "Figma", url: "/reviews/figma", rating: 4.5, pros: ["rápido"], cons: ["caro"] });
    expect(r["@type"]).toBe("Review");
    expect(r.reviewRating.ratingValue).toBe(4.5);
    expect(r.positiveNotes?.itemListElement).toHaveLength(1);
    expect(r.negativeNotes?.itemListElement[0].name).toBe("caro");
  });

  it("breadcrumbLd numera posiciones desde 1", () => {
    const b = breadcrumbLd([{ name: "Inicio", url: "/" }, { name: "Blog", url: "/blog" }]);
    expect(b.itemListElement[0].position).toBe(1);
    expect(b.itemListElement[1].item).toBe("https://tuconcepto.com/blog");
  });

  it("faqLd produce FAQPage con preguntas/respuestas", () => {
    const f = faqLd([{ pregunta: "¿Qué es X?", respuesta: "Y" }]);
    expect(f["@type"]).toBe("FAQPage");
    expect(f.mainEntity[0]["@type"]).toBe("Question");
    expect(f.mainEntity[0].acceptedAnswer.text).toBe("Y");
  });
});
