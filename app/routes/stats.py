"""Aggregate stats for the dashboard."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import JOB_STATUSES, Job

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=dict[str, int])
def stats(db: Session = Depends(get_db)) -> dict[str, int]:
    counts: dict[str, int] = {s: 0 for s in JOB_STATUSES}
    rows = db.execute(select(Job.status, func.count(Job.id)).group_by(Job.status)).all()
    for status_value, count in rows:
        counts[status_value] = int(count)
    counts["total"] = sum(counts[s] for s in JOB_STATUSES)
    return counts
