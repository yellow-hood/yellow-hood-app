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

Error handling is strictly layered — each layer has exactly one responsibility:

| Layer | Responsibility |
|---|---|
| DB Layer | Execute and throw naturally — no swallowing |
| Service Layer | Pass-through only — no try/catch unless explicit not-found |
| Route Layer | ONLY error boundary — catches everything, returns normalized response |

### Implementation

All routes must wrap their handler with `withRouteErrorBoundary`.

```ts
// ✅ Correct
export const GET = withRouteErrorBoundary(async (req) => {
  const data = await userService.getUser(id)
  return NextResponse.json(data)
})

// ❌ Forbidden
export const GET = async (req) => {
  try {
    const data = await userService.getUser(id)
    return NextResponse.json(data)
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

### Implementation

```ts
logger.error({
  source: 'userService.getUser',
  message: error.message,
  context: { userId }
})
```

### Forbidden

- Empty catch blocks
- `console.log` in production paths (use the logger module)
- Logging without source context
- Swallowing an error after logging it (must still re-throw or return error response)

---

## Contract 4: Route Boundary Enforcement

### Rule

- Every API route file must use `withRouteErrorBoundary`
- One boundary per route — no nesting
- No internal try/catch inside route handlers

Applies to all routes under `/app/api/**`

---

## Contract 5: API Response Format

### Rule

All API responses must follow a consistent shape.

### Success shape

```json
{
  "data": { ... }
}
```

### Error shape (auto-produced by withRouteErrorBoundary)

```json
{
  "error": {
    "message": "Human-readable message",
    "code": "ERROR_CODE"
  }
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

### Implementation

```ts
const session = await getServerSession()
if (!session?.user?.id) {
  return NextResponse.json(
    { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
    { status: 401 }
  )
}
const userId = session.user.id
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
