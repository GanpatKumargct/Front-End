import { apiClient } from '../../../shared/api/client';
import { mockRequisitions } from '../../../shared/api/mocks/Requisitions';
import type { Requisition } from '@/shared/types';

let localRequisitions = [...mockRequisitions] as unknown as Requisition[];

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchRequisitions(): Promise<Requisition[]> {
  if (useMocks) {
    await delay(300);
    return localRequisitions;
  }
  const response = await apiClient.get('/entity/job_requisitions/records');
  return response.data.data;
}

export async function createRequisitionApi(
  reqData: Partial<Requisition>
): Promise<Requisition> {
  if (useMocks) {
    await delay(300);
    const newReq: Requisition = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      title: reqData.title || 'Untitled Requisition',
      department: reqData.department || 'General',
      requester: reqData.requester || 'Default User',
      hiringManagers: reqData.hiringManagers || [],
      status: 'Draft',
      priority: reqData.priority || 'Medium',
      headcount: reqData.headcount || 1,
      employmentType: reqData.employmentType || 'Full Time',
      workModel: reqData.workModel || 'Onsite',
      location: reqData.location || 'Bengaluru',
      compensationRange: reqData.compensationRange || 'Not Specified',
      roleOverview: reqData.roleOverview || '',
      scopeOfWork: reqData.scopeOfWork || [],
      requirements: reqData.requirements || [],
      businessJustification: reqData.businessJustification || '',
      createdDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      targetHireDate: reqData.targetHireDate || '',
      experienceRange: reqData.experienceRange || '3-6 Years',
      candidateCount: 0,
      interviewCount: 0,
      selectedCount: 0,
      rejectedCount: 0,
      skills: reqData.skills || [],
      approvalStatus: 'Pending Review',
      roleType: reqData.roleType || 'New Role',
      ...reqData,
    } as Requisition;
    localRequisitions.push(newReq);
    return newReq;
  }
  const response = await apiClient.post('/entity/job_requisitions/records', reqData);
  return response.data;
}
