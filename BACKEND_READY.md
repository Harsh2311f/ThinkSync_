# ThinkSync Backend - corrected build

## Run

```powershell
cd C:\Users\harsh\ThinkSync-backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Swagger: `http://127.0.0.1:8000/docs`

## Core APIs

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/sections`
- `GET /api/tasks`
- `GET /api/tasks/{task_id}`
- `PATCH /api/tasks/{task_id}/status`
- `GET /api/resources`
- `GET /api/blocks`
- `GET /api/traffic`
- `GET /api/health-map`
- `GET /api/alerts`
- `GET /api/reports/weekly`
- `GET /api/reports/monthly`
- `POST /api/auth/login`
- `POST /api/optimize` (API boundary only; returns 501 until Module 2B is connected)
- `POST /api/replan` (API boundary only; returns 501 until Module 2B is connected)
- `GET /api/plans/{plan_id}`

`section_id` and the frontend-compatible `section` query parameter are both accepted on the main list APIs.

## Authentication

Authentication is optional and is not applied to the existing read APIs yet. To enable the demo login, copy the auth values from `.env.example` into `.env` and change the secret/password.

## Reports

If `end_date` is omitted, weekly/monthly reports use the newest Jharkhand maintenance-task timestamp in the static demo dataset. You can pass an explicit ISO datetime using `?end_date=...`.

## Module 2B

`app/ml/` remains separate. No ML or CP-SAT implementation has been added in this correction pass.
