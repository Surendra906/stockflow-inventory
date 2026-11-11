# Stockflow Inventory

Stockflow Inventory is a modern inventory management app built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## Overview

This project provides a clean starting point for tracking products, stock levels, and inventory workflows in a simple web application.

## Tech Stack

- Next.js
- React
- TypeScript
- Prisma
- Tailwind CSS

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your environment variables in a `.env` file for your database connection and app settings.

3. Run Prisma migrations or push your schema when ready:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

## Project Structure

- `app/` — application pages and UI
- `prisma/` — Prisma schema and database configuration
- `public/` — static assets
- `package.json` — scripts and dependencies

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Learn More

This project was initialized with the standard Next.js app template and customized for inventory management. For more details on the framework:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app)
