import { apiClient } from '../../../shared/api/client';
import { mockInterviews } from '../../../shared/api/mocks/Interviews';

let localInterviews = [...mockInterviews];

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchInterviews(): Promise<any[]> {
  if (useMocks) {
    await delay(300);
    return localInterviews;
  }
  const response = await apiClient.get('/entity/interviews/records');
  return response.data.data;
}

export async function createInterviewApi(interviewData: any): Promise<any> {
  if (useMocks) {
    await delay(300);
    const newInterview = {
      id: `INT-${Date.now().toString().slice(-4)}`,
      status: 'scheduled',
      ...interviewData,
    };
    localInterviews.push(newInterview);
    return newInterview;
  }
  const response = await apiClient.post('/entity/interviews/records', interviewData);
  return response.data;
}
