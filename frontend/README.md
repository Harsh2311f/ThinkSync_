# ThinkSync React Migration

This project is a **minimal-change React + Vite migration** of the original ThinkSync frontend.

## Migration rule

The team-written design and page engines are intentionally preserved:

- Original CSS files are preserved under `public/legacy/`.
- Original JavaScript page engines are preserved under `public/legacy/` with only the outer `DOMContentLoaded` wrapper adapted so each engine starts after its React page mounts.
- Original HTML structure/comments are converted mechanically to JSX in `src/pages/` (`class` -> `className`, `for` -> `htmlFor`, inline `style` -> React style object, and navigation `.html` links -> React route paths).
- The untouched original frontend is included under `original/` for comparison.
- No Tailwind/CSS-module/styled-components rewrite was performed.
- No variable/function/data model rename was performed inside the page engines.

## Run in VS Code

```powershell
npm install
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173/`.

## Routes

- `/` Dashboard
- `/map` Railway Health Map
- `/calendar` Block Calendar
- `/tasks` Maintenance Tasks
- `/movements` Train Movements
- `/resources` Resources
- `/optimization` Optimization
- `/reports` Reports
- `/alerts` Alerts
- `/settings` Settings

Old paths such as `/tasks.html` are also accepted for compatibility.

## Backend integration

The current page behavior/data has deliberately not been rewritten during migration. `src/services/api.js` is prepared for the FastAPI endpoints so the mock datasets can be replaced incrementally with backend/MongoDB data later.

Set the backend base URL by copying `.env.example` to `.env` if needed.


## Live FastAPI integration (submission build)

This build keeps the original ThinkSync visual/page engines but connects the operational pages to the real backend through `src/services/api.js` and `src/services/liveBridge.js`.

Local setup:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

The default backend URL is `http://localhost:8000`. For deployment, set `VITE_API_BASE_URL` to the public FastAPI URL before building the frontend.

The Optimization page calls the real `/api/optimize` endpoint and renders Plan A/B/C returned by the ML + Rules + OR-Tools CP-SAT engine. After a plan has been generated, the existing Regenerate control calls `/api/replan` for dynamic replanning.
