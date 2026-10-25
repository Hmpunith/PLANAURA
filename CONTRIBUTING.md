# Contributing to PlanAura

Thank you for your interest in contributing to **PlanAura**, the AI-native celebration and event planning intelligence engine.

---

## 🛠️ Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hmpunith/PLANAURA.git
   cd PLANAURA
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy the sample environment file:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
   *(Note: PlanAura includes a high-fidelity offline heuristic planning engine, so tests and features work without an API key).*

4. **Start Development Environment:**
   ```bash
   # Start Vite frontend client
   npm run dev

   # Start backend API server
   npm run server
   ```

---

## 📐 Coding Standards & Guidelines

- **TypeScript Strict Mode**: All code in `server/`, `src/`, and `tests/` must strictly comply with `tsconfig.json`.
- **Linting & Hygiene**: Run `npm run lint` before committing. Zero errors and zero warnings are permitted.
- **Domain Errors**: Never throw generic `Error`. Extend `PlanAuraFault` in `server/errors/PlannerError.ts`.
- **Formatting**: Run `npm run format` (Prettier 2-space indentation).

---

## 🧪 Testing Protocol

PlanAura maintains a comprehensive 74+ test suite across 9 distinct categories:
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

Every new feature must include corresponding unit, integration, or accessibility test assertions.

---

## 🌿 Branching & Submitting Pull Requests

1. Fork the repo and create your feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes using Conventional Commits: `git commit -m 'feat: add vendor payment milestone reminder'`
3. Verify all tests and linter pass: `npm test && npm run lint`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request against `main`.
