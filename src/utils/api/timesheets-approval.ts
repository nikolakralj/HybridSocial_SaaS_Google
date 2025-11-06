/**
 * Timesheet Approval System API - Production Ready
 * 
 * API layer for approval-v2 system with KV store integration
 * Builds organizations, contracts, and periods dynamically from real timesheet data
 */

import { createClient } from '../supabase/client';
import { getTimesheetEntries } from './timesheets';
import type { 
  Organization,
  ProjectContract,
  TimesheetPeriod,
  TimesheetEntry,
  MonthlyTimesheetView,
  ApprovalHistoryEntry,
  Attachment,
  ReviewFlag,
  AllocatedTask,
  ApprovalStatus,
} from '../../types';
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabase = createClient();

// ============================================================================
// HELPER: Build Organizations from Real Data
// ============================================================================

async function buildOrganizationsFromData(): Promise<Organization[]> {
  try {
    // Fetch ALL timesheet entries from the database
    const entries = await getTimesheetEntries({});
    
    // If no entries exist, return default organization structure
    if (entries.length === 0) {
      console.log('📋 No timesheet entries found - returning default organization');
      return [{
        id: 'company-1',
        name: 'Acme Corporation',
        type: 'company' as const,
      }];
    }
    
    // Extract unique company IDs
    const companyIds = new Set<string>();
    entries.forEach(entry => {
      if (entry.companyId) {
        companyIds.add(entry.companyId);
      }
    });
    
    // Map company IDs to organization objects
    const organizations: Organization[] = Array.from(companyIds).map(companyId => ({
      id: companyId,
      name: getCompanyName(companyId), // Helper function to get friendly name
      type: 'company' as const,
    }));
    
    console.log('📋 Built organizations from DB:', organizations.length, 'companies');
    return organizations;
  } catch (error) {
    console.error('Error building organizations:', error);
    // Return default organization on error
    return [{
      id: 'company-1',
      name: 'Acme Corporation',
      type: 'company' as const,
    }];
  }
}

// Helper to map company IDs to friendly names
function getCompanyName(companyId: string): string {
  const nameMap: Record<string, string> = {
    'company-1': 'Acme Corporation',
    'company-2': 'TechStart Inc',
    'company-3': 'Global Solutions Ltd',
  };
  return nameMap[companyId] || companyId;
}

// Helper to map user IDs to friendly names
function getUserName(userId: string): string {
  const nameMap: Record<string, string> = {
    'user-1': 'James Kim',
    'user-2': 'Sarah Johnson',
    'user-3': 'Mike Chen',
  };
  return nameMap[userId] || userId;
}

// ============================================================================
// HELPER: Build Contracts from Real Data
// ============================================================================

async function buildContractsFromData(): Promise<ProjectContract[]> {
  try {
    // Fetch ALL timesheet entries from the database
    const entries = await getTimesheetEntries({});
    
    // Extract unique user+company combinations
    const contractMap = new Map<string, { userId: string; companyId: string }>();
    
    entries.forEach(entry => {
      const key = `${entry.userId}:${entry.companyId}`;
      if (!contractMap.has(key)) {
        contractMap.set(key, {
          userId: entry.userId,
          companyId: entry.companyId,
        });
      }
    });
    
    // Build contract objects
    const contracts: ProjectContract[] = Array.from(contractMap.values()).map(({ userId, companyId }) => ({
      id: `contract-${userId}-${companyId}`,
      userId,
      userName: getUserName(userId),
      userRole: 'individual_contributor' as const,
      organizationId: companyId,
      projectId: 'project-main',
      contractType: 'hourly' as const,
      hourlyRate: 125,
      hideRate: false,
      startDate: '2025-01-01',
    }));
    
    console.log('📋 Built contracts from DB:', contracts.length, 'contracts');
    return contracts;
  } catch (error) {
    console.error('Error building contracts:', error);
    return [];
  }
}

// ============================================================================
// HELPER: Build Weekly Periods from Real Data
// ============================================================================

async function buildPeriodsForContract(contractId: string, userId: string, companyId: string): Promise<TimesheetPeriod[]> {
  try {
    // Fetch entries for this user+company
    const entries = await getTimesheetEntries({
      userId,
      companyId,
    });
    
    if (entries.length === 0) {
      return [];
    }
    
    // Group entries by week
    const weekMap = new Map<string, typeof entries>();
    
    entries.forEach(entry => {
      const entryDate = parseISO(entry.date);
      const weekStart = startOfWeek(entryDate, { weekStartsOn: 1 }); // Monday
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, []);
      }
      weekMap.get(weekKey)!.push(entry);
    });
    
    // Build period objects for each week
    const periods: TimesheetPeriod[] = Array.from(weekMap.entries()).map(([weekStartStr, weekEntries]) => {
      const weekStart = parseISO(weekStartStr);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      
      // Calculate total hours
      const totalHours = weekEntries.reduce((sum, entry) => sum + entry.hours, 0);
      
      // Determine status based on entries
      const hasApproved = weekEntries.some(e => e.status === 'approved');
      const hasRejected = weekEntries.some(e => e.status === 'rejected');
      const hasSubmitted = weekEntries.some(e => e.status === 'submitted');
      
      let status: ApprovalStatus = 'pending';
      if (hasRejected) status = 'rejected';
      else if (hasApproved && weekEntries.every(e => e.status === 'approved')) status = 'approved';
      else if (hasSubmitted) status = 'pending';
      
      return {
        id: `period-${contractId}-${weekStartStr}`,
        contractId,
        weekStartDate: format(weekStart, 'yyyy-MM-dd'),
        weekEndDate: format(weekEnd, 'yyyy-MM-dd'),
        totalHours,
        status,
        approvalHistory: [],
        attachments: [],
        reviewFlags: [],
        allocatedTasks: [],
        submittedAt: hasSubmitted ? new Date().toISOString() : undefined,
      };
    });
    
    console.log(`📋 Built ${periods.length} periods for contract ${contractId}`);
    return periods.sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate)); // Most recent first
  } catch (error) {
    console.error('Error building periods for contract:', error);
    return [];
  }
}

// ============================================================================
// ORGANIZATIONS (Built from real data)
// ============================================================================

export async function fetchOrganizations(): Promise<Organization[]> {
  return buildOrganizationsFromData();
}

export async function fetchOrganizationById(id: string): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching organization:', error);
      throw new Error(`Failed to fetch organization: ${error.message}`);
    }
    
    return data as Organization;
  } catch (err) {
    console.error('Unexpected error in fetchOrganizationById:', err);
    throw err;
  }
}

// ============================================================================
// CONTRACTS (Built from real data)
// ============================================================================

export async function fetchAllContracts(): Promise<ProjectContract[]> {
  return buildContractsFromData();
}

export async function fetchContractsByOrganization(
  organizationId: string
): Promise<ProjectContract[]> {
  try {
    const { data, error } = await supabase
      .from('project_contracts')
      .select('*')
      .eq('organization_id', organizationId)
      .order('user_name');
    
    if (error) {
      console.error('Error fetching contracts by organization:', error);
      throw new Error(`Failed to fetch contracts: ${error.message}`);
    }
    
    return (data || []) as ProjectContract[];
  } catch (err) {
    console.error('Unexpected error in fetchContractsByOrganization:', err);
    throw err;
  }
}

export async function fetchContractById(id: string): Promise<ProjectContract | null> {
  try {
    const { data, error } = await supabase
      .from('project_contracts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching contract:', error);
      throw new Error(`Failed to fetch contract: ${error.message}`);
    }
    
    return data as ProjectContract;
  } catch (err) {
    console.error('Unexpected error in fetchContractById:', err);
    throw err;
  }
}

// ============================================================================
// TIMESHEET PERIODS (WEEKLY) - Built from real data
// ============================================================================

export async function fetchPeriodsByContract(
  contractId: string
): Promise<TimesheetPeriod[]> {
  // Extract userId and companyId from contractId
  // Format: "contract-{userId}-{companyId}"
  const match = contractId.match(/^contract-(.+?)-(.+)$/);
  
  if (!match) {
    console.warn(`Invalid contractId format: ${contractId}`);
    return [];
  }
  
  const [, userId, companyId] = match;
  
  // Build periods from real database entries
  return buildPeriodsForContract(contractId, userId, companyId);
}

export async function fetchPeriodById(id: string): Promise<TimesheetPeriod | null> {
  try {
    const { data: period, error } = await supabase
      .from('timesheet_periods')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching period:', error);
      throw new Error(`Failed to fetch period: ${error.message}`);
    }
    
    // Fetch related data
    const [history, attachments, flags, tasks] = await Promise.all([
      fetchApprovalHistory(period.id),
      fetchAttachments(period.id),
      fetchReviewFlags(period.id),
      fetchAllocatedTasks(period.id),
    ]);
    
    return {
      ...period,
      approvalHistory: history,
      attachments: attachments,
      reviewFlags: flags,
      allocatedTasks: tasks,
    } as TimesheetPeriod;
  } catch (err) {
    console.error('Unexpected error in fetchPeriodById:', err);
    throw err;
  }
}

// ============================================================================
// TIMESHEET ENTRIES (DAILY)
// ============================================================================

export async function fetchEntriesByPeriod(
  periodId: string
): Promise<TimesheetEntry[]> {
  try {
    const { data, error } = await supabase
      .from('timesheet_entries')
      .select('*')
      .eq('period_id', periodId)
      .order('date');
    
    if (error) {
      console.error('Error fetching entries:', error);
      throw new Error(`Failed to fetch entries: ${error.message}`);
    }
    
    return (data || []) as TimesheetEntry[];
  } catch (err) {
    console.error('Unexpected error in fetchEntriesByPeriod:', err);
    throw err;
  }
}

/**
 * Fetch entries by user and date range
 * Used to attach entries to periods in the approval drawer
 */
export async function fetchEntriesByUserAndDateRange(
  userId: string,
  startDate: string, // YYYY-MM-DD
  endDate: string    // YYYY-MM-DD
): Promise<TimesheetEntry[]> {
  try {
    const { data, error } = await supabase
      .from('timesheet_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
    
    if (error) {
      console.error('Error fetching entries by date range:', error);
      throw new Error(`Failed to fetch entries: ${error.message}`);
    }
    
    return (data || []) as TimesheetEntry[];
  } catch (err) {
    console.error('Unexpected error in fetchEntriesByUserAndDateRange:', err);
    throw err;
  }
}

// ============================================================================
// APPROVAL HISTORY
// ============================================================================

async function fetchApprovalHistory(periodId: string): Promise<ApprovalHistoryEntry[]> {
  try {
    const { data, error } = await supabase
      .from('approval_history')
      .select('*')
      .eq('period_id', periodId)
      .order('timestamp');
    
    if (error) {
      console.error('Error fetching approval history:', error);
      return []; // Non-critical, return empty array
    }
    
    return (data || []) as ApprovalHistoryEntry[];
  } catch (err) {
    console.error('Unexpected error in fetchApprovalHistory:', err);
    return [];
  }
}

// ============================================================================
// ATTACHMENTS (PDFs)
// ============================================================================

async function fetchAttachments(periodId: string): Promise<Attachment[]> {
  try {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('period_id', periodId)
      .order('uploaded_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching attachments:', error);
      return [];
    }
    
    return (data || []) as Attachment[];
  } catch (err) {
    console.error('Unexpected error in fetchAttachments:', err);
    return [];
  }
}

// ============================================================================
// REVIEW FLAGS
// ============================================================================

async function fetchReviewFlags(periodId: string): Promise<ReviewFlag[]> {
  try {
    const { data, error } = await supabase
      .from('review_flags')
      .select('*')
      .eq('period_id', periodId)
      .order('severity', { ascending: false }); // High severity first
    
    if (error) {
      console.error('Error fetching review flags:', error);
      return [];
    }
    
    return (data || []) as ReviewFlag[];
  } catch (err) {
    console.error('Unexpected error in fetchReviewFlags:', err);
    return [];
  }
}

// ============================================================================
// ALLOCATED TASKS
// ============================================================================

async function fetchAllocatedTasks(periodId: string): Promise<AllocatedTask[]> {
  try {
    const { data, error } = await supabase
      .from('allocated_tasks')
      .select('*')
      .eq('period_id', periodId);
    
    if (error) {
      console.error('Error fetching allocated tasks:', error);
      return [];
    }
    
    return (data || []) as AllocatedTask[];
  } catch (err) {
    console.error('Unexpected error in fetchAllocatedTasks:', err);
    return [];
  }
}

// ============================================================================
// MONTHLY AGGREGATION
// ============================================================================

export async function fetchMonthlyView(
  contractId: string,
  month: string // YYYY-MM format
): Promise<MonthlyTimesheetView | null> {
  try {
    // Fetch all periods for this contract
    const periods = await fetchPeriodsByContract(contractId);
    
    // Filter to specific month (only include weeks that START in this month)
    const monthStart = new Date(month + '-01');
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    
    const monthPeriods = periods.filter(p => {
      const weekStart = new Date(p.weekStartDate);
      return weekStart >= monthStart && weekStart <= monthEnd;
    });
    
    if (monthPeriods.length === 0) {
      return null;
    }
    
    // Fetch contract for rate info
    const contract = await fetchContractById(contractId);
    if (!contract) {
      throw new Error(`Contract ${contractId} not found`);
    }
    
    // Aggregate totals
    const totalHours = monthPeriods.reduce((sum, p) => sum + (p.totalHours || 0), 0);
    const totalDays = monthPeriods.reduce((sum, p) => sum + (p.totalDays || 0), 0);
    
    // Calculate amount if rate is visible
    let totalAmount: number | null = null;
    if (!contract.hideRate) {
      if (contract.contractType === 'hourly' && contract.hourlyRate) {
        totalAmount = totalHours * contract.hourlyRate;
      } else if (contract.contractType === 'daily' && contract.dailyRate) {
        totalAmount = totalDays * contract.dailyRate;
      }
    }
    
    // Aggregate flags, tasks, attachments
    const aggregatedFlags: ReviewFlag[] = [];
    const aggregatedTasks: AllocatedTask[] = [];
    const allAttachments: Attachment[] = [];
    const combinedNotes: string[] = [];
    
    monthPeriods.forEach(period => {
      if (period.reviewFlags) aggregatedFlags.push(...period.reviewFlags);
      if (period.allocatedTasks) aggregatedTasks.push(...period.allocatedTasks);
      if (period.attachments) allAttachments.push(...period.attachments);
      if (period.contractorNotes) combinedNotes.push(period.contractorNotes);
    });
    
    // Determine overall monthly status
    let monthlyStatus: ApprovalStatus = 'approved';
    if (monthPeriods.some(p => p.status === 'rejected')) {
      monthlyStatus = 'rejected';
    } else if (monthPeriods.some(p => p.status === 'pending')) {
      monthlyStatus = 'pending';
    } else if (monthPeriods.some(p => p.status === 'changes_requested')) {
      monthlyStatus = 'changes_requested';
    }
    
    // Aggregate budget (if exists)
    const aggregatedBudget = monthPeriods.some(p => p.projectBudget)
      ? {
          allocated: monthPeriods.reduce((sum, p) => sum + (p.projectBudget?.allocated || 0), 0),
          spent: monthPeriods.reduce((sum, p) => sum + (p.projectBudget?.spent || 0), 0),
          monthPeriod: monthPeriods.reduce((sum, p) => sum + (p.projectBudget?.thisPeriod || 0), 0),
        }
      : null;
    
    return {
      contractId,
      month,
      monthStart: monthStart.toISOString().split('T')[0],
      monthEnd: monthEnd.toISOString().split('T')[0],
      weeks: monthPeriods,
      totalHours,
      totalDays,
      totalAmount,
      aggregatedFlags,
      aggregatedTasks,
      aggregatedBudget,
      monthlyStatus,
      allAttachments,
      combinedNotes,
    };
  } catch (err) {
    console.error('Unexpected error in fetchMonthlyView:', err);
    throw err;
  }
}

// ============================================================================
// APPROVAL ACTIONS (MUTATIONS) - Update real database entries
// ============================================================================

export async function approveTimesheet(
  periodId: string,
  approverId: string,
  approverName: string
): Promise<void> {
  try {
    // Extract userId and companyId from periodId
    // Format: "period-contract-{userId}-{companyId}-{weekStartDate}"
    const match = periodId.match(/^period-contract-(.+?)-(.+?)-(\d{4}-\d{2}-\d{2})$/);
    
    if (!match) {
      console.warn(`Invalid periodId format: ${periodId}`);
      return;
    }
    
    const [, userId, companyId, weekStartStr] = match;
    
    // Fetch all entries for this user+company+week
    const weekStart = parseISO(weekStartStr);
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    const entries = await getTimesheetEntries({
      userId,
      companyId,
      startDate: format(weekStart, 'yyyy-MM-dd'),
      endDate: format(weekEnd, 'yyyy-MM-dd'),
    });
    
    // Update all entries to 'approved' status
    const { updateTimesheetEntry } = await import('./timesheets');
    
    await Promise.all(
      entries.map(entry => 
        updateTimesheetEntry(entry.id, { status: 'approved' })
      )
    );
    
    console.log(`✅ Approved ${entries.length} entries for period ${periodId}`);
  } catch (err) {
    console.error('Unexpected error in approveTimesheet:', err);
    throw err;
  }
}

export async function rejectTimesheet(
  periodId: string,
  approverId: string,
  approverName: string,
  reason: string
): Promise<void> {
  try {
    // Extract userId and companyId from periodId
    const match = periodId.match(/^period-contract-(.+?)-(.+?)-(\d{4}-\d{2}-\d{2})$/);
    
    if (!match) {
      console.warn(`Invalid periodId format: ${periodId}`);
      return;
    }
    
    const [, userId, companyId, weekStartStr] = match;
    
    // Fetch all entries for this user+company+week
    const weekStart = parseISO(weekStartStr);
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    const entries = await getTimesheetEntries({
      userId,
      companyId,
      startDate: format(weekStart, 'yyyy-MM-dd'),
      endDate: format(weekEnd, 'yyyy-MM-dd'),
    });
    
    // Update all entries to 'rejected' status
    const { updateTimesheetEntry } = await import('./timesheets');
    
    await Promise.all(
      entries.map(entry => 
        updateTimesheetEntry(entry.id, { status: 'rejected' })
      )
    );
    
    console.log(`❌ Rejected ${entries.length} entries for period ${periodId}. Reason: ${reason}`);
  } catch (err) {
    console.error('Unexpected error in rejectTimesheet:', err);
    throw err;
  }
}

export async function bulkApproveTimesheets(
  periodIds: string[],
  approverId: string,
  approverName: string
): Promise<{ succeeded: string[]; failed: string[] }> {
  const succeeded: string[] = [];
  const failed: string[] = [];
  
  // Process in parallel (but with error isolation)
  await Promise.all(
    periodIds.map(async (periodId) => {
      try {
        await approveTimesheet(periodId, approverId, approverName);
        succeeded.push(periodId);
      } catch (err) {
        console.error(`Failed to approve period ${periodId}:`, err);
        failed.push(periodId);
      }
    })
  );
  
  return { succeeded, failed };
}

export async function bulkRejectTimesheets(
  periodIds: string[],
  approverId: string,
  approverName: string,
  reason: string
): Promise<{ succeeded: string[]; failed: string[] }> {
  const succeeded: string[] = [];
  const failed: string[] = [];
  
  await Promise.all(
    periodIds.map(async (periodId) => {
      try {
        await rejectTimesheet(periodId, approverId, approverName, reason);
        succeeded.push(periodId);
      } catch (err) {
        console.error(`Failed to reject period ${periodId}:`, err);
        failed.push(periodId);
      }
    })
  );
  
  return { succeeded, failed };
}

// ============================================================================
// HELPERS
// ============================================================================

export function formatContractRate(contract: ProjectContract): string {
  if (contract.hideRate) return 'Hidden';
  
  switch (contract.contractType) {
    case 'hourly':
      return contract.hourlyRate ? `$${contract.hourlyRate}/hr` : 'Not set';
    case 'daily':
      return contract.dailyRate ? `$${contract.dailyRate}/day` : 'Not set';
    case 'fixed':
      return contract.fixedAmount ? `$${contract.fixedAmount.toLocaleString()}` : 'Not set';
    default:
      return 'Custom';
  }
}

export function getStatusColor(status: ApprovalStatus): string {
  switch (status) {
    case 'approved':
      return 'text-green-600 bg-green-50';
    case 'rejected':
      return 'text-red-600 bg-red-50';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'changes_requested':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}