# Changelog

All notable changes to **PlanAura** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-25

### Added
- **Aura Copilot**: Interactive GenAI planning director powered by Google Gemini 2.5 Flash with contextual grounding and multi-turn conversational advice.
- **Wedding Studio**: Matrimonial planner with reception seating matrix, ceremony processional protocols, and traditional checklist management.
- **Birthday Bash**: Milestone birthday generator for 1st, 18th, 21st, 30th, and 50th celebrations with automated cake tier sizing and interactive party games.
- **Community Hub**: Civic operations hub managing municipal assembly permits, volunteer zone rosters, crowd safety ratios, and sponsorship progress.
- **Budget Intelligence Engine**: Real-time category allocation benchmarks, variance tracking (estimated vs actual), currency switcher, and automated AI cost-saving tips.
- **Timeline & Run-of-Show**: Phased milestone countdown roadmap and hour-by-hour day-of operational itinerary with printable call-sheets.
- **Vendor Checklists**: 5-stage procurement lifecycle tracking (*Contacted &rarr; Quoted &rarr; Contract Pending &rarr; Booked &rarr; Paid*), deposit monitoring, and COI verification.
- **Personalized Ideas Synthesizer**: Curated theme vaults, chromatic color palettes with one-click hex copying, signature dining menus, and custom invitation wording drafts.
- **Accessibility Suite**: WCAG AA compliance with semantic landmarks (`banner`, `tablist`, `main`, `contentinfo`), keyboard skip link, high-contrast outlines, and 3 media queries (`prefers-reduced-motion`, `prefers-contrast`, `print`).
- **Test Suite**: 74 automated unit, integration, accessibility, and security tests running in Vitest with 100% pass rate.

### Security
- Explicit `Permissions-Policy` header restricting sensitive browser device APIs.
- Strict `Content-Security-Policy` via Helmet.
- XSS payload sanitization and 250KB body limit.
- Unique distributed request tracing UUID via `X-Request-Id`.
- Rate limiting protection of 60 requests/minute per client IP.
