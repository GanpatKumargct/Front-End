export type RequisitionStage =
  | 'Draft'
  | 'Requisition'
  | 'Under Review'
  | 'Open'
  | 'Closed';

export interface RequisitionItem {
  id: string;
  title: string;
  category: string;
  owner: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  vendor?: string;
  budget: string;
  createdDate: string;
  dueDate: string;
  status: RequisitionStage;
  description: string;
  tags: string[];
}