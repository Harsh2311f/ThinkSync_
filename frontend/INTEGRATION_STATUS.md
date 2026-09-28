# ThinkSync Integration Status

This submission build connects the preserved React/Vite frontend to the FastAPI backend.

- Dashboard: `/api/dashboard`, `/api/sections`, `/api/traffic`
- Health Map: `/api/health-map`
- Maintenance Tasks: `/api/tasks`
- Train Movements: `/api/traffic` + `/api/sections`
- Resources: `/api/resources` + `/api/sections`
- Block Calendar: `/api/blocks`
- Alerts: `/api/alerts`
- Reports: `/api/reports/weekly`, `/api/reports/monthly`
- Optimization: `/api/optimize`
- Dynamic replanning: `/api/replan`

The legacy visual structure and CSS are intentionally preserved. If the backend is unreachable, the existing frontend datasets remain as a visual fallback rather than leaving the page blank.
