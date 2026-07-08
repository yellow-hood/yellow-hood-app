# Yellow Hood — Architectural Decisions

Log of meaningful backend architectural decisions: error handling strategy, DB flow strategy, route lifecycle behavior, service layer responsibilities. Not a log of bug fixes, UI changes, DB schema changes, or feature-level implementation details.

---

## 2026-07-08 — Phase 0 backend stabilization

### Prisma client caching must be identical in dev and production

**Decision:** `lib/prisma.ts` caches its lazily-constructed `PrismaClient` the same way regardless of `NODE_ENV`, instead of recreating a fresh client (and connection pool) on every property access in production while caching only in development.

**Why:** the app runs as a long-lived Docker process (not serverless), so there is no reason for the two environments to behave differently, and per-call client recreation in production is a connection-exhaustion risk.

**Scope:** DB flow strategy — Prisma initialization/caching only, no schema changes.

### Route error containment goes through a single shared boundary

**Decision:** standardize all API route handlers on the `withRouteErrorBoundary` helper rather than each route hand-rolling its own `try/catch`.

**Why:** avoids duplicated boilerplate and inconsistent logging/response shape between routes; keeps exactly one place responsible for catching uncaught exceptions per request.

**Scope:** error handling strategy, route lifecycle behavior.

### `/api/health` is a derived, on-demand runtime check — not a boot dependency

**Decision:** health reachability (DB connectivity + required env vars) is computed fresh on every request to `/api/health`, never cached or computed at build/boot time.

**Why:** a statically-cached health response would freeze whatever state existed at build time and stop reflecting real runtime health.

**Scope:** route lifecycle behavior, DB flow strategy.

### Required environment variables are validated at process start with non-blocking logging

**Decision:** validate env vars once when the server process starts (via Next.js's `instrumentation.ts` hook), logging a warning on a missing/invalid value. Never `throw` or call `process.exit()` from this check.

**Why:** a missing env var should degrade the app, not crash the boot process — consistent with "no single failure crashes the whole app."

**Scope:** error handling strategy.

### API response normalization must be strictly additive, not a redesign

**Decision:** introduce a shared `apiSuccess`/`apiError` response wrapper that adds new fields (`success`, and for errors `message`/`code`) on top of every route's existing response body, without renaming, removing, or re-nesting any field a route already returns.

**Why:** existing frontend code (`services/`, `store/`) reads specific top-level fields per route (`token`, `user`, `balance`, `newBalance`, `transactions`, `games`, `code`, or the bare body for registration) and detects failure purely by HTTP status — a shape redesign would silently break those consumers rather than fail loudly, since every error read is optional-chained.

**Scope:** error handling strategy, API response shape.

### Auth-failure responses must go through the same response helper as every other route error

**Decision:** `lib/auth.ts`'s `getCurrentUser()` — the shared auth check used by every protected route — builds its 401/404 responses through the same response helper as route-level errors, instead of constructing raw `Response` objects independently.

**Why:** auth failures are the most frequently hit error path in the app; leaving them outside the shared response helper meant the majority of real-world error responses never participated in whatever consistency the wrapper was meant to guarantee.

**Scope:** error handling strategy, service layer responsibilities.
