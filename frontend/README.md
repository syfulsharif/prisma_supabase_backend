# SCIC Express Shop - Frontend Client

This is the decoupled React + TypeScript + Vite frontend client application built to consume the SCIC Express Shop REST API.

## Features
- **Decoupled Architecture**: Communicates via REST API endpoints configurable via environment variables.
- **Glassmorphic Modern UI**: Built with custom Vanilla CSS design tokens, smooth micro-animations, responsive grid layout, and dark mode.
- **Complete End-to-End Functionality**:
  - JWT Authentication & Authorization (Login / Register / Profile persistence).
  - Product Catalog with Search and Category Filter.
  - Category Management & Products count.
  - Product Review Submission & Rating system.
  - Cart Management & Order Checkout.
  - Customer Order tracking & Status updates (Admin).
  - Registered Users Management & Soft Deletion (Admin).

## Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The client application will run at `http://localhost:5173`.

4. **Production Build**:
   ```bash
   npm run build
   ```

## Deployment
This decoupled frontend can be deployed independently to platforms like **Vercel**, **Netlify**, or **Cloudflare Pages**.
When deploying, set the environment variable:
`VITE_API_URL` -> URL of your deployed backend (e.g. `https://your-backend.vercel.app/api`).
