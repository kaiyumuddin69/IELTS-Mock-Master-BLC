# IELTS Mock Test Platform - Deployment Guide

This guide provides step-by-step instructions for deploying the platform on a standard hosting environment (VPS or Shared Hosting).

## 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database (or MySQL)
- Domain name with SSL (recommended)

## 2. Database Setup
The platform uses Prisma ORM. To switch from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set your `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ielts_db"
   ```
3. Run migrations:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

## 3. Environment Variables
Create a `.env` file in the root directory:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_super_secret_key
DATABASE_URL=your_database_url
```

## 4. Build the Application
Run the following command to build the frontend and prepare the server:
```bash
npm install
npm run build
```
This will generate a `dist/` folder containing the compiled React application.

## 5. Deployment Options

### Option A: VPS (Recommended)
Use a process manager like `pm2` to keep the server running:
```bash
npm install -g pm2
pm2 start server.ts --name ielts-platform --interpreter tsx
```
Configure Nginx as a reverse proxy to forward traffic from port 80/443 to port 3000.

### Option B: Shared Hosting (cPanel)
1. Use the "Setup Node.js App" tool in cPanel.
2. Set the Application startup file to `server.ts`.
3. Upload all files (excluding `node_modules`).
4. Run `npm install` and `npm run build` via the cPanel terminal or SSH.

## 6. Security Checklist
- [ ] Ensure SSL is active (HTTPS).
- [ ] Change the default `JWT_SECRET`.
- [ ] Restrict database access to `localhost` only.
- [ ] Set `NODE_ENV=production`.

## 7. Initial Data
To seed the database with initial tests and an admin user:
```bash
npx tsx seed.ts
```
Default Admin: `admin@ielts.com` / `admin123`
