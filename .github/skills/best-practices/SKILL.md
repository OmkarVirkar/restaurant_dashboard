---
name: best-practices
description: "Use when implementing or reviewing backend code and deciding how to keep changes maintainable, testable, readable, and low risk."
---

# Backend Best Practices

Optimize for correctness, clarity, and a small change surface.

- Read the owning module, nearby tests, and project map before editing.
- Prefer existing NestJS and repository patterns over new abstractions.
- Keep public APIs stable unless the change explicitly requires a contract update.
- Use descriptive names, narrow functions, explicit return types for public methods, and typed errors.
- Avoid `any`; isolate unavoidable vendor typing at the adapter boundary.
- Keep controllers focused on transport concerns and services focused on use cases.
- Make side effects explicit and keep pure transformations easy to unit test.
- Handle asynchronous work with clear lifecycle and cleanup behavior.
- Add focused tests for changed behavior and run build, lint, and relevant tests before finishing.
- Do not mix unrelated refactors, formatting churn, or generated artifacts into a feature change.
