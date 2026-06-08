import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import {
  fetchCandidates,
  fetchCandidateById,
  updateCandidateStatusApi,
  createCandidateApi,
} from '../api/candidates';
import { fetchJobs, createJobApi } from '../api/jobs';
import { fetchRequisitions, createRequisitionApi } from '../api/requisitions';
import { fetchInterviews, createInterviewApi } from '../api/interviews';
import type { Candidate, CandidateStatus } from '@/shared/types';

export function useCandidatesQuery() {
  return useQuery({
    queryKey: queryKeys.candidates(),
    queryFn: fetchCandidates,
  });
}

export function useCandidateQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.candidate(id),
    queryFn: () => fetchCandidateById(id),
    enabled: !!id,
  });
}

export function useUpdateCandidateStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CandidateStatus }) =>
      updateCandidateStatusApi(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidates() });
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate(variables.id) });
    },
  });
}

export function useCreateCandidateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (candidateData: Partial<Candidate>) =>
      createCandidateApi(candidateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidates() });
    },
  });
}

export function useJobsQuery() {
  return useQuery({
    queryKey: queryKeys.jobs(),
    queryFn: fetchJobs,
  });
}

export function useCreateJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobData: any) => createJobApi(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs() });
    },
  });
}

export function useRequisitionsQuery() {
  return useQuery({
    queryKey: queryKeys.requisitions(),
    queryFn: fetchRequisitions,
  });
}

export function useCreateRequisitionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reqData: any) => createRequisitionApi(reqData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requisitions() });
    },
  });
}

export function useInterviewsQuery() {
  return useQuery({
    queryKey: queryKeys.interviews(),
    queryFn: fetchInterviews,
  });
}

export function useCreateInterviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (interviewData: any) => createInterviewApi(interviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews() });
    },
  });
}
