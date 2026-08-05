"""Pydantic v2 schemas for the API boundary."""

from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

JobStatus = Literal["Scheduled", "In Progress", "Completed", "Cancelled"]


# ── Engineer ────────────────────────────────────────────────────────────────


class EngineerBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    skills: str = Field(default="", max_length=500)
    active: bool = True


class EngineerCreate(EngineerBase):
    pass


class EngineerUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    skills: Optional[str] = Field(default=None, max_length=500)
    active: Optional[bool] = None


class EngineerRead(EngineerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


# ── Job ─────────────────────────────────────────────────────────────────────


class JobBase(BaseModel):
    reference: str = Field(min_length=1, max_length=40)
    customer: str = Field(min_length=1, max_length=200)
    address: str = Field(default="", max_length=400)
    scheduled_for: Optional[datetime] = None
    engineer_id: Optional[int] = None
    status: JobStatus = "Scheduled"
    notes: str = ""


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    reference: Optional[str] = Field(default=None, min_length=1, max_length=40)
    customer: Optional[str] = Field(default=None, min_length=1, max_length=200)
    address: Optional[str] = Field(default=None, max_length=400)
    scheduled_for: Optional[datetime] = None
    engineer_id: Optional[int] = None
    status: Optional[JobStatus] = None
    notes: Optional[str] = None


class JobRead(JobBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    engineer_name: Optional[str] = None


# ── Stats ───────────────────────────────────────────────────────────────────


class StatusCounts(BaseModel):
    Scheduled: int = 0
    In_Progress: int = Field(default=0, alias="In Progress")
    Completed: int = 0
    Cancelled: int = 0
    total: int = 0

    model_config = ConfigDict(populate_by_name=True)
