/** Engineers API — mock-first via dataSource.resolve. */
import type { Engineer, EngineerInput } from '../types';
import { api } from './api';
import { resolve } from './dataSource';
import { mockData } from './mockData';

export async function listEngineers(activeOnly = false): Promise<Engineer[]> {
  const qs = activeOnly ? '?active=true' : '';
  const mock = activeOnly
    ? mockData.endpoints['GET /api/engineers'].filter((e) => e.active)
    : mockData.endpoints['GET /api/engineers'];
  return resolve(
    () => api.get<Engineer[]>(`/api/engineers${qs}`).then((r) => r.data),
    mock as Engineer[],
  );
}

export async function createEngineer(input: EngineerInput): Promise<Engineer> {
  return api.post<Engineer>('/api/engineers', input).then((r) => r.data);
}

export async function updateEngineer(id: number, input: Partial<EngineerInput>): Promise<Engineer> {
  return api.put<Engineer>(`/api/engineers/${id}`, input).then((r) => r.data);
}

export async function deleteEngineer(id: number): Promise<void> {
  await api.delete(`/api/engineers/${id}`);
}
