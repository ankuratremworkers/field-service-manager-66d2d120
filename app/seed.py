"""Populate the database with a small realistic seed when empty."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Engineer, Job


def _dt(days: int, hour: int = 9, minute: int = 0) -> datetime:
    now = datetime.now(timezone.utc).replace(microsecond=0)
    base = now + timedelta(days=days)
    return base.replace(hour=hour, minute=minute, second=0)


def seed_if_empty(db: Session) -> None:
    if db.execute(select(Engineer).limit(1)).scalar_one_or_none() is not None:
        return
    if db.execute(select(Job).limit(1)).scalar_one_or_none() is not None:
        return

    engineers = [
        Engineer(name="Alex Rivera", skills="plumbing, boilers, gas safe", active=True),
        Engineer(name="Priya Shah", skills="HVAC, refrigeration, electrical", active=True),
        Engineer(name="Danny O'Neill", skills="IT installation, cabling, networking", active=True),
        Engineer(name="Marta Kowalski", skills="general maintenance, joinery", active=True),
        Engineer(name="Sam Chen", skills="electrical, EV chargers", active=False),
    ]
    db.add_all(engineers)
    db.flush()

    jobs = [
        Job(
            reference="JOB-0001",
            customer="Willow Street Café",
            address="14 Willow Street, London E1 6QL",
            scheduled_for=_dt(-3, 9, 30),
            engineer_id=engineers[0].id,
            status="Completed",
            notes="Replaced leaking mains pipe under sink.",
        ),
        Job(
            reference="JOB-0002",
            customer="Beacon Logistics",
            address="Unit 7, Beacon Industrial Park, Reading",
            scheduled_for=_dt(-1, 14, 0),
            engineer_id=engineers[1].id,
            status="In Progress",
            notes="Cold room compressor intermittent — diagnostics in progress.",
        ),
        Job(
            reference="JOB-0003",
            customer="Northgate Dental",
            address="52 Northgate, Bath BA1 5AS",
            scheduled_for=_dt(0, 10, 0),
            engineer_id=engineers[2].id,
            status="Scheduled",
            notes="Install new patient-record workstations and printer.",
        ),
        Job(
            reference="JOB-0004",
            customer="Harborough Primary School",
            address="Kettering Road, Market Harborough",
            scheduled_for=_dt(1, 8, 0),
            engineer_id=engineers[3].id,
            status="Scheduled",
            notes="Repair broken door closers in main corridor.",
        ),
        Job(
            reference="JOB-0005",
            customer="Rowan & Fig Bakery",
            address="88 Rowan Road, Bristol",
            scheduled_for=_dt(2, 11, 30),
            engineer_id=None,
            status="Scheduled",
            notes="New oven install — awaiting engineer assignment.",
        ),
        Job(
            reference="JOB-0006",
            customer="Ashcroft Estates",
            address="Site office, Ashcroft Business Park",
            scheduled_for=_dt(-7, 13, 0),
            engineer_id=engineers[1].id,
            status="Cancelled",
            notes="Customer rescheduled — new visit to be booked.",
        ),
        Job(
            reference="JOB-0007",
            customer="Meridian Legal",
            address="3rd Floor, 210 High Holborn, London",
            scheduled_for=_dt(3, 15, 0),
            engineer_id=engineers[2].id,
            status="Scheduled",
            notes="Meeting room AV refresh.",
        ),
        Job(
            reference="JOB-0008",
            customer="Peak Fitness Gym",
            address="Peak House, Sheffield S1 4RT",
            scheduled_for=_dt(-5, 7, 30),
            engineer_id=engineers[0].id,
            status="Completed",
            notes="Shower block re-plumbed — signed off.",
        ),
    ]
    db.add_all(jobs)
    db.commit()
