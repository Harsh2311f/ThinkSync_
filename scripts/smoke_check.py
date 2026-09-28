from pathlib import Path
import py_compile

ROOT = Path(__file__).resolve().parents[1]

EXPECTED_ROUTE_SNIPPETS = {
    "app/routes/auth.py": ["/auth/login"],
    "app/routes/dashboard.py": ["/dashboard"],
    "app/routes/sections.py": ["/sections"],
    "app/routes/tasks.py": ["/tasks", "/tasks/{task_id}", "/tasks/{task_id}/status"],
    "app/routes/resources.py": ["/resources"],
    "app/routes/blocks.py": ["/blocks"],
    "app/routes/traffic.py": ["/traffic"],
    "app/routes/health_map.py": ["/health-map"],
    "app/routes/alerts.py": ["/alerts"],
    "app/routes/reports.py": ["/reports/weekly", "/reports/monthly"],
    "app/routes/optimization.py": ["/optimize", "/replan"],
    "app/routes/plans.py": ["/plans/{plan_id}"],
}

for path in ROOT.joinpath("app").rglob("*.py"):
    py_compile.compile(str(path), doraise=True)

for relative_path, snippets in EXPECTED_ROUTE_SNIPPETS.items():
    text = ROOT.joinpath(relative_path).read_text(encoding="utf-8")
    for snippet in snippets:
        if snippet not in text:
            raise RuntimeError(f"Missing route {snippet} in {relative_path}")

print("ThinkSync backend smoke check: OK")
