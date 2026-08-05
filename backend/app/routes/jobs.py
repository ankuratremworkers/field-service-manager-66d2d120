"""Jobs CRUD, filtering, and the grouped-by-status view."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.db import get_db
from app.models import JOB_STATUSES, Engineer, Job
from app.schemas import JobCreate, JobRead, JobStatus, JobUpdate

router = APIRouter(prefix="/jobs", tags=["jobs"])


def _to_read(job: Job) -> dict:
    """Serialise a Job for JobRead, flattening the engineer name."""
    return {
        "id": job.id,
        "reference": job.reference,
        "customer": job.customer,
        "address": job.address,
        "scheduled_for": job.scheduled_for,
        "engineer_id": job.engineer_id,
        "status": job.status,
        "notes": job.notes,
        "created_at": job.created_at,
        "updated_at": job.updated_at,
        "engineer_name": job.engineer.name if job.engineer else None,
    }


@router.get("", response_model=list[JobRead])
def list_jobs(
    search: Optional[str] = None,
    status: Optional[JobStatus] = None,
    db: Session = Depends(get_db),
) -> list[dict]:
    stmt = (
        select(Job)
        .options(selectinload(Job.engineer))
        .order_by(Job.scheduled_for.is_(None), Job.scheduled_for.asc(), Job.id.desc())
    )
    if status:
        stmt = stmt.where(Job.status == status)
    if search:
        needle = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                Job.reference.ilike(needle),
                Job.customer.ilike(needle),
                Job.address.ilike(needle),
            )
        )
    return [_to_read(j) for j in db.execute(stmt).scalars().all()]


@router.get("/grouped-by-status", response_model=dict[str, list[JobRead]])
def jobs_grouped_by_status(db: Session = Depends(get_db)) -> dict[str, list[dict]]:
    stmt = (
        select(Job)
        .options(selectinload(Job.engineer))
        .order_by(Job.scheduled_for.is_(None), Job.scheduled_for.asc(), Job.id.desc())
    )
    groups: dict[str, list[dict]] = {s: [] for s in JOB_STATUSES}
    for job in db.execute(stmt).scalars().all():
        groups.setdefault(job.status, []).append(_to_read(job))
    return groups


@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobCreate, db: Session = Depends(get_db)) -> dict:
    if payload.engineer_id is not None:
        if db.get(Engineer, payload.engineer_id) is None:
            raise HTTPException(status_code=400, detail="Assigned engineer does not exist")
    if db.execute(select(Job).where(Job.reference == payload.reference)).scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Reference already exists")
    job = Job(**payload.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    # Load the engineer relationship for the response.
    db.refresh(job, attribute_names=["engineer"])
    return _to_read(job)


@router.get("/{job_id}", response_model=JobRead)
def get_job(job_id: int, db: Session = Depends(get_db)) -> dict:
    job = db.get(Job, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return _to_read(job)


@router.put("/{job_id}", response_model=JobRead)
def update_job(job_id: int, payload: JobUpdate, db: Session = Depends(get_db)) -> dict:
    job = db.get(Job, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    data = payload.model_dump(exclude_unset=True)
    if "engineer_id" in data and data["engineer_id"] is not None:
        if db.get(Engineer, data["engineer_id"]) is None:
            raise HTTPException(status_code=400, detail="Assigned engineer does not exist")
    if "reference" in data and data["reference"] != job.reference:
        clash = db.execute(
            select(Job).where(Job.reference == data["reference"])
        ).scalar_one_or_none()
        if clash is not None:
            raise HTTPException(status_code=400, detail="Reference already exists")
    for field, value in data.items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    db.refresh(job, attribute_names=["engineer"])
    return _to_read(job)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db)) -> Response:
    job = db.get(Job, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
