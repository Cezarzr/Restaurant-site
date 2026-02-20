# The Local Lebanese - Full-Stack Replacement Site

Production-ready Next.js + Prisma full-stack app for live schedule, menus, booking intake, and protected admin operations.

## Stack
- Next.js App Router + TypeScript + TailwindCSS
- Next.js API routes + Zod validation
- PostgreSQL + Prisma
- NextAuth (Credentials + optional Google)
- Nodemailer SMTP notifications
- FullCalendar for public/admin calendars
- Vitest + Playwright tests

## Setup (Local)
1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Ensure PostgreSQL is running locally and update `DATABASE_URL` in `.env` if needed.
3. Install deps:
   ```bash
   npm install
   ```
4. Generate Prisma client + migrate:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
5. Seed initial data:
   ```bash
   npm run prisma:seed
   ```
6. Run app:
   ```bash
   npm run dev
   ```

## API Endpoints
Public:
- `GET /api/public/schedule`
- `GET /api/public/menus`
- `POST /api/public/bookings`
- `POST /api/public/contact`

Admin (session-protected):
- `/api/admin/schedule` (GET/POST/PATCH/DELETE)
- `/api/admin/blackouts` (GET/POST/DELETE)
- `/api/admin/menus/categories` (GET/POST/PATCH/DELETE)
- `/api/admin/menus/items` (POST/PATCH/DELETE)
- `/api/admin/bookings` (GET/PATCH)
- `/api/admin/settings` (GET/PATCH)

## What was fixed after review
- Booking form now sends valid `BookingType` values and proper labeled required fields.
- Contact page now submits to a real backend endpoint and sends email when SMTP is configured.
- Admin bookings page now supports confirm/decline/mark-contacted actions from the UI.
- Admin settings page now supports editing and saving.
- Admin menus page now supports basic category/item creation and item availability toggling.
- Settings and schedule admin APIs were hardened for missing records/IDs.
