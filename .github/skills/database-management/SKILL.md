---
name: database-management
description: "Use when creating schemas, repositories, queries, migrations, seeds, transactions, indexes, or switching database providers in the NestJS backend."
---

# Database Management

Treat persistence as an infrastructure concern and keep feature code provider-neutral.

- Use `DatabaseService` and the adapter contract; do not access PGlite, PostgreSQL, SQLite, or MongoDB clients from controllers.
- Keep repositories and entity mapping inside feature modules, not in the core database module.
- Prefer migrations for production schema changes and make migrations reversible where practical.
- Make seed scripts idempotent and separate test fixtures from production seed data.
- Use parameterized queries and bounded result sets. Never concatenate user input into SQL or document filters.
- Add indexes from measured query patterns and verify them with query plans.
- Define transaction boundaries explicitly. Do not assume a transaction exists across multiple adapters.
- Preserve foreign keys, uniqueness, not-null constraints, and audit timestamps at the persistence boundary.
- Test repositories against the real supported adapter and include rollback, duplicate, empty-result, and pagination cases.
- Never commit credentials or runtime database files.
