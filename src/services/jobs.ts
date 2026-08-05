/** Jobs API — mock-first via dataSource.resolve. */
import type { GroupedJobs, Job, JobInput, JobStatus } from '../types';
import { api } from './api';
import { resolve } from './dataSource';
import { mockData } from './mockData';

export async function listJobs(opts: { search?: string; status?: JobStatus } = {}): Promise<Job[]> {
  const params = new URLSearchParams();
  if (opts.search) params.set('search', opts.search);
  if (opts.status) params.set('status', opts.status);
  const qs = params.toString() ? `?${params.toString()}` : '';

  // Mock filtering mirrors the backend logic.
  const all = mockData.endpoints['GET /api/jobs'] as unknown as Job[];
  const needle = opts.search?.toLowerCase() ?? '';
  const mock = all.filter((j) => {
    if (opts.status && j.status !== opts.status) return false;
    if (
      needle &&
      !(
        j.reference.toLowerCase().includes(needle) ||
        j.customer.toLowerCase().includes(needle) ||
        j.address.toLowerCase().includes(needle)
      )
    ) {
      return false;
    }
    return true;
  });

  return resolve(() => api.get<Job[]>(`/api/jobs${qs}`).then((r) => r.data), mock);
}

export async function listJobsGroupedByStatus(): Promise<GroupedJobs> {
  return resolve(
    () => api.get<GroupedJobs>('/api/jobs/grouped-by-status').then((r) => r.data),
    mockData.endpoints['GET /api/jobs/grouped-by-status'] as unknown as GroupedJobs,
  );
}

export async function createJob(input: JobInput): Promise<Job> {
  return api.post<Job>('/api/jobs', input).then((r) => r.data);
}

export async function updateJob(id: number, input: Partial<JobInput>): Promise<Job> {
  return api.put<Job>(`/api/jobs/${id}`, input).then((r) => r.data);
}

export async function deleteJob(id: number): Promise<void> {
  await api.delete(`/api/jobs/${id}`);
}
