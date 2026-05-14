// src/services/api.js
import { departments } from '@/features/ats/data/Departments';
import { mockCandidates } from '@/features/ats/data/Candidates';

// Dummy API simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getDepartments = async () => {
  await delay(500); // Simulate network latency
  return departments;
};

export const getCandidates = async () => {
  await delay(600);
  return mockCandidates;
};

export const updateCandidateStatus = async (candidateId, status) => {
  await delay(300);
  // In a real app, you would POST/PUT to an endpoint here
  return { success: true, candidateId, status };
};
