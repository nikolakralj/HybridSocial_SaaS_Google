// Phase 5 Day 3: Global Approvals Queue API
// Cross-project approval workbench with RLS and field masking

export type ApprovalQueueItem = {
  id: string;
  objectType: 'timesheet' | 'expense';
  
  // Project context
  project: {
    id: string;
    name: string;
  };
  
  // Approval flow position
  stepOrder: number;           // 1, 2, 3, etc.
  totalSteps: number;          // e.g., 3
  policyVersion: number;       // vN pinned on this item
  
  // Current approver
  partyId: string;             // the party for this step
  partyName: string;
  
  // Timesheet data
  period: { start: string; end: string };
  person: {
    id: string;
    name: string;
    role?: string;
  };
  
  // Metrics
  hours: number;
  amount: number | null;       // null if masked
  canViewRates: boolean;
  
  // Gating
  gating: {
    blocked: boolean;
    reasons: string[];         // ["missing_tasks", "weekend_work"]
  };
  
  // SLA
  sla: {
    dueAt?: string;
    breached: boolean;
    etaHours?: number;         // estimated hours to next step
  };
  
  // Audit
  submittedAt: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type QueueFilters = {
  projects: { id: string; name: string; count: number }[];
  parties: { id: string; name: string; count: number }[];
  steps: { order: number; label: string; count: number }[];
  workTypes: { type: 'timesheet' | 'expense'; count: number }[];
};

export type ApprovalQueueResponse = {
  items: ApprovalQueueItem[];
  total: number;
  filters: QueueFilters;
};

/**
 * Get cross-project approval queue
 */
export async function getApprovalQueue(params?: {
  projectId?: string;
  partyId?: string;
  step?: number;
  workType?: 'timesheet' | 'expense';
  sla?: 'breach' | 'soon' | 'all';
  status?: 'pending' | 'approved' | 'rejected';
  limit?: number;
  offset?: number;
}): Promise<ApprovalQueueResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.projectId) queryParams.set('projectId', params.projectId);
    if (params?.partyId) queryParams.set('partyId', params.partyId);
    if (params?.step) queryParams.set('step', params.step.toString());
    if (params?.workType) queryParams.set('workType', params.workType);
    if (params?.sla) queryParams.set('sla', params.sla);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.offset) queryParams.set('offset', params.offset.toString());

    const response = await fetch(`/api/approvals/queue?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch approval queue: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching approval queue:', error);
    throw error;
  }
}

/**
 * Approve an item
 */
export async function approveItem(
  itemId: string,
  data: {
    approvedBy: string;
    notes?: string;
  }
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/approvals/${itemId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to approve item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error approving item:', error);
    throw error;
  }
}

/**
 * Reject an item
 */
export async function rejectItem(
  itemId: string,
  data: {
    rejectedBy: string;
    reason: string;
  }
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/approvals/${itemId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to reject item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error rejecting item:', error);
    throw error;
  }
}

/**
 * Bulk approve items
 */
export async function bulkApproveItems(
  data: {
    approvedBy: string;
    itemIds: string[];
    threshold?: number;
  }
): Promise<{ success: boolean; approved: number; failed: string[] }> {
  try {
    const response = await fetch('/api/approvals/bulk-approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to bulk approve: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error bulk approving items:', error);
    throw error;
  }
}

/**
 * MOCK IMPLEMENTATION FOR DAY 3
 */

let mockQueueItems: ApprovalQueueItem[] = [];
let mockNextId = 1;

// Generate mock data on first call
function ensureMockData() {
  if (mockQueueItems.length > 0) return;

  const projects = [
    { id: 'project-1', name: 'Mobile App Redesign' },
    { id: 'project-2', name: 'E-commerce Platform' },
    { id: 'project-3', name: 'API Integration' },
    { id: 'project-4', name: 'Marketing Site' },
  ];

  const people = [
    { id: 'person-1', name: 'Jane Doe', role: 'Senior Developer' },
    { id: 'person-2', name: 'Mike Chen', role: 'UI Designer' },
    { id: 'person-3', name: 'Alex Lee', role: 'Backend Engineer' },
    { id: 'person-4', name: 'Sarah Johnson', role: 'Full Stack Developer' },
    { id: 'person-5', name: 'David Kim', role: 'DevOps Engineer' },
  ];

  const parties = [
    { id: 'techcorp', name: 'TechCorp' },
    { id: 'design-agency', name: 'Design Agency' },
    { id: 'client-co', name: 'Client Co' },
  ];

  // Generate 18 pending approvals across projects
  let itemCount = 0;
  projects.forEach((project, pIdx) => {
    people.slice(0, 3 + pIdx).forEach((person, personIdx) => {
      const now = Date.now();
      const daysAgo = Math.floor(Math.random() * 5);
      const submittedAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      
      const stepOrder = 2; // Current step
      const totalSteps = 3;
      const party = parties[Math.floor(Math.random() * parties.length)];
      
      const hours = 35 + Math.floor(Math.random() * 10);
      const rate = 100 + Math.floor(Math.random() * 100);
      const canViewRates = Math.random() > 0.3; // 70% can view rates
      const amount = canViewRates ? hours * rate : null;
      
      // SLA calculation
      const hoursOld = daysAgo * 24 + Math.floor(Math.random() * 24);
      const breached = hoursOld > 48;
      const dueAt = new Date(now + (48 - hoursOld) * 60 * 60 * 1000).toISOString();
      
      mockQueueItems.push({
        id: `approval-${mockNextId++}`,
        objectType: 'timesheet',
        project,
        stepOrder,
        totalSteps,
        policyVersion: 1,
        partyId: party.id,
        partyName: party.name,
        period: {
          start: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date(now).toISOString().split('T')[0],
        },
        person,
        hours,
        amount,
        canViewRates,
        gating: {
          blocked: false,
          reasons: [],
        },
        sla: {
          dueAt,
          breached,
          etaHours: Math.floor(Math.random() * 24),
        },
        submittedAt,
        submittedBy: person.id,
        status: 'pending',
      });
      
      itemCount++;
      if (itemCount >= 18) return; // Stop at 18 items
    });
  });
}

/**
 * Mock: Get approval queue
 */
export async function getApprovalQueueMock(params?: {
  projectId?: string;
  partyId?: string;
  step?: number;
  workType?: 'timesheet' | 'expense';
  sla?: 'breach' | 'soon' | 'all';
  status?: 'pending' | 'approved' | 'rejected';
  limit?: number;
  offset?: number;
}): Promise<ApprovalQueueResponse> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  
  ensureMockData();
  
  // Apply filters
  let filtered = [...mockQueueItems];
  
  if (params?.projectId) {
    filtered = filtered.filter(item => item.project.id === params.projectId);
  }
  
  if (params?.partyId) {
    filtered = filtered.filter(item => item.partyId === params.partyId);
  }
  
  if (params?.step) {
    filtered = filtered.filter(item => item.stepOrder === params.step);
  }
  
  if (params?.workType) {
    filtered = filtered.filter(item => item.objectType === params.workType);
  }
  
  if (params?.status) {
    filtered = filtered.filter(item => item.status === params.status);
  } else {
    // Default to pending only
    filtered = filtered.filter(item => item.status === 'pending');
  }
  
  if (params?.sla) {
    if (params.sla === 'breach') {
      filtered = filtered.filter(item => item.sla.breached);
    } else if (params.sla === 'soon') {
      filtered = filtered.filter(item => !item.sla.breached && item.sla.etaHours && item.sla.etaHours < 24);
    }
  }
  
  // Sort by SLA (breached first, then by due date)
  filtered.sort((a, b) => {
    if (a.sla.breached && !b.sla.breached) return -1;
    if (!a.sla.breached && b.sla.breached) return 1;
    if (a.sla.dueAt && b.sla.dueAt) {
      return new Date(a.sla.dueAt).getTime() - new Date(b.sla.dueAt).getTime();
    }
    return 0;
  });
  
  // Pagination
  const limit = params?.limit || 50;
  const offset = params?.offset || 0;
  const paginated = filtered.slice(offset, offset + limit);
  
  // Build filters from full dataset
  const allPending = mockQueueItems.filter(item => item.status === 'pending');
  
  const projectCounts = new Map<string, { id: string; name: string; count: number }>();
  allPending.forEach(item => {
    const existing = projectCounts.get(item.project.id);
    if (existing) {
      existing.count++;
    } else {
      projectCounts.set(item.project.id, { ...item.project, count: 1 });
    }
  });
  
  const partyCounts = new Map<string, { id: string; name: string; count: number }>();
  allPending.forEach(item => {
    const existing = partyCounts.get(item.partyId);
    if (existing) {
      existing.count++;
    } else {
      partyCounts.set(item.partyId, { id: item.partyId, name: item.partyName, count: 1 });
    }
  });
  
  const stepCounts = new Map<number, { order: number; label: string; count: number }>();
  allPending.forEach(item => {
    const existing = stepCounts.get(item.stepOrder);
    if (existing) {
      existing.count++;
    } else {
      stepCounts.set(item.stepOrder, { 
        order: item.stepOrder, 
        label: `Step ${item.stepOrder} of ${item.totalSteps}`, 
        count: 1 
      });
    }
  });
  
  return {
    items: paginated,
    total: filtered.length,
    filters: {
      projects: Array.from(projectCounts.values()),
      parties: Array.from(partyCounts.values()),
      steps: Array.from(stepCounts.values()),
      workTypes: [{ type: 'timesheet', count: allPending.length }],
    },
  };
}

/**
 * Mock: Approve item
 */
export async function approveItemMock(
  itemId: string,
  data: { approvedBy: string; notes?: string }
): Promise<{ success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const item = mockQueueItems.find(i => i.id === itemId);
  if (item) {
    item.status = 'approved';
  }
  
  return { success: true };
}

/**
 * Mock: Reject item
 */
export async function rejectItemMock(
  itemId: string,
  data: { rejectedBy: string; reason: string }
): Promise<{ success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const item = mockQueueItems.find(i => i.id === itemId);
  if (item) {
    item.status = 'rejected';
  }
  
  return { success: true };
}

/**
 * Mock: Bulk approve
 */
export async function bulkApproveItemsMock(data: {
  approvedBy: string;
  itemIds: string[];
  threshold?: number;
}): Promise<{ success: boolean; approved: number; failed: string[] }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const approved: string[] = [];
  const failed: string[] = [];
  
  data.itemIds.forEach(itemId => {
    const item = mockQueueItems.find(i => i.id === itemId);
    if (item) {
      // Check threshold if provided
      if (data.threshold && item.amount && item.amount > data.threshold) {
        failed.push(itemId);
      } else {
        item.status = 'approved';
        approved.push(itemId);
      }
    } else {
      failed.push(itemId);
    }
  });
  
  return {
    success: true,
    approved: approved.length,
    failed,
  };
}
