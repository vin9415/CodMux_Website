# Code Mux - Next.js Production Platform

Production-ready Next.js 15/16 full-stack migration for CoDMux (codmux.Online), backed by PostgreSQL and Prisma ORM.

## Tech Stack
- **Framework**: Next.js (App Router, Turbopack, TypeScript)
- **Database**: PostgreSQL (`psql`)
- **ORM**: Prisma 6
- **Authentication**: Email + Password with `bcryptjs` password hashing & HTTP-only JWT session cookies
- **Document Engine**: `jspdf` server-side pixel-perfect certificate rendering
- **Styling**: Tailwind CSS v4 & Lucide Icons

---

## Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your `.env` with your PostgreSQL database connection:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/codemux_db?schema=public"
JWT_SECRET="your-strong-production-jwt-secret-min-32-chars"
```

### 2. Push Prisma Schema & Seed Database
Ensure PostgreSQL is running, then run:
```bash
# Push schema to database
npm run db:push

# Seed initial admin, mentors, demo student, and certificate
npm run db:seed
```

Default credentials created by seed:
- **Admin**: `admin@codemux.in` / `Admin@123456`
- **Mentor**: `priya.mentor@codemux.in` / `Password@123`
- **Student**: `xyz@gmail.com` / `Password@123`

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Build for Production
```bash
npm run build
npm start
```

---

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Create account (Student / Parent registration)
- `POST /api/auth/login` - Email & password login, sets HTTP-only secure cookie
- `POST /api/auth/logout` - Clear session cookie
- `GET /api/auth/me` - Current authenticated user session

### Certificates & Verification
- `GET /api/certificates/verify/[serial]` - Public authenticity lookup
- `GET /api/certificates/pdf/[serial]` - Dynamic high-res PDF generation & download
- `GET /api/certificates` - List certificates (optional `?student_id=`)
- `POST /api/certificates` - Issue certificate (Admin only)
- `POST /api/certificates/revoke` - Revoke certificate (Admin only)
- `GET /api/certificates/stats` - Certificate analytics counters

### Academic Operations
- `GET /api/classes` - Class schedules by track/batch
- `POST /api/classes` - Schedule session (Admin/Mentor)
- `GET /api/attendance` - Attendance history
- `POST /api/attendance` - Mark session attendance (Mentor/Admin)
- `GET /api/projects` - Project syllabus items
- `POST /api/projects` - Create project spec
- `GET /api/projects/submissions` - View submitted deliverables
- `POST /api/projects/submissions` - Submit GitHub & Demo URLs

### CRM & Inquiries
- `POST /api/leads` - Early access waitlist enrollment
- `GET /api/leads` - Admin lead inbox
- `POST /api/inquiries` - Public contact message
- `GET /api/inquiries` - Admin inquiry inbox
