from fastapi import FastAPI
from app.routes import sections

app = FastAPI(title="ThinkSync Backend")

app.include_router(sections.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}