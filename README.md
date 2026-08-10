# SCIC / EJP-13 Backend REST API

Production-ready, scalable, and modular REST API backend developed with **Express.js**, **TypeScript**, **PostgreSQL (Supabase)**, and **Prisma ORM**.

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

---

## 📁 Project Architecture

```text
server/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── controllers/
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── category.routes.ts
│   │   ├── product.routes.ts
│   │   ├── review.routes.ts
│   │   └── order.routes.ts
│   ├── services/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── category/
│   │   ├── product/
│   │   ├── review/
│   │   └── order/
│   └── lib/
│       ├── prisma.ts
│       ├── jwt.ts
│       └── response.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and set your Supabase database credentials:
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
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

---

## 📖 API Documentation
Full API documentation with endpoints, request body schemas, and response formats is available in [`server/API_DOCUMENTATION.md`](./server/API_DOCUMENTATION.md).
