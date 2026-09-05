---
name: microservices
description: "Use when splitting backend capabilities into services, designing messaging, asynchronous workflows, service boundaries, retries, or distributed transactions."
---

# Microservices

Do not split the current modular monolith without a capability, ownership, or scaling reason.

- Define bounded contexts and data ownership before choosing a service boundary.
- Each service owns its data and exposes a versioned contract; avoid shared database tables.
- Prefer idempotent commands, correlation IDs, explicit timeouts, and bounded retries with jitter.
- Use an outbox or equivalent durable publication strategy when a database change must emit an event.
- Design for duplicate delivery, out-of-order events, poison messages, dead-letter handling, and replay.
- Avoid distributed transactions where a saga or compensating action is sufficient.
- Version events and APIs; never silently change the meaning of an existing message.
- Include health, readiness, metrics, structured logs, and trace context in every service.
- Test contract compatibility and failure paths, not only the happy path.
