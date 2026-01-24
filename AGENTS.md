# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed with pnpm workspaces and Turbo.
- `apps/api`: NestJS backend service.
- `apps/web`: Vite + React frontend.
- `packages/api-contract`: OpenAPI spec (`openapi.json`) and validation scripts.
- `packages/types`: generated TypeScript types from the OpenAPI contract.
- `packages/validation`: shared validation utilities.
- `docs/`: product and architecture notes. `docker-compose.yml`: local Postgres dev stack.

## Build, Test, and Development Commands
- `pnpm install`: install workspace dependencies.
- `pnpm dev`: run `turbo run dev` for all apps.
- Frontend: `pnpm --filter @spec/web dev|build|preview|lint`.
- Backend: `pnpm --filter @spec/api dev|build|lint|format|test`.
- API contract: `pnpm --filter @spec/api generate:openapi` updates `packages/api-contract/openapi.json`.
- Types: `pnpm --filter @spec/types build` regenerates `packages/types/src/generated`.
- OpenAPI lint: `pnpm --filter @spec/api-contract validate`.
- Local DB: `docker compose up -d db` (Postgres on `localhost:5432`).

## Coding Style & Naming Conventions
- TypeScript throughout; follow existing 2-space indentation and file-local style.
- `apps/api` uses ESLint + Prettier (via eslint-plugin-prettier). `apps/web` uses ESLint with React Hooks and TS rules.
- React components in `apps/web/src/components` use PascalCase filenames (e.g., `BOMTable.tsx`); pages use `list.tsx`/`detail.tsx` under `apps/web/src/pages`.
- Package names are scoped (`@spec/*`); keep new packages under `packages/`.

## Testing Guidelines
- Backend tests: Jest with `*.spec.ts` under `apps/api/src`.
- Run `pnpm --filter @spec/api test`, `test:watch`, or `test:e2e` as needed.
- Root `pnpm test` is a placeholder; there are no configured frontend/package tests yet.

## Commit & Pull Request Guidelines
- Recent commits mix conventional messages (`feat:`, `fix(web):`) with descriptive notes. Prefer short, present-tense summaries; use conventional type/scope when practical.
- PRs: include a clear description, testing notes, and screenshots for UI changes. Update OpenAPI and generated types when API shapes change.
