// Approval Types for Multi-Layer Approval Chain
// Supports 3-layer approval: Company → Agency → Client

export interface TimesheetApproval {
  id: string;
  timesheetEntryId: string;
  
  // Approval layer
  approvalLayer: 1 | 2 | 3;  // 1=Company, 2=Agency, 3=Client
  contractId: string;         // Which contract rate is being locked
  
  // Approver info
  approverId: string;
  approverName: string;
  approverRole: 'company-owner' | 'agency-owner' | 'client-pm';
  
  // Status
  status: 'pending' | 'approved' | 'rejected';
  
  // Financial lock (immutable after approval)
  lockedRate: number;         // e.g., $60/hr
  lockedHours: number;        // e.g., 8h
  lockedAmount: number;       // e.g., $480
  
  // Audit trail
  comments?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export type TimesheetStatus = 
  | 'draft'                 // Not submitted yet
  | 'submitted'             // Waiting for Layer 1 (Company)
  | 'approved-by-company'   // Layer 1 approved, waiting for Layer 2
  | 'approved-by-agency'    // Layer 2 approved, waiting for Layer 3
  | 'approved-by-client'    // Final approval - ready for payment
  | 'rejected'              // Rejected at any layer
  | 'revisions-requested';  // Needs edits before re-submission

export interface ApprovalChainStatus {
  currentLayer: 1 | 2 | 3 | 'complete';
  layer1?: TimesheetApproval;
  layer2?: TimesheetApproval;
  layer3?: TimesheetApproval;
  isComplete: boolean;
  isRejected: boolean;
  canApprove: (userId: string) => boolean;
}
