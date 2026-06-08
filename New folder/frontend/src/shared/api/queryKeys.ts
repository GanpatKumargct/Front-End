export const queryKeys = {
  candidates: (filters?: Record<string, any>) => ['candidates', filters || {}],
  candidate: (id: string) => ['candidate', id],
  jobs: (filters?: Record<string, any>) => ['jobs', filters || {}],
  job: (id: string) => ['job', id],
  requisitions: (filters?: Record<string, any>) => ['requisitions', filters || {}],
  interviews: (filters?: Record<string, any>) => ['interviews', filters || {}],
  entities: () => ['entities'],
  entity: (id: string) => ['entity', id],
  formLayout: (entityId: string) => ['formLayout', entityId],
  workflow: (recordId: string) => ['workflow', recordId],
  currentUser: () => ['currentUser'],
};
