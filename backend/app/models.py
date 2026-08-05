"""SQLAlchemy models for engineers and jobs."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

# The four canonical statuses. Stored as human-readable strings so the
# grouped-by-status endpoint returns keys the frontend can display directly.
JOB_STATUSES: tuple[str, ...] = ("Scheduled", "In Progress", "Completed", "Cancelled")


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Engineer(Base):
    __tablename__ = "engineers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    # Comma-separated skills string — MVP-simple, editable in one text field.
    skills: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=_utcnow)

    jobs: Mapped[list["Job"]] = relationship(back_populates="engineer")


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    reference: Mapped[str] = mapped_column(String(40), nullable=False, unique=True, index=True)
    customer: Mapped[str] = mapped_column(String(200), nullable=False)
    address: Mapped[str] = mapped_column(String(400), nullable=False, default="")
    scheduled_for: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    engineer_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("engineers.id", ondelete="SET NULL"),
        nullable=True,
    )
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Scheduled")
    notes: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=_utcnow, onupdate=_utcnow
    )

    engineer: Mapped[Optional[Engineer]] = relationship(back_populates="jobs")
