<!-- 
  📁 File location: yellow-hood-app/docs/system-contracts.md
  📄 Notion page: https://www.notion.so/steering-agency/System-Contract-3493cf957a688058a8a6e6801f25e6d6

  Notion last updated: 2026-06-28
  Prompt last run: —

  To sync this file with Notion, use the Sync Prompt on the Notion page.
-->

# Yellow Hood — System Contracts

## Purpose

This document defines non-implementational rules that govern how the Yellow Hood system behaves at a fundamental level.

These are NOT features. These are NOT tasks. They are system-level constraints that every engineer must follow when writing code for this project.

When backend behavior, DB flow, error handling, or route rules change — **this document must be updated first.**

> Single source of truth for system behavior rules. Lives at `/docs/system-contracts.md`.

---

## ⚠️ Core Principle

> The system must always have exactly ONE predictable error exit point: the route boundary. Every failure must be traceable. No silent behavior is permitted anywhere in the stack.

---

## Contract 1: Error Handling Strategy

### Rule

Error handling is layered. Note: this codebase does not have a separate "service" layer — `lib/db.ts` combines DB access and service responsibilities in one file.

| Layer | Responsibility |
|---|---|
| `lib/db.ts` (DB + service, combined) | Calls Prisma directly and returns typed results, or `undefined`/`null` for not-found. No try/catch — errors propagate naturally. |
| Route Layer (`app/api/**/route.ts`) | Should be the single error boundary, via `withRouteErrorBoundary`, catching everything and returning a response. |

### Current implementation status

The shared `lib/route-error-boundary.ts` helper exists and is used by 7 of 11 routes:

```ts
// ✅ Used by: auth/login, auth/register, auth/logout, auth/update,
//             wallet/balance, wallet/swap, wallet/transactions
export const GET = withRouteErrorBoundary(async (req) => {
  const data = await getWallet(userId)
  return NextResponse.json({ balance: data.balance })
})
```

4 routes do not yet use it — they hand-roll their own `try/catch` instead:
`app/api/vitrin/connect`, `app/api/vitrin/oauth`, `app/api/webhooks/vitrin/reward`, `app/api/games/list`.

```ts
// Current pattern in the 4 routes above
export async function POST(request: Request) {
  try {
    // ...
  } catch (error) {
    console.error("...", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### Forbidden

- Silent error suppression anywhere in the stack
- Fallback values returned in place of real errors
- Multiple catch layers for the same error flow

---

## Contract 2: DB Stability Behavior

### Rule

- Prisma initialization must never crash the application at import time
- DB errors must surface ONLY during query execution, never at boot
- No fake fallback clients or partial initialization states

### Allowed

- Runtime failure on actual DB usage (query time)
- Not-found returned as a valid non-error state

### Forbidden

- `throw` inside Prisma client instantiation
- Any code that causes process exit on DB unavailability at startup
- Catching and silencing a Prisma connection error at boot

---

## Contract 3: Logging Consistency

### Current implementation status

There is no `logger` module in the codebase — logging is done with plain `console.error`/`console.warn` calls, and not every error path logs:

- `lib/route-error-boundary.ts`'s catch-all logs every uncaught exception as `console.error("[route-error-boundary]", error)` before returning the 500 response.
- The 4 routes not yet using `withRouteErrorBoundary` (see Contract 1) each log their own uncaught exceptions with an ad-hoc message, e.g. `console.error("Error initiating Vit-Rin connection:", error)`.
- A few specific validation/lookup failures log before returning an error response (e.g. `auth/login` logs `"User not found for email:"` and `"Password verification failed for email:"`; `lib/db.ts`'s `verifyPassword` logs `"User not found for password verification"` and `"Password comparison failed for user:"`, and warns `"Using plain text password comparison for user:"` for legacy unhashed passwords).
- Most validation/not-found error paths (e.g. "Wallet not found", "Insufficient balance", "Session not found") return their error response directly with no log call at all.
- No call site logs a structured `{ source, message, context }` object — every call passes a plain string plus loose extra arguments.

### Forbidden

- Empty catch blocks
- Swallowing an error after logging it (must still re-throw or return an error response)

---

## Contract 4: Route Boundary Enforcement

### Rule

- Every API route file must use `withRouteErrorBoundary`
- One boundary per route — no nesting
- No internal try/catch inside route handlers

Applies to all routes under `/app/api/**`

### Current implementation status

7 of 11 route files comply. 4 do not yet: `vitrin/connect`, `vitrin/oauth`, `webhooks/vitrin/reward`, `games/list` — see Contract 1 for the exact pattern each currently uses instead.

---

## Contract 5: API Response Format

### Current implementation status

There is no shared response wrapper — every route builds its own `NextResponse.json(...)` body directly, and shapes differ per route:

| Route | Success shape |
|---|---|
| `auth/login` | `{ token, user }` |
| `auth/register` | the bare user object, no wrapper key (`{ id, email, username, ... }`) |
| `auth/logout` | `{ message }` |
| `auth/update` | `{ user }` |
| `vitrin/connect` | `{ message, redirectUrl, code }` |
| `vitrin/oauth` | `{ message, user }` |
| `wallet/balance` | `{ balance }` |
| `wallet/swap` | `{ message, newBalance }` |
| `wallet/transactions` | `{ transactions }` |
| `webhooks/vitrin/reward` | `{ message, userId, newBalance }` |
| `games/list` | `{ games }` |

Error shape is consistent everywhere it's built directly in a route or by `withRouteErrorBoundary`'s default handler: a flat `{ error: "<message>" }`, `error` always a plain string — never a nested `{message, code}` object, no `code` field exists anywhere today. `lib/auth.ts`'s `getCurrentUser()` (used by 6 of 11 routes for auth-failure responses) builds the same `{ error: "<message>" }` shape but via a raw `new Response(JSON.stringify(...))` rather than `NextResponse.json`, for its three cases: "Authorization token required" (401), "Invalid or expired session" (401), "User not found" (404).

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

- Returning `{ success: false }` as the error structure
- Returning raw error objects or stack traces to the client
- Using 200 for error responses
- Inconsistent shapes between routes

---

## Contract 6: Auth Session Rules

### Rule

- Session is managed server-side using the established auth library
- Session must be validated at the route level before any DB query
- User ID is extracted from the session — never from the request body or query params

### Current implementation

There is no `getServerSession()`/next-auth style mechanism. Auth is a custom bearer-token scheme, implemented in `lib/auth.ts`'s `getCurrentUser(request)` and used at the top of every protected route:

```ts
// lib/auth.ts — actual current implementation
const authHeader = request.headers.get("authorization");
if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return { error: new Response(JSON.stringify({ error: "Authorization token required" }), { status: 401, headers: { "Content-Type": "application/json" } }) };
}
const token = authHeader.substring(7);
const session = await findSession(token); // custom Session table, not a cookie/JWT session
if (!session) {
  return { error: new Response(JSON.stringify({ error: "Invalid or expired session" }), { status: 401, headers: { "Content-Type": "application/json" } }) };
}
const user = await findUser(undefined, session.user_id);
if (!user) {
  return { error: new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { "Content-Type": "application/json" } }) };
}
return { user };
```

Route usage:

```ts
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
| Token expires | Silent refresh attempt; if fails → 401 with `VITRIN_SESSION_EXPIRED` |
| User disconnects VIT-RIN | Token deleted from server-side storage |

### VIT-RIN Error Codes

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
- Unknown layer keys are rejected with 400
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
| DB returns unexpected null | Service returns 404, no crash |
| VIT-RIN API is unreachable | Route returns 503 with `VITRIN_API_ERROR`, logged |
| Auth session is missing | Route returns 401 with `UNAUTHORIZED` |
| Avatar POST with invalid body | Route returns 400 with validation message |
| Prisma throws unique constraint | Service catches, returns 409 or descriptive 400 |

---

## Ownership

- Contracts define rules ONLY
- Implementation lives in Tasks and Epics (Updates board in Notion)
- This document must be updated when any of the following change:
  - DB flow or Prisma behavior
  - Error handling strategy
  - Auth session rules
  - VIT-RIN integration behavior
  - API response shape
  - Avatar data schema
