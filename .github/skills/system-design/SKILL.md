---
name: system-design
description: "Use when designing or changing backend architecture, module boundaries, scalability, reliability, data flows, or technology choices in this restaurant system."
---

# System Design

Design from business capabilities and explicit boundaries. For this repository:

- Keep controllers thin and put business rules in application services.
- Keep feature modules independent from infrastructure modules.
- Keep database vendor code behind the database adapter boundary.
- Prefer dependency inversion and explicit interfaces over importing infrastructure from domain code.
- Define ownership, inputs, outputs, failure modes, consistency requirements, and operational limits before implementation.
- Prefer a modular monolith until there is a measured reason to split a bounded capability into a service.
- Record important architectural decisions in a short ADR when a choice affects future migrations, scaling, or public contracts.

For every design change, check:

1. What is the owning module?
2. What contract crosses the module boundary?
3. What happens on timeout, duplicate request, partial failure, and restart?
4. How will the design be tested and observed?
5. What is the simplest implementation that preserves a future migration path?
