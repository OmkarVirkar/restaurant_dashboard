---
name: nestjs
description: "Use when creating or modifying NestJS modules, controllers, providers, guards, pipes, interceptors, filters, lifecycle hooks, configuration, or dependency injection."
---

# NestJS

Use NestJS as the composition and transport framework.

- Group code by business feature: module, controller, service, DTOs, repositories, and tests.
- Keep modules explicit. Export only providers that are part of another module's contract.
- Use constructor injection and provider tokens for replaceable infrastructure.
- Use DTOs with runtime validation for external input; do not expose persistence entities directly.
- Use guards for authentication and authorization, pipes for transformation and validation, interceptors for cross-cutting request behavior, and exception filters for error mapping.
- Use lifecycle hooks for connection setup and cleanup, and make initialization failures fail fast.
- Keep controllers thin: map transport input to a use-case call and map the result to a response.
- Avoid global state and hidden module coupling. Add `@Global()` only when the dependency is truly application-wide.
- Test providers in isolation and test HTTP contracts through e2e tests.
