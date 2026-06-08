import { apiClient } from '../../../shared/api/client';
import { mockCandidates } from '../../../shared/api/mocks/Candidates';
import type { Candidate, CandidateStatus } from '@/shared/types';

// In-memory array to persist edits in mock mode
let localCandidates = [...mockCandidates] as unknown as Candidate[];

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCandidates(): Promise<Candidate[]> {
  if (useMocks) {
    await delay(300);
    return localCandidates;
  }
  const response = await apiClient.get('/entity/candidates/records');
  // Format based on standard API: { data: [...], total: N }
  return response.data.data;
}

export async function fetchCandidateById(id: string): Promise<Candidate> {
  if (useMocks) {
    await delay(300);
    const candidate = localCandidates.find((c) => c.id === id);
    if (!candidate) throw new Error('Candidate not found');
    return candidate;
  }
  const response = await apiClient.get(`/entity/candidates/records/${id}`);
  return response.data;
}

export async function updateCandidateStatusApi(
  id: string,
  newStatus: CandidateStatus
): Promise<Candidate> {
  if (useMocks) {
    await delay(300);
    const index = localCandidates.findIndex((c) => c.id === id);
    if (index !== -1) {
      localCandidates[index] = { ...localCandidates[index], status: newStatus };
      return localCandidates[index];
    }
    throw new Error('Candidate not found');
  }
  // Standard status change executing a transition workflow
  const response = await apiClient.post('/workflow/transition', {
    record_id: id,
    transition_name: newStatus,
  });
  return response.data;
}

export async function createCandidateApi(
  candidateData: Partial<Candidate>
): Promise<Candidate> {
  if (useMocks) {
    await delay(300);
    const newCandidate: Candidate = {
      id: `TG-${Date.now().toString().slice(-4)}`,
      name: candidateData.name || 'Anonymous',
      role: candidateData.role || 'Unassigned',
      department: candidateData.department || 'GEN',
      skills: candidateData.skills || [],
      location: candidateData.location || 'Remote',
      appliedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      experience: candidateData.experience || 0,
      status: 'Screening',
      ...candidateData,
    };
    localCandidates.push(newCandidate);
    return newCandidate;
  }
  const response = await apiClient.post('/entity/candidates/records', candidateData);
  return response.data;
}
