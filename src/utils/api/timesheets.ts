import { projectId, publicAnonKey } from '../supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f8b491be`;

export interface TimesheetEntry {
  id: string;
  userId: string;
  companyId: string;
  date: string; // YYYY-MM-DD
  hours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  projectId?: string | null;
  notes?: string;
  taskId?: string; // Support for multi-task entries
  startTime?: string; // ✅ HH:MM format (e.g., "09:00")
  endTime?: string;   // ✅ HH:MM format (e.g., "17:30")
  breakMinutes?: number; // ✅ Break duration in minutes
  // ✅ NEW: Task metadata fields
  workType?: 'regular' | 'overtime' | 'travel' | 'oncall';
  taskCategory?: string; // e.g., "Development", "Design", "Meeting", etc.
  taskDescription?: string; // ✅ Specific task description
  billable?: boolean;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  initials: string;
  contractId?: string;
  contractRole?: string;
  contractStatus?: string;
}

// Helper to make API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
      throw new Error(error.error || error.message || `API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with more context
      throw new Error(`API call to ${endpoint} failed: ${error.message}`);
    }
    throw error;
  }
}

// Seed demo data
export async function seedDemoData() {
  return apiCall('/seed', { method: 'POST' });
}

// Get people for a company
export async function getCompanyPeople(companyId: string): Promise<User[]> {
  const data = await apiCall(`/companies/${companyId}/people`);
  return data.people || [];
}

// Get timesheet entries
export async function getTimesheetEntries(params: {
  userId?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<TimesheetEntry[]> {
  const queryParams = new URLSearchParams();
  if (params.userId) queryParams.set('userId', params.userId);
  if (params.companyId) queryParams.set('companyId', params.companyId);
  if (params.startDate) queryParams.set('startDate', params.startDate);
  if (params.endDate) queryParams.set('endDate', params.endDate);
  
  const data = await apiCall(`/timesheets?${queryParams.toString()}`);
  return data.entries || [];
}

// Create/update a single timesheet entry
export async function saveTimesheetEntry(entry: Omit<TimesheetEntry, 'id' | 'updatedAt'>) {
  const data = await apiCall('/timesheets', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
  return data.entry;
}

// Bulk save timesheet entries (for drag-copy operations)
export async function bulkSaveTimesheetEntries(entries: Omit<TimesheetEntry, 'id' | 'updatedAt'>[]) {
  const data = await apiCall('/timesheets/bulk', {
    method: 'POST',
    body: JSON.stringify({ entries }),
  });
  return data.entries;
}

// Delete a timesheet entry
export async function deleteTimesheetEntry(userId: string, date: string) {
  return apiCall(`/timesheets/${userId}/${date}`, { method: 'DELETE' });
}

// Update a timesheet entry by ID (Phase 1C)
export async function updateTimesheetEntry(entryId: string, updates: Partial<Omit<TimesheetEntry, 'id' | 'userId' | 'companyId'>>) {
  const data = await apiCall(`/timesheets/${entryId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data.entry;
}

// Delete a timesheet entry by ID (Phase 1C)
export async function deleteTimesheetEntryById(entryId: string) {
  return apiCall(`/timesheets/${entryId}`, { method: 'DELETE' });
}

// Create a new timesheet entry (Phase 1C)
export interface TimesheetEntryInput {
  userId: string;
  companyId: string;
  date: string;
  hours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  projectId?: string | null;
  notes?: string;
}

export async function createTimesheetEntry(entry: TimesheetEntryInput) {
  const data = await apiCall('/timesheets', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
  return data.entry as TimesheetEntry;
}

// Bulk apply timesheet template to multiple people
export interface BulkApplyParams {
  templatePersonId: string;
  templateDate: string; // YYYY-MM-DD
  targetPersonIds: string[];
  dateRangeType: 'day' | 'week' | 'month';
  overwriteExisting: boolean;
  companyId: string;
}

export async function bulkApplyTimesheet(params: BulkApplyParams) {
  console.log('🌐 API: Calling bulk-apply endpoint with params:', params);
  
  const data = await apiCall('/timesheets/bulk-apply', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  
  console.log('🌐 API: Received response:', data);
  
  return {
    created: data.created as number,
    skipped: data.skipped as number,
    overwritten: data.overwritten as number || 0,
    entries: data.entries as TimesheetEntry[],
  };
}