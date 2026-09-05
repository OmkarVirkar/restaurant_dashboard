---
name: engineering-standards
description: "Use when establishing coding standards, reviewing consistency, naming, documentation, dependency changes, or quality gates for this TypeScript and NestJS backend."
---

# Engineering Standards

Follow the repository's TypeScript, NestJS, and test conventions.

- Use strict TypeScript types and avoid implicit contracts.
- Use 2-space indentation, Prettier, ESLint, and the existing package scripts.
- Use PascalCase for classes, camelCase for variables and methods, and kebab-case for file names.
- Keep configuration in environment-backed typed resolvers and document every supported variable.
- Use conventional HTTP status codes and consistent response/error shapes.
- Prefer small cohesive modules and one reason to change per class.
- Document decisions and operational behavior, not obvious implementation details.
- Review package additions for license, maintenance, security, bundle/runtime impact, and Node compatibility.
- Required checks for backend changes: `npm run build`, focused tests, and `npm run lint` when applicable.
