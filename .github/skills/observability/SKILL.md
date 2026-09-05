---
name: observability
description: "Use when adding logs, metrics, tracing, health checks, readiness, alerts, diagnostics, or operational visibility to the backend."
---

# Observability

Make production behavior explainable without exposing sensitive data.

- Emit structured logs with timestamp, level, service, operation, request ID, and correlation ID.
- Use the appropriate level: debug for development detail, info for lifecycle events, warn for recoverable anomalies, and error for failed operations.
- Record latency, throughput, error rate, dependency failures, queue depth, and database pool health as metrics.
- Propagate trace and correlation context across HTTP and message boundaries.
- Separate liveness from readiness; readiness must reflect dependency availability.
- Redact credentials, tokens, payment data, and personal data from logs and telemetry.
- Add useful context to errors while preserving stable client-facing responses.
- Document alert thresholds and runbook actions for important failure modes.
