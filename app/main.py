from contextlib import asynccontextmanager
import os

from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware

from app.database import client, ping_database
from app.routes import (
    alerts,
    auth,
    blocks,
    dashboard,
    health_map,
    optimization,
    plans,
    reports,
    resources,
    sections,
    tasks,
    traffic,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        yield
    finally:
        await client.close()


app = FastAPI(
    title="ThinkSync Backend",
    version="1.0.0",
    description="FastAPI backend for ThinkSync Railway Maintenance Planning System",
    lifespan=lifespan,
)


cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:5173",
    ).split(",")
    if origin.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(sections.router, prefix="/api", tags=["Sections"])
app.include_router(tasks.router, prefix="/api", tags=["Tasks"])
app.include_router(resources.router, prefix="/api", tags=["Resources"])
app.include_router(blocks.router, prefix="/api", tags=["Blocks"])
app.include_router(traffic.router, prefix="/api", tags=["Traffic"])
app.include_router(health_map.router, prefix="/api", tags=["Health Map"])
app.include_router(alerts.router, prefix="/api", tags=["Alerts"])
app.include_router(reports.router, prefix="/api", tags=["Reports"])
app.include_router(optimization.router, prefix="/api", tags=["Optimization"])
app.include_router(plans.router, prefix="/api", tags=["Plans"])


@app.get("/")
async def root():
    return {
        "name": "ThinkSync Backend",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/api/health")
async def health_check(response: Response):
    database_connected = await ping_database()

    if not database_connected:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return {
        "status": "ok" if database_connected else "error",
        "database": "connected" if database_connected else "disconnected",
    }
