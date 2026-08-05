/** Stats API — mock-first via dataSource.resolve. */
import type { Stats } from '../types';
import { api } from './api';
import { resolve } from './dataSource';
import { mockData } from './mockData';

export async function fetchStats(): Promise<Stats> {
  return resolve(
    () => api.get<Stats>('/api/stats').then((r) => r.data),
    mockData.endpoints['GET /api/stats'] as unknown as Stats,
  );
}
