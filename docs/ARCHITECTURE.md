# 🏛️ PlanAura System Architecture

PlanAura is an AI-native event planning intelligence platform built to eliminate organizational friction across weddings, milestone birthdays, and community festivals.

---

## 🗺️ System Overview

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 19 + Vite + Tailwind v4)"]
        UI[App Shell & Canvas]
        NAV[Semantic Tab Navigation]
        COPILOT[Aura Copilot Chat]
        WEDDING[Wedding Studio]
        BDAY[Birthday Bash]
        COMM[Community Hub]
        BUDGET[Budget Engine View]
        TL[Timeline & Run-of-Show]
        VDR[Vendor Checklists]
        IDEAS[Personalized Ideas]
    end

    subgraph Security ["Security & Middleware Gateway"]
        H_PERM[Permissions-Policy]
        H_CSP[Content-Security-Policy]
        H_TRC[X-Request-Id Tracing]
        RATE[Rate Limiter (60 req/min)]
        XSS[Payload XSS Sanitizer]
        BODY[250KB Body Cap]
    end

    subgraph Server ["Server Modules (Express 5 + TypeScript)"]
        API[API Router /api/*]
        B_ENG[Budget Intelligence Engine]
        T_ENG[Timeline & Run-of-Show Engine]
        V_ENG[Vendor Lifecycle Manager]
        I_ENG[Idea & Palette Synthesizer]
        CACHE[SHA-256 MemoVault Cache]
        GEMINI[Google Gemini 2.5 Flash]
        FALLBACK[Offline Heuristic Engine]
    end

    Client --> Security
    Security --> API
    API --> B_ENG
    API --> T_ENG
    API --> V_ENG
    API --> I_ENG
    API --> GEMINI
    API --> CACHE
    GEMINI -.->|Rate Limit / Offline| FALLBACK
```

---

## 🗂️ Module Directory Structure

```
planaura/
├── docs/
│   └── ARCHITECTURE.md          # Complete architectural specification
├── server/
│   ├── config/
│   │   └── env.ts               # Type-safe environment configuration
│   ├── errors/
│   │   └── PlannerError.ts      # Custom domain error hierarchy
│   ├── middleware/
│   │   ├── errorHandler.ts      # Centralized HTTP status code mapping
│   │   ├── rateLimiter.ts       # Express rate limiter (60 req/min)
│   │   └── security.ts          # 6 HTTP headers & XSS sanitization
│   ├── modules/
│   │   ├── budget/
│   │   │   └── budgetEngine.ts  # Allocations, variance & cost optimizer
│   │   ├── ideas/
│   │   │   └── ideaSynthesizer.ts # Themes, palettes, menus & wording
│   │   ├── timeline/
│   │   │   └── timelineEngine.ts# Multi-phase milestones & day-of run-of-show
│   │   └── vendors/
│   │       └── vendorEngine.ts  # Vendor procurement pipeline & liabilities
│   ├── routes/
│   │   └── api.ts               # Primary REST API routes
│   ├── services/
│   │   ├── cacheService.ts      # In-memory SHA-256 caching with TTL
│   │   └── geminiService.ts     # Google Gemini 2.5 Flash + heuristic fallback
│   └── index.ts                 # Express 5 entry point
├── src/
│   ├── components/
│   │   ├── AuraCopilot.tsx      # GenAI conversational planning copilot
│   │   ├── BirthdayBash.tsx     # Milestone presets & cake sizing matrix
│   │   ├── BudgetEngineView.tsx # Allocation bars, ledger & currency switcher
│   │   ├── CommunityHub.tsx     # Permits, volunteer roster & crowd ratios
│   │   ├── EventConfigModal.tsx # Plan customization modal
│   │   ├── Footer.tsx           # Semantic contentinfo with compliance badges
│   │   ├── Header.tsx           # Semantic banner with category switcher
│   │   ├── Navigation.tsx       # Semantic tablist with keyboard controls
│   │   ├── PersonalizedIdeasView.tsx # Themes, palettes & menus
│   │   ├── TimelineView.tsx     # Countdown & day-of master run-of-show
│   │   └── VendorChecklistView.tsx   # 5-stage procurement tracking
│   ├── services/
│   │   └── apiService.ts        # Client API service
│   ├── types/
│   │   └── index.ts             # TypeScript data contracts
│   ├── App.tsx                  # Root state coordinator
│   ├── index.css                # Base Tailwind & WCAG AA media queries
│   └── main.tsx                 # React DOM root
├── tests/
│   ├── a11y/
│   │   └── accessibility.test.ts# HTML landmarks & CSS media queries
│   ├── components/
│   │   └── render.test.tsx      # React component rendering & ARIA roles
│   ├── integration/
│   │   └── api.test.ts          # Full API routes & error handling
│   ├── resilience/
│   │   └── fallback.test.ts     # Offline heuristic engine & cache eviction
│   ├── security/
│   │   └── headers.test.ts      # 6 HTTP response headers & XSS defense
│   └── unit/
│       ├── budget.test.ts       # Benchmark allocation & variance calculations
│       ├── ideas.test.ts        # Theme synthesis & palette generation
│       ├── timeline.test.ts     # Milestone sequencing & day-of scheduling
│       └── vendor.test.ts       # Vendor lifecycle status & metrics
├── .editorconfig                # Universal indentation & line ending rules
├── CHANGELOG.md                 # Keep a Changelog version history
├── CODE_OF_CONDUCT.md           # Contributor Covenant v2.1
├── CONTRIBUTING.md              # Contributor guide & PR workflow
├── LICENSE                      # MIT Open Source License
├── package.json                 # Version 1.0.0 with full lifecycle scripts
├── README.md                    # Primary documentation & evaluation dossier
├── SECURITY.md                  # Comprehensive security policy
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite bundler configuration
└── vitest.config.ts             # Vitest test runner configuration
```

---

## 📡 REST API Route Table

| Method | Route | Description | Auth / Limit |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health, Gemini engine status, cache metrics | 60 req/min |
| `POST` | `/api/plan/generate` | Generates end-to-end blueprint (budget, timeline, vendors, ideas) | 60 req/min |
| `POST` | `/api/chat` | Aura Copilot conversational planning dialogue | 60 req/min |
| `POST` | `/api/budget/analyze` | Calculates category variance and generates cost-saving tips | 60 req/min |
| `POST` | `/api/timeline/generate`| Generates milestone roadmap and hour-by-hour run-of-show | 60 req/min |
| `GET` | `/api/vendors/checklist`| Retrieves category-tailored vendor procurement checklist | 60 req/min |
| `PATCH`| `/api/vendors/status` | Updates vendor status and recomputes liabilities | 60 req/min |
| `POST` | `/api/ideas/synthesize` | Synthesizes custom themes, palettes, and menu pairings | 60 req/min |

---

## 🤖 GenAI Architecture & Dual-Tier Fallback

1. **Primary Layer: Google Gemini 2.5 Flash**
   - Utilizes `@google/generative-ai` with system instructions positioning Aura as an elite event director.
   - Grounded directly in user event context (category, budget, guest count).
   - Enforces a 2500ms timeout race to ensure sub-second UI responsiveness.

2. **Secondary Layer: In-Memory SHA-256 MemoVault**
   - Deterministic SHA-256 hash generated across request payload.
   - 15-minute TTL eviction prevents redundant API invocations and conserves quota.

3. **Tertiary Layer: Resilient Heuristic Planning Engine**
   - If API quotas are exhausted or network is offline, Aura switches to the built-in domain heuristic engine without erroring.
   - Delivers structured markdown advice, benchmark allocations, and procurement guidelines.

---

## ♿ Accessibility Architecture (WCAG AA)

- **Semantic Landmarks**: `<header role="banner">`, `<nav aria-label="...">`, `<main id="main-content">`, `<footer role="contentinfo">`.
- **Keyboard Navigation**: Skip-link (`.skip-link`) allows immediate jump to primary content; focus rings styled via `:focus-visible`.
- **ARIA Integration**: `aria-selected`, `aria-controls`, `aria-live="polite"` on dynamic copilot replies.
- **3 Responsive Media Queries**:
  - `@media (prefers-reduced-motion: reduce)`: Drops all transitions to 0.01ms.
  - `@media (prefers-contrast: high)`: Switches to maximum contrast obsidian/pure white.
  - `@media print`: Formats run-of-show into clean printable vendor call-sheets.
