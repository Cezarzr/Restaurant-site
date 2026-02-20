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
- Docker + docker-compose

## Setup
1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Start database + app dependencies:
   ```bash
   docker-compose up -d db
   ```
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

Admin (session-protected):
- `/api/admin/schedule` (GET/POST/PATCH/DELETE)
- `/api/admin/blackouts` (GET/POST/DELETE)
- `/api/admin/menus/categories` (GET/POST/PATCH)
- `/api/admin/menus/items` (POST/PATCH/DELETE)
- `/api/admin/bookings` (GET/PATCH)
- `/api/admin/settings` (GET/PATCH)

## Notes
- Booking requests are always stored; conflicts only flag requests and return suggestions.
- Admin drag/drop rescheduling is enabled on the admin calendar.
- SEO includes metadata, robots, and sitemap.
