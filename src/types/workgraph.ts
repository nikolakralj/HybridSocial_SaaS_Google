/**
 * WorkGraph Core Types
 * Complete type system for the Visual WorkGraph Builder and multi-party work management
 */

// ============================================================================
// GRAPH ENTITIES (Canvas Nodes)
// ============================================================================

export type NodeType = 
  | 'party'        // Organization (Company, Agency, Client, Contractor)
  | 'team'         // Team within an organization
  | 'person'       // Individual worker
  | 'contract'     // Contract between parties
  | 'sow'          // Statement of Work
  | 'po'           // Purchase Order
  | 'budget'       // Budget allocation
  | 'milestone'    // Deliverable milestone
  | 'timesheet'    // Timesheet template
  | 'expense';     // Expense template

export type EdgeType =
  | 'approves'      // Approval relationship
  | 'owns'          // Ownership relationship
  | 'funds'         // Funding relationship
  | 'assigns'       // Assignment relationship
  | 'worksOn'       // Work relationship
  | 'billsTo'       // Billing relationship
  | 'invoices'      // Invoicing relationship
  | 'subcontracts'; // Subcontracting relationship

export type PartyType = 'client' | 'agency' | 'company' | 'contractor' | 'freelancer';

// ============================================================================
// GRAPH NODES
// ============================================================================

export interface BaseNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: any; // Specific to node type
  selected?: boolean;
  draggable?: boolean;
}

export interface PartyNodeData {
  name: string;
  partyType: PartyType;
  organizationId?: string; // Link to actual organization
  logo?: string;
  color?: string;
}

export interface PersonNodeData {
  name: string;
  email: string;
  role: string;
  partyId: string; // Which party they belong to
  userId?: string; // Link to actual user
  avatar?: string;
}

export interface ContractNodeData {
  name: string;
  contractType: 'hourly' | 'daily' | 'fixed' | 'custom';
  hourlyRate?: number;
  dailyRate?: number;
  fixedAmount?: number;
  currency: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  
  // Contract Parties (who signed this contract)
  parties: {
    partyA: string; // Party ID (e.g., DevShop Inc)
    partyB: string; // Party ID (e.g., TechStaff Agency)
  };
  
  // Visibility rules
  visibility: {
    hideRateFrom: string[]; // Party IDs who should NOT see this contract's rate
    hideTermsFrom: string[]; // Party IDs who should NOT see contract terms
  };
  
  // Optional: Weekly/Monthly limits
  weeklyHourLimit?: number;
  monthlyHourLimit?: number;
}

export interface SOWNodeData {
  name: string;
  description: string;
  scopeOfWork: string;
  deliverables: string[];
  totalValue: number;
  currency: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'pending_signature' | 'active' | 'completed';
  documentUrl?: string;
  signedDocumentUrl?: string;
}

export interface PONodeData {
  poNumber: string;
  description: string;
  totalAmount: number;
  committedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  currency: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'approved' | 'active' | 'closed';
}

export interface BudgetNodeData {
  name: string;
  totalAllocated: number;
  spent: number;
  committed: number;
  remaining: number;
  currency: string;
  phases?: {
    name: string;
    allocated: number;
    spent: number;
  }[];
  costCenters?: {
    name: string;
    allocated: number;
    spent: number;
  }[];
}

export interface MilestoneNodeData {
  name: string;
  description: string;
  dueDate: string;
  value?: number; // For milestone billing
  status: 'not_started' | 'in_progress' | 'pending_approval' | 'accepted' | 'rejected';
  acceptanceCriteria: string[];
  deliverables: string[];
  billingTrigger: 'on_start' | 'on_completion' | 'on_acceptance';
}

// ============================================================================
// GRAPH EDGES
// ============================================================================

export interface BaseEdge {
  id: string;
  type: EdgeType;
  source: string; // Node ID
  target: string; // Node ID
  data: any; // Specific to edge type
  animated?: boolean;
  style?: any;
}

export interface ApprovesEdgeData {
  order: number; // Position in approval chain (1, 2, 3...)
  required: boolean; // Is this approval required?
  role?: string; // Which role at the party approves
  conditions?: {
    minAmount?: number;
    maxAmount?: number;
    requireAll?: boolean; // For parallel approvals
  };
}

export interface FundsEdgeData {
  amount: number;
  currency: string;
  fundingType: 'direct' | 'through_po' | 'through_budget';
  poId?: string; // If through PO
  budgetId?: string; // If through budget
}

export interface SubcontractsEdgeData {
  contractId: string;
  role: 'prime' | 'sub' | 'sub-sub';
  markup?: number; // Percentage
}

export interface BillsToEdgeData {
  billingType: 't_and_m' | 'fixed' | 'milestone' | 'retainer';
  billingFrequency: 'weekly' | 'biweekly' | 'monthly' | 'on_milestone';
  terms: string; // e.g., "Net 30"
  currency: string;
}

// ============================================================================
// COMPILED POLICIES (Output of Graph)
// ============================================================================

export interface ApprovalPolicy {
  projectId: string;
  workType: 'timesheet' | 'expense' | 'deliverable' | 'change_order' | 'invoice';
  sequential: boolean; // Must approve in order?
  steps: ApprovalStep[];
  escalation?: {
    timeoutHours: number;
    toRole?: string;
    toPartyId?: string;
    action: 'notify' | 'auto_approve' | 'reassign';
  };
  autoApprove?: {
    underAmount?: number;
    underHours?: number;
    afterDays?: number;
    forParties?: string[]; // Auto-approve for trusted parties
  };
  parallel?: {
    requireAll: boolean; // All must approve?
    requireCount?: number; // Or N of M must approve?
  };
}

export interface ApprovalStep {
  order: number;
  partyId: string;
  partyType: PartyType;
  role: string; // e.g., "Approver", "Finance", "PM"
  minAmount?: number; // Only triggered if amount >= this
  maxAmount?: number; // Only triggered if amount < this
  conditions?: {
    ifField?: string;
    operator?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
    value?: any;
  };
}

export interface VisibilityRule {
  id: string;
  projectId: string;
  scope: {
    objectType: string; // 'contract', 'invoice', 'timesheet', etc.
    field: string; // 'rate', 'terms', 'amount', etc.
  };
  policy: {
    action: 'SHOW' | 'MASK' | 'HIDE' | 'AGGREGATE';
    hiddenFrom: string[]; // Party IDs
    visibleTo?: string[]; // Party IDs (explicit allow)
    maskWith?: string; // e.g., "•••" or "Hidden"
    aggregateAs?: string; // e.g., "Total Only"
  };
  priority: number; // Higher priority wins
}

export interface CompiledProjectConfig {
  projectId: string;
  version: number;
  compiledAt: string;
  compiledBy: string;
  graph: {
    nodes: BaseNode[];
    edges: BaseEdge[];
  };
  approvalPolicies: ApprovalPolicy[];
  visibilityRules: VisibilityRule[];
  routingRules: RoutingRule[];
  notificationRules: NotificationRule[];
}

export interface RoutingRule {
  workType: 'timesheet' | 'expense' | 'invoice';
  from: string; // Party ID or role
  to: string; // Party ID or role
  conditions?: any;
}

export interface NotificationRule {
  trigger: 'submitted' | 'approved' | 'rejected' | 'escalated' | 'deadline';
  recipients: {
    partyId?: string;
    role?: string;
    email?: string;
  }[];
  template: string;
  channel: 'email' | 'in_app' | 'slack' | 'teams';
}

// ============================================================================
// PERMISSIONS & ACCESS CONTROL
// ============================================================================

export type Permission = 
  | 'view' 
  | 'edit' 
  | 'approve' 
  | 'delete' 
  | 'view_rate' 
  | 'view_terms' 
  | 'view_audit';

export interface PermissionGrant {
  id: string;
  projectId: string;
  subjectType: 'party' | 'role' | 'user';
  subjectId: string;
  objectType: string; // 'timesheet', 'contract', etc.
  objectId?: string; // Specific object or null for all
  permissions: Permission[];
  conditions?: {
    field?: string;
    operator?: string;
    value?: any;
  }[];
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
}

export interface AccessContext {
  userId: string;
  parties: {
    partyId: string;
    partyType: PartyType;
    roles: string[];
  }[];
  projectId?: string;
  effectivePermissions: Permission[];
}

// ============================================================================
// WORK OBJECTS (State Machines)
// ============================================================================

export type WorkObjectStatus = 
  | 'draft'
  | 'submitted'
  | 'pending_approval'
  | 'approved_level_1'
  | 'approved_level_2'
  | 'approved_level_3'
  | 'approved'
  | 'rejected'
  | 'changes_requested'
  | 'withdrawn'
  | 'posted'
  | 'billed'
  | 'paid';

export interface WorkObjectBase {
  id: string;
  projectId: string;
  type: 'timesheet' | 'expense' | 'deliverable' | 'change_order' | 'invoice';
  status: WorkObjectStatus;
  submittedBy: string; // User ID
  submittedAt?: string;
  currentApprovalStep?: number;
  approvalHistory: ApprovalAction[];
  metadata: Record<string, any>;
}

export interface ApprovalAction {
  id: string;
  workObjectId: string;
  workObjectType: string;
  step: number;
  actorId: string; // User ID
  actorPartyId: string; // Party ID
  action: 'approve' | 'reject' | 'request_changes' | 'withdraw' | 'escalate';
  reason?: string;
  timestamp: string;
  ipAddress?: string;
  onBehalfOf?: string; // If delegated
}

// ============================================================================
// AUDIT & COMPLIANCE
// ============================================================================

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  partyId: string;
  projectId: string;
  action: string; // 'viewed', 'edited', 'approved', 'downloaded', etc.
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface ComplianceItem {
  id: string;
  type: 'document' | 'certification' | 'check' | 'training';
  name: string;
  description: string;
  required: boolean;
  status: 'not_started' | 'in_progress' | 'pending_review' | 'approved' | 'expired' | 'rejected';
  dueDate?: string;
  expiresAt?: string;
  documentUrl?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

// ============================================================================
// VALIDATION & ERRORS
// ============================================================================

export interface ValidationError {
  nodeId?: string;
  edgeId?: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  suggestion?: string;
}

export type ValidationErrorCode =
  | 'CYCLE_DETECTED'
  | 'MISSING_APPROVER'
  | 'ORPHAN_NODE'
  | 'DISCONNECTED_GRAPH'
  | 'INVALID_EDGE'
  | 'RATE_VISIBILITY_CONFLICT'
  | 'DUPLICATE_STEP'
  | 'INVALID_PARTY_TYPE';

// ============================================================================
// CANVAS STATE & TEMPLATES
// ============================================================================

export interface CanvasState {
  projectId: string;
  nodes: BaseNode[];
  edges: BaseEdge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  selectedNodes: string[];
  selectedEdges: string[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'staff_aug' | 'sow_milestone' | 'managed_service' | 'consulting' | 'custom';
  previewImage?: string;
  defaultNodes: BaseNode[];
  defaultEdges: BaseEdge[];
  instructions: string[];
}

// ============================================================================
// QUERY & FILTER TYPES
// ============================================================================

export interface ProjectFilter {
  status?: ('active' | 'archived' | 'draft')[];
  partyIds?: string[];
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  hasApprovalsPending?: boolean;
}

export interface WorkQueueFilter {
  workTypes?: ('timesheet' | 'expense' | 'invoice' | 'deliverable')[];
  statuses?: WorkObjectStatus[];
  assignedToMe?: boolean;
  partyId?: string;
  projectId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  BaseNode,
  BaseEdge,
  PartyNodeData,
  PersonNodeData,
  ContractNodeData,
  SOWNodeData,
  PONodeData,
  BudgetNodeData,
  MilestoneNodeData,
  ApprovesEdgeData,
  FundsEdgeData,
  SubcontractsEdgeData,
  BillsToEdgeData,
};
