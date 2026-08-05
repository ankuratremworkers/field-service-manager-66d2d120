"""Engineers CRUD."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Engineer
from app.schemas import EngineerCreate, EngineerRead, EngineerUpdate

router = APIRouter(prefix="/engineers", tags=["engineers"])


@router.get("", response_model=list[EngineerRead])
def list_engineers(
    active: Optional[bool] = None,
    db: Session = Depends(get_db),
) -> list[Engineer]:
    stmt = select(Engineer).order_by(Engineer.name.asc())
    if active is not None:
        stmt = stmt.where(Engineer.active.is_(active))
    return list(db.execute(stmt).scalars().all())


@router.post("", response_model=EngineerRead, status_code=status.HTTP_201_CREATED)
def create_engineer(payload: EngineerCreate, db: Session = Depends(get_db)) -> Engineer:
    engineer = Engineer(**payload.model_dump())
    db.add(engineer)
    db.commit()
    db.refresh(engineer)
    return engineer


@router.get("/{engineer_id}", response_model=EngineerRead)
def get_engineer(engineer_id: int, db: Session = Depends(get_db)) -> Engineer:
    engineer = db.get(Engineer, engineer_id)
    if engineer is None:
        raise HTTPException(status_code=404, detail="Engineer not found")
    return engineer


@router.put("/{engineer_id}", response_model=EngineerRead)
def update_engineer(
    engineer_id: int,
    payload: EngineerUpdate,
    db: Session = Depends(get_db),
) -> Engineer:
    engineer = db.get(Engineer, engineer_id)
    if engineer is None:
        raise HTTPException(status_code=404, detail="Engineer not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(engineer, field, value)
    db.commit()
    db.refresh(engineer)
    return engineer


@router.delete("/{engineer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_engineer(engineer_id: int, db: Session = Depends(get_db)) -> Response:
    engineer = db.get(Engineer, engineer_id)
    if engineer is None:
        raise HTTPException(status_code=404, detail="Engineer not found")
    # Jobs' engineer_id will be NULLed by the FK's ON DELETE SET NULL.
    db.delete(engineer)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
