<!-- 
  📁 File location: yellow-hood-app/docs/system-contracts.md
  📄 Notion page: https://www.notion.so/steering-agency/System-Contract-3493cf957a688058a8a6e6801f25e6d6

  Notion last updated: 2026-07-08
  Prompt last run: 2026-07-08

  To sync this file with Notion, use the Sync Prompt on the Notion page.
-->

# Yellow Hood — System Contracts

## Purpose

This document defines non-implementational rules that govern how the Yellow Hood system behaves at a fundamental level.

These are NOT features. These are NOT tasks. They are system-level constraints that every engineer must follow when writing code for this project.

When backend behavior, DB flow, error handling, or route rules change — this document must be updated first.

> This file lives at `/docs/system-contracts.md` in the `yellow-hood-app` repository and is the single source of truth for system behavior rules.

---

## ⚠️ Core Principle

> The system must always have exactly ONE predictable error exit point: the route boundary. Every failure must be traceable. No silent behavior is permitted anywhere in the stack.

---

## Contract 1: Error Handling Strategy

### Rule

Error handling is strictly layered — each layer has exactly one responsibility:

| Layer | Responsibility |
|---|---|
| `lib/db.ts` (DB + service, combined — this codebase has no separate service layer) | Calls Prisma directly and returns typed results, or `undefined`/`null` for not-found. No try/catch — errors propagate naturally. |
| Route Layer | ONLY error boundary — catches everything, returns normalized response via `apiSuccess`/`apiError` |

### Implementation

All routes must wrap their handler with `withRouteErrorBoundary`.

```typescript
// ✅ Correct — actual current pattern, used by all 12 routes
export const GET = withRouteErrorBoundary(async (req) => {
  const wallet = await getWallet(userId)
  return apiSuccess({ balance: wallet.balance })
})

// ❌ Forbidden
export const GET = async (req) => {
  try {
    const wallet = await getWallet(userId)
    return NextResponse.json({ balance: wallet.balance })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
```

### Forbidden

- Silent error suppression anywhere in the stack
- Fallback values returned in place of real errors
- Multiple catch layers for the same error flow
- Any try/catch inside a route handler

---

## Contract 2: DB Stability Behavior

### Rule

- Prisma initialization must never crash the application at import time
- DB errors must surface ONLY during query execution, never at boot
- No fake fallback clients or partial initialization states

### Allowed

- Runtime failure on actual DB usage (query time)
- Not-found returned as a valid non-error state

### Current implementation status

`lib/prisma.ts` caches its lazily-constructed `PrismaClient` on `globalThis` identically in development and production — exactly one client (and one underlying connection pool) exists per process lifetime, with no `NODE_ENV` branch that would recreate the client per call. Construction itself is wrapped in try/catch: a failure is logged (`console.error("[lib/prisma] Failed to initialize Prisma client:", error)`) and rethrown, still only ever triggered lazily on first property access — never at module import.

Env var validation (`instrumentation.ts`): on Node.js server start (`process.env.NEXT_RUNTIME === "nodejs"`), checks that `DATABASE_URL` is set. If missing, logs `console.warn("[instrumentation] DATABASE_URL is not set — DB-dependent routes will fail until it is configured.")`. Never `throw`s and never calls `process.exit()` — a missing env var only produces a warning, boot continues. No other env vars are currently validated here.

### Forbidden

- `throw` inside Prisma client instantiation
- Any code that causes process exit on DB unavailability at startup
- Catching and silencing a Prisma connection error at boot

---

## Contract 3: Logging Consistency

### Rule

Every error that exits through the route boundary must be logged before exit.

Every log must include:
- `source` — which function or module threw
- `message` — the error message if it exists
- `context` — relevant identifiers (userId, route, etc.) where available

### Current implementation status

There is no `logger` module in the codebase — logging is done with plain `console.error`/`console.warn` calls, and not every error path logs:

- `lib/route-error-boundary.ts`'s catch-all logs every uncaught exception as `console.error("[route-error-boundary]", error)` before returning the 500 response.
- `lib/prisma.ts` logs Prisma client construction failures; `lib/db.ts` logs `checkDbConnection()` failures (`"[lib/db] DB connectivity check failed:"`) and a few password-verification edge cases.
- `instrumentation.ts` warns (does not error) on a missing `DATABASE_URL`.
- Most validation/not-found error paths (e.g. "Wallet not found", "Insufficient balance") return their error response directly with no log call at all.
- No call site logs a structured `{ source, message, context }` object — every call passes a plain string plus loose extra arguments.

### Forbidden

- Empty catch blocks
- Logging without source context
- Swallowing an error after logging it (must still re-throw or return error response)

---

## Contract 4: Route Boundary Enforcement

### Rule

- Every API route file must use `withRouteErrorBoundary`
- One boundary per route — no nesting
- No internal try/catch inside route handlers

Applies to all routes under `/app/api/**`

### Current implementation status

All 12 route files (the 11 pre-existing routes plus `/api/health`) use `withRouteErrorBoundary` — fully compliant, no exceptions found.

### `/api/health`

`app/api/health/route.ts` exists. It exports `export const dynamic = "force-dynamic"` so it is evaluated fresh on every request — never cached or computed at build time (this was a deliberate fix: an earlier version was statically pre-rendered and would have frozen whatever DB/env state existed at build time forever). On each `GET`, it checks `DATABASE_URL` presence and calls `checkDbConnection()` (a lightweight `prisma.$queryRaw` `SELECT 1` in `lib/db.ts`). When both pass it returns `apiSuccess` with `status: "ok"` and the checks object, at HTTP 200. When either fails it returns `apiError` with message `"Service degraded"`, code `"DEGRADED"`, status 503, plus the same checks object — a genuinely derived, on-demand runtime check with no boot dependency.

---

## Contract 5: API Response Format

### Rule

All API responses must follow a consistent shape, produced by the shared `apiSuccess`/`apiError` helpers (`lib/api-response.ts`) — no route builds its own ad-hoc `NextResponse.json` body directly anymore.

### Success shape

`apiSuccess(data, status)` spreads the caller's own data fields (which vary per route — e.g. `{token,user}` for login, `{balance}` for wallet/balance, `{games}` for games/list) and adds one field on top:

```json
{
  "...routeSpecificFields": "...",
  "success": true
}
```

### Error shape (produced by `apiError`, including `withRouteErrorBoundary`'s default catch-all)

Uniform across every route — `error` is always kept as a plain string (not nested) for backward compatibility with existing frontend code that reads it as a string:

```json
{
  "error": "Human-readable message",
  "message": "Human-readable message",
  "code": "ERROR_CODE",
  "success": false
}
```

### HTTP Status Codes

| Situation | Status |
|---|---|
| Success | 200 |
| Created | 201 |
| Bad request / validation | 400 |
| Unauthorized (no session) | 401 |
| Forbidden (wrong user) | 403 |
| Not found | 404 |
| Internal server error | 500 |
| External service unavailable | 503 |

### Forbidden

- Returning raw error objects or stack traces to the client
- Using 200 for error responses
- Inconsistent envelope shapes between routes (the `success`/`error`/`message`/`code` envelope must stay uniform; per-route data fields naturally differ by domain)

---

## Contract 6: Auth Session Rules

### Rule

- Session is managed server-side via a custom bearer-token scheme (`lib/auth.ts`) — not a third-party auth library, not cookie-based sessions
- Session must be validated at the route level before any DB query
- User ID is extracted from the session — never from the request body or query params

### Implementation

Actual current code, `lib/auth.ts`'s `getCurrentUser(request)` — used at the top of every protected route:

```typescript
const authHeader = request.headers.get("authorization");
if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return { error: apiError("Authorization token required", ApiErrorCode.UNAUTHORIZED, 401) };
}
const token = authHeader.substring(7);
const session = await findSession(token); // custom Session table, not a cookie/JWT session
if (!session) {
  return { error: apiError("Invalid or expired session", ApiErrorCode.SESSION_EXPIRED, 401) };
}
const user = await findUser(undefined, session.user_id);
if (!user) {
  return { error: apiError("User not found", ApiErrorCode.USER_NOT_FOUND, 404) };
}
return { user };
```

Route usage:

```typescript
const authResult = await getCurrentUser(request);
if (authResult.error) {
  return authResult.error;
}
const { user } = authResult; // user.id used for all subsequent DB calls
```

### Auth States

| State | Description |
|---|---|
| Guest | No session — cannot access protected routes |
| Logged in (YH only) | Session exists, VIT-RIN not connected |
| Fully connected | Session + VIT-RIN token stored server-side |

### Forbidden

- Trusting `userId` from client-provided body or params
- Storing VIT-RIN token in client-accessible storage (must be server-side only)
- Returning 500 for unauthenticated requests (must return 401)

---

## Contract 7: VIT-RIN Integration Rules

### Rule

Yellow Hood communicates with VIT-RIN exclusively through server-side API calls. The VIT-RIN token is never exposed to the client.

### Flow

```
Client request
  → Yellow Hood API route (validates YH session)
  → Yellow Hood calls VIT-RIN API server-side (with stored VIT-RIN token)
  → Returns transformed response to client
```

### Token Lifecycle

| Event | Action |
|---|---|
| User connects VIT-RIN | Token received via OAuth, stored server-side |
| Each request needing VIT-RIN | Token retrieved from server-side storage |
| Token expires | Silent refresh attempt; if fails → return 401 with code `VITRIN_SESSION_EXPIRED` |
| User disconnects VIT-RIN | Token deleted from server-side storage |

### Error Codes (VIT-RIN specific)

| Code | Meaning |
|---|---|
| `VITRIN_NOT_CONNECTED` | User has not linked VIT-RIN account |
| `VITRIN_SESSION_EXPIRED` | Token expired and refresh failed |
| `VITRIN_API_ERROR` | VIT-RIN returned an unexpected error |

### Forbidden

- Passing VIT-RIN token to the frontend
- Calling VIT-RIN APIs from client-side code
- Trusting VIT-RIN error responses without logging and wrapping

---

## Contract 8: Avatar & Character API Rules

### Rule

Avatar data (outfit, color, accessories, gender) is stored in PostgreSQL via Prisma and owned by Yellow Hood — not VIT-RIN.

### Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/user/avatar` | Return current user's avatar config |
| POST | `/api/user/avatar` | Save updated avatar config |

### Data shape

```json
{
  "gender": "boy",
  "layer": {
    "body": "default",
    "outfit": "hoodie-yellow",
    "head": "cap-black",
    "accessory": "glasses-round",
    "expression": "happy"
  },
  "background": "gradient-night",
  "colorSlots": {
    "slot1": "#F5C518",
    "slot2": "#1A1A1A"
  }
}
```

### Rules

- Avatar config is validated server-side before saving
- Unknown layer keys are rejected (400)
- Avatar data is passed to the Godot character iframe via a signed read-only token — never as raw JSON in URL params

### Forbidden

- Saving avatar data client-side only (must persist to DB)
- Accepting arbitrary JSON without schema validation
- Exposing avatar write endpoint without session validation

---

## Contract 9: DB Validation Plan

Scenarios that must pass before any deploy that touches DB or error handling:

| Scenario | Expected behavior |
|---|---|
| DB is offline at server start | Server starts normally, no crash |
| DB goes offline mid-request | Route returns 500, error is logged, process continues |
| DB returns unexpected null | Service returns not-found (404), no crash |
| VIT-RIN API is unreachable | Route returns 503 with `VITRIN_API_ERROR`, logged |
| Auth session is missing | Route returns 401 with `UNAUTHORIZED` |
| Avatar POST with invalid body | Route returns 400 with validation message |
| Prisma throws unique constraint | Service catches, returns 409 or descriptive 400 |

---

## Ownership

- Contracts define rules ONLY
- Implementation lives in Tasks and Epics (Updates board)
- This document must be updated when any of the following change: DB flow, error handling strategy, auth rules, VIT-RIN integration behavior, API response shape
- The `/docs/system-contracts.md` file in the repo must stay in sync with this page
