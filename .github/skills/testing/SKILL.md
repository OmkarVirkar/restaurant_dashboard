---
name: testing
description: "Use when adding, changing, or reviewing unit, integration, contract, end-to-end, regression, or security tests in the backend."
---

# Testing

Test behavior at the narrowest level that gives confidence, then cover important boundaries with integration and e2e tests.

- Unit test pure logic and services with injected dependencies.
- Integration test repositories and adapters against the real database engine they support.
- E2e test HTTP status codes, validation, authorization, response shapes, and lifecycle behavior.
- Prefer stable fixtures and isolated test data. Do not depend on developer-local databases.
- Cover happy paths, invalid input, unauthorized and forbidden access, not-found behavior, duplicates, retries, empty results, and dependency failures.
- Test adapter selection for every supported provider and reject unknown configuration.
- Avoid asserting private implementation details or exact incidental error text.
- Keep tests deterministic: control time, randomness, network calls, and external services.
- Run focused tests first, then build and the broader suite before completion.
