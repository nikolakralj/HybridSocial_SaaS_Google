// Phase 5 Day 1-2: Policy Versioning Types
// Types for approval policy versioning system

import { CompiledPolicy, WorkGraphNode, WorkGraphEdge } from './workgraph';

/**
 * Approval Policy Version
 * Represents a versioned, immutable approval policy
 */
export interface ApprovalPolicy {
  id: string;
  projectId: string;
  
  // Version info
  version: number;
  versionName?: string;
  
  // Policy data
  compiledJson: CompiledPolicy;
  graphSnapshot?: GraphSnapshot;
  
  // Status
  isActive: boolean;
  isPublished: boolean;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  publishedBy?: string;
  
  // Audit
  description?: string;
  changeNotes?: string;
}

/**
 * Graph Snapshot
 * Stores the visual graph structure for rebuilding in WorkGraph builder
 */
export interface GraphSnapshot {
  nodes: WorkGraphNode[];
  edges: WorkGraphEdge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
  metadata?: {
    createdWith: string; // e.g., "WorkGraph Builder v1.0"
    lastModified: string;
    totalNodes: number;
    totalEdges: number;
  };
}

/**
 * Policy Version History Event
 * Tracks changes to policy versions
 */
export interface PolicyVersionHistoryEvent {
  id: string;
  policyId: string;
  projectId: string;
  
  // Event info
  eventType: PolicyEventType;
  
  // Actor
  performedBy: string;
  performedAt: string;
  
  // Context
  reason?: string;
  metadata?: Record<string, any>;
  
  // Impact
  affectedTimesheetsCount?: number;
  affectedApprovalsCount?: number;
}

/**
 * Policy Event Types
 */
export type PolicyEventType =
  | 'created'
  | 'published'
  | 'activated'
  | 'deactivated'
  | 'archived'
  | 'rolled_back';

/**
 * Policy Version Summary
 * Lightweight version info for lists
 */
export interface PolicyVersionSummary {
  id: string;
  version: number;
  versionName?: string;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  createdBy: string;
  
  // Usage stats
  totalTimesheets?: number;
  pendingApprovals?: number;
  approvedTimesheets?: number;
}

/**
 * Policy Comparison Result
 * Shows differences between two policy versions
 */
export interface PolicyComparison {
  oldVersion: number;
  newVersion: number;
  
  changes: {
    type: 'added' | 'removed' | 'modified';
    path: string; // JSON path like "steps[0].autoApprove"
    oldValue?: any;
    newValue?: any;
    description: string;
  }[];
  
  // Risk assessment
  breakingChanges: boolean;
  affectedInFlightItems: number;
  migrationRequired: boolean;
}

/**
 * Policy Pin Status
 * Shows which version a timesheet is pinned to
 */
export interface PolicyPinStatus {
  timesheetId: string;
  policyVersionId: string;
  version: number;
  pinnedAt: string;
  
  // Is this the current active version?
  isCurrentVersion: boolean;
  
  // Can this be rebinded?
  canRebind: boolean;
  rebindReasons?: string[];
}

/**
 * Rebind Request
 * Request to move timesheets from one policy version to another
 */
export interface RebindRequest {
  timesheetIds: string[];
  fromVersionId: string;
  toVersionId: string;
  
  // Options
  validateCompatibility: boolean;
  dryRun: boolean;
  
  // Audit
  performedBy: string;
  reason: string;
}

/**
 * Rebind Result
 * Result of a rebind operation
 */
export interface RebindResult {
  success: boolean;
  
  // Stats
  totalRequested: number;
  successfullyRebinded: number;
  failed: number;
  
  // Details
  rebindedTimesheetIds: string[];
  failedTimesheetIds: string[];
  errors?: {
    timesheetId: string;
    error: string;
  }[];
  
  // Audit
  performedAt: string;
}

/**
 * Active Policy Info
 * Information about the currently active policy
 */
export interface ActivePolicyInfo {
  policyId: string;
  version: number;
  versionName?: string;
  activatedAt: string;
  activatedBy: string;
  
  // Usage
  totalItemsUsingThisVersion: number;
  pendingApprovalsCount: number;
  
  // Preview of next version
  nextVersion?: PolicyVersionSummary;
}

/**
 * Policy Save Request
 * Request to save a new policy version
 */
export interface PolicySaveRequest {
  projectId: string;
  compiledJson: CompiledPolicy;
  graphSnapshot: GraphSnapshot;
  
  // Metadata
  versionName?: string;
  description?: string;
  changeNotes?: string;
  
  // Options
  publishImmediately?: boolean; // Publish right away?
  activateImmediately?: boolean; // Make active right away?
  
  // Audit
  createdBy: string;
}

/**
 * Policy Save Response
 */
export interface PolicySaveResponse {
  success: boolean;
  policyId: string;
  version: number;
  
  // Status
  isPublished: boolean;
  isActive: boolean;
  
  // Warnings
  warnings?: string[];
}

/**
 * Policy Rollback Request
 * Request to rollback to a previous version
 */
export interface PolicyRollbackRequest {
  projectId: string;
  targetVersionId: string;
  
  // Audit
  performedBy: string;
  reason: string;
  
  // Options
  handleInFlightItems: 'keep' | 'rebind' | 'fail';
}

/**
 * Policy Rollback Result
 */
export interface PolicyRollbackResult {
  success: boolean;
  previousVersionId: string;
  newActiveVersionId: string;
  
  // Impact
  affectedTimesheets: number;
  affectedApprovals: number;
  
  // Timing
  rollbackCompletedAt: string;
  rollbackDurationMs: number;
}

/**
 * Policy Version Badge Props
 * Props for the "Pinned to vN" badge component
 */
export interface PolicyVersionBadgeProps {
  version: number;
  versionName?: string;
  isCurrentVersion: boolean;
  onClick?: () => void;
  showRebindHint?: boolean;
}

/**
 * Version History Drawer Props
 * Props for the version history drawer
 */
export interface VersionHistoryDrawerProps {
  projectId: string;
  currentVersionId: string;
  onVersionSelect?: (versionId: string) => void;
  onCompare?: (versionA: string, versionB: string) => void;
  onRollback?: (versionId: string) => void;
}

/**
 * Rebind Wizard Props
 * Props for the one-click rebind wizard
 */
export interface RebindWizardProps {
  timesheetIds: string[];
  currentVersionId: string;
  availableVersions: PolicyVersionSummary[];
  onRebind: (request: RebindRequest) => Promise<RebindResult>;
  onCancel: () => void;
}

/**
 * Policy Version Stats
 * Statistics about policy version usage
 */
export interface PolicyVersionStats {
  versionId: string;
  version: number;
  
  // Timesheet stats
  totalTimesheets: number;
  draftTimesheets: number;
  submittedTimesheets: number;
  approvedTimesheets: number;
  rejectedTimesheets: number;
  
  // Approval stats
  pendingApprovals: number;
  avgApprovalTimeMs: number;
  
  // Date range
  firstUsedAt?: string;
  lastUsedAt?: string;
  
  // Can this version be archived?
  canArchive: boolean;
  archiveBlockers?: string[];
}
