// Permission Types for Project-Level Access Control

export interface ProjectPermission {
  id: string;
  projectId: string;
  userId: string;
  
  // Role in this project
  role: 
    | 'project-owner'      // Can configure everything
    | 'approver-layer-1'   // Company owner (approves company → agency)
    | 'approver-layer-2'   // Agency owner (approves agency → client)
    | 'approver-layer-3'   // Client PM (final approval)
    | 'contributor'        // Can log time only
    | 'viewer';            // Read-only
  
  // Granular permissions
  canApproveTimesheets: boolean;
  canViewRates: boolean;
  canEditContracts: boolean;
  canManageTeam: boolean;
  canGenerateInvoices: boolean;
  
  // Data scope
  scope: 'self' | 'organization' | 'project';
  organizationId?: string;  // For org-scoped approvers
  
  // Approval layer (if approver)
  approvalLayer?: 1 | 2 | 3;
  
  // Metadata
  grantedBy: string;
  grantedAt: Date;
}

export interface RateVisibilityScope {
  // What the current user can see
  canSeeRates: boolean;
  
  // If they can see rates, which ones?
  internalCost?: number;      // What they pay (upstream)
  billableToCustomer?: number; // What they charge (downstream)
  margin?: number;             // Difference
  marginPercent?: number;      // Percentage
  
  // For display
  internalLabel?: string;      // "Your cost from Acme"
  billableLabel?: string;      // "Your rate to Client"
}
