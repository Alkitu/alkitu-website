# VeriFactu Billing Module - Design Document

**Date:** 2026-03-03
**Status:** Approved
**Author:** Claude Code + Luis Eurdaneta

---

## Table of Contents

1. [Overview](#overview)
2. [Legal Framework](#legal-framework)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Tax & Fiscal Catalogs](#tax--fiscal-catalogs)
6. [VeriFactu Compliance](#verifactu-compliance)
7. [API Routes](#api-routes)
8. [Admin UI Structure](#admin-ui-structure)
9. [PDF Generation](#pdf-generation)
10. [Email Integration](#email-integration)
11. [Reporting Dashboard](#reporting-dashboard)
12. [Dependencies](#dependencies)
13. [AEAT Environments](#aeat-environments)
14. [Security](#security)
15. [Implementation Phases](#implementation-phases)

---

## 1. Overview

### Purpose

Build a complete invoicing/billing module integrated into the Alkitu admin panel that complies with Spain's VeriFactu regulation (Real Decreto 1007/2023 + Orden HAC/1177/2024).

### Scope

- **Personal use first** (autónomo), scalable to **multi-user SaaS**
- **All document types:** invoices, sales receipts, credit notes, receipt notes, estimates, sales orders, waybills, proformas, purchases, purchase refunds, purchase orders
- **VeriFactu mode:** Automatic submission to AEAT (sandbox first, then production)
- **Full reporting:** IVA quarterly (Modelo 303), receivables/payables, income/expenses

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | All-in-Next.js + Supabase | Simplicity, shared auth/UI, one deployment |
| PDF Engine | @react-pdf/renderer | React components, server-side, good design control |
| XML Signing | xadesjs + xmldsigjs | Pure TS/JS XAdES implementation, Node.js compatible |
| AEAT Communication | SOAP via soap npm package | Direct AEAT protocol compliance |
| Integration | Inside /admin/* | Shared layout, auth, navigation |
| Certificate | FNMT (user has one) | Qualified electronic certificate |

---

## 2. Legal Framework

### Applicable Legislation

1. **Real Decreto 1007/2023** (BOE-A-2023-24840) - Establishes requirements for billing software
2. **Orden HAC/1177/2024** (BOE-A-2024-22138) - Technical specifications
3. **Real Decreto-ley 15/2025** - Postpones deadlines
4. **RD 1619/2012** - Invoicing regulations (referenced for invoice types)

### Compliance Deadlines

| Who | Deadline |
|-----|----------|
| Software producers | 9 months after Orden publication (July 2025) |
| Companies (IS taxpayers) | January 1, 2027 |
| **Autónomos (our case)** | **July 1, 2027** |

### Penalties

- **Users:** Up to €50,000/year for using non-compliant software
- **Producers:** Up to €150,000/year per software type

### Complete Requirements Checklist

| # | Requirement | Legal Reference | Implementation |
|---|-------------|----------------|----------------|
| 1 | SHA-256 hash chain per record | Art. 13 Orden HAC | `verifactu_records.hash` field, sequential calculation |
| 2 | XAdES Enveloped Signature | Art. 14 / ETSI EN 319 132 | xadesjs library with FNMT cert |
| 3 | Automatic AEAT submission (VeriFactu mode) | Art. 16-17 | SOAP client to AEAT endpoints |
| 4 | QR code on every invoice (30-40mm, ISO 18004) | Art. 20-21 | qrcode npm, included in PDF |
| 5 | "VERI*FACTU" mention on invoice | Art. 20 | Text in PDF template |
| 6 | Event registry (No-VeriFactu mode) | Art. 9 | `verifactu_events` table |
| 7 | Declaración Responsable | Art. 15 | `verifactu_system_info` table + PDF |
| 8 | SistemaInformático identification | Art. 15.1 a-l | Complete system metadata |
| 9 | 4-year record conservation | Art. 8.3 / RD 1619/2012 | Supabase + export capability |
| 10 | Record immutability | Art. 8 | No UPDATE on verifactu_records, audit |
| 11 | Record traceability (chaining) | Art. 8 | Previous hash reference chain |
| 12 | Invoice types F1-F3, R1-R5 | Enum L2 | doc_type + tipo_factura mapping |
| 13 | ClaveRegimen IVA (01-20) | Enum L8A | Tax regime selection per item |
| 14 | CalificacionOperacion (S1,S2,N1,N2) | Enum L9 | Operation qualification per item |
| 15 | TipoRectificativa (S=substitution, I=differences) | Enum L3 | Rectificative invoice handling |
| 16 | Simplified invoices (F2) | RD 1619/2012 art 6.1.d | No buyer required for F2 |
| 17 | Flow control: 60s wait, max 1000 records/msg | Art. 16 | Queue with configurable delay |
| 18 | Retry minimum every 1 hour on failure | Art. 16 | Retry logic with exponential backoff |
| 19 | CSV (Código Seguro Verificación) storage | Art. 17 | `verifactu_records.aeat_csv` |
| 20 | XML UTF-8 format | Art. 10-11 | fast-xml-parser with UTF-8 encoding |
| 21 | Anomaly detection capability | Art. 9 (Enum L2E) | Integrity check process |
| 22 | Event summary every 6 hours minimum | Art. 9 | Scheduled event generation |

---

## 3. Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Panel (Next.js)                     │
│  /admin/billing/*                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │Documents │ │ Clients  │ │ Reports  │ │  VeriFactu    │  │
│  │ CRUD     │ │ CRUD     │ │Dashboard │ │  Status       │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬───────┘  │
│       │             │            │                │          │
│  ─────┴─────────────┴────────────┴────────────────┴─────    │
│                    API Routes Layer                          │
│              /api/admin/billing/*                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              VeriFactu Engine                        │   │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌───────────┐  │   │
│  │  │Hash     │ │XML       │ │XAdES   │ │SOAP       │  │   │
│  │  │SHA-256  │ │Builder   │ │Signer  │ │Client     │  │   │
│  │  └─────────┘ └──────────┘ └────────┘ └───────────┘  │   │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐               │   │
│  │  │QR       │ │PDF       │ │Event   │               │   │
│  │  │Generator│ │Generator │ │Logger  │               │   │
│  │  └─────────┘ └──────────┘ └────────┘               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
┌──────────────────────┐  ┌─────────────────────┐
│   Supabase Database  │  │   AEAT SOAP API     │
│   (PostgreSQL + RLS) │  │   (VeriFactu)       │
│                      │  │                     │
│  billing_entities    │  │  Sandbox:           │
│  billing_products    │  │  prewww1.aeat.es    │
│  billing_clients     │  │                     │
│  documents           │  │  Production:        │
│  document_items      │  │  www1.aeat.es       │
│  document_payments   │  │                     │
│  verifactu_records   │  │  QR Validation:     │
│  verifactu_events    │  │  www2.aeat.es       │
│  verifactu_system    │  │                     │
│  document_sequences  │  └─────────────────────┘
└──────────────────────┘
```

### VeriFactu Engine Components

Located in `lib/verifactu/` and `lib/billing/`:

```
lib/verifactu/                    # VeriFactu-specific logic
├── index.ts                      # Main exports
├── config.ts                     # AEAT environment config
├── hash.ts                       # SHA-256 hash calculation
├── xml-builder.ts                # XML generation (RegistroAlta, RegistroAnulacion)
├── xml-signer.ts                 # XAdES Enveloped Signature
├── soap-client.ts                # AEAT SOAP communication
├── qr-generator.ts               # QR code generation
├── event-logger.ts               # Event registry management
├── validators.ts                 # Zod schemas for all document types
├── enums.ts                      # All VeriFactu enumerations (L1-L12)
├── catalogs.ts                   # Tax rates, surcharges, IRPF, payment methods, units
├── calculations.ts               # Tax, surcharge, IRPF, total calculations
└── types.ts                      # TypeScript types

lib/billing/                      # General billing logic
├── import-export.ts              # CSV/JSON/Excel import, export, template generator
├── bulk.ts                       # Bulk action processor (max 500, error collection)
├── pdf-templates/                # React-PDF templates
│   ├── invoice.tsx               # Invoice/sales receipt PDF
│   ├── credit-note.tsx           # Credit note PDF (FACTURA RECTIFICATIVA)
│   ├── estimate.tsx              # Estimate/proforma PDF
│   ├── purchase.tsx              # Purchase PDF
│   ├── waybill.tsx               # Packing list/waybill PDF
│   ├── sales-order.tsx           # Sales order PDF
│   └── shared/                   # Shared components (header, footer, tax table, etc.)
└── email-templates/              # React Email templates for billing
    ├── invoice-email.tsx         # Invoice delivery email
    ├── payment-reminder.tsx      # Overdue reminder
    └── estimate-followup.tsx     # Estimate follow-up
```

---

## 4. Database Schema

### Table: `billing_entities`

Stores the issuer/business data. Multi-tenant ready via `user_id`.

```sql
CREATE TABLE billing_entities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Business identity
  person_type text NOT NULL DEFAULT 'juridica'
    CHECK (person_type IN ('fisica', 'juridica')),  -- Persona física/jurídica
  name text NOT NULL,                    -- Razón social / Nombre completo
  trade_name text,                       -- Nombre comercial
  nif text NOT NULL,                     -- NIF/CIF

  -- Address
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  postal_code text NOT NULL,
  province text NOT NULL,
  country text NOT NULL DEFAULT 'ES',

  -- Contact
  email text,
  phone text,
  website text,

  -- Branding
  logo_url text,

  -- Certificate (server-side only, path to .pfx/.p12)
  certificate_path text,
  certificate_password_encrypted text,   -- Encrypted at rest

  -- Fiscal territory and tax regime
  tax_regime text NOT NULL DEFAULT 'IVA'
    CHECK (tax_regime IN ('IVA', 'IGIC', 'IPSI')),
    -- IVA: Península + Baleares
    -- IGIC: Canarias
    -- IPSI: Ceuta y Melilla

  -- Activity type (affects IRPF retention)
  activity_type text DEFAULT 'professional'
    CHECK (activity_type IN (
      'professional',          -- Actividad profesional (15% IRPF)
      'professional_new',      -- Nuevo profesional, primeros 3 años (7% IRPF)
      'professional_artistic', -- Artistas/culturales (7% IRPF)
      'business',              -- Actividad empresarial (no IRPF en factura)
      'agricultural',          -- Agrícola/ganadera (2% IRPF)
      'forestry',              -- Forestal (2% IRPF)
      'poultry',               -- Avicultura (1% IRPF)
      'modules'                -- Estimación objetiva/módulos (1% IRPF)
    )),

  -- Recargo de equivalencia
  applies_surcharge boolean DEFAULT false,  -- Is this entity a retail merchant under RE?

  -- Defaults
  default_currency text NOT NULL DEFAULT 'EUR',
  default_tax_rate numeric(5,2) DEFAULT 21.00,
  default_irpf_rate numeric(5,2) DEFAULT 0,    -- 15, 7, 2, 1, or 0 depending on activity_type
  default_payment_terms integer DEFAULT 30,  -- Days
  default_payment_method text DEFAULT '04',  -- Facturae code: 04=Transferencia

  -- Bank details (for invoice footer)
  bank_name text,
  bank_iban text,
  bank_swift text,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX billing_entities_user_id_idx ON billing_entities(user_id);
CREATE UNIQUE INDEX billing_entities_nif_user_idx ON billing_entities(user_id, nif);

ALTER TABLE billing_entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_entities" ON billing_entities
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

### Table: `billing_clients`

Stores clients (for sales) and suppliers (for purchases).

```sql
CREATE TABLE billing_clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id uuid NOT NULL REFERENCES billing_entities(id) ON DELETE CASCADE,

  -- Type
  type text NOT NULL CHECK (type IN ('client', 'supplier', 'both')),
  person_type text NOT NULL DEFAULT 'juridica'
    CHECK (person_type IN ('fisica', 'juridica')),  -- Persona física/jurídica

  -- Identity
  name text NOT NULL,                    -- Razón social / Nombre completo
  trade_name text,                       -- Nombre comercial
  nif text,                              -- NIF/CIF/NIE (nullable for international)
  vat_number text,                       -- EU VAT number (NIF-IVA)
  id_type text DEFAULT 'NIF'             -- NIF, NIF_IVA, PASAPORTE, OTRO_DOC
    CHECK (id_type IN ('NIF', 'NIF_IVA', 'PASAPORTE', 'DOCUMENTO_OFICIAL',
                        'CERTIFICADO_RESIDENCIA', 'OTRO_DOC', 'NO_CENSADO')),
  id_country text DEFAULT 'ES',          -- ISO country code

  -- Address
  address_line1 text,
  address_line2 text,
  city text,
  postal_code text,
  province text,
  country text DEFAULT 'ES',

  -- Contact
  email text,
  phone text,
  website text,
  contact_person text,

  -- Defaults for this client
  default_tax_rate numeric(5,2),
  default_payment_terms integer,
  default_payment_method text,

  -- Notes
  notes text,
  is_active boolean DEFAULT true,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX billing_clients_entity_id_idx ON billing_clients(entity_id);
CREATE INDEX billing_clients_type_idx ON billing_clients(entity_id, type);
CREATE INDEX billing_clients_nif_idx ON billing_clients(entity_id, nif);

ALTER TABLE billing_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entity_owners_manage_clients" ON billing_clients
FOR ALL TO authenticated
USING (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()))
WITH CHECK (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()));
```

### Table: `billing_products`

Catalog of products and services for quick line item creation.

```sql
CREATE TABLE billing_products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id uuid NOT NULL REFERENCES billing_entities(id) ON DELETE CASCADE,

  -- Product identity
  code text,                               -- Internal reference (SKU, código)
  name text NOT NULL,                      -- Nombre del producto/servicio
  description text,                        -- Descripción amplia

  -- Type
  type text NOT NULL DEFAULT 'service'
    CHECK (type IN ('product', 'service')),

  -- Pricing
  unit_price numeric(12,4) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',

  -- Unit of measure
  unit text DEFAULT 'unit'
    CHECK (unit IN (
      'unit',       -- Unidad
      'hour',       -- Hora
      'day',        -- Día
      'week',       -- Semana
      'month',      -- Mes
      'year',       -- Año
      'kg',         -- Kilogramo
      'm',          -- Metro
      'm2',         -- Metro cuadrado
      'm3',         -- Metro cúbico
      'l',          -- Litro
      'pack',       -- Paquete
      'box',        -- Caja
      'lot',        -- Lote
      'set',        -- Juego/conjunto
      'piece',      -- Pieza
      'project',    -- Proyecto
      'session',    -- Sesión
      'word',       -- Palabra (traducciones)
      'page',       -- Página
      'other'       -- Otro
    )),

  -- Tax defaults (pre-filled on line item creation)
  tax_rate numeric(5,2) DEFAULT 21.00,        -- Tipo impositivo por defecto
  surcharge_rate numeric(5,2) DEFAULT 0,      -- Recargo equivalencia por defecto
  irpf_rate numeric(5,2) DEFAULT 0,           -- Retención IRPF por defecto

  -- VeriFactu classification defaults
  impuesto text DEFAULT '01',                 -- 01=IVA, 02=IPSI, 03=IGIC
  clave_regimen text DEFAULT '01',            -- ClaveRegimen (01-20)
  calificacion_operacion text DEFAULT 'S1',   -- S1, S2, N1, N2
  causa_exencion text,                        -- E1-E6 (solo si exento)

  -- Discount defaults
  default_discount_percent numeric(5,2) DEFAULT 0,

  -- Status
  is_active boolean DEFAULT true,

  -- Categorization
  category text,                              -- Free-text grouping
  tags text[],

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX billing_products_entity_id_idx ON billing_products(entity_id);
CREATE INDEX billing_products_code_idx ON billing_products(entity_id, code);
CREATE INDEX billing_products_type_idx ON billing_products(entity_id, type);
CREATE INDEX billing_products_active_idx ON billing_products(entity_id, is_active) WHERE is_active = true;
CREATE INDEX billing_products_name_search_idx ON billing_products USING gin(to_tsvector('spanish', name));

ALTER TABLE billing_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entity_owners_manage_products" ON billing_products
FOR ALL TO authenticated
USING (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()))
WITH CHECK (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()));
```

### Table: `document_sequences`

Manages correlative numbering per document type and series.

```sql
CREATE TABLE document_sequences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id uuid NOT NULL REFERENCES billing_entities(id) ON DELETE CASCADE,

  doc_type text NOT NULL,           -- invoice, estimate, purchase, etc.
  series text NOT NULL DEFAULT '',  -- Series prefix (e.g., 'A', 'FACT', '')
  year integer NOT NULL,            -- Fiscal year
  next_number integer NOT NULL DEFAULT 1,
  prefix_format text DEFAULT '{series}{year}-{number}',  -- e.g., "A2026-00001"
  number_padding integer DEFAULT 5, -- Zero-pad to this length

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(entity_id, doc_type, series, year)
);

ALTER TABLE document_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entity_owners_manage_sequences" ON document_sequences
FOR ALL TO authenticated
USING (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()))
WITH CHECK (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()));
```

### Table: `documents`

Unified table for ALL document types.

```sql
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id uuid NOT NULL REFERENCES billing_entities(id) ON DELETE CASCADE,
  client_id uuid REFERENCES billing_clients(id) ON DELETE SET NULL,

  -- Document identification
  doc_type text NOT NULL CHECK (doc_type IN (
    'invoice', 'salesreceipt', 'creditnote', 'receiptnote',
    'estimate', 'salesorder', 'waybill', 'proform',
    'purchase', 'purchaserefund', 'purchaseorder'
  )),
  doc_series text NOT NULL DEFAULT '',
  doc_number text,                       -- Assigned on issue (correlative)

  -- Status
  status text NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'issued', 'sent', 'partially_paid', 'paid',
    'overdue', 'cancelled', 'rejected'
  )),

  -- VeriFactu mapping (for invoices/creditnotes only)
  tipo_factura text CHECK (tipo_factura IN (
    'F1', 'F2', 'F3', 'R1', 'R2', 'R3', 'R4', 'R5'
  )),
  tipo_rectificativa text CHECK (tipo_rectificativa IN ('S', 'I')),
  motivo_rectificacion text,

  -- Linked document (for creditnotes → original invoice, etc.)
  linked_document_id uuid REFERENCES documents(id) ON DELETE SET NULL,

  -- Dates
  issue_date date,                       -- Assigned on issue
  due_date date,
  delivery_date date,                    -- For waybills
  validity_date date,                    -- For estimates/proformas

  -- Amounts (calculated from items)
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  total_discount numeric(12,2) DEFAULT 0,
  total_tax numeric(12,2) NOT NULL DEFAULT 0,
  total_surcharge numeric(12,2) DEFAULT 0,
  total_irpf numeric(12,2) DEFAULT 0,       -- Total IRPF retention (subtracted from total)
  total_amount numeric(12,2) NOT NULL DEFAULT 0,  -- subtotal - discount + tax + surcharge - irpf
  total_paid numeric(12,2) DEFAULT 0,
  total_pending numeric(12,2) GENERATED ALWAYS AS (total_amount - total_paid) STORED,

  currency text NOT NULL DEFAULT 'EUR',

  -- Payment
  payment_method text,                   -- Facturae code: 01-19 (see section 5.12)
  payment_terms integer,                 -- Days until due

  -- Content
  notes text,                            -- Free text notes/conditions
  internal_notes text,                   -- Private notes (not shown to client)
  footer_text text,                      -- Custom footer

  -- Files
  pdf_url text,                          -- Generated PDF storage URL

  -- Email
  email_sent_at timestamptz,
  email_recipient text,

  -- Metadata
  tags text[],

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX documents_entity_id_idx ON documents(entity_id);
CREATE INDEX documents_client_id_idx ON documents(client_id);
CREATE INDEX documents_doc_type_idx ON documents(entity_id, doc_type);
CREATE INDEX documents_status_idx ON documents(entity_id, status);
CREATE INDEX documents_issue_date_idx ON documents(entity_id, issue_date DESC);
CREATE INDEX documents_doc_number_idx ON documents(entity_id, doc_type, doc_number);
CREATE INDEX documents_linked_idx ON documents(linked_document_id) WHERE linked_document_id IS NOT NULL;

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entity_owners_manage_documents" ON documents
FOR ALL TO authenticated
USING (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()))
WITH CHECK (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()));
```

### Table: `document_items`

Line items for each document.

```sql
CREATE TABLE document_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  product_id uuid REFERENCES billing_products(id) ON DELETE SET NULL,  -- Link to catalog

  position integer NOT NULL DEFAULT 0,   -- Display order

  -- Content
  description text NOT NULL,
  quantity numeric(12,4) NOT NULL DEFAULT 1,
  unit_price numeric(12,4) NOT NULL DEFAULT 0,
  unit text DEFAULT 'unit',              -- unit, hour, day, kg, etc.

  -- Discount
  discount_percent numeric(5,2) DEFAULT 0,
  discount_amount numeric(12,2) DEFAULT 0,

  -- Tax (IVA/IGIC/IPSI)
  tax_rate numeric(5,2) NOT NULL DEFAULT 21.00,  -- 21, 10, 4, 0 (IVA); 7, 3, 0 (IGIC); etc.
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,   -- Cuota repercutida

  -- Recargo equivalencia (surcharge)
  surcharge_rate numeric(5,2) DEFAULT 0,  -- 5.2, 1.4, 0.5, 0
  surcharge_amount numeric(12,2) DEFAULT 0,

  -- IRPF retention (for professional services)
  irpf_rate numeric(5,2) DEFAULT 0,      -- 15, 7, 2, 1, 0
  irpf_amount numeric(12,2) DEFAULT 0,   -- Calculated: subtotal * irpf_rate / 100

  -- VeriFactu tax classification
  impuesto text DEFAULT '01',            -- 01=IVA, 02=IPSI, 03=IGIC, 05=Otros
  clave_regimen text DEFAULT '01',       -- ClaveRegimenIvaEspecial (01-20)
  calificacion_operacion text DEFAULT 'S1', -- S1, S2, N1, N2
  causa_exencion text,                   -- E1-E6 (if tax_rate = 0 and exempt)

  -- Calculated
  subtotal numeric(12,2) NOT NULL DEFAULT 0,  -- qty * unit_price - discount (= base imponible)
  total numeric(12,2) NOT NULL DEFAULT 0,     -- subtotal + tax + surcharge - irpf

  created_at timestamptz DEFAULT now()
);

CREATE INDEX document_items_document_id_idx ON document_items(document_id);
CREATE INDEX document_items_product_id_idx ON document_items(product_id) WHERE product_id IS NOT NULL;

ALTER TABLE document_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entity_owners_manage_items" ON document_items
FOR ALL TO authenticated
USING (document_id IN (
  SELECT d.id FROM documents d
  JOIN billing_entities be ON d.entity_id = be.id
  WHERE be.user_id = auth.uid()
))
WITH CHECK (document_id IN (
  SELECT d.id FROM documents d
  JOIN billing_entities be ON d.entity_id = be.id
  WHERE be.user_id = auth.uid()
));
```

### Table: `document_payments`

Payment records for tracking partial/full payments.

```sql
CREATE TABLE document_payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,

  amount numeric(12,2) NOT NULL,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text NOT NULL,          -- Facturae code: 01-19 (see section 5.12)
  reference text,                        -- Bank reference, check number, etc.
  notes text,

  created_at timestamptz DEFAULT now()
);

CREATE INDEX document_payments_document_id_idx ON document_payments(document_id);

ALTER TABLE document_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entity_owners_manage_payments" ON document_payments
FOR ALL TO authenticated
USING (document_id IN (
  SELECT d.id FROM documents d
  JOIN billing_entities be ON d.entity_id = be.id
  WHERE be.user_id = auth.uid()
))
WITH CHECK (document_id IN (
  SELECT d.id FROM documents d
  JOIN billing_entities be ON d.entity_id = be.id
  WHERE be.user_id = auth.uid()
));
```

### Table: `verifactu_records`

Immutable VeriFactu billing records. NO UPDATE allowed.

```sql
CREATE TABLE verifactu_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id uuid NOT NULL REFERENCES billing_entities(id),
  document_id uuid REFERENCES documents(id),

  -- Record type
  record_type text NOT NULL CHECK (record_type IN ('alta', 'anulacion')),

  -- Invoice data (COPIED and IMMUTABLE)
  nif_emisor text NOT NULL,
  num_serie_factura text NOT NULL,       -- Series + number combined
  fecha_expedicion date NOT NULL,
  tipo_factura text,                     -- F1, F2, F3, R1-R5
  cuota_total numeric(12,2),             -- Total tax quota
  importe_total numeric(12,2),           -- Total amount

  -- For rectificativas
  tipo_rectificativa text,               -- S or I
  motivo_rectificacion text,
  nif_emisor_original text,              -- If different from issuer

  -- Chain reference (previous record)
  previous_record_id uuid REFERENCES verifactu_records(id),
  previous_hash text,                    -- Hash del registro anterior (64 chars)
  previous_nif_emisor text,
  previous_num_serie text,
  previous_fecha_expedicion date,

  -- Hash of THIS record
  hash text NOT NULL,                    -- SHA-256, 64 chars hex uppercase

  -- Generation timestamp (with timezone, IMMUTABLE)
  generation_timestamp timestamptz NOT NULL,

  -- XML content (complete, UTF-8)
  xml_content text NOT NULL,

  -- Electronic signature (XAdES Enveloped)
  xml_signature text,

  -- QR
  qr_url text NOT NULL,

  -- AEAT submission status
  aeat_status text NOT NULL DEFAULT 'pending'
    CHECK (aeat_status IN ('pending', 'sending', 'accepted',
                            'accepted_with_errors', 'rejected', 'error')),
  aeat_response jsonb,                   -- Full AEAT response
  aeat_csv text,                         -- Código Seguro Verificación
  aeat_sent_at timestamptz,
  aeat_retry_count integer DEFAULT 0,
  aeat_next_retry_at timestamptz,
  aeat_error_description text,

  -- IMMUTABLE: only created_at, no updated_at
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX verifactu_records_entity_id_idx ON verifactu_records(entity_id);
CREATE INDEX verifactu_records_document_id_idx ON verifactu_records(document_id);
CREATE INDEX verifactu_records_aeat_status_idx ON verifactu_records(entity_id, aeat_status);
CREATE INDEX verifactu_records_created_at_idx ON verifactu_records(entity_id, created_at DESC);
CREATE INDEX verifactu_records_hash_idx ON verifactu_records(hash);

ALTER TABLE verifactu_records ENABLE ROW LEVEL SECURITY;

-- Read-only for entity owners (records are created via API, never updated directly)
CREATE POLICY "entity_owners_read_records" ON verifactu_records
FOR SELECT TO authenticated
USING (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()));

-- Insert only via API (service role)
CREATE POLICY "service_insert_records" ON verifactu_records
FOR INSERT TO authenticated
WITH CHECK (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()));

-- AEAT status updates only (restricted columns via API)
CREATE POLICY "service_update_aeat_status" ON verifactu_records
FOR UPDATE TO authenticated
USING (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()))
WITH CHECK (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()));
```

### Table: `verifactu_events`

Event registry (required for No-VeriFactu mode, optional for VeriFactu mode).

```sql
CREATE TABLE verifactu_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id uuid NOT NULL REFERENCES billing_entities(id),

  -- Event classification (Enum L2E)
  event_type text NOT NULL CHECK (event_type IN (
    'start_no_verifactu',          -- 1: Inicio como NO VERI*FACTU
    'stop_no_verifactu',           -- 2: Fin como NO VERI*FACTU
    'anomaly_check_invoices',      -- 3: Lanzamiento detección anomalías facturas
    'anomalies_found_invoices',    -- 4: Anomalías detectadas en facturas
    'anomaly_check_events',        -- 5: Lanzamiento detección anomalías eventos
    'anomalies_found_events',      -- 6: Anomalías detectadas en eventos
    'backup_restore',              -- 7: Restauración de copia de seguridad
    'invoice_export',              -- 8: Exportación de facturas
    'event_export',                -- 9: Exportación de eventos
    'summary',                     -- 10: Resumen periódico (mín. cada 6h)
    'other'                        -- 90: Otros eventos voluntarios
  )),
  event_description text,

  -- System identification
  system_id text NOT NULL,
  system_version text NOT NULL,
  installation_number text NOT NULL,
  nif_obligado text NOT NULL,

  -- Chain reference
  previous_event_id uuid REFERENCES verifactu_events(id),
  previous_hash text,
  hash text NOT NULL,                    -- SHA-256

  generation_timestamp timestamptz NOT NULL,
  xml_content text,
  xml_signature text,

  created_at timestamptz DEFAULT now()
);

CREATE INDEX verifactu_events_entity_id_idx ON verifactu_events(entity_id);
CREATE INDEX verifactu_events_type_idx ON verifactu_events(entity_id, event_type);

ALTER TABLE verifactu_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entity_owners_manage_events" ON verifactu_events
FOR ALL TO authenticated
USING (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()))
WITH CHECK (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()));
```

### Table: `verifactu_system_info`

System identification and Declaración Responsable (Art. 15).

```sql
CREATE TABLE verifactu_system_info (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id uuid NOT NULL REFERENCES billing_entities(id) ON DELETE CASCADE,

  -- Art. 15.1 mandatory fields
  system_name text NOT NULL,                     -- a) Nombre del sistema
  system_code text NOT NULL,                     -- b) Código identificador (max 2 chars)
  system_version text NOT NULL,                  -- c) Versión completa
  system_description text,                       -- d) Componentes y funcionalidades
  is_verifactu_only boolean DEFAULT true,         -- e) Diseño exclusivo VERI*FACTU (S/N)
  is_multi_user boolean DEFAULT true,             -- f) Multi-obligado tributario (S/N)
  signature_types text,                          -- g) Tipos de firma (if No-VeriFactu)

  -- Producer identification
  producer_name text NOT NULL,                   -- h) Nombre/razón social productor
  producer_nif text NOT NULL,                    -- i) NIF del productor
  producer_address text NOT NULL,                -- j) Dirección postal completa

  -- Declaration
  compliance_statement text NOT NULL,            -- k) Declaración de cumplimiento
  declaration_date date NOT NULL,                -- l) Fecha
  declaration_place text NOT NULL,               -- l) Lugar

  -- Installation
  installation_number text NOT NULL DEFAULT '01', -- Número de instalación

  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(entity_id, system_code)
);

ALTER TABLE verifactu_system_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entity_owners_manage_system" ON verifactu_system_info
FOR ALL TO authenticated
USING (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()))
WITH CHECK (entity_id IN (SELECT id FROM billing_entities WHERE user_id = auth.uid()));
```

---

## 5. Tax & Fiscal Catalogs

All tax rates, codes, and catalogs used by the billing module. These are defined as TypeScript constants in `lib/verifactu/enums.ts` and used for dropdowns, validation, and calculations.

### 5.1 Tax Regimes by Territory

| Regime | Territory | Applicable |
|--------|-----------|------------|
| **IVA** | Península + Baleares | Default for most businesses |
| **IGIC** | Canarias (Islas Canarias) | Autonomous tax system |
| **IPSI** | Ceuta y Melilla | Autonomous tax system |

The entity's `tax_regime` field determines which rate tables are shown in the UI.

### 5.2 IVA Rates (Península + Baleares)

| Rate | Type | Common Use |
|------|------|------------|
| **21%** | General | Most services and goods |
| **10%** | Reducido | Food, transport, hospitality, renovation |
| **4%** | Superreducido | Bread, milk, medicine, books, disabled aids |
| **0%** | Exento/No sujeto | Exports, education, health (with causa exención) |

### 5.3 IGIC Rates (Canarias)

| Rate | Type | Common Use |
|------|------|------------|
| **0%** | Tipo cero | Basic necessities, some services |
| **3%** | Reducido | Certain food, some professional services |
| **7%** | General | Most goods and services |
| **9.5%** | Incrementado | Vehicles, electronics |
| **15%** | Especial incrementado | Tobacco, alcohol, luxury |
| **20%** | Tipo especial | Very specific luxury items |

### 5.4 IPSI Rates (Ceuta y Melilla)

| Rate | Type |
|------|------|
| **0.5%** | Mínimo |
| **1%** | Reducido |
| **2%** | Reducido |
| **4%** | Intermedio |
| **8%** | General |
| **10%** | Incrementado |

### 5.5 Recargo de Equivalencia

Applies to retail merchants (`applies_surcharge = true` in `billing_entities`). The surcharge rate is linked to the IVA rate:

| IVA Rate | Surcharge Rate | Total Combined |
|----------|----------------|----------------|
| 21% | **5.2%** | 26.2% |
| 10% | **1.4%** | 11.4% |
| 4% | **0.5%** | 4.5% |
| 0% | **0%** | 0% |
| Tabaco | **1.75%** | Special |

> **Implementation:** When `applies_surcharge = true` and the user selects a tax rate, the surcharge rate auto-fills based on this mapping.

### 5.6 IRPF Retentions

Applicable to professional services invoices (autónomos). The IRPF is **subtracted** from the total, not added.

| Activity Type | IRPF Rate | Legal Basis |
|---------------|-----------|-------------|
| **professional** | 15% | Actividad profesional general |
| **professional_new** | 7% | Primeros 3 años de alta (+ año anterior si no facturó) |
| **professional_artistic** | 7% | Artistas, actividades culturales |
| **business** | 0% | Actividades empresariales (no aplica IRPF en factura) |
| **agricultural** | 2% | Actividades agrícolas y ganaderas |
| **forestry** | 2% | Actividades forestales |
| **poultry** | 1% | Actividades avícolas |
| **modules** | 1% | Estimación objetiva (módulos) |

**Calculation example (autónomo profesional):**
```
Base imponible:         1,000.00 €
IVA (21%):              + 210.00 €
IRPF (15%):             - 150.00 €
─────────────────────────────────
Total factura:          1,060.00 €
```

> **Implementation:** `default_irpf_rate` is set on `billing_entities` based on `activity_type`. Can be overridden per product or per line item.

### 5.7 Tipo de Impuesto (VeriFactu L1 Enum)

| Code | Description |
|------|-------------|
| `01` | IVA |
| `02` | IPSI |
| `03` | IGIC |
| `05` | Otros |

### 5.8 Tipo de Factura (VeriFactu L2 Enum)

| Code | Category | Description |
|------|----------|-------------|
| `F1` | Ordinaria | Factura - Art. 6, 7.2 y 7.3 del RD 1619/2012 |
| `F2` | Simplificada | Factura simplificada - Art. 6.1.d RD 1619/2012 |
| `F3` | Sustitutiva | Emitida en sustitución de facturas simplificadas |
| `R1` | Rectificativa | Error fundado en derecho + Art. 80.Uno, Dos, Seis LIVA |
| `R2` | Rectificativa | Art. 80.3 LIVA |
| `R3` | Rectificativa | Art. 80.4 LIVA |
| `R4` | Rectificativa | Resto |
| `R5` | Rectificativa | En facturas simplificadas |

### 5.9 Calificación de Operación (VeriFactu L9 Enum)

| Code | Description |
|------|-------------|
| `S1` | Operación Sujeta y No exenta - Sin inversión del sujeto pasivo |
| `S2` | Operación Sujeta y No exenta - Con inversión del sujeto pasivo |
| `N1` | Operación No sujeta - Artículo 7, 14, otros |
| `N2` | Operación No sujeta - Por reglas de localización |

### 5.10 Clave de Régimen IVA (VeriFactu L8A Enum)

| Code | Description |
|------|-------------|
| `01` | Operación de régimen general |
| `02` | Exportación |
| `04` | Régimen especial del oro de inversión |
| `07` | Régimen especial del criterio de caja |
| `08` | Operaciones sujetas al IPSI / IGIC |
| `10` | Cobros por cuenta de terceros (honorarios profesionales, etc.) |
| `11` | Operaciones de arrendamiento de local de negocio |
| `14` | IVA pendiente de devengo en certificaciones de obra (Adm. Pública) |
| `15` | IVA pendiente de devengo en operaciones de tracto sucesivo |
| `17` | Operación acogida a régimen OSS / IOSS (Capítulo XI Título IX) |
| `18` | Recargo de equivalencia |
| `19` | Régimen Especial de Agricultura, Ganadería y Pesca (REAGYP) |
| `20` | Régimen simplificado |

### 5.11 Causa de Exención (VeriFactu L10 Enum)

Visible only when `calificacion_operacion` is **not** S1/S2 (subject) and operation is exempt.

| Code | Description |
|------|-------------|
| `E1` | Exenta por el artículo 20 LIVA |
| `E2` | Exenta por el artículo 21 LIVA |
| `E3` | Exenta por el artículo 22 LIVA |
| `E4` | Exenta por los artículos 23 y 24 LIVA |
| `E5` | Exenta por el artículo 25 LIVA |
| `E6` | Exenta por otros |

### 5.12 Payment Methods (Facturae Standard)

| Code | Description |
|------|-------------|
| `01` | Al contado (Cash) |
| `02` | Recibo domiciliado (Direct debit) |
| `03` | Recibo (Receipt) |
| `04` | **Transferencia** (Bank transfer) — Default |
| `05` | Letra aceptada (Accepted bill) |
| `06` | Crédito documentario (Documentary credit) |
| `07` | Contrato adjudicación (Award contract) |
| `08` | Letra de cambio (Bill of exchange) |
| `09` | Pagaré a la orden (Promissory note) |
| `10` | Pagaré no a la orden (Non-order promissory note) |
| `11` | Cheque (Check) |
| `12` | Reposición (Replacement) |
| `13` | Especiales (Special) |
| `14` | Compensación (Offset) |
| `15` | Giro postal (Postal order) |
| `16` | Cheque conformado (Certified check) |
| `17` | Cheque bancario (Bank check) |
| `18` | Pago contra reembolso (Cash on delivery) |
| `19` | Pago mediante tarjeta (Card payment) |

### 5.13 Units of Measure

| Code | Spanish | English |
|------|---------|---------|
| `unit` | Unidad | Unit |
| `hour` | Hora | Hour |
| `day` | Día | Day |
| `week` | Semana | Week |
| `month` | Mes | Month |
| `year` | Año | Year |
| `kg` | Kilogramo | Kilogram |
| `m` | Metro | Meter |
| `m2` | Metro cuadrado | Square meter |
| `m3` | Metro cúbico | Cubic meter |
| `l` | Litro | Liter |
| `pack` | Paquete | Pack |
| `box` | Caja | Box |
| `lot` | Lote | Lot |
| `set` | Juego/Conjunto | Set |
| `piece` | Pieza | Piece |
| `project` | Proyecto | Project |
| `session` | Sesión | Session |
| `word` | Palabra | Word |
| `page` | Página | Page |
| `other` | Otro | Other |

### 5.14 Simplified Invoice Rules (F2)

Simplified invoices (tickets) are allowed when:
- Amount ≤ 400 € (IVA included)
- Rectificative invoices ≤ 400 €
- Specific sectors (Art. 6.1.d RD 1619/2012): retail, transport, hospitality, parking, tolls, entertainment

**Key difference from F1:** No buyer identification required (NIF/address optional).

### 5.15 Cash Payment Limit (Ley Antifraude)

- Maximum 1,000 € in cash between professionals
- Applies when at least one party is a professional (autónomo or empresa)
- Penalty: 25% of the amount paid in cash

---

## 6. VeriFactu Compliance

### Hash Calculation (SHA-256)

**For RegistroAlta (invoice registration):**

```
Input string (concatenated with &):
IDEmisorFactura={NIF}
&NumSerieFactura={series/number}
&FechaExpedicionFactura={DD-MM-YYYY}
&TipoFactura={F1|F2|F3|R1-R5}
&CuotaTotal={X.XX}
&ImporteTotal={Y.YY}
&Huella={previous_hash_or_empty}
&FechaHoraHusoGenRegistro={2024-01-01T19:20:30+01:00}
```

**For RegistroAnulacion (cancellation):**

```
Input string:
IDEmisorFacturaAnulada={NIF}
&NumSerieFacturaAnulada={series/number}
&FechaExpedicionFacturaAnulada={DD-MM-YYYY}
&Huella={previous_hash_or_empty}
&FechaHoraHusoGenRegistro={ISO8601+timezone}
```

**For Events:**

```
Input string:
IDProductor={producer_id}
&IdSistemaInformatico={system_id}
&VersionSistemaInformatico={version}
&NumInstalacion={install_number}
&NifObligadoEmision={NIF}
&TipoEvento={event_type}
&Huella={previous_hash_or_empty}
&FechaHoraHusoGenRegistro={ISO8601+timezone}
```

**Rules:**
- Algorithm: SHA-256 (L12 enum value: "01")
- Input encoding: UTF-8
- Output: 64-character hexadecimal string, UPPERCASE
- If a field has no value, include only `fieldName=` (empty value)
- First record in chain: `Huella=` (empty)
- Spaces removed from field values
- Numeric values normalized

### Electronic Signature

- Standard: **ETSI EN 319 132** (XAdES Enveloped Signature)
- Certificate: Qualified electronic certificate (FNMT or EU Trusted List provider)
- Required for: Non-VeriFactu mode (always), VeriFactu mode (optional but recommended)
- Implementation: `xadesjs` library with PFX/P12 certificate

### QR Code

- Size: 30x30 to 40x40 mm
- Standard: ISO/IEC 18004
- Error correction: Level M
- Content (URL format):

```
# VeriFactu mode:
https://www2.aeat.es/wlpl/TIKE-CONT/ValidarQR?nif={NIF}&numserie={series/number}&fecha={DD-MM-YYYY}&importe={total}

# Testing:
https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR?nif={NIF}&numserie={series/number}&fecha={DD-MM-YYYY}&importe={total}
```

### AEAT SOAP Communication

**Flow control rules (Art. 16):**
- Wait 60 seconds between submissions (configurable by AEAT)
- Maximum 1,000 records per SOAP message
- On failure: retry minimum every 1 hour
- On acceptance: store CSV (Código Seguro Verificación)

---

## 7. API Routes

### Complete Route Map

Every module includes: **CRUD + Import + Export + Template + Bulk Actions**

```
/api/admin/billing/

# ─── Mis Datos (Entity management) ──────────────────────────
├── entities/
│   ├── GET     route.ts              List entities for current user
│   ├── POST    route.ts              Create new entity
│   ├── import/
│   │   └── POST  route.ts           Import entities from CSV/JSON
│   ├── export/
│   │   └── GET   route.ts           Export entities to CSV/JSON/Excel
│   ├── template/
│   │   └── GET   route.ts           Download import template (CSV with headers)
│   └── [id]/
│       ├── GET     route.ts          Get entity details
│       ├── PATCH   route.ts          Update entity
│       └── DELETE  route.ts          Delete entity

# ─── Productos y Servicios ──────────────────────────────────
├── products/
│   ├── GET     route.ts              List products (search, filter by type/category/active)
│   ├── POST    route.ts              Create product/service
│   ├── import/
│   │   └── POST  route.ts           Import products from CSV/JSON
│   ├── export/
│   │   └── GET   route.ts           Export products to CSV/JSON/Excel
│   ├── template/
│   │   └── GET   route.ts           Download import template (CSV with headers + example row)
│   ├── bulk/
│   │   ├── PATCH  route.ts          Bulk update (activate, deactivate, change tax rate, etc.)
│   │   └── DELETE route.ts          Bulk deactivate (soft delete)
│   └── [id]/
│       ├── GET     route.ts          Get product details
│       ├── PATCH   route.ts          Update product
│       └── DELETE  route.ts          Deactivate product (soft delete)

# ─── Clientes y Proveedores ─────────────────────────────────
├── clients/
│   ├── GET     route.ts              List clients (filter: type, person_type, active)
│   ├── POST    route.ts              Create client/supplier
│   ├── import/
│   │   └── POST  route.ts           Import clients from CSV/JSON
│   ├── export/
│   │   └── GET   route.ts           Export clients to CSV/JSON/Excel
│   ├── template/
│   │   └── GET   route.ts           Download import template (CSV)
│   ├── bulk/
│   │   ├── PATCH  route.ts          Bulk update (activate, deactivate, change defaults)
│   │   └── DELETE route.ts          Bulk deactivate (soft delete)
│   └── [id]/
│       ├── GET     route.ts          Get client details
│       ├── PATCH   route.ts          Update client
│       └── DELETE  route.ts          Delete client (soft)

# ─── Documentos (Emisión + Consulta + Borradores) ───────────
├── documents/
│   ├── GET     route.ts              List documents (filters: type, status, date range, client)
│   │                                 status=draft → Borradores view
│   │                                 status=issued → Consulta de facturas view
│   ├── POST    route.ts              Create document (draft)
│   ├── import/
│   │   └── POST  route.ts           Import documents from CSV/JSON (as drafts)
│   ├── export/
│   │   └── GET   route.ts           Export documents to CSV/JSON/Excel (filterable)
│   ├── template/
│   │   └── GET   route.ts           Download import template (CSV with items structure)
│   ├── bulk/
│   │   ├── issue/
│   │   │   └── POST  route.ts       Bulk issue multiple drafts
│   │   ├── email/
│   │   │   └── POST  route.ts       Bulk send via email
│   │   ├── pdf/
│   │   │   └── GET   route.ts       Bulk download PDFs (ZIP)
│   │   ├── PATCH  route.ts          Bulk update status/tags
│   │   └── DELETE route.ts          Bulk delete drafts only
│   └── [id]/
│       ├── GET       route.ts        Get document with items (detail/consulta)
│       ├── PATCH     route.ts        Update draft document
│       ├── DELETE    route.ts        Delete draft only
│       ├── issue/
│       │   └── POST  route.ts        Issue document (VeriFactu flow → Emisión)
│       ├── cancel/
│       │   └── POST  route.ts        Cancel/annul document (RegistroAnulacion)
│       ├── pdf/
│       │   └── GET   route.ts        Generate/download PDF
│       ├── email/
│       │   └── POST  route.ts        Send document via email
│       ├── duplicate/
│       │   └── POST  route.ts        Duplicate document as new draft
│       ├── convert/
│       │   └── POST  route.ts        Convert (estimate → invoice, etc.)
│       └── payments/
│           ├── GET   route.ts        List payments for document
│           └── POST  route.ts        Register payment

# ─── Números de Serie ────────────────────────────────────────
├── sequences/
│   ├── GET     route.ts              List sequences (all series for entity)
│   ├── POST    route.ts              Create new sequence/series
│   ├── import/
│   │   └── POST  route.ts           Import sequences from CSV/JSON
│   ├── export/
│   │   └── GET   route.ts           Export sequences to CSV/JSON/Excel
│   ├── template/
│   │   └── GET   route.ts           Download import template (CSV)
│   ├── bulk/
│   │   └── PATCH  route.ts          Bulk update (reset counters, change format)
│   └── [id]/
│       ├── GET     route.ts          Get sequence details + usage stats
│       ├── PATCH   route.ts          Update sequence settings
│       └── DELETE  route.ts          Delete unused sequence

# ─── VeriFactu ───────────────────────────────────────────────
├── verifactu/
│   ├── records/
│   │   ├── GET   route.ts            List VeriFactu records (status filter)
│   │   └── export/
│   │       └── GET   route.ts        Export records to CSV/XML
│   ├── retry/
│   │   └── [id]/
│   │       └── POST  route.ts        Retry failed AEAT submission
│   ├── bulk-retry/
│   │   └── POST  route.ts            Bulk retry all failed/pending submissions
│   ├── events/
│   │   ├── GET   route.ts            List events
│   │   └── export/
│   │       └── GET   route.ts        Export events to CSV/XML
│   ├── system/
│   │   ├── GET   route.ts            Get system info
│   │   └── PATCH route.ts            Update system info
│   └── integrity-check/
│       └── POST  route.ts            Run anomaly detection on chain

# ─── Reports ─────────────────────────────────────────────────
└── reports/
    ├── summary/
    │   └── GET   route.ts            Income/expense summary (period)
    ├── vat/
    │   └── GET   route.ts            VAT calculation (Modelo 303)
    ├── irpf/
    │   └── GET   route.ts            IRPF retention summary (quarterly)
    ├── receivables/
    │   └── GET   route.ts            Accounts receivable
    ├── payables/
    │   └── GET   route.ts            Accounts payable
    └── export/
        └── GET   route.ts            Export any report to CSV/PDF/Excel
```

### Import/Export/Template/Bulk Specification

**Import** (POST `*/import`):
- Accepts: CSV, JSON, Excel (.xlsx)
- Returns: `{ imported: number, errors: { row: number, field: string, message: string }[] }`
- Validates with Zod before insert
- Dry-run mode available (`?dryrun=true`) to preview without saving

**Export** (GET `*/export`):
- Formats: CSV (`?format=csv`), JSON (`?format=json`), Excel (`?format=xlsx`)
- Supports all list filters (date range, type, status, etc.)
- Streams large datasets (no memory issues)

**Template** (GET `*/template`):
- Returns CSV file with correct headers + one example row
- Includes all required fields, marks optional with `(optional)` suffix
- Format: `?format=csv` (default) or `?format=xlsx`

**Bulk Actions** (POST/PATCH/DELETE `*/bulk`):
- Accepts: `{ ids: string[] }` or `{ filter: { ... } }` (all matching)
- Maximum 500 items per request
- Returns: `{ processed: number, errors: { id: string, message: string }[] }`
- Confirmation required for destructive actions (`?confirm=true`)

### Issue Flow (POST /api/admin/billing/documents/[id]/issue)

```typescript
// Pseudocode
async function issueDocument(documentId: string) {
  // 1. Validate document is draft
  const doc = await getDocument(documentId);
  if (doc.status !== 'draft') throw new Error('Only drafts can be issued');

  // 2. Validate all fields with Zod
  const validated = DocumentIssueSchema.parse(doc);

  // 3. Assign correlative number (atomic transaction)
  const { series, number } = await getNextNumber(doc.entity_id, doc.doc_type);

  // 4. Determine VeriFactu tipo_factura
  const tipoFactura = mapDocTypeToTipoFactura(doc);

  // 5. Get previous record hash
  const previousRecord = await getLastVerifactuRecord(doc.entity_id);

  // 6. Calculate SHA-256 hash
  const hash = calculateHash({
    nifEmisor: entity.nif,
    numSerieFactura: `${series}${number}`,
    fechaExpedicion: doc.issue_date,
    tipoFactura,
    cuotaTotal: doc.total_tax,
    importeTotal: doc.total_amount,
    huellaAnterior: previousRecord?.hash || '',
    fechaHoraHuso: new Date().toISOString(),
  });

  // 7. Build XML (RegistroAlta)
  const xml = buildRegistroAltaXml({...});

  // 8. Sign XML with XAdES
  const signedXml = await signXml(xml, certificate);

  // 9. Generate QR URL
  const qrUrl = generateQrUrl({...});

  // 10. Create immutable verifactu_record
  const record = await createVerifactuRecord({...});

  // 11. Send to AEAT via SOAP
  const aeatResponse = await sendToAeat(signedXml);

  // 12. Update record with AEAT response
  await updateAeatStatus(record.id, aeatResponse);

  // 13. Update document status
  await updateDocument(documentId, {
    status: 'issued',
    doc_number: `${series}${number}`,
    issue_date: new Date(),
  });

  // 14. Generate PDF with QR
  const pdfUrl = await generatePdf(documentId);

  return { success: true, data: { documentId, pdfUrl, aeatStatus: aeatResponse.status } };
}
```

---

## 8. Admin UI Structure

### Navigation

```
Admin Sidebar:
├── Dashboard (existing)
├── Projects (existing)
├── Categories (existing)
├── Users (existing)
├── Contact (existing)
├── Newsletter (existing)
├── ─── Facturación ─────────────
├── 📊 Panel de Facturación       ← Billing Dashboard
├── 👤 Mis Datos                   ← Entity setup (person_type, NIF, address, cert, tax config)
├── 👥 Clientes                    ← Clients & Suppliers
│   ├── Todos los Clientes
│   ├── + Nuevo Cliente
│   ├── Importar
│   └── Exportar
├── 📦 Productos y Servicios       ← Product/service catalog
│   ├── Todos los Productos
│   ├── + Nuevo Producto
│   ├── Importar
│   └── Exportar
├── 🔢 Números de Serie            ← Sequences/series management
│   ├── Todas las Series
│   ├── + Nueva Serie
│   ├── Importar
│   └── Exportar
├── 📄 Emisión de Facturas          ← Create/issue documents
│   ├── + Nueva Factura
│   ├── + Nuevo Presupuesto
│   ├── + Nueva Factura Compra
│   └── + Nuevo Documento
├── 🔍 Consulta de Facturas         ← Search/view issued documents
│   ├── Facturas Emitidas
│   ├── Facturas de Compra
│   ├── Presupuestos
│   ├── Todos los Documentos
│   ├── Importar
│   └── Exportar
├── 📝 Borradores                   ← Draft documents
│   └── (filtered view: status=draft)
├── ✅ VeriFactu
│   ├── Estado de Registros
│   ├── Registro de Eventos
│   ├── Info del Sistema
│   └── Exportar
├── 📈 Informes
│   ├── Resumen
│   ├── IVA (Modelo 303)
│   ├── IRPF (Retenciones)
│   ├── Cuentas por Cobrar
│   ├── Cuentas por Pagar
│   └── Exportar
└── ⚙️ Configuración
    ├── Mis Datos (entity)
    ├── Series y Numeración
    └── Plantillas PDF
```

### Key Pages

**Each list page includes:** Searchable table + filters + bulk actions toolbar + import/export buttons + template download.

1. **Panel de Facturación** (Dashboard) - Overview: income, expenses, pending invoices, VeriFactu status, quick actions
2. **Mis Datos** (Entity Setup) - Form: person_type, NIF, address, tax regime, activity type, IRPF, certificate, bank details, logo
3. **Clientes** (Client List) - Filterable by type (client/supplier), person_type, active. Bulk: activate, deactivate, delete
4. **Cliente Editor** - Form with person_type toggle, identity (NIF/VAT), address with postal code autocomplete, contact, defaults
5. **Productos y Servicios** (Product List) - Filterable by type, category, active. Bulk: activate, deactivate, change tax rate
6. **Producto Editor** - Form with pricing, unit selection, tax defaults (IVA/IGIC/IPSI), clave régimen, IRPF, surcharge
7. **Números de Serie** (Sequences) - List all series with current counters, format preview, usage stats
8. **Emisión de Facturas** (Document Editor) - Full form with:
   - Client selector (search by name/NIF)
   - Product selector (search, auto-fills line item with defaults)
   - Line items: description, qty, unit, price, discount toggle, tax rate, IRPF rate, surcharge toggle
   - Auto-calculated totals (base, IVA, recargo, IRPF, total)
   - VeriFactu classification per line (clave régimen, calificación operación, causa exención)
   - Live preview panel
9. **Consulta de Facturas** (Document Search) - Advanced search: by number, date range, client, amount, status, type. Read-only detail view with PDF preview, VeriFactu status, payment history
10. **Borradores** (Drafts) - Filtered document list (status=draft only). Bulk: issue, delete, email
11. **VeriFactu Records** - Status table with retry capability, export XML
12. **Informes** (Reports) - Charts and tables with date range filters, export to CSV/PDF/Excel

---

## 9. PDF Generation

### Technology: @react-pdf/renderer

React components that render to PDF on the server.

### Invoice PDF Template Requirements

1. **Header**: Logo + entity details (name, NIF, address)
2. **Client details**: Name, NIF, address
3. **Invoice metadata**: Number, date, due date, payment terms
4. **Line items table**: Description, qty, unit price, discount, tax rate, IRPF rate, total
5. **Tax summary table**: Breakdown by tax rate (base, IVA %, cuota IVA, recargo %, cuota recargo)
6. **IRPF summary**: Breakdown by IRPF rate (base, IRPF %, retención)
7. **Totals**: Subtotal, discounts, + taxes, + surcharges, - IRPF, = total
8. **Payment info**: Bank details (IBAN), payment method (Facturae code label)
9. **QR Code**: 30-40mm, positioned bottom-right
10. **VERI*FACTU mention**: "Factura verificable en la sede electrónica de la AEAT"
11. **Footer**: Legal text, conditions

### PDF for Each Document Type

Each document type gets its own template variant:
- Invoice / Sales Receipt → Full VeriFactu layout
- Credit Note → Shows "FACTURA RECTIFICATIVA" + original reference
- Estimate / Proforma → No VeriFactu elements (no QR, no hash)
- Purchase → Internal document, simplified layout
- Waybill → Delivery-focused layout
- Sales Order → Order confirmation layout

---

## 10. Email Integration

### Using Existing Resend Setup

The project already has Resend configured. Extend for billing:

- **Send invoice email**: PDF attached, customizable subject/body
- **Payment reminder**: Overdue invoice notification
- **Estimate follow-up**: Optional reminder for pending estimates
- **Templates**: React Email components (already using `@react-email/components`)

---

## 11. Reporting Dashboard

### Metrics

1. **Income Summary**: Total invoiced, by period, by client
2. **Expense Summary**: Total purchases, by period, by supplier
3. **VAT Calculation (Modelo 303)**:
   - IVA repercutido (output tax) by rate (21%, 10%, 4%)
   - IVA soportado (input tax) deducible
   - Result: amount to pay or claim
   - Filter by quarter (T1-T4) and year
4. **Accounts Receivable**: Pending invoices, aging analysis
5. **Accounts Payable**: Pending purchases, due dates
6. **VeriFactu Status**: Records accepted/pending/rejected by period

### Export

- CSV export for accountant
- PDF summary reports
- Modelo 303 pre-fill data

---

## 12. Dependencies

### New npm Packages

```json
{
  "@react-pdf/renderer": "^4.x",      // PDF generation (React components → PDF)
  "xadesjs": "^2.4",                  // XAdES electronic signature
  "xmldsigjs": "^2.x",                // XML digital signatures (dependency of xadesjs)
  "fast-xml-parser": "^4.x",          // XML parsing and building
  "qrcode": "^1.5",                   // QR code generation
  "node-forge": "^1.3",               // Certificate handling (PFX/P12 parsing)
  "soap": "^1.x",                     // SOAP client for AEAT web services
  "xlsx": "^0.18",                    // Excel import/export (.xlsx read/write)
  "csv-parse": "^5.x",               // CSV parser (streaming, RFC 4180 compliant)
  "csv-stringify": "^6.x",           // CSV generator (streaming)
  "archiver": "^7.x"                 // ZIP generation (bulk PDF download)
}
```

### Existing Packages Used

- `zod` - Validation schemas
- `@react-email/components` - Email templates
- `resend` - Email sending
- `date-fns` - Date formatting
- `sonner` - Toast notifications
- `@supabase/ssr` - Database client

---

## 13. AEAT Environments

### Endpoint Configuration

```typescript
// lib/verifactu/config.ts

type AeatEnvironment = 'sandbox' | 'production';

const AEAT_CONFIG = {
  sandbox: {
    soapEndpoint: 'https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP',
    soapEndpointSeal: 'https://prewww10.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP',
    qrValidationBase: 'https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR',
    wsdl: 'https://prewww2.aeat.es/static_files/common/internet/dep/aplicaciones/es/aeat/tikeV1.0/cont/ws/SistemaFacturacion.wsdl',
    portalUrl: 'https://preportal.aeat.es',
  },
  production: {
    soapEndpoint: 'https://www1.agenciatributaria.gob.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP',
    soapEndpointSeal: 'https://www10.agenciatributaria.gob.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP',
    qrValidationBase: 'https://www2.agenciatributaria.gob.es/wlpl/TIKE-CONT/ValidarQR',
    wsdl: 'https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tikeV1.0/cont/ws/SistemaFacturacion.wsdl',
    portalUrl: 'https://sede.agenciatributaria.gob.es',
  },
} as const;
```

### Environment Variable

```env
AEAT_ENVIRONMENT=sandbox   # or 'production'
```

### Testing Notes

- Sandbox uses real certificate (FNMT)
- Sandbox data has no fiscal consequences
- Do NOT use for massive testing (AEAT may block)
- Use for punctual integration validation

---

## 14. Security

### Certificate Storage

- Certificate (.pfx/.p12) stored server-side only
- Certificate password encrypted at rest in `billing_entities.certificate_password_encrypted`
- Never exposed to client/browser
- Loaded only in API routes for signing

### Data Protection

- All billing data protected by Supabase RLS
- `user_id` filtering on all queries
- VeriFactu records are immutable (no UPDATE on core fields)
- Hash chain guarantees integrity

### API Security

- All routes require authenticated admin user
- Zod validation on all inputs
- Rate limiting on AEAT submissions

---

## 15. Implementation Phases

### Phase 1: Foundation (Database + Core CRUD + Import/Export)

1. Database migrations (all 10 tables including `billing_products`)
2. Tax & fiscal catalogs (`lib/verifactu/enums.ts` — all rates, codes, payment methods, units)
3. **Shared import/export engine** (`lib/billing/import-export.ts`):
   - CSV/JSON/Excel parser (import)
   - CSV/JSON/Excel generator (export)
   - Template generator (CSV with headers + example row)
   - Zod validation per entity type
   - Dry-run mode for import preview
4. **Shared bulk actions engine** (`lib/billing/bulk.ts`):
   - Batch processor (max 500 items)
   - Confirmation flow for destructive actions
   - Error collection and reporting
5. **Mis Datos** — Entity setup page (`billing_entities` — person_type, tax regime, activity type, IRPF, certificate, bank)
6. **Productos y Servicios** — CRUD + import/export/template/bulk
7. **Clientes y Proveedores** — CRUD + import/export/template/bulk (person_type, postal code autocomplete)
8. **Números de Serie** — CRUD + import/export/template/bulk
9. **Documentos** — CRUD (draft creation, editing) + import/export/template
10. **Document items** — Line items with product selector, tax/IRPF/surcharge auto-calculation
11. **Borradores** — Filtered draft view with bulk issue/delete

### Phase 2: VeriFactu Engine + Emisión

1. Hash calculation module (SHA-256)
2. XML builder (RegistroAlta, RegistroAnulacion)
3. XAdES signing module (with FNMT cert)
4. SOAP client for AEAT
5. QR code generation
6. **Emisión de facturas** — Issue flow (draft → issued with VeriFactu)
7. Cancel flow (RegistroAnulacion)
8. **Bulk issue** — Issue multiple drafts at once
9. **Bulk retry** — Retry all failed AEAT submissions

### Phase 3: PDF & Email

1. PDF templates (invoice, estimate, purchase, credit note, waybill, etc.)
2. Tax summary table in PDF (base, IVA, recargo, IRPF per rate)
3. QR code integration in PDF
4. "VERI*FACTU" mention in PDF
5. Email sending with PDF attachment
6. **Bulk email** — Send multiple documents via email
7. **Bulk PDF download** — ZIP file with multiple PDFs
8. Payment reminders

### Phase 4: Consulta + Reporting + Dashboard

1. **Consulta de facturas** — Advanced search (number, date, client, amount, status, type)
2. **Panel de facturación** (Billing dashboard) — income, expenses, pending, VeriFactu status
3. VAT calculation (Modelo 303) with IVA soportado/repercutido
4. IRPF retention summary (for quarterly declarations)
5. Accounts receivable/payable
6. **Report export** — CSV/PDF/Excel for any report
7. VeriFactu status overview + export

### Phase 5: Advanced Features

1. Document conversion (estimate → invoice, proforma → invoice)
2. Duplicate documents
3. Recurring invoices (periodic billing)
4. Event registry (for No-VeriFactu mode)
5. Anomaly detection (integrity check)
6. Declaración Responsable PDF generation

### Phase 6: Polish & Scale

1. Multi-entity support
2. Advanced search and filtering (full-text, saved filters)
3. Keyboard shortcuts for common actions
4. Audit trail / activity log
5. Backup and restore for billing data

---

## Sources

- [Real Decreto 1007/2023 (BOE)](https://www.boe.es/buscar/act.php?id=BOE-A-2023-24840)
- [Orden HAC/1177/2024 (BOE)](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-22138)
- [AEAT Technical Information](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu/informacion-tecnica.html)
- [AEAT Developer Portal](https://www.agenciatributaria.es/AEAT.desarrolladores/Desarrolladores/_menu_/Documentacion/Sistemas_Informaticos_de_Facturacion_y_Sistemas_VERI_FACTU/Sistemas_Informaticos_de_Facturacion_y_Sistemas_VERI_FACTU.html)
- [VeriFactu Hash Calculation (SeoXan)](https://seoxan.es/articulo/huella-hash-verifactu-calculo-sha256)
- [VeriFactu Implementation (GitHub - mdiago)](https://github.com/mdiago/VeriFactu)
- [VeriFactu Wiki](https://verifactu-aeat.github.io/)
- [Marosa VAT Guide](https://marosavat.com/verifactu-spain-2026-guide/)
- [AEAT Testing Portal](https://preportal.aeat.es/)
- [WSDL Sandbox](https://prewww2.aeat.es/static_files/common/internet/dep/aplicaciones/es/aeat/tikeV1.0/cont/ws/SistemaFacturacion.wsdl)
