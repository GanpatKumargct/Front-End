import { apiClient } from '../../../shared/api/client';
import { mockJobs } from '../../../shared/api/mocks/Jobs';

let localJobs = [...mockJobs];

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchJobs(): Promise<any[]> {
  if (useMocks) {
    await delay(300);
    return localJobs;
  }
  const response = await apiClient.get('/entity/jobs/records');
  return response.data.data;
}

export async function createJobApi(jobData: any): Promise<any> {
  if (useMocks) {
    await delay(300);
    const newJob = {
      id: `JOB-${Date.now().toString().slice(-4)}`,
      daysOpen: 0,
      candidatesCount: 0,
      status: 'open',
      ...jobData,
    };
    localJobs.push(newJob);
    return newJob;
  }
  const response = await apiClient.post('/entity/jobs/records', jobData);
  return response.data;
}
