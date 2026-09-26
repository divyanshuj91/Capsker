# ⚡ capsker

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black.svg?style=flat-square)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Neobrutalism-FFE800.svg?style=flat-square)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791.svg?style=flat-square)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

> **Enterprise Hackathon Operations Engine & Event Copilot**  
> Streamline registration normalization, automated credential and ticket generation, hybrid Agentic RAG intelligence, and bulk delivery across distributed hackathon tracks.

---

## 1. System Overview

Hackathon organizers regularly contend with fragile, ad-hoc spreadsheets, disparate communications channels, and fragmented design workflows. Ingesting participant records requires constant data cleaning: de-duplicating teams, extracting canonical LinkedIn/GitHub profiles, standardizing international phone formats, and parsing varied university domains.

**capsker** resolves these operational bottlenecks through a single fullstack platform designed with an accessible, high-contrast **Neobrutalist** user experience. It converges tabular ingestion, automated vectorization for natural language query execution, an interactive canvas-based document studio, and rate-limited mass delivery infrastructure.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CAPSKER CORE                              │
├─────────────────────┬───────────────────┬──────────────────────────────┤
│ 1. INGESTION        │ 2. VISUAL STUDIO  │ 3. INTELLIGENCE & DISPATCH   │
│ • Fuzzy CSV Mapping │ • Canvas Engine   │ • Hybrid Agentic RAG         │
│ • URL/E.164 Cleanse │ • Dynamic Layers  │ • Vector/Relational Search   │
│ • Auto Team Group   │ • Headless Export │ • Multi-Tenant SMTP / Queues │
└─────────────────────┴───────────────────┴──────────────────────────────┘
```

---

## 2. High-Level Architecture

The platform is structured as an event-driven system built on Next.js 14, combining serverless API handlers with asynchronous background workers to ensure UI responsiveness during intensive document rendering and mass email operations.

```
                           ┌────────────────────────┐
                           │   Client / Browser     │
                           │ (Next.js App / Canvas) │
                           └───────────┬────────────┘
                                       │ HTTPS / WSS
                                       ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │                        Next.js Fullstack Runtime                         │
 │                                                                          │
 │  ┌───────────────────────┐  ┌──────────────────┐  ┌───────────────────┐  │
 │  │ CSV Streaming / Parser│  │  Canvas Overlay   │  │ Agentic RAG Engine│  │
 │  │   (PapaParse Stream)  │  │ Dynamic Renderer │  │  (Tool Execution) │  │
 │  └──────────┬────────────┘  └────────┬─────────┘  └─────────┬─────────┘  │
 └─────────────┼────────────────────────┼──────────────────────┼────────────┘
               │                        │                      │
               ▼                        ▼                      ▼
 ┌──────────────────────────────────────────────┐    ┌──────────────────────┐
 │         PostgreSQL (Supabase / Neon)         │    │  LLM / Embeddings    │
 │  • Relational Data (Teams, Participants)     │    │  • text-embedding-3  │
 │  • pgvector Extension (Semantic Indexing)    │    │  • GPT-4o / Claude   │
 └──────────────────────┬───────────────────────┘    └──────────────────────┘
                        │
                        ▼
 ┌──────────────────────────────────────────────┐    ┌──────────────────────┐
 │         Redis / BullMQ Message Broker        │───▶│ Async Workers        │
 │  • High-throughput Email Queue               │    │ • Headless PDF Gen   │
 │  • Dynamic Asset Assembly                    │    │ • SMTP / SES Client  │
 └──────────────────────────────────────────────┘    └──────────────────────┘
```

---

## 3. Core Architectural Subsystems

### 3.1 Streaming Ingestion & Canonical Normalizer
* **Streaming Parser**: Ingests multi-thousand-row CSV files via browser and Node.js streams to maintain low memory footprints.
* **Fuzzy Column Matcher**: Uses Levenshtein distance metrics to auto-bind arbitrary spreadsheet headers (e.g., `lead-gh`, `team_name`, `ph_no`) to the internal relational model.
* **Profile Sanitizer**: Enforces standard E.164 phone formats and converts bare usernames into absolute HTTPS profile URLs for GitHub and LinkedIn.

### 3.2 Dynamic Template & Asset Studio
* **Interactive Canvas**: Powered by Fabric.js / Konva primitives, enabling event staff to upload arbitrary SVG, PNG, or PDF tickets and badge templates.
* **Vectorized Placeholders**: Position dynamic nodes (`{{team_name}}`, `{{participant_name}}`, `{{institution}}`, `{{qr_code}}`) with pixel-level precision.
* **Headless Export Pipeline**: Dispatches rendering jobs to BullMQ workers running `@react-pdf/renderer` or Skia-backed canvas renderers to batch generate zip files or link assets directly to individual email attachments.

### 3.3 Hybrid Agentic RAG ("capsker Intel")
* **Hybrid Search Formulation**: Combines deterministic SQL lookups (e.g., filtering teams by confirmed statuses or unverified phone numbers) with dense vector searches over attendee bios, project pitches, and organizer notes using `pgvector`.
* **Tool Calling Engine**: Employs an LLM agent equipped with structured functions:
  ```typescript
  // Agent Function Registry
  queryParticipantDirectory(filter: SearchFilterParams): Promise<Participant[]>;
  mutateTeamStatus(teamIds: string[], status: TeamStatus): Promise<BatchResult>;
  queueTargetedBroadcast(filter: SearchFilterParams, templateId: string): Promise<QueueAck>;
  ```
* **Streaming Copilot UI**: Provides real-time event stats and operational actions directly through an interactive slide-over console.

### 3.4 Multi-Tenant Mail Dispatcher & Queue Engine
* **Isolation & Verification**: Supports custom SMTP connections (encrypted at rest using AES-256-GCM) alongside transactional providers (AWS SES, Resend).
* **Backpressure Management**: Built on BullMQ and Redis with token bucket rate-limiting algorithms to avoid IP blacklisting or mailbox throttling by host providers.

---

## 4. Design System: Neobrutalism Specification

The user interface follows Neobrutalist design tenets to maximize contrast and eliminate visual ambiguity during fast-paced live events:

* **Structural Borders**: Solid, unrounded `2px` or `3px` absolute black (`#000000`) borders across all cards, containers, dialogs, and inputs.
* **Depth & Elevation**: Sharp, un-blurred solid drop shadows (`shadow-[4px_4px_0px_0px_#000000]`). Zero diffusion or Gaussian blur.
* **Tactile Micro-Interactions**: Direct transform translations on interactive elements (`hover:-translate-x-0.5 hover:-translate-y-0.5`, `active:translate-x-0.5 active:translate-y-0.5`).
* **Semantic Color Tokens**:
  * **Canvas Background**: `#FFFDF5` (Warm Cream)
  * **Primary Action**: `#FFE800` (Cyber Yellow)
  * **Confirmed / Active**: `#00F084` (Neo Green)
  * **Alert / Disqualified**: `#FF66C4` (Punch Pink)
  * **Information / In-Progress**: `#38BDF8` (Sky Blue)
  * **Waitlisted**: `#FB923C` (Orange)

---

## 5. Domain Schema Overview

The relational structure is managed through Prisma and optimized for PostgreSQL with `pgvector`:

```
┌────────────────────┐          ┌────────────────────┐
│       Event        │ 1      * │        Team        │
│────────────────────│──────────│────────────────────│
│ id: String (cuid)  │          │ id: String (cuid)  │
│ title: String      │          │ name: String       │
│ slug: String       │          │ status: TeamStatus │
└─────────┬──────────┘          └─────────┬──────────┘
          │ 1                             │ 1
          │                               │
          │ *                             │ *
┌─────────┴──────────┐          ┌─────────┴──────────┐
│   AssetTemplate    │          │    Participant     │
│────────────────────│          │────────────────────│
│ id: String         │          │ id: String         │
│ type: TICKET|CERT  │          │ name, email, phone │
│ fieldConfig: JSON  │          │ githubUrl, role    │
└────────────────────┘          └────────────────────┘
```

---

## 6. Directory Layout

```
capsker/
├── app/                        # Next.js 14 App Router
│   ├── (dashboard)/            # Event overview, master tables, and Kanban board
│   │   ├── events/[id]/        # Track-specific team and participant matrices
│   │   └── settings/           # SMTP configurations and provider settings
│   ├── api/                    # REST / RPC endpoints & server webhooks
│   │   ├── agent/chat/         # RAG stream & agent tool execution endpoint
│   │   ├── export/             # Batch document generation route
│   │   └── ingest/             # Multipart CSV upload stream handler
│   └── studio/[templateId]/    # Visual canvas ticket & badge builder
├── components/
│   ├── brutal/                 # Custom Neobrutalist primitives (Button, Card, Input)
│   ├── canvas/                 # Konva/Fabric rendering nodes and overlay controls
│   ├── intel/                  # Sliding AI drawer and chat interfaces
│   └── tables/                 # Virtualized participant data grid
├── lib/
│   ├── agent/                  # LLM setup, system prompts, vector retrieval
│   ├── crypto/                 # AES-256-GCM credential encryption routines
│   ├── normalizer/             # Heuristic CSV mapping and phone formatting
│   └── queue/                  # BullMQ job configurations and worker runners
├── prisma/                     # Database schemas, migrations, and seed scripts
└── workers/                    # Dedicated processing workers for background tasks
    ├── asset-renderer.ts       # Headless document and image exporter
    └── email-dispatcher.ts     # Throttled bulk mail worker
```

---

## 7. Getting Started

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `pnpm` (`npm i -g pnpm`)
* **PostgreSQL**: `v15+` with `pgvector` enabled
* **Redis**: `v7.x+` (local instance or Upstash)

### Environment Configuration

Create a `.env.local` file in the project root:

```env
# Database (PostgreSQL with pgvector)
DATABASE_URL="postgresql://postgres:password@localhost:5432/capsker?schema=public"

# Redis Cache & Message Broker
REDIS_URL="redis://localhost:6379"

# Authentication (NextAuth.js v5)
AUTH_SECRET="generate-a-secure-random-32-byte-secret"
AUTH_URL="http://localhost:3000"

# AI & Semantic Embeddings
OPENAI_API_KEY="sk-proj-..."

# Cryptography (for SMTP Passwords at Rest)
ENCRYPTION_SECRET="32-character-random-key-here-1234"
```

### Installation & Initialization

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Execute database migrations and generate the client:**
   ```bash
   pnpm prisma db push
   pnpm prisma generate
   ```

3. **Start the local background worker process:**
   ```bash
   pnpm worker:dev
   ```

4. **Launch the development server:**
   ```bash
   pnpm dev
   ```
   Access the dashboard at `http://localhost:3000`.

---

## 8. Security & Data Handling

* **Credential Isolation**: All outbound SMTP credentials and private tokens are encrypted with `AES-256-GCM` before database persistence and decrypted solely within ephemeral worker memory.
* **CSV Sanitization**: Embedded formulas starting with (`=`, `+`, `-`, `@`) are stripped during normalization to eliminate CSV formula injection risks.
* **Rate-Limit Guardrails**: Automatic burst suppression protects external mail relays from being blacklisted during massive confirmation blitzes.

---

## 9. Contributing & Code Standards

* **Strict Typings**: Zero `any` declarations; all models and payloads must be validated using Zod schemas.
* **Design Consistency**: Every visual element must inherit from `@/components/brutal` tokens to uphold the Neobrutalist design specifications.
* **Testing**: Run integration test suites prior to pull requests:
  ```bash
  pnpm test:unit
  pnpm test:e2e
  ```

---

## 10. License

This project is licensed under the [MIT License](LICENSE).