<!-- .github/copilot-instructions.md - Guidance for AI coding agents -->

# Quick orientation

This repo is a Vite + React + TypeScript web app (shadcn-ui + Tailwind). Primary runtime is a local Vite dev server on port `8080`. The codebase integrates Google Gemini via `@google/generative-ai` and Firebase for auth + Firestore.

Key locations:
- `src/lib/gemini.ts` — Gemini client wrapper (retry, streaming, model name `gemini-2.5-flash`).
- `src/lib/firebase.ts` — Firebase initialization; exports `auth` and `db`.
- `src/contexts/AuthContext.tsx` — Auth provider and Firestore user document patterns.
- `src/components/GeminiChat.tsx` and `src/hooks/useGemini.ts` — example UI + hook usage of the Gemini client.
- `vite.config.ts` — Vite config: `@` alias -> `./src`, dev server host `::` and port `8080`, and `lovable-tagger` used in development mode.

# Big-picture architecture

- Frontend-only SPA: routing/pages in `src/pages/*`, components in `src/components/*`.
- Global providers mounted in `src/main.tsx`: `AuthProvider` and `SignupProvider` wrap `App`.
- AI integration is encapsulated in `src/lib/gemini.ts` and consumed via `useGemini` and components such as `GeminiChat`.
- Firebase is used for authentication and storing user profiles (`users` collection). The `AuthContext` creates both the Firebase Auth user and a Firestore document on signup.

# Developer workflows & important commands

- Install dependencies: `npm i`.
- Dev server (local): `npm run dev` (Vite serves on port `8080` by default).
- Build for production: `npm run build` or `npm run build:dev` for a development-mode build.
- Preview production build: `npm run preview`.
- Linting: `npm run lint` (ESLint config in repo).

Environment and secrets:
- Gemini API key is read from `import.meta.env.VITE_GEMINI_API_KEY`. Provide it in a Vite env file (e.g. `.env.local`) or via the environment when running Vite. Example: `VITE_GEMINI_API_KEY=...`.
- Firebase config is kept in `src/lib/firebase.ts` (currently contains a client config). In production, prefer env-based secrets and not committing private keys.

# Project-specific conventions & patterns

- Path alias: `@` resolves to `src` (see `vite.config.ts` and `tsconfig.json`). Use imports like `import { X } from '@/lib/gemini'`.
- AI calls: use `geminiClient.generateText(...)` or `generateWithStreaming(...)`. The client implements exponential backoff with jitter and retries; follow its error handling patterns when adding new AI calls.
- Gemini responses are often post-processed in UI: see `formatText` in `GeminiChat.tsx` for sanitization examples.
- Auth/signup: `AuthContext.signup` both creates Firebase Auth user and writes a Firestore document under `users/{uid}`. When changing user shape, update both signup flow and Firestore usage sites.
- UI primitives: shadcn-derived components live under `src/components/ui/*`. Prefer these wrappers for consistent styling.

# Integration points & external deps

- Google Generative AI: dependency `@google/generative-ai` — model name `gemini-2.5-flash` used in the repo.
- Firebase: `firebase` SDK for Auth/Firestore/Analytics (`src/lib/firebase.ts`).
- Lovable: `lovable-tagger` is enabled in dev mode inside `vite.config.ts` (used by the Lovable platform).

# Debugging tips specific to this repo

- If Gemini features appear broken, check `VITE_GEMINI_API_KEY`. The gemini client logs attempts and retry messages to console (see `src/lib/gemini.ts`).
- Authentication state flows are handled in `AuthContext.tsx` via `onAuthStateChanged`. Use the `userData` state to inspect Firestore profile reads.
- Vite dev server is explicitly configured to `host: '::'` and `port: 8080` in `vite.config.ts` — use that when opening the app in a browser.

# Files to inspect when making changes

- `src/lib/gemini.ts` — core AI logic and retry behaviour (critical for any AI feature changes).
- `src/hooks/useGemini.ts` — hook wrapper consumed by UI components like `GeminiChat`.
- `src/contexts/AuthContext.tsx` — signup/login/logout patterns with Firestore writes.
- `src/components/ui/*` — button/input/card wrappers; prefer reuse over ad-hoc elements.

# Non-goals / things not found

- There are no automated tests in the repo. Don’t add test assumptions unless you add the test harness and scripts.
- No backend API server — all data interactions are direct client SDK calls (Firebase) and external AI SDK calls.

# Example quick tasks for an AI agent

- Add a new AI prompt helper: update `src/lib/gemini.ts` with a new helper function, then wire it into a new hook under `src/hooks/` and a component in `src/components/`.
- Add a new user profile field: update Firestore write in `AuthContext.signup`, update consumers under `src/pages/*` and the types if added.

---

If any of this is surprising or you want more detail about runtime envs, CI, or test scaffolding, tell me which area to expand and I'll update this file.