# 🧹 CleanLK — Express.js Backend API

RESTful API service for the CleanLK waste management platform.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` (defaults to PORT 5000):
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

Server runs on: **`http://localhost:5000`**

---

## 📡 API Reference

### Health Check
- **`GET /api/health`** — Verify server status

### Waste Reports (`/api/reports`)
- **`GET /api/reports`** — List all reports.
  - Query parameters:
    - `?area=Kandy` (Filter by Area: Colombo, Kandy, Kegalle, Gampaha, Galle, Kurunegala)
    - `?status=Reported` (Filter by Status: Reported, In Progress, Resolved)
    - `?severity=High` (Filter by Severity: Low, Medium, High)
    - `?search=road` (Free-text search across title, area, description)
- **`GET /api/reports/stats`** — Returns `{ total, inProgress, resolved, reported }`
- **`GET /api/reports/:id`** — Get a single report by ID
- **`POST /api/reports`** — Submit a new report (with validation)
  ```json
  {
    "fullName": "Dinelka Perera",
    "area": "Kegalle",
    "issueType": "Illegal Dumping",
    "description": "Garbage has been dumped beside the main road.",
    "severity": "High"
  }
  ```
- **`PATCH /api/reports/:id/status`** — Update status (`Reported`, `In Progress`, `Resolved`)
  ```json
  {
    "status": "In Progress"
  }
  ```

### Collection Schedules (`/api/schedules`)
- **`GET /api/schedules`** — List schedules (optional `?area=Colombo&wasteType=Household`)
- **`GET /api/schedules/area/:area`** — Schedules for a specific area

### Smart AI Classification (`/api/ai`)
- **`POST /api/ai/classify`** — Suggest issue type & severity from description text
  ```json
  {
    "text": "Huge pile of rubbish dumped on the roadside near the canal smelling really bad"
  }
  ```
