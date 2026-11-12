# StockFlow - Inventory Management MVP

A multi-tenant SaaS inventory app. Each organization manages its own products and sees its own dashboard.

**Live demo:** [https://stockflow-inventory-ten.vercel.app]  
**Demo login:** `demo@stockflow.com` / `demo@123`

## Features
- Signup and login with organization name (JWT in httpOnly cookie)
- Product CRUD with unique SKU per organization
- Search by name or SKU, delete confirmation
- Dashboard: total products, total units, low-stock list
- Settings: default low-stock threshold

## Tech stack
Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma, PostgreSQL (Neon), Zod, bcrypt, jose. Deployed on Vercel.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `JWT_SECRET`
3. `npx prisma migrate dev`
4. `npm run dev`

## Design decisions
- **Tenant isolation:** every query is filtered by the `organizationId` stored in the signed session, never taken from user input.
- **SKU uniqueness:** enforced by a database constraint on `(organizationId, sku)`.
- **Low stock:** `quantity <= (product threshold ?? organization default)`.
- **Validation:** Zod on the server, HTML constraints on the client.

## Out of scope (per PRD)
Password reset, roles and invites, stock movement history, integrations.
