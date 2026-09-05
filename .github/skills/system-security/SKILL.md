---
name: system-security
description: "Use when handling authentication, authorization, secrets, validation, injection risks, security headers, sensitive data, dependencies, or threat modeling for the backend."
---

# System Security

Use defense in depth and treat all external input as untrusted.

- Validate request bodies, params, query strings, headers, and environment configuration at the boundary.
- Authenticate callers before loading protected resources and authorize against the resource owner or required role.
- Use least-privilege database credentials and separate development, test, and production secrets.
- Keep secrets in environment or a secret manager; never log passwords, tokens, connection strings, or personal data.
- Use parameterized database APIs and safe serialization to prevent injection.
- Apply rate limits and payload size limits to public or expensive endpoints.
- Return stable, non-sensitive error responses; keep stack traces in server logs only.
- Configure CORS, security headers, TLS, and secure cookie settings deliberately rather than relying on defaults.
- Review new dependencies, lockfile changes, and known vulnerabilities before merging.
- Add tests for unauthorized, forbidden, malformed, replayed, and over-sized requests.
