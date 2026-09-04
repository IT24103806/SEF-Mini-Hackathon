# 🧹 CleanLK — Express.js Backend API

RESTful API service for the CleanLK waste management platform powered by Neon PostgreSQL.

The Waste Reports module also provides JSON-backed smart reporting with
priority classification, similar-report detection, and community statistics.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Set `DATABASE_URL` in `.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://neondb_owner:npg_g2xVweb8Ojmh@ep-calm-night-az2jl2m8-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3. Run Development Server
```bash
npm run dev
```

Server runs on: **`http://localhost:5000`**

---

## 📡 API Reference

### Smart Waste Reports (`/api/waste-reports`)
- **`GET /api/waste-reports`** — Search and filter reports
- **`GET /api/waste-reports/stats`** — Community impact totals
- **`GET /api/waste-reports/:id`** — View a report
- **`POST /api/waste-reports`** — Create and check for similar reports
- **`PUT /api/waste-reports/:id`** — Update a report
- **`DELETE /api/waste-reports/:id`** — Delete a report

Duplicate submissions return `409` with `code: "SIMILAR_REPORTS_FOUND"`.
Repeat the create request with `"submitAnyway": true` to confirm it.

### Health Check
- **`GET /api/health`** — Verify server status

### Waste Reports (`/api/reports`)
- **`GET /api/reports`** — List all reports (Supports `?area=`, `?status=`, `?severity=`, `?search=`)
- **`GET /api/reports/stats`** — Returns `{ total, inProgress, resolved, reported }`
- **`GET /api/reports/:id`** — Get a single report by ID
- **`POST /api/reports`** — Submit a new report (with validation)
- **`PATCH /api/reports/:id/status`** — Update status (`Reported`, `In Progress`, `Resolved`)

### Collection Schedules (`/api/schedules`)
- **`GET /api/schedules`** — List schedules (optional `?area=Colombo&wasteType=Household`)
- **`GET /api/schedules/area/:area`** — Schedules for a specific area

### Community Requests (`/api/community-requests`)
- **`GET /api/community-requests`** — List all requests (Supports `?area=`, `?status=`, `?priority=`, `?search=`)
- **`GET /api/community-requests/:id`** — Get single request
- **`POST /api/community-requests`** — Submit a new community request
- **`PUT /api/community-requests/:id`** — Update entire request details
- **`PATCH /api/community-requests/:id/status`** — Update status (`Pending`, `Under Review`, `Approved`, `Completed`)
- **`DELETE /api/community-requests/:id`** — Delete request

### Smart AI Classification (`/api/ai`)
- **`POST /api/ai/classify`** — Suggest issue type & severity from description text
