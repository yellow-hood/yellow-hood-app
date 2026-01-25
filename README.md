# Yellow Hoods

**Gamification & Wallet App** — A Next.js application for user accounts, in-app wallet, Vitrin integration, and game discovery.

---

## Tech Stack

| Layer        | Technology |
| ------------ | ---------- |
| Framework    | **Next.js 14** (App Router) |
| Language     | **TypeScript** |
| Database     | **PostgreSQL** + **Prisma** (ORM) |
| Auth         | Custom session auth using **bcryptjs** (pure JS for cross-platform Docker) |
| Deployment   | **Docker** & **Docker Compose** |

---

## Key Architecture Decisions

### bcryptjs instead of bcrypt

We use **bcryptjs** (pure JavaScript) instead of the native **bcrypt** module to avoid native build issues on:

- Docker Alpine images
- macOS Apple Silicon (and other ARM/x64 environments)

No native compilation means reliable installs and runs inside containers and across dev machines.

### Lightweight, Edge-Compatible Middleware

Auth checks in `middleware.ts` are **edge-compatible**:

- No database or Prisma calls in the middleware
- No Node-only APIs — only cookie checks and path-based redirects
- All DB/auth logic lives in API routes and server components, so the middleware stays small and can run on the Edge.

---

## Getting Started (Docker)

### 1. Copy environment file

```bash
cp .env.example .env
```

Edit `.env` if you need to override defaults (e.g. `DATABASE_URL` when not using Docker).

### 2. Start services

```bash
docker-compose up -d --build
```

This starts:

- **PostgreSQL** (`yellow-hood-postgres`) on port `5432`
- **Next.js** (`yellow-hood-nextjs`) on port `3000`

### 3. Apply schema and seed data

```bash
# Apply Prisma schema to the database
docker-compose exec nextjs npx prisma db push

# Seed users, games, and sample data
docker-compose exec nextjs npx prisma db seed
```

### 4. Open the app

**http://localhost:3000**

---

## Test Accounts

After running the seed, you can log in with any of these (password is the same for all):

| Email                   | Password   | Notes                          |
| ----------------------- | ---------- | ------------------------------ |
| `john.doe@example.com`  | `password123` | Vitrin connected, balance 1500.50 |
| `jane.smith@example.com`| `password123` | Not connected, balance 750.25    |
| `alice.wonder@example.com` | `password123` | Vitrin connected, balance 2000.00 |
| `bob.builder@example.com`  | `password123` | Not connected, balance 100.00     |

---

## Project Structure

```
yellow-hood-app/
├── app/
│   ├── (auth)/          # Login, register
│   ├── (protected)/     # Home, games, wallet, settings
│   ├── api/             # Auth, games, wallet, vitrin, webhooks
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── games/           # GameCard, etc.
│   ├── layout/          # Navbar
│   └── wallet/          # ConnectWalletCard, SwapModal, WalletDashboard
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── services/            # api, authService, gameService, walletService
├── store/               # useAuthStore, useWalletStore (Zustand)
├── types/
├── docker-compose.yml
├── Dockerfile
└── middleware.ts        # Edge-safe auth redirects
```

---

## Useful Commands

| Command | Description |
| ------- | ----------- |
| `docker-compose up -d --build` | Build and start all services |
| `docker-compose exec nextjs npx prisma db push` | Sync schema to DB |
| `docker-compose exec nextjs npx prisma db seed` | Run seed script |
| `docker-compose exec nextjs npx prisma studio` | Open Prisma Studio (DB UI) |
| `docker-compose down` | Stop and remove containers |

For **local development** (no Docker), use a local PostgreSQL instance, set `DATABASE_URL` to `localhost`, and run:

```bash
npm install
npx prisma db push
npx prisma db seed
npm run dev
```
