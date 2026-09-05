# Restaurant App Project Map

This document is the canonical map for the AI assistant and contributors working in this repository. It captures the architecture, module boundaries, and the “where to change what” guidance so the code does not need to be re-analyzed on every task.

## 1) Repository Shape

- Root
  - `docker-compose.yml` — starts both application services together.
  - `README.md` — repo-level setup and run notes.
  - `AGENTS.md` — repo instructions for AI-assisted work.
  - `PROJECT_MAP.md` — current architecture map.

- `backend/`
  - NestJS API application.
  - Runs on port `3001` in Docker and exposes app internals on port `3000` within the container.
  - Source code lives in `backend/src/`.

- `dashbaord/`
  - Next.js frontend dashboard for the restaurant admin experience.
  - Runs on port `3000` in Docker.
  - Source code lives in `dashbaord/app/` and `dashbaord/components/`.

## 2) Runtime Architecture

The project is split into two independent apps:

1. Backend service
   - Responsible for business logic, API endpoints, and data persistence.
   - Uses NestJS for application framework and structure.
  - Includes a DatabaseService with adapters for PGlite, PostgreSQL, SQLite, and MongoDB.
   - Current baseline includes HTTP root route and database module setup.

2. Dashboard service
   - Responsible for UI and user experience.
   - Current UI is a restaurant login screen with locale switching and branded styling.

The backend and frontend are separate codebases orchestrated by Docker Compose rather than a monorepo package structure. Database integration is handled within the backend via the DatabaseModule.

## 3) Backend Map

Files of interest:

- `backend/src/main.ts`
  - Bootstraps the NestJS app.
  - Starts the HTTP server on `process.env.PORT ?? 3000`.

- `backend/src/app.module.ts`
  - Root application module.
  - Registers controllers and providers for the app.

- `backend/src/app.controller.ts`
  - Exposes the root API route.
  - Current route: `GET /`

- `backend/src/app.service.ts`
  - Contains the logic behind the root endpoint.
  - Currently returns the string `Hello World!`.

- `backend/src/database/`
  - Database integration module for the backend.
  
- `backend/src/database/database.module.ts`
  - Global NestJS module that exports the DatabaseService.
  - Configured with `@Global()` decorator for app-wide access.
  
- `backend/src/database/database.service.ts`
  - Selects and manages the configured database adapter.
  - Handles initialization, seeding, and cleanup on module init/destroy.
  - Provides configuration via `database.config.ts`.
  
- `backend/src/database/database.config.ts`
  - Resolves database configuration from environment variables.
  - Supports both PGlite (embedded) and PostgreSQL (network) clients.

- `backend/scripts/`
  - Utility scripts for database operations.
  
- `backend/scripts/restaurant-seed.sql`
  - SQL seed file for initial database setup and data population.

- `backend/test/`
  - App-level e2e and unit tests.

- `.github/skills/`
  - On-demand AI-assisted coding skills for architecture, databases, security, standards, NestJS, microservices, testing, API design, observability, and delivery operations.

### Backend conventions

- Keep business logic in services, not inside controllers.
- Add new modules when the app grows beyond one controller/service pair.
- Use the DatabaseService (injected from DatabaseModule) for all data access operations.
- Database configuration is resolved from environment variables via `database.config.ts`.
- SQL seed data is maintained in `backend/scripts/restaurant-seed.sql` for consistent database initialization.
- Entity/repository logic should be kept inside feature-specific modules rather than in the core database module.

## 4) Dashboard Map

Files of interest:

- `dashbaord/app/page.tsx`
  - Root page redirect for the dashboard app.
  - It passes to the login page.

- `dashbaord/app/login/page.tsx`
  - Route entry for the login screen.
  - Reads `locale` from the query string and passes it to the login component.

- `dashbaord/components/restaurant-login.tsx`
  - Main login screen UI.
  - Renders the branded hero panel, admin sign-in form, switchable language labels, and social login buttons.

- `dashbaord/components/language-switcher.tsx`
  - Locale toggle UI.

- `dashbaord/components/brand-mark.tsx`
  - Brand/logo block used in the login page.

- `dashbaord/assets/login-content.ts`
  - All text content and translations for the login experience.

- `dashbaord/components/ui/`
  - Shared UI building blocks such as form fields and social buttons.

### Dashboard conventions

- Use the `app/` directory for route-level pages.
- Keep reusable UI in `components/`.
- Keep copy and locale strings in `assets/login-content.ts` instead of hard-coding text in components.
- Keep route props and server/client behavior explicit; this app uses server components and async page props in several places.

## 5) How the Two Apps Fit Together

Currently, the relationship is simple:

- Dashboard is a standalone frontend shell.
- Backend is a standalone API layer.
- Docker Compose runs both together on the same machine, but they are not yet coupled by shared code or a contract.

Practical expectation:

- Dashboard UI changes should happen in `dashbaord/`.
- API and business logic changes should happen in `backend/`.
- Once the app grows, the API contract should be formalized between them before frontend wiring is added.

## 6) Safe Working Rules for AI Assistants

When making changes:

- Read this file first before exploring the codebase deeply.
- Prefer the smallest relevant file and symbol change.
- Do not assume a monorepo pattern; the apps are separate projects.
- Keep service logic in the backend and UI logic in the dashboard.
- Use Docker Compose for full-stack tests: `docker compose up --build` from the repo root.

## 7) Planned Evolution

The next likely architectural step is to add a database and persistence layer to the backend, then expose backend endpoints or a typed API contract to the dashboard. That work should be introduced in the backend first, with the dashboard consuming the result only after the contract is defined.
