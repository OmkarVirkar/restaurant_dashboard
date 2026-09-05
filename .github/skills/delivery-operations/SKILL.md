---
name: delivery-operations
description: "Use when changing Docker, CI, deployments, environment configuration, migrations, runtime compatibility, or production readiness for the backend."
---

# Delivery and Operations

Make changes reproducible from a clean checkout and safe to roll forward or back.

- Keep build and production runtime Node versions compatible with the code and dependencies.
- Use multi-stage Docker builds, non-root runtime users, minimal images, and explicit health checks.
- Keep configuration externalized and validate required production variables at startup.
- Run build, lint, unit, integration, and e2e checks in CI with reproducible dependency installs.
- Apply database migrations as a deliberate deployment step; never depend on application startup for destructive changes.
- Use graceful shutdown for HTTP servers, database pools, queues, and message consumers.
- Define rollback behavior for code, schema, and events before deployment.
- Pin or lock dependencies and review security advisories.
- Keep runtime data, secrets, coverage, and build output out of version control.
