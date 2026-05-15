# Car Wash Management System

A full-stack management system built for a real car wash business. Handles orders, sales, inventory, and payments. I was packaged as a desktop app, but designed so it can move to the cloud when the business scales.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, TanStack Query, React Router, Tailwind CSS |
| Backend | Node.js, Express, Prisma, SQLite |
| Desktop | Electron |
| Shared | TypeScript, Zod, npm workspaces |

## Features

- **Dashboard** — KPIs, revenue charts, activity feed, and inventory alerts
- **Orders** — Kanban board with columns for state (Pending → In Progress → Completed)
- **Sales & Purchases** — Transaction tracking with full history
- **Inventory** — Stock management with adjustment reasons (damage, theft, expiry)
- **Multi-currency** — USD / VES / EUR support with live BCV exchange rates
- **Settings** — Store info, payment methods, and exchange rate configuration

## Architecture

Monorepo with three apps and one shared package:

```
apps/
  api/        # Express REST API
  web/        # React frontend
  desktop/    # Electron wrapper
packages/
  types/      # Shared DTOs, schemas, and enums
```

The API follows a layered architecture: **Controllers → Services → Repositories**, with a manual dependency injection container. The shared `types` package keeps API contracts in sync with the frontend without any code generation.

In production, Electron spawns the Node.js API as a utility process and loads the bundled web app — everything ships as a single desktop installer.

## Key Decisions

**Node.js + React instead of a monolithic stack**
The client needed a desktop app first, but wanted the option to go cloud later. Splitting the frontend and backend from day one made that a straightforward path — just deploy the two apps separately when the time comes.

**SQLite + Prisma**
Zero-config database for the desktop phase. Switching to PostgreSQL is a one-line change in the Prisma schema.

**Monorepo with shared types**
Avoids duplication between API and web. Both apps import the same DTOs and validation schemas, so a change in one place propagates everywhere.

## Getting Started

Requires Node.js 20+.

```bash
cp apps/api/.env.example apps/api/.env
npm install
npm run dev
```

This starts all three apps concurrently (API, web, and Electron).

## What I Learned

- How to apply clean architecture (layered pattern + DI container) in a real Node.js backend
- Structuring a monorepo with npm workspaces and cross-app shared packages
- Managing server state with React Query — caching, invalidation, and keeping the UI in sync
- Talking with a real client, mapping their business processes, and translating that into technical requirements
