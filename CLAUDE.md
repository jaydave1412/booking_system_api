# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev       # Watch mode (recommended for development)
npm run start:debug     # Debug + watch mode

# Build & Production
npm run build           # Compile with NestJS CLI
npm run start:prod      # Run compiled output

# Testing
npm run test            # Run unit tests (Jest)
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report
npm run test:e2e        # End-to-end tests

# Single test file
npx jest src/employee/employee.service.spec.ts

# Code quality
npm run lint            # ESLint with auto-fix
npm run format          # Prettier format
```

## Architecture

NestJS REST API with Prisma ORM connected to a Neon serverless PostgreSQL database.

**Module structure:**
- `AppModule` — root module, imports `PrismaModule` and feature modules
- `PrismaModule` — global module; `PrismaService` wraps the Prisma client using `@prisma/adapter-neon` (serverless adapter, not standard `PrismaClient`)
- `EmployeeModule` — first feature module; demonstrates the standard pattern: Controller → Service → PrismaService

**Prisma client location:** `generated/prisma/` (custom output path, not `node_modules`). Import from `'../../generated/prisma'` (or adjust relative path). The path alias `generated/*` is configured in `tsconfig.json`.

**DTO validation:** Global `ValidationPipe` is applied in `main.ts`. DTOs use `class-validator` decorators — always apply them to new DTOs.

**Password handling:** `bcrypt` is used in `EmployeeService`. Strip sensitive fields from responses manually (no serialization interceptor yet).

## Database

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Run migrations
npx prisma migrate dev --name <migration-name>

# Open Prisma Studio
npx prisma studio
```

Schema is at `prisma/schema.prisma`. Requires `DATABASE_URL` in `.env`.

## Code Style

- Single quotes, trailing commas (Prettier config)
- ESLint treats unused variables as errors (underscore prefix `_var` to ignore)
- `@typescript-eslint/no-explicit-any` is disabled — avoid `any` anyway
- Floating promises must be handled (`no-floating-promises` is a warning)
