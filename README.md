# Prisma Supabase Backend

Production-ready, scalable, and modular REST API backend developed with **Express.js**, **TypeScript**, **PostgreSQL (Supabase)**, and **Prisma ORM**.

---

## 🔗 Live Deployment & Documentation

* **Live API URL:** [https://prisma-supabase-backend.vercel.app/](https://prisma-supabase-backend.vercel.app/)
* **Live FrontEnd URL:** [https://prisma-supabase-client.vercel.app](https://prisma-supabase-client.vercel.app)
* **API Documentation:** [`server/API_DOCUMENTATION.md`](./server/API_DOCUMENTATION.md)
* **GitHub Repository:** [syfulsharif/prisma_supabase_backend](https://github.com/syfulsharif/prisma_supabase_backend)

---

## 🌟 Tech Stack & Features

* **Framework:** Express.js + TypeScript
* **Database:** PostgreSQL (Supabase)
* **ORM:** Prisma ORM
* **Authentication:** JWT (JSON Web Token) with `bcrypt` password hashing
* **Soft Delete:** Enabled on all models (`isDeleted: true`)
* **Data Validation & Enums:** Enums for `UserRole`, `ProductStatus`, and `OrderStatus`
* **Relational Design:** Mapped tables with `@@map()`, relations, cascade rules, and DB indexes `@index()`
* **Response Format:** Standardized `{ success, message, data }` format across all endpoints
* **Vercel Serverless Ready:** Native serverless function entrypoint (`api/index.ts`) and zero-config setup

---

## 📁 Project Architecture

```text
SCIC_backend_project/
│
├── server/                     # Express Application Source
│   ├── prisma/
│   │   ├── schema.prisma       # Database Models, Relations & Enums
│   │   └── seed.ts             # Database Seeding Script
│   │
│   ├── src/
│   │   ├── app.ts              # Express App & Middlewares
│   │   ├── server.ts           # HTTP Server Launcher
│   │   │
│   │   ├── middlewares/        # Auth & Error Middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── routes/             # REST Route Controllers
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── category.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── review.routes.ts
│   │   │   └── order.routes.ts
│   │   │
│   │   ├── services/           # Service & Business Logic Layer
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── category/
│   │   │   ├── product/
│   │   │   ├── review/
│   │   │   └── order/
│   │   │
│   │   └── lib/                # Database & Token Utilities
│   │       ├── prisma.ts
│   │       ├── jwt.ts
│   │       └── response.ts
│   │
│   ├── API_DOCUMENTATION.md    # Endpoint Specifications
│   ├── .env.example            # Environment variables template
│   ├── package.json            # Backend dependencies & scripts
│   ├── tsconfig.json           # TypeScript configuration
│   └── test-crud.sh            # Automated CRUD API Test Suite
│
├── api/
│   └── index.ts                # Vercel Serverless Function Handler
├── vercel.json                 # Vercel Routing & Deployment Configuration
├── package.json                # Root package.json
└── README.md                   # Project Documentation
```

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
Run from the root directory:
```bash
npm install
cd server && npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` inside `server/`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
JWT_SECRET="scic_jwt_secret_key_super_secure_2026"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="*"
```

### 3. Database Migration & Prisma Generation
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

### 5. Run Automated Test Suite
```bash
cd server
bash test-crud.sh
```

---

## ☁️ Deployment (Vercel)

This repository is pre-configured for instant Vercel deployment:
1. Import repository to Vercel.
2. Set Environment Variables: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CORS_ORIGIN`.
3. Deploy! Vercel handles serverless routing via `api/index.ts` and Prisma client generation via `"postinstall"`.
