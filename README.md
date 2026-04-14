# 🚚 Courier Tracking SaaS Platform

A full-stack, multi-tenant SaaS platform for courier and shipment management. Built with a **Turborepo monorepo** structure, it enables workspace admins to manage fleets, agents, shipments, and real-time tracking — while delivery agents get a focused view of their assigned vehicle and routes.

---

## ✨ Features

- 🏢 **Multi-tenant workspaces** — each business operates in its own isolated workspace
- 👥 **Role-based access** — `super_admin`, `admin`, and `delivery_agent` roles with separate views
- 📦 **Shipment lifecycle management** — create, assign, track, and complete shipments
- 🚗 **Fleet management** — register vehicles (bike, car, van, truck, auto) and assign to agents
- 📍 **Real-time tracking** — live location updates via Redis pub/sub
- 🔔 **Email notifications** — powered by [Resend](https://resend.com)
- 📸 **File uploads** — proof-of-delivery image uploads via Cloudflare R2
- 🔐 **Secure auth** — JWT access + refresh tokens with HTTP-only cookies
- 📊 **Analytics module** — workspace-level delivery analytics
- 🧾 **QR Code generation** — per-shipment QR codes for quick scanning
- 💳 **Subscription module** — tiered workspace subscription support
- 🚦 **Rate limiting** — Redis-backed rate limiting per IP
- 📖 **Swagger docs** — auto-generated API documentation

---

## 🗂 Monorepo Structure

.
├── apps/
│ ├── backend/ # Express.js REST API (Node.js + TypeScript)
│ ├── frontend/ # Next.js 16 web dashboard (React 19 + Tailwind v4)
│ └── docker-compose.yml
├── packages/
│ ├── ui/ # Shared shadcn/ui component library (@repo/ui)
│ ├── eslint-config/ # Shared ESLint config (@repo/eslint-config)
│ └── typescript-config/ # Shared tsconfig (@repo/typescript-config)
├── turbo.json
└── package.json

text

---

## 🛠 Tech Stack

| Layer            | Technology                                                       |
| ---------------- | ---------------------------------------------------------------- |
| Frontend         | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, TanStack Query |
| Backend          | Express.js 5, TypeScript, Drizzle ORM                            |
| Database         | PostgreSQL via [Neon](https://neon.tech) (serverless)            |
| Cache / Queue    | Redis (ioredis) + BullMQ                                         |
| Storage          | Cloudflare R2 (AWS S3-compatible)                                |
| Email            | Resend                                                           |
| Auth             | JWT (access + refresh), bcryptjs, HTTP-only cookies              |
| Validation       | Zod                                                              |
| API Docs         | Swagger (swagger-jsdoc + swagger-ui-express)                     |
| Monorepo         | Turborepo                                                        |
| Containerization | Docker + Docker Compose                                          |

---

## 📋 Prerequisites

Make sure you have the following installed before getting started:

- **Node.js** v20+ — [Download](https://nodejs.org)
- **npm** v10+ (comes with Node.js)
- **Docker & Docker Compose** — [Download](https://www.docker.com/products/docker-desktop)
- **Git**

You will also need accounts/API keys for:

- [Neon](https://neon.tech) — PostgreSQL database (free tier available) / [Supabase](https://supabase.com) — PostgreSQL database (free tier available)
- [Resend](https://resend.com) — Transactional email (free tier available)
- [Cloudflare R2](https://developers.cloudflare.com/r2/) — Object storage for file uploads

---

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/AdityaGhamat/Courier-Tracking-SaaS-Platform.git
cd Courier-Tracking-SaaS-Platform
```

### 2. Install dependencies

From the **root** of the monorepo:

```bash
npm install
```

---

## 🔧 Environment Variables

### Backend (`apps/backend/.env`)

Copy the example file and fill in your values:

```bash
cp apps/backend/.env.example apps/backend/.env
```

| Variable                | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `PORT`                  | Backend server port (default: `3005`)                |
| `DATABASE_URL`          | Neon PostgreSQL connection string                    |
| `JWT_SECRET`            | Secret for JWT signing                               |
| `COOKIE_SECRET_KEY`     | Secret for access token cookie signing               |
| `COOKIE_REFRESH_SECRET` | Secret for refresh token cookie signing              |
| `RESEND_API_KEY`        | Resend API key for sending emails                    |
| `FROM_EMAIL`            | Sender email address (must be verified in Resend)    |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID                           |
| `R2_ACCESS_KEY_ID`      | R2 access key                                        |
| `R2_SECRET_ACCESS_KEY`  | R2 secret key                                        |
| `R2_BUCKET_NAME`        | R2 bucket name                                       |
| `R2_TOKEN`              | R2 API token                                         |
| `R2_PUBLIC_URL`         | Public URL of your R2 bucket                         |
| `R2_ENDPOINT`           | R2 S3-compatible endpoint URL                        |
| `REDIS_URL`             | Redis connection URL (e.g. `redis://localhost:6379`) |
| `REDIS_TLS`             | Set to `true` if using TLS (e.g. Upstash)            |
| `TRACKING_BASE_URL`     | Base URL for public tracking links                   |
| `API_URL`               | Backend API URL (used internally)                    |
| `FRONTEND_URL`          | Frontend URL for CORS configuration                  |

### Frontend (`apps/frontend/.env.local`)

Create a `.env.local` file inside `apps/frontend/`:

```bash
# apps/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3005/api
```

---

## 🗄 Database Setup

This project uses **Neon PostgreSQL** with **Drizzle ORM**. After setting your `DATABASE_URL`:

```bash
cd apps/backend

# Generate migration files from schema
npm run db:generate

# Push schema to your Neon database
npm run db:push

# (Optional) Open Drizzle Studio to inspect your DB
npm run db:studio
```

---

## 🐳 Running with Docker (Recommended)

The `docker-compose.yml` spins up **Redis** and the **backend** together. Make sure your `apps/backend/.env` is filled in first.

```bash
cd apps
docker-compose up -d
```

This starts:

- `courier-redis` — Redis on port `6379`
- `courier-backend` — Express API on port `3005`

To stop:

```bash
docker-compose down
```

---

## 🏃 Running Without Docker

### Start Redis locally

```bash
redis-server
```

Or use a managed Redis like [Upstash](https://upstash.com) and set `REDIS_URL` + `REDIS_TLS=true`.

### Start the Backend

```bash
cd apps/backend
npm run dev
```

- API: `http://localhost:3005`
- Swagger Docs: `http://localhost:3005/api-docs`

### Start the Frontend

```bash
cd apps/frontend
npm run dev
```

- Dashboard: `http://localhost:3003`

---

## 🚀 Running the Full Monorepo

From the **root**, use Turborepo to run everything at once:

```bash
npm run dev
# or with global turbo:
turbo dev
```

---

## 📜 Available Scripts

### Backend (`apps/backend`)

| Script                | Description                                 |
| --------------------- | ------------------------------------------- |
| `npm run dev`         | Start backend with hot reload (ts-node-dev) |
| `npm run build`       | Compile TypeScript to `dist/`               |
| `npm run start`       | Run compiled production build               |
| `npm run db:generate` | Generate Drizzle migration files            |
| `npm run db:push`     | Push schema changes to database             |
| `npm run db:studio`   | Open Drizzle Studio in browser              |

### Frontend (`apps/frontend`)

| Script                | Description                           |
| --------------------- | ------------------------------------- |
| `npm run dev`         | Start Next.js dev server on port 3003 |
| `npm run build`       | Build for production                  |
| `npm run start`       | Start production server on port 3003  |
| `npm run lint`        | Run ESLint                            |
| `npm run check-types` | TypeScript type check                 |

---

## 🔌 API Modules

| Module         | Description                                |
| -------------- | ------------------------------------------ |
| `auth`         | Registration, login, logout, token refresh |
| `core`         | Workspace & user management                |
| `shipment`     | Shipment CRUD, assignment, status updates  |
| `tracking`     | Real-time location tracking via Redis      |
| `vehicle`      | Fleet registration and agent assignment    |
| `hub`          | Delivery hub management                    |
| `notification` | Email notifications via Resend             |
| `upload`       | File upload to Cloudflare R2               |
| `qrcode`       | QR code generation per shipment            |
| `analytics`    | Workspace delivery analytics               |
| `payment`      | Payment processing module                  |
| `subscription` | Workspace subscription tiers               |
| `superAdmin`   | Platform-level admin controls              |

---

## 👤 User Roles

| Role             | Access                                                        |
| ---------------- | ------------------------------------------------------------- |
| `super_admin`    | Platform-wide access across all workspaces                    |
| `admin`          | Full access within their workspace (fleet, agents, shipments) |
| `delivery_agent` | Read-only access to assigned vehicle and deliveries           |

---

## 📦 Shared Packages

| Package                   | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| `@repo/ui`                | Shared React component library built on shadcn/ui and Radix UI |
| `@repo/eslint-config`     | Shared ESLint configuration for all apps                       |
| `@repo/typescript-config` | Shared `tsconfig.json` base configurations                     |

---

## 🧪 Postman Collection

A Postman collection is included for API testing at `apps/backend/postman/`. Import it into Postman to test all API endpoints with pre-configured requests.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Aditya Ghamat** — [GitHub](https://github.com/AdityaGhamat)
