// Phase 5 Day 1-2: Policy Versioning API
// API functions for managing approval policy versions

import {
  ApprovalPolicy,
  PolicyVersionSummary,
  PolicySaveRequest,
  PolicySaveResponse,
  RebindRequest,
  RebindResult,
  PolicyRollbackRequest,
  PolicyRollbackResult,
  ActivePolicyInfo,
  PolicyComparison,
  PolicyVersionStats,
  PolicyVersionHistoryEvent,
} from '../../types/policy-versions';

/**
 * Save a new policy version
 */
export async function savePolicyVersion(
  request: PolicySaveRequest
): Promise<PolicySaveResponse> {
  try {
    const response = await fetch('/api/policies/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to save policy: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving policy version:', error);
    throw error;
  }
}

/**
 * Get all policy versions for a project
 */
export async function getPolicyVersions(
  projectId: string
): Promise<PolicyVersionSummary[]> {
  try {
    const response = await fetch(`/api/policies?projectId=${projectId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch policies: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching policy versions:', error);
    throw error;
  }
}

/**
 * Get a specific policy version by ID
 */
export async function getPolicyVersion(
  policyId: string
): Promise<ApprovalPolicy> {
  try {
    const response = await fetch(`/api/policies/${policyId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch policy: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching policy version:', error);
    throw error;
  }
}

/**
 * Get the currently active policy for a project
 */
export async function getActivePolicy(
  projectId: string
): Promise<ActivePolicyInfo | null> {
  try {
    const response = await fetch(`/api/policies/active?projectId=${projectId}`);

    if (response.status === 404) {
      return null; // No active policy
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch active policy: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching active policy:', error);
    throw error;
  }
}

/**
 * Publish a policy version (make it available for use)
 */
export async function publishPolicyVersion(
  policyId: string,
  publishedBy: string
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/policies/${policyId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publishedBy }),
    });

    if (!response.ok) {
      throw new Error(`Failed to publish policy: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error publishing policy version:', error);
    throw error;
  }
}

/**
 * Activate a policy version (make it the current version)
 */
export async function activatePolicyVersion(
  policyId: string,
  activatedBy: string
): Promise<{ success: boolean; previousVersionId?: string }> {
  try {
    const response = await fetch(`/api/policies/${policyId}/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activatedBy }),
    });

    if (!response.ok) {
      throw new Error(`Failed to activate policy: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error activating policy version:', error);
    throw error;
  }
}

/**
 * Rebind timesheets to a different policy version
 */
export async function rebindTimesheets(
  request: RebindRequest
): Promise<RebindResult> {
  try {
    const response = await fetch('/api/policies/rebind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to rebind timesheets: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error rebinding timesheets:', error);
    throw error;
  }
}

/**
 * Rollback to a previous policy version
 */
export async function rollbackPolicy(
  request: PolicyRollbackRequest
): Promise<PolicyRollbackResult> {
  try {
    const startTime = Date.now();
    
    const response = await fetch('/api/policies/rollback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to rollback policy: ${response.statusText}`);
    }

    const result = await response.json();
    const duration = Date.now() - startTime;
    
    // Verify it completed in < 1s (exit criteria)
    if (duration > 1000) {
      console.warn(`⚠️ Rollback took ${duration}ms (target: <1000ms)`);
    } else {
      console.log(`✅ Rollback completed in ${duration}ms`);
    }
    
    return { ...result, rollbackDurationMs: duration };
  } catch (error) {
    console.error('Error rolling back policy:', error);
    throw error;
  }
}

/**
 * Compare two policy versions
 */
export async function comparePolicyVersions(
  versionAId: string,
  versionBId: string
): Promise<PolicyComparison> {
  try {
    const response = await fetch(
      `/api/policies/compare?versionA=${versionAId}&versionB=${versionBId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to compare policies: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error comparing policy versions:', error);
    throw error;
  }
}

/**
 * Get usage statistics for a policy version
 */
export async function getPolicyVersionStats(
  policyId: string
): Promise<PolicyVersionStats> {
  try {
    const response = await fetch(`/api/policies/${policyId}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch policy stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching policy stats:', error);
    throw error;
  }
}

/**
 * Get version history for a policy
 */
export async function getPolicyVersionHistory(
  policyId: string
): Promise<PolicyVersionHistoryEvent[]> {
  try {
    const response = await fetch(`/api/policies/${policyId}/history`);

    if (!response.ok) {
      throw new Error(`Failed to fetch policy history: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching policy history:', error);
    throw error;
  }
}

/**
 * Delete/archive a policy version
 * Only allowed if no timesheets are using it
 */
export async function archivePolicyVersion(
  policyId: string,
  archivedBy: string,
  force: boolean = false
): Promise<{ success: boolean; blockers?: string[] }> {
  try {
    const response = await fetch(`/api/policies/${policyId}/archive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archivedBy, force }),
    });

    if (!response.ok) {
      throw new Error(`Failed to archive policy: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error archiving policy version:', error);
    throw error;
  }
}

/**
 * MOCK IMPLEMENTATIONS FOR DEVELOPMENT
 * Replace these with real API calls when backend is ready
 */

let mockPolicies: ApprovalPolicy[] = [];
let mockNextId = 1;

/**
 * Mock: Save policy version
 */
export async function savePolicyVersionMock(
  request: PolicySaveRequest
): Promise<PolicySaveResponse> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  const nextVersion = mockPolicies.filter(p => p.projectId === request.projectId).length + 1;
  
  const newPolicy: ApprovalPolicy = {
    id: `mock-policy-${mockNextId++}`,
    projectId: request.projectId,
    version: nextVersion,
    versionName: request.versionName,
    compiledJson: request.compiledJson,
    graphSnapshot: request.graphSnapshot,
    isActive: request.activateImmediately || false,
    isPublished: request.publishImmediately || false,
    createdBy: request.createdBy,
    createdAt: new Date().toISOString(),
    description: request.description,
    changeNotes: request.changeNotes,
  };

  // If activating immediately, deactivate others
  if (request.activateImmediately) {
    mockPolicies = mockPolicies.map(p => 
      p.projectId === request.projectId ? { ...p, isActive: false } : p
    );
  }

  mockPolicies.push(newPolicy);

  return {
    success: true,
    policyId: newPolicy.id,
    version: newPolicy.version,
    isPublished: newPolicy.isPublished,
    isActive: newPolicy.isActive,
  };
}

/**
 * Mock: Get policy versions
 */
export async function getPolicyVersionsMock(
  projectId: string
): Promise<PolicyVersionSummary[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  return mockPolicies
    .filter(p => p.projectId === projectId)
    .map(p => ({
      id: p.id,
      version: p.version,
      versionName: p.versionName,
      isActive: p.isActive,
      isPublished: p.isPublished,
      createdAt: p.createdAt,
      createdBy: p.createdBy,
    }))
    .sort((a, b) => b.version - a.version);
}

/**
 * Mock: Get active policy
 */
export async function getActivePolicyMock(
  projectId: string
): Promise<ActivePolicyInfo | null> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const activePolicy = mockPolicies.find(
    p => p.projectId === projectId && p.isActive
  );

  if (!activePolicy) return null;

  return {
    policyId: activePolicy.id,
    version: activePolicy.version,
    versionName: activePolicy.versionName,
    activatedAt: activePolicy.createdAt,
    activatedBy: activePolicy.createdBy,
    totalItemsUsingThisVersion: 0,
    pendingApprovalsCount: 0,
  };
}

// For development, export mock versions as default
export const dev = {
  savePolicyVersion: savePolicyVersionMock,
  getPolicyVersions: getPolicyVersionsMock,
  getActivePolicy: getActivePolicyMock,
};
