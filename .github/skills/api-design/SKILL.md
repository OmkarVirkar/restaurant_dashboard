---
name: api-design
description: "Use when designing REST endpoints, request and response contracts, pagination, errors, versioning, OpenAPI, or dashboard-to-backend integration."
---

# API Design

Treat the API as a stable product contract between the backend and dashboard.

- Design resources around business concepts, not database tables or vendor objects.
- Use nouns for resources, HTTP methods for intent, and consistent status codes.
- Validate input and return a consistent error envelope with a machine-readable code.
- Define pagination, filtering, sorting, limits, and maximum page sizes explicitly.
- Avoid leaking internal database fields, stack traces, or provider-specific details.
- Make mutating operations idempotent where clients may retry.
- Version breaking changes and document response examples.
- Add OpenAPI metadata for public endpoints and contract tests for dashboard consumers.
- Consider authorization, rate limits, caching, and observability as part of endpoint design.
