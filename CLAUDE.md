# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SpecMaster (服装配方管理系统) is a garment specification management system built as a pnpm + Turborepo monorepo. The system manages a 4-level nested data structure for garment specifications: Style → ColorVariant → BOMItem → SpecDetail.

**Stack**: NestJS backend + React/Refine frontend + PostgreSQL + Prisma ORM

## Monorepo Structure

```
apps/
  api/     - NestJS backend API (@spec/api)
  web/     - React/Refine frontend (@spec/web)
```

This is a **pnpm workspace** managed by **Turborepo**. No shared packages exist yet - only two applications.

## Commands

### Development
```bash
# Run both apps in dev mode (from root)
pnpm dev                    # Runs turbo dev (starts both apps)

# Or run individually
cd apps/api && pnpm start:dev    # NestJS API (port 3000)
cd apps/web && pnpm dev          # Vite dev server (port 3000 - will conflict!)
```

### Database (API)
```bash
cd apps/api
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Create and apply migrations
npx prisma studio          # Open Prisma Studio GUI
npx prisma db push         # Push schema changes (prototype mode)
```

**Database Connection**: PostgreSQL via Docker Compose (see Infrastructure section)

### Build & Test
```bash
# From root (uses Turborepo)
turbo run build            # Build all apps
turbo run lint             # Lint all apps
turbo run test             # Run all tests

# Individual apps
cd apps/api
pnpm build                 # NestJS build → dist/
pnpm test                  # Jest unit tests
pnpm test:e2e              # E2E tests
pnpm test:cov              # Coverage report

cd apps/web
pnpm build                 # Vite build → dist/
pnpm build:check           # TypeScript check + build
pnpm lint                  # ESLint (0 warnings tolerance)
```

## Infrastructure

### Docker Compose Setup
```bash
docker-compose up -d       # Start PostgreSQL container
docker-compose down        # Stop and remove containers
```

**PostgreSQL Configuration** (docker-compose.yml):
- Container: `spec-postgres`
- Port: `5432`
- Database: `specmaster`
- Credentials: `admin` / `123` (local dev)
- Volume: `postgres_data` (persistent storage)

### Environment Variables

**apps/api/.env**:
```bash
DATABASE_URL="postgresql://admin:123@localhost:5432/specmaster?schema=public"
PORT=3000                  # API server port
```

## Architecture

### Backend (apps/api)

**Framework**: NestJS 11 + TypeScript 5.7
**ORM**: Prisma 7.2 with PostgreSQL
**API Docs**: Swagger/OpenAPI (@nestjs/swagger)
**File Storage**: AWS S3 (@aws-sdk/client-s3)

**Structure**:
```
apps/api/
  prisma/
    schema.prisma          - Database schema
    migrations/            - Migration history
  src/
    main.ts                - NestJS bootstrap
    app.module.ts          - Root module
    app.controller.ts      - Root controller
  prisma.config.ts         - Prisma configuration
```

**Prisma Client**: Generated to `apps/api/generated/prisma/` (custom output path)

**Key Dependencies**:
- `@nestjs/config` - Environment configuration
- `@prisma/client` - Database ORM
- `@aws-sdk/client-s3` - S3 file uploads

### Frontend (apps/web)

See `apps/web/CLAUDE.md` for detailed frontend architecture. Summary:

**Framework**: React 18 + Refine 4.47 + TypeScript 5.2
**Build**: Vite 5.0
**UI**: Ant Design 5.12 + Pro Components + TailwindCSS
**Storage**: Dexie (IndexedDB wrapper) for client-side persistence
**File Upload**: Qiniu Cloud OSS

**4-Level Component Hierarchy**:
```
StyleDetailPage (L1: 款号)
  └─ VariantTabs (L2: 颜色版本)
      └─ BOMTable (L3: 配料明细)
          └─ SpecDetailModal (L4: 规格明细)
```

**Current State**: Uses mock data provider (in-memory). Backend integration is pending.

## Development Workflow

### Adding a New Backend Module

1. Generate NestJS module:
   ```bash
   cd apps/api
   nest g module <name>
   nest g controller <name>
   nest g service <name>
   ```

2. Define Prisma schema in `prisma/schema.prisma`

3. Create migration:
   ```bash
   npx prisma migrate dev --name <migration-name>
   ```

4. Implement service with Prisma Client:
   ```typescript
   import { PrismaClient } from '../../generated/prisma';
   ```

5. Add Swagger decorators for API docs

### Connecting Frontend to Backend

Replace `mockDataProvider` in `apps/web/src/App.tsx` with a real Refine data provider that calls the NestJS API. The component code remains unchanged due to Refine's abstraction layer.

## Monorepo Conventions

- **Package Manager**: pnpm 10.27 (required by packageManager field)
- **Task Runner**: Turborepo 2.7
- **Workspace Protocol**: `pnpm-workspace.yaml` defines `apps/*` and `packages/*`
- **Caching**: Turborepo caches build/test outputs in `.turbo/` (gitignored)
- **Dependencies**: Shared dev dependencies (turbo) at root, app-specific deps in each app

### Turborepo Pipeline

Defined in `turbo.json`:
- `build`: Depends on `^build` (topological), outputs to `dist/**`, `.next/**`, `build/**`
- `dev`: No cache, persistent mode (long-running servers)
- `lint`: Standard caching

## Important Notes

- **Port Conflict**: Both apps default to port 3000. When running simultaneously, configure one to use a different port.
- **Prisma Client Path**: Custom output path `generated/prisma/` - import from `../../generated/prisma` in services
- **Migration Strategy**: Currently using `prisma migrate dev`. For production, use `prisma migrate deploy`
- **Database Reset**: `docker-compose down -v` deletes all data (removes volume)
- **Frontend Persistence**: Currently client-side only (Dexie). Backend integration will replace mock provider.

## Git Workflow

- **Branch**: `dev` (no main branch configured yet)
- **Recent Work**: Prisma integration, PostgreSQL setup, Docker configuration
- **Modified Files**: `apps/api/package.json`, `pnpm-lock.yaml` (uncommitted Prisma changes)
