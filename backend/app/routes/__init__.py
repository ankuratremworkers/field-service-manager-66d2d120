"""Route barrel — every router the app serves is mounted here."""

from fastapi import APIRouter

from app.routes import engineers, health, jobs, stats

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(engineers.router)
api_router.include_router(jobs.router)
api_router.include_router(stats.router)
