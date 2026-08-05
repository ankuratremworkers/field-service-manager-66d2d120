// Shared types shared between services and components.

export type JobStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export const JOB_STATUSES: JobStatus[] = [
  'Scheduled',
  'In Progress',
  'Completed',
  'Cancelled',
];

export type Engineer = {
  id: number;
  name: string;
  skills: string;
  active: boolean;
  created_at: string;
};

export type EngineerInput = {
  name: string;
  skills: string;
  active: boolean;
};

export type Job = {
  id: number;
  reference: string;
  customer: string;
  address: string;
  scheduled_for: string | null;
  engineer_id: number | null;
  status: JobStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  engineer_name: string | null;
};

export type JobInput = {
  reference: string;
  customer: string;
  address: string;
  scheduled_for: string | null;
  engineer_id: number | null;
  status: JobStatus;
  notes: string;
};

export type Stats = {
  Scheduled: number;
  'In Progress': number;
  Completed: number;
  Cancelled: number;
  total: number;
};

export type GroupedJobs = Record<JobStatus, Job[]>;
