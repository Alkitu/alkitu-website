# VeriFACTU-Compliant Invoicing Solutions for Spain - Research (March 2026)

Research on the best and most affordable VeriFACTU-compliant invoicing/billing SaaS solutions for small businesses and freelancers in Spain, focusing on API availability, affordability, and delegation of legal compliance.

---

## Table of Contents

1. [What is VeriFACTU?](#what-is-verifactu)
2. [Mandatory Dates](#mandatory-dates)
3. [Solution Categories](#solution-categories)
4. [TIER 1: API-First Solutions (Best for Integration)](#tier-1-api-first-solutions)
5. [TIER 2: Full Invoicing SaaS with API](#tier-2-full-invoicing-saas-with-api)
6. [TIER 3: Full Invoicing SaaS (Limited/No API)](#tier-3-full-invoicing-saas-limited-or-no-api)
7. [Comparison Table](#comparison-table)
8. [Recommendations](#recommendations)
9. [Key Decision Factors](#key-decision-factors)
10. [Sources](#sources)

---

## What is VeriFACTU?

VeriFACTU (Verifiable Invoice Issuance System) is a regulation from the Spanish Tax Agency (AEAT) under the Anti-Fraud Law (Ley Antifraude / Ley Crea y Crece) that mandates:

- **All invoices must be verifiable** by the Tax Authority
- **Digital hash chaining** for invoice integrity and traceability
- **QR codes** on all invoices with specific data
- **Real-time or near-real-time submission** to AEAT
- **Immutability** of invoice records
- **Event logging** with complete traceability
- **Digital signatures** for document authenticity

Invoicing software must be certified/homologated by the AEAT to comply.

---

## Mandatory Dates

| Entity Type | Mandatory Date |
|---|---|
| Companies (Corporate Income Tax / Impuesto de Sociedades) | January 1, 2027 |
| Self-employed (Autónomos) and other entities | July 1, 2027 |
| Software providers must have certified products | July 29, 2025 (voluntary period begins) |

**Note:** The AEAT also provides a free basic invoicing application since October 2025 for very low-volume users.

---

## Solution Categories

Based on the research, solutions fall into three categories:

1. **API-First / Developer-Oriented**: Pure APIs designed for integration into custom applications. You send invoice data, they handle compliance (hash chaining, XML generation, AEAT submission, QR codes, digital signatures).

2. **Full Invoicing SaaS with API**: Complete invoicing platforms that also offer APIs for integration. Good balance of standalone use and integration capability.

3. **Full Invoicing SaaS (Limited/No API)**: Complete invoicing platforms mainly used through their web UI. API is limited or non-existent.

---

## TIER 1: API-First Solutions (Best for Integration)

These are the best options if you want to **integrate VeriFACTU compliance into a custom web application** while delegating all legal responsibility to the provider.

---

### 1. BeeL.es (RECOMMENDED)

**Website:** https://beel.es
**Type:** Full invoicing SaaS + REST API designed for developers

**Pricing:**
- Web UI: From **4.90 EUR/month** (unlimited invoices, clients, products, VeriFACTU)
- API plan: **15 EUR/month** for up to 250 invoices (no long-term contract)
- Higher tiers available for more volume

**API Features:**
- Full REST API compatible with any stack (Node, Python, Go, PHP, serverless)
- Technology agnostic - no framework lock-in
- Draft vs. issued invoice workflow
- Rectificative invoices programmatically
- Multi-language PDFs (Spanish, English, Catalan)
- Advanced filtering, pagination for dashboards
- Webhooks support
- Multi-tenant SaaS architecture support (each tenant can have separate API keys)
- Event-driven, serverless, batch processing patterns documented

**VeriFACTU Compliance:**
- 100% VeriFACTU compliant and certified
- Handles VAT, IRPF, VeriFACTU, sequential numbering automatically
- You send business data (client, amount, concept), receive a legally valid invoice
- QR code generation, hash chaining, AEAT submission all handled

**Legal Responsibility:**
- BeeL handles all fiscal compliance as the certified invoicing system
- Developer does NOT need to understand Spanish tax regulations

**Pros:**
- Cheapest option with a robust API
- Spanish company, focused on Spain-specific regulations
- Excellent developer documentation with integration patterns
- No long-term contracts
- Works as backend while you control the frontend

**Cons:**
- Relatively new/smaller company compared to established players
- 250 invoice limit on API plan (sufficient for most small businesses)

---

### 2. Verifacti

**Website:** https://www.verifacti.com
**Type:** Pure VeriFACTU API for developers/software providers

**Pricing:**
- Free test environment (1 test NIF, unlimited test calls, no credit card required)
- Production: From **2.90 EUR/NIF/month** (monthly billing)
- Annual billing: From **2.61 EUR/NIF/month** (10% discount)
- Up to 100 NIFs on Pro plan; Enterprise for 100+ NIFs (custom pricing)
- 3,000 invoices/NIF/month included; excess at 2 EUR per 1,000 additional invoices

**API Features:**
- REST API for VeriFACTU + TicketBAI
- API for NIF management (activation/deactivation)
- Webhooks
- Automated representation model management
- Complete developer documentation

**VeriFACTU Compliance:**
- Full VeriFACTU and TicketBAI compliance
- Handles all AEAT communication
- Certified system

**Legal Responsibility:**
- Verifacti acts as the SIF (Sistema Informatico de Facturacion)
- They handle compliance, you handle your business logic

**Pros:**
- Very affordable per-NIF pricing model
- Perfect for SaaS platforms managing multiple clients/NIFs
- Free testing environment
- No setup fees or long-term contracts
- Also supports TicketBAI (Basque Country)

**Cons:**
- Pure API - no web UI for manual invoice creation
- Pricing scales per NIF, so for a single business it's 2.90 EUR/month (very cheap) but for multi-tenant scenarios costs add up per NIF
- Spanish-only documentation (last checked)

---

### 3. Verifactu-API.com

**Website:** https://verifactu-api.com
**Type:** Pure VeriFACTU + TicketBAI API

**Pricing:**
- Free plan: 0 EUR (1 test NIF, unlimited test calls, complete docs, email support)
- Paid: **9.99 EUR/NIF/month** (+ VAT)
- Scales up to 100 NIFs with volume-based discounts
- 10% discount for annual billing
- Custom plan for higher volumes with SLA guarantees and 24/7 support

**API Features:**
- Full VeriFACTU API + TicketBAI API included at no extra cost
- Unlimited invoices per NIF (no invoice limit)
- Priority support, webhooks on higher plans

**VeriFACTU Compliance:**
- Full VeriFACTU and TicketBAI compliance
- Certified system

**Pros:**
- Unlimited invoices per NIF
- Both VeriFACTU and TicketBAI in one API
- Free testing
- Volume discounts

**Cons:**
- More expensive per NIF than Verifacti (9.99 vs 2.90 EUR)
- Newer player in the market

---

### 4. Invopop

**Website:** https://www.invopop.com
**Type:** Global e-invoicing API platform (supports Spain + many countries)

**Pricing:**
- Developer plan: **50 EUR/month** (200 pops/month) or 43 EUR/month (yearly)
- Pro plan: **300 EUR/month** (20,000 pops/month) or 255 EUR/month (yearly)
- Enterprise: Custom pricing
- VeriFACTU submission costs 2 pops per document
- Core actions (PDF, email) cost 1 pop each

**API Features:**
- Full REST API with interactive documentation
- Open-source GOBL (Go Business Language) format
- Supports VeriFACTU, TicketBAI, Facturae, Peppol, and many international formats
- PDF generation with QR codes
- Multi-country support (Spain, Italy, Portugal, Germany, etc.)

**VeriFACTU Compliance:**
- Full VeriFACTU compliance
- Automatic XML generation and AEAT submission
- QR code generation
- Compliance statement as per Ministerial Order HAC/1177/2024

**Legal Responsibility:**
- Invopop handles compliance as the certified platform

**Pros:**
- Multi-country support if you plan to expand internationally
- Open-source GOBL format
- Well-documented, developer-friendly
- Strong backing (EU-focused company)

**Cons:**
- Expensive for small volume (50 EUR/month minimum)
- Pop-based pricing can be confusing
- Overkill for Spain-only needs

---

### 5. Quaderno

**Website:** https://quaderno.io
**Type:** Global tax compliance + invoicing API

**Pricing:**
- Hobby: **29 USD/month** (25 transactions, 1 user, 1 jurisdiction)
- Startup: **49 USD/month** (250 transactions, unlimited users/jurisdictions)
- Business: **99 USD/month** (1,000 transactions)
- Growth: **149 USD/month** (2,500 transactions)
- Enterprise: Custom
- 7-day free trial, no credit card required
- API calls limit = 10x transactions per plan

**API Features:**
- Full REST API
- VeriFACTU API with JSON format (not XML)
- QR codes in API response
- Integrations with Stripe, Shopify, WooCommerce, Amazon FBA, Paddle, etc.
- Webhook support

**VeriFACTU Compliance:**
- Certified by AEAT for VeriFACTU
- Automatic submission to AEAT
- QR code generation
- Single API call to handle entire compliance flow

**Pros:**
- Excellent developer documentation
- Multi-country tax compliance (not just Spain)
- Many pre-built integrations (Stripe, Shopify, etc.)
- JSON-based API (easier than XML)
- Free testing environment

**Cons:**
- Pricing in USD, not EUR
- Expensive for small volumes (29 USD/month for just 25 transactions)
- More suited for SaaS/e-commerce than traditional invoicing
- Transaction-based pricing can get costly

---

### 6. fiskaly SIGN ES

**Website:** https://www.fiskaly.com/signes
**Type:** Fiscalization API for Spain (VeriFACTU + TicketBAI + NaTicket)

**Pricing:**
- Pay-as-you-go model (pay only when clients begin invoicing)
- Free trial with full API access
- Specific pricing not publicly listed (contact sales)

**API Features:**
- Single API for VeriFACTU, TicketBAI, NaTicket, SII, and B2B e-invoicing
- ISO certified
- Step-by-step integration documentation

**VeriFACTU Compliance:**
- 100% VeriFACTU compliant
- ISO certified
- Handles all Spanish fiscal compliance variants

**Pros:**
- Single integration covers all Spanish fiscal requirements
- Pay-as-you-go (no upfront costs)
- ISO certified
- Free trial

**Cons:**
- Pricing not transparent (must contact sales)
- Enterprise-oriented, may be expensive for small businesses
- German company, support may be less Spain-focused

---

### 7. efsta

**Website:** https://www.efsta.eu/en/solutions/verifactu-api
**Type:** Fiscalization API (multi-country)

**Pricing:**
- Not publicly listed (contact for quote)
- Free initial consultation

**API Features:**
- Unified API for document submission
- Automatic XML conversion and AEAT submission
- Real-time compliance

**Pros:**
- Multi-country support
- Established company in European fiscalization

**Cons:**
- Pricing not transparent
- More enterprise-oriented
- May be overkill for small businesses

---

## TIER 2: Full Invoicing SaaS with API

These are complete invoicing platforms that also offer API access for integration.

---

### 8. Holded

**Website:** https://www.holded.com
**Type:** Full ERP/invoicing platform

**Pricing:**
- Single user plan: From **7.50 EUR/month** (includes VeriFACTU)
- Basic: **29 EUR/month** (invoicing, basic accounting, CRM, 2 users)
- Professional: **59 EUR/month** (project management, inventory, 10 users)
- Enterprise: Custom pricing
- 50% discount first 3 months

**API Features:**
- Full REST API with OAuth 2.0 and API key auth
- Available on all paid plans (not free plan)
- Developer documentation at developers.holded.com
- Webhook support

**VeriFACTU Compliance:**
- Certified by AEAT for VeriFACTU
- Easy activation within the platform

**Pros:**
- Very well-known in Spain
- Complete ERP (invoicing, accounting, CRM, projects, inventory)
- Good API documentation
- Large ecosystem of integrations

**Cons:**
- More expensive than alternatives for just invoicing
- ERP features may be unnecessary overhead
- API only on paid plans
- Can get expensive as you add users/features

---

### 9. Billin (TS Facturas Billin / TeamSystem)

**Website:** https://www.billin.net
**Type:** Full invoicing platform

**Pricing:**
- Basic: From **6.60 EUR/month** (annual billing)
- Professional: Mid-tier (details vary)
- Unlimited: Higher tier with more features
- Unlimited Plus: **83.30 EUR/month** (annual billing) - includes API access
- 30-day free trial

**API Features:**
- REST API for invoices, tickets, and expenses
- Available only on Unlimited plan and during 30-day free trial
- Developer documentation available

**VeriFACTU Compliance:**
- Full VeriFACTU, Facturae, and TicketBAI support
- Unlimited electronic invoices on all plans

**Pros:**
- Well-established in Spain (part of TeamSystem)
- Shopify integration
- Good for e-commerce

**Cons:**
- API only on expensive Unlimited plan (83.30 EUR/month)
- Not cost-effective if you only need API access

---

### 10. Quipu

**Website:** https://getquipu.com
**Type:** Full invoicing + accounting platform

**Pricing:**
- Solution plan: **15 EUR/month** (50% discount = 7.50 EUR/month for 3 months) - includes API
- Premium: **29.50 EUR/month** (includes 2,000 API calls/month)
- Normal pricing: ~30 EUR/month for Solution plan

**API Features:**
- REST API available from Solution plan
- 2,000 API calls/month on Premium plan
- Rate limit: 5 requests every 5 seconds
- Developer documentation available

**VeriFACTU Compliance:**
- VeriFACTU integrated
- Error detection before issuing
- Bank and advisor synchronization

**Pros:**
- Complete solution (invoicing + accounting + tax models)
- VeriFACTU included at no extra cost
- Bank connection for reconciliation

**Cons:**
- API rate limited (5 req/5 sec)
- API only from Solution plan (15+ EUR/month)
- More expensive than simpler alternatives
- Focused more on standalone use than API integration

---

### 11. Anfix

**Website:** https://www.anfix.com
**Type:** Full invoicing + accounting platform

**Pricing:**
- Professional: **12 EUR/month** (freelancers)
- Enterprise: From **25 EUR/month** (SMEs, multiple users)

**VeriFACTU Compliance:**
- VeriFACTU included by default at no additional cost
- No configuration needed

**API Features:**
- Not prominently documented; limited API information found
- May have integration capabilities but not API-first

**Pros:**
- Affordable
- VeriFACTU included free
- Good for freelancers and small businesses
- Part of Wolters Kluwer group (established)

**Cons:**
- Limited API documentation/capabilities
- Not designed for integration into custom apps
- More of a standalone tool

---

### 12. FacturaDirecta

**Website:** https://www.facturadirecta.com
**Type:** Invoicing platform for small businesses

**Pricing:**
- Free plan: Basic invoicing
- Plan 1: **10 EUR/month** (+VAT) - 100 customers, 25 products
- Plan 2: **20 EUR/month** (+VAT) - Advanced payment management
- Plan 3: **40 EUR/month** (+VAT) - Unlimited customers/products, expenses, bank connection

**VeriFACTU Compliance:**
- VeriFACTU certified and prepared
- Automatic AEAT submission
- QR code generation

**API Features:**
- Limited information found about API capabilities
- Likely has basic API for integration

**Pros:**
- Established Spanish company
- Free plan available
- VeriFACTU compliant
- Good for very small businesses

**Cons:**
- API documentation not prominently available
- Limited information about developer tools
- May not be suitable for custom integration

---

### 13. Alegra

**Website:** https://www.alegra.com/es/
**Type:** Full invoicing + accounting + inventory platform

**Pricing:**
- Free: **0 EUR/month** (10 invoices/month, 1 user, VeriFACTU included)
- PYME: **9.99 EUR/month** (100 invoices, 2 users)
- PRO: **19.99 EUR/month** (250 invoices, 3 users, inventory)
- Plus: **39.99 EUR/month** (unlimited invoices, 5 users)
- 50% annual discount available

**VeriFACTU Compliance:**
- VeriFACTU integrated natively in all plans (including free)
- Automatic XML generation, QR code, hash chaining, AEAT submission
- Homologated by AEAT

**API Features:**
- Developer API at developer.alegra.com
- Not prominently detailed in pricing (likely on higher plans)

**Pros:**
- Free plan with VeriFACTU included (unique!)
- Very affordable pricing
- Complete platform (invoicing, accounting, inventory)
- Latin American company with strong Spanish presence

**Cons:**
- API access details unclear (likely not free plan)
- Smaller in Spain compared to Holded or Quipu
- May have limitations for custom integration

---

### 14. Facturantia

**Website:** https://www.facturantia.com
**Type:** Cloud invoicing platform with API

**Pricing:**
- From **10 EUR/month** (includes API access)

**API Features:**
- XML-based API (POST endpoint)
- Accepts proformas in XML format following Facturantia XSD schema
- Issues VeriFACTU and non-VeriFACTU invoices
- Generates PDF with QR code
- Supports batch processing (up to 1,000 invoices per shipment)

**VeriFACTU Compliance:**
- Full VeriFACTU compliance (SIF certified)
- Also supports non-VeriFACTU mode
- QR code generation

**Pros:**
- Affordable (10 EUR/month with API)
- Established company (since 1985, based in Madrid)
- Batch processing support
- Good for accounting firms

**Cons:**
- XML-based API (not REST/JSON - more complex to work with)
- Less modern developer experience
- Documentation may be less polished

---

### 15. B2Brouter

**Website:** https://www.b2brouter.net
**Type:** Electronic invoicing platform (national + international)

**Pricing:**
- Basic (Free): 0 EUR (24 transactions/year limit)
- Professional: **110 EUR/year** (+VAT) = ~9.17 EUR/month (unlimited transactions)
- Business: **300 EUR/year** (+VAT) = 25 EUR/month (premium features, 10 users)

**API Features:**
- API B2Brouter for general e-invoicing
- Separate API VeriFactu for VeriFACTU compliance
- Peppol Access Point (international e-invoicing)

**VeriFACTU Compliance:**
- Full VeriFACTU compliance
- ISO 27001 certified
- Supports FacturaE, UBL, TicketBAI formats

**Pros:**
- International e-invoicing (Peppol network)
- ISO 27001 certified
- Good for B2B and international invoicing
- Kit Digital eligible (government subsidy)
- Per-NIF subscription model

**Cons:**
- Limited free plan (24 transactions/year)
- API documentation not as developer-friendly
- More focused on B2B e-invoicing than custom integration

---

### 16. Renn

**Website:** https://getrenn.com
**Type:** Online accounting platform for freelancers and small businesses

**Pricing:**
- Free plan: Up to 25 invoices/month (VeriFACTU ready)
- Higher plans: **14-25 EUR/month** (more features, bank reconciliation, API access)

**VeriFACTU Compliance:**
- VeriFACTU ready and integrated

**Pros:**
- Free plan with decent limits
- Modern interface
- Good for freelancers

**Cons:**
- API access only on higher plans
- Relatively new platform
- Limited information about API capabilities

---

## TIER 3: Notable Mentions

### Txerpa

**Website:** https://www.txerpa.com
**Type:** VeriFACTU API middleware

**Description:** Allows automatic submission of invoices from billing software to Txerpa, which handles VeriFACTU record generation, AEAT submission, and status monitoring.

**Pricing:** Not publicly listed.

### STEL Order

**Website:** https://www.stelorder.com
**Type:** ERP/invoicing platform with VeriFACTU API

**Description:** API for adapting any software to VeriFACTU. No digital certificate needed. Generates QR codes instantly.

**Pricing:** Not publicly listed for API. Main ERP pricing varies.

### AEAT Free Application

**Website:** https://sede.agenciatributaria.gob.es
**Type:** Free government application

**Description:** The Spanish Tax Agency offers a free VeriFACTU billing application since October 2025 for basic needs.

**Pricing:** Free.
**Limitations:** Very basic, no API, designed for very low-volume users.

---

## Comparison Table

### API-First Solutions (Best for Custom Integration)

| Solution | Monthly Cost | API Type | Invoice Limit | VeriFACTU | TicketBAI | Legal Delegation | Best For |
|---|---|---|---|---|---|---|---|
| **BeeL.es** | 4.90 EUR (UI) / 15 EUR (API) | REST/JSON | 250/mo (API plan) | Yes | No | Yes | Small business custom apps |
| **Verifacti** | 2.90 EUR/NIF | REST | 3,000/NIF/mo | Yes | Yes | Yes | Multi-tenant SaaS, cheapest per-NIF |
| **Verifactu-API.com** | 9.99 EUR/NIF | REST | Unlimited | Yes | Yes | Yes | Unlimited invoices per NIF |
| **Invopop** | 50 EUR minimum | REST/JSON | Pop-based | Yes | Yes | Yes | International/multi-country |
| **Quaderno** | ~29 USD minimum | REST/JSON | 25 transactions | Yes | No info | Yes | SaaS/e-commerce with Stripe/Shopify |
| **fiskaly SIGN ES** | Pay-as-you-go | REST | Contact sales | Yes | Yes | Yes | All Spanish fiscal variants |

### Full SaaS with API

| Solution | Monthly Cost | API Available? | VeriFACTU | Best For |
|---|---|---|---|---|
| **Holded** | From 7.50 EUR | Yes (paid plans) | Yes | Full ERP needs |
| **Billin** | From 6.60 EUR | Only Unlimited (83+ EUR) | Yes | E-commerce (Shopify) |
| **Quipu** | From 15 EUR | Yes (Solution plan+) | Yes | Invoicing + accounting |
| **Anfix** | From 12 EUR | Limited | Yes | Freelancers (standalone) |
| **Alegra** | Free - 39.99 EUR | Yes (higher plans) | Yes (all plans) | Budget-conscious, free VeriFACTU |
| **FacturaDirecta** | Free - 40 EUR | Limited info | Yes | Very small businesses |
| **Facturantia** | From 10 EUR | Yes (XML) | Yes | Accounting firms, batch |
| **B2Brouter** | Free - 25 EUR/mo | Yes (VeriFactu API) | Yes | B2B, international e-invoicing |
| **Renn** | Free - 25 EUR | Higher plans | Yes | Freelancers |

---

## Recommendations

### For a Small Web Development Agency Wanting API Integration

**Best Overall: BeeL.es**
- **Why:** 15 EUR/month for a full REST API that handles all VeriFACTU compliance. Modern developer documentation, works with any tech stack (perfect for a Next.js app), handles all legal complexity. You send business data, they return a legally valid invoice.
- **Cost:** 15 EUR/month for API (250 invoices/month) or 4.90 EUR/month for web-only use.
- **Integration effort:** Low - REST API with JSON, documented patterns for SPA, serverless, etc.

**Best Value (API-First): Verifacti**
- **Why:** At 2.90 EUR/NIF/month, it is the cheapest API option. Perfect if you are building for a single NIF (your own business).
- **Cost:** 2.90 EUR/month for 1 NIF with up to 3,000 invoices.
- **Integration effort:** Medium - pure API, no UI fallback.

**Best for Future Growth / Multi-Country: Invopop**
- **Why:** If you plan to expand beyond Spain or handle invoicing for clients in multiple countries.
- **Cost:** 50 EUR/month minimum (expensive for Spain-only).
- **Integration effort:** Low-medium - well-documented, GOBL format.

**Best Free Option with VeriFACTU: Alegra**
- **Why:** Free plan includes VeriFACTU compliance for up to 10 invoices/month. No cost to start.
- **Cost:** Free (10 invoices/month) or 9.99 EUR/month (100 invoices).
- **Integration effort:** Medium - API exists but not the primary focus.

### If You Do NOT Need API Integration (Just a Billing Tool)

**Cheapest VeriFACTU: BeeL.es** at 4.90 EUR/month or **Alegra** for free (10 invoices/month).

**Best All-in-One: Holded** starting at 7.50 EUR/month if you want invoicing + accounting + CRM in one tool.

---

## Key Decision Factors

### 1. Legal Responsibility Delegation

All solutions listed above that are VeriFACTU-certified handle the legal responsibility for:
- Hash chaining and immutability
- XML format compliance
- AEAT submission
- QR code generation
- Digital signatures
- Invoice record integrity

**You do NOT need your own digital certificate** when using a certified SaaS provider. The provider's certification covers the compliance requirements.

### 2. API Integration Complexity

| Approach | Effort | Cost | Flexibility |
|---|---|---|---|
| Pure API (Verifacti, BeeL API) | Medium | Low | High |
| SaaS with API (Holded, Quipu) | Low-Medium | Medium | Medium |
| Manual SaaS (any platform) | None | Low | Low |

### 3. What You Actually Need for a Small Agency

For a small web development agency issuing ~10-50 invoices per month:
- **BeeL.es at 15 EUR/month** covers all needs with a proper API
- **Verifacti at 2.90 EUR/month** is the absolute cheapest API option
- **Alegra free plan** works if you just need basic invoicing (10/month) without integration

### 4. Comparison with Holded

| Factor | Holded | BeeL.es (API) | Verifacti |
|---|---|---|---|
| Monthly cost | 7.50-59 EUR | 15 EUR | 2.90 EUR |
| API included | Yes (paid plans) | Yes | Yes (API-only) |
| VeriFACTU | Yes | Yes | Yes |
| Accounting | Yes | No | No |
| CRM | Yes (higher plans) | No | No |
| Invoicing UI | Yes | Yes (separate plan) | No |
| Custom integration ease | Good | Excellent | Excellent |
| Legal delegation | Yes | Yes | Yes |

---

## Sources

### Official References
- [AEAT - Sistemas Informaticos de Facturacion (SIF) y VERI*FACTU](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu.html)

### API-First Solutions
- [BeeL.es - Software Facturacion Verifactu](https://beel.es/)
- [BeeL.es - API para Apps Personalizadas](https://beel.es/public-api/casos-de-uso/apps-personalizadas)
- [Verifacti - API Verifactu](https://www.verifacti.com/en)
- [Verifacti - Precios](https://www.verifacti.com/precios)
- [Verifactu-API.com](https://verifactu-api.com/)
- [Verifactu-API.com - Precios](https://verifactu-api.com/precios.html)
- [Invopop - VeriFactu API](https://www.invopop.com/coverage/verifactu-api)
- [Invopop - Pricing](https://www.invopop.com/pricing)
- [Invopop - Understanding Pricing](https://docs.invopop.com/get-started/pricing)
- [Quaderno - API Verifactu](https://quaderno.io/es/api/verifactu/)
- [Quaderno - Pricing](https://quaderno.io/pricing/)
- [Quaderno Developers - Verifactu](https://developers.quaderno.io/guides/e-invoicing/verifactu/)
- [fiskaly SIGN ES](https://www.fiskaly.com/signes)
- [fiskaly - Verifactu API](https://www.fiskaly.com/signes/verifactu)
- [efsta - Verifactu API](https://www.efsta.eu/en/solutions/verifactu-api)

### Full SaaS Platforms
- [Holded - Pricing](https://www.holded.com/pricing)
- [Holded - API Documentation](https://developers.holded.com/)
- [Billin - Precios](https://www.billin.net/precios/)
- [Billin - API Desarrolladores](https://www.billin.net/api-desarrolladores/)
- [Quipu - VeriFACTU](https://getquipu.com/es/sistema-verifactu)
- [Anfix - Verifactu](https://www.anfix.com/verifactu)
- [Alegra - Precios](https://www.alegra.com/es/gestion/precios/)
- [Alegra - Sistema Verifactu](https://www.alegra.com/es/sistema-verifactu/)
- [FacturaDirecta - VeriFactu](https://www.facturadirecta.com/en/verifactu/)
- [FacturaDirecta - Pricing](https://www.facturadirecta.com/en/pequenos-negocios/precios/)
- [Facturantia - API Verifactu](https://www.facturantia.com/api_verifactu.php)
- [B2Brouter - API VeriFactu](https://www.b2brouter.net/es/api-verifactu/)
- [B2Brouter - Precios](https://www.b2brouter.net/es/precios/)
- [Renn - Best Invoicing Platform for Spain](https://getrenn.com/blog/best-invoicing-platform)
- [Txerpa - API Verifactu](https://www.txerpa.com/api-verifactu)
- [STEL Order - API Verifactu](https://www.stelorder.com/api-verifactu/)

### Comparatives and Guides
- [Inforges - Los Mejores Software Verifactu 2026](https://inforges.es/blog/los-mejores-software-verifactu-para-tu-empresa/)
- [TeamSystem - Los 6 mejores programas para VeriFactu 2026](https://teamsystem.es/magazine/mejores-programas-verifactu/)
- [BeeL.es - Los 7 Mejores Programas Facturacion Verifactu 2026](https://beel.es/blog/mejores-programas-facturacion-verifactu-2026)
- [Billin - Los 7 mejores programas Verifactu 2026](https://www.billin.net/blog/mejores-programas-verifactu/)
- [Ley Factura Electronica - Comparativa Programas Verifactu](https://leyfacturaelectronica.com/comparativa-programas-verifactu/)
- [Ley Factura Electronica - Precio de Verifactu](https://leyfacturaelectronica.com/precio-de-verifactu/)
- [Marosa VAT - Verifactu Spain Guide](https://marosavat.com/vat-news/verifactu-spain-2026-guide)

---

*Research conducted: March 3, 2026. Prices and features may change. Always verify current pricing on provider websites before making a decision.*
