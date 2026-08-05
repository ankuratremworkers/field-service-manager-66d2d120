// Realistic mocks for the Preview tab, matching the real API shape.
// Statuses and timestamps mirror what the FastAPI backend actually returns.

const now = new Date();
const iso = (daysOffset: number, hour: number, minute = 0): string => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const engineers = [
  {
    id: 1,
    name: 'Alex Rivera',
    skills: 'plumbing, boilers, gas safe',
    active: true,
    created_at: iso(-30, 9),
  },
  {
    id: 2,
    name: 'Priya Shah',
    skills: 'HVAC, refrigeration, electrical',
    active: true,
    created_at: iso(-25, 9),
  },
  {
    id: 3,
    name: "Danny O'Neill",
    skills: 'IT installation, cabling, networking',
    active: true,
    created_at: iso(-20, 9),
  },
  {
    id: 4,
    name: 'Marta Kowalski',
    skills: 'general maintenance, joinery',
    active: true,
    created_at: iso(-15, 9),
  },
  {
    id: 5,
    name: 'Sam Chen',
    skills: 'electrical, EV chargers',
    active: false,
    created_at: iso(-40, 9),
  },
];

type MockJob = {
  id: number;
  reference: string;
  customer: string;
  address: string;
  scheduled_for: string | null;
  engineer_id: number | null;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
  engineer_name: string | null;
};

const jobs: MockJob[] = [
  {
    id: 1,
    reference: 'JOB-0001',
    customer: 'Willow Street Café',
    address: '14 Willow Street, London E1 6QL',
    scheduled_for: iso(-3, 9, 30),
    engineer_id: 1,
    status: 'Completed',
    notes: 'Replaced leaking mains pipe under sink.',
    created_at: iso(-10, 8),
    updated_at: iso(-3, 12),
    engineer_name: 'Alex Rivera',
  },
  {
    id: 2,
    reference: 'JOB-0002',
    customer: 'Beacon Logistics',
    address: 'Unit 7, Beacon Industrial Park, Reading',
    scheduled_for: iso(-1, 14),
    engineer_id: 2,
    status: 'In Progress',
    notes: 'Cold room compressor intermittent — diagnostics in progress.',
    created_at: iso(-6, 10),
    updated_at: iso(-1, 15),
    engineer_name: 'Priya Shah',
  },
  {
    id: 3,
    reference: 'JOB-0003',
    customer: 'Northgate Dental',
    address: '52 Northgate, Bath BA1 5AS',
    scheduled_for: iso(0, 10),
    engineer_id: 3,
    status: 'Scheduled',
    notes: 'Install new patient-record workstations and printer.',
    created_at: iso(-4, 11),
    updated_at: iso(-4, 11),
    engineer_name: "Danny O'Neill",
  },
  {
    id: 4,
    reference: 'JOB-0004',
    customer: 'Harborough Primary School',
    address: 'Kettering Road, Market Harborough',
    scheduled_for: iso(1, 8),
    engineer_id: 4,
    status: 'Scheduled',
    notes: 'Repair broken door closers in main corridor.',
    created_at: iso(-2, 9),
    updated_at: iso(-2, 9),
    engineer_name: 'Marta Kowalski',
  },
  {
    id: 5,
    reference: 'JOB-0005',
    customer: 'Rowan & Fig Bakery',
    address: '88 Rowan Road, Bristol',
    scheduled_for: iso(2, 11, 30),
    engineer_id: null,
    status: 'Scheduled',
    notes: 'New oven install — awaiting engineer assignment.',
    created_at: iso(-1, 16),
    updated_at: iso(-1, 16),
    engineer_name: null,
  },
  {
    id: 6,
    reference: 'JOB-0006',
    customer: 'Ashcroft Estates',
    address: 'Site office, Ashcroft Business Park',
    scheduled_for: iso(-7, 13),
    engineer_id: 2,
    status: 'Cancelled',
    notes: 'Customer rescheduled — new visit to be booked.',
    created_at: iso(-14, 10),
    updated_at: iso(-7, 14),
    engineer_name: 'Priya Shah',
  },
  {
    id: 7,
    reference: 'JOB-0007',
    customer: 'Meridian Legal',
    address: '3rd Floor, 210 High Holborn, London',
    scheduled_for: iso(3, 15),
    engineer_id: 3,
    status: 'Scheduled',
    notes: 'Meeting room AV refresh.',
    created_at: iso(-2, 14),
    updated_at: iso(-2, 14),
    engineer_name: "Danny O'Neill",
  },
  {
    id: 8,
    reference: 'JOB-0008',
    customer: 'Peak Fitness Gym',
    address: 'Peak House, Sheffield S1 4RT',
    scheduled_for: iso(-5, 7, 30),
    engineer_id: 1,
    status: 'Completed',
    notes: 'Shower block re-plumbed — signed off.',
    created_at: iso(-12, 9),
    updated_at: iso(-5, 12),
    engineer_name: 'Alex Rivera',
  },
];

const grouped: Record<MockJob['status'], MockJob[]> = {
  Scheduled: jobs.filter((j) => j.status === 'Scheduled'),
  'In Progress': jobs.filter((j) => j.status === 'In Progress'),
  Completed: jobs.filter((j) => j.status === 'Completed'),
  Cancelled: jobs.filter((j) => j.status === 'Cancelled'),
};

const stats = {
  Scheduled: grouped.Scheduled.length,
  'In Progress': grouped['In Progress'].length,
  Completed: grouped.Completed.length,
  Cancelled: grouped.Cancelled.length,
  total: jobs.length,
};

export const mockData = {
  endpoints: {
    'GET /api/engineers': engineers,
    'GET /api/jobs': jobs,
    'GET /api/jobs/grouped-by-status': grouped,
    'GET /api/stats': stats,
  },
} as const;

export type MockData = typeof mockData;
