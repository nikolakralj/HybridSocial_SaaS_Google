# Option A: Production Integration Checklist

**Goal:** Replace demo data with real Supabase database integration  
**Estimated Effort:** 15-20 hours  
**Start Date:** _____________  
**Target Completion:** _____________

---

## Phase 1: Database Setup (2-3 hours)

### 1.1 Create Supabase Tables

**File:** Create migration file or use Supabase Dashboard

```sql
-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('company', 'agency', 'freelancer')),
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Contracts
CREATE TABLE project_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT CHECK (user_role IN ('individual_contributor', 'company_employee', 'agency_contractor')),
  organization_id UUID REFERENCES organizations(id),
  project_id UUID NOT NULL,
  contract_type TEXT CHECK (contract_type IN ('hourly', 'daily', 'fixed', 'custom')),
  rate DECIMAL(10,2),
  hourly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  fixed_amount DECIMAL(10,2),
  hide_rate BOOLEAN DEFAULT FALSE,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timesheet Periods (Weekly)
CREATE TABLE timesheet_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES project_contracts(id),
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_hours DECIMAL(5,2) DEFAULT 0,
  total_days DECIMAL(5,2),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  rejected_at TIMESTAMPTZ,
  rejected_by UUID,
  rejection_reason TEXT,
  contractor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timesheet Entries (Daily)
CREATE TABLE timesheet_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id UUID REFERENCES timesheet_periods(id),
  date DATE NOT NULL,
  hours DECIMAL(5,2),
  days DECIMAL(5,2),
  task_description TEXT,
  billable BOOLEAN DEFAULT TRUE,
  start_time TIME,
  end_time TIME,
  break_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approval History
CREATE TABLE approval_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id UUID REFERENCES timesheet_periods(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  actor TEXT NOT NULL,
  action TEXT CHECK (action IN ('submitted', 'approved', 'rejected', 'changes_requested')),
  comment TEXT
);

-- Attachments (PDF timesheets)
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id UUID REFERENCES timesheet_periods(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  size INTEGER -- bytes
);

-- Review Flags
CREATE TABLE review_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id UUID REFERENCES timesheet_periods(id),
  type TEXT CHECK (type IN ('warning', 'error', 'info')),
  message TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high'))
);

-- Allocated Tasks
CREATE TABLE allocated_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id UUID REFERENCES timesheet_periods(id),
  name TEXT NOT NULL,
  allocated_hours DECIMAL(5,2),
  logged_hours DECIMAL(5,2),
  status TEXT CHECK (status IN ('on_track', 'over', 'under', 'not_started'))
);
```

**Checklist:**
- [ ] All 8 tables created
- [ ] Foreign keys properly set up
- [ ] CHECK constraints added for enums
- [ ] Default values configured

### 1.2 Create Indexes

```sql
CREATE INDEX idx_contracts_org ON project_contracts(organization_id);
CREATE INDEX idx_contracts_user ON project_contracts(user_id);
CREATE INDEX idx_periods_contract ON timesheet_periods(contract_id);
CREATE INDEX idx_periods_dates ON timesheet_periods(week_start_date, week_end_date);
CREATE INDEX idx_entries_period ON timesheet_entries(period_id);
CREATE INDEX idx_entries_date ON timesheet_entries(date);
```

**Checklist:**
- [ ] Indexes created for foreign keys
- [ ] Date range indexes added
- [ ] Performance tested with large datasets

### 1.3 Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheet_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheet_entries ENABLE ROW LEVEL SECURITY;
-- ... (enable for all tables)

-- Example policy: Users can view their own contracts
CREATE POLICY "Users can view own contracts"
  ON project_contracts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Example policy: Managers can view team contracts
CREATE POLICY "Managers can view team contracts"
  ON project_contracts
  FOR SELECT
  USING (
    organization_id IN (
      SELECT org_id FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('manager', 'owner')
    )
  );

-- TODO: Define all policies based on permissions model
```

**Checklist:**
- [ ] RLS enabled on all tables
- [ ] SELECT policies defined
- [ ] INSERT policies defined
- [ ] UPDATE policies defined
- [ ] DELETE policies defined
- [ ] Policies tested with different user roles

### 1.4 Seed Test Data

**Option 1: Migrate from demo data**
```typescript
// Script to convert demo-data-multi-party.ts to SQL inserts
```

**Option 2: Manual seed via Supabase Dashboard**
- [ ] Insert 2-3 test organizations
- [ ] Insert 5-10 test contracts
- [ ] Insert 20-30 test periods
- [ ] Insert 100+ test entries

**Checklist:**
- [ ] Test data seeded
- [ ] Realistic data distribution (60% pending, 30% approved, 10% rejected)
- [ ] Multiple months of data for testing month filtering

---

## Phase 2: API Layer (4-6 hours)

### 2.1 Create Supabase Client Utilities

**File:** `/utils/api/timesheets.ts`

```typescript
import { createClient } from '@/utils/supabase/client';
import type { 
  Organization, 
  ProjectContract, 
  TimesheetPeriod,
  TimesheetEntry,
  MonthlyTimesheetView 
} from '@/types';

const supabase = createClient();

// ===== Organizations =====

export async function fetchOrganizations(): Promise<Organization[]> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Organization[];
}

// ===== Contracts =====

export async function fetchContractsByOrganization(
  organizationId: string
): Promise<ProjectContract[]> {
  const { data, error } = await supabase
    .from('project_contracts')
    .select('*')
    .eq('organization_id', organizationId)
    .order('user_name');
  
  if (error) throw error;
  return data as ProjectContract[];
}

// ===== Periods =====

export async function fetchPeriodsByContract(
  contractId: string
): Promise<TimesheetPeriod[]> {
  const { data: periods, error: periodsError } = await supabase
    .from('timesheet_periods')
    .select('*')
    .eq('contract_id', contractId)
    .order('week_start_date', { ascending: false });
  
  if (periodsError) throw periodsError;
  
  // Fetch related data for each period
  const periodsWithData = await Promise.all(
    periods.map(async (period) => {
      const [history, attachments, flags, tasks] = await Promise.all([
        fetchApprovalHistory(period.id),
        fetchAttachments(period.id),
        fetchReviewFlags(period.id),
        fetchAllocatedTasks(period.id)
      ]);
      
      return {
        ...period,
        approvalHistory: history,
        attachments: attachments,
        reviewFlags: flags,
        allocatedTasks: tasks
      };
    })
  );
  
  return periodsWithData as TimesheetPeriod[];
}

export async function fetchEntriesByPeriod(
  periodId: string
): Promise<TimesheetEntry[]> {
  const { data, error } = await supabase
    .from('timesheet_entries')
    .select('*')
    .eq('period_id', periodId)
    .order('date');
  
  if (error) throw error;
  return data as TimesheetEntry[];
}

// ===== Approval Actions =====

export async function approveTimesheet(
  periodId: string,
  approverId: string
): Promise<void> {
  const now = new Date().toISOString();
  
  // Update period status
  const { error: updateError } = await supabase
    .from('timesheet_periods')
    .update({
      status: 'approved',
      approved_at: now,
      approved_by: approverId
    })
    .eq('id', periodId);
  
  if (updateError) throw updateError;
  
  // Add to approval history
  const { error: historyError } = await supabase
    .from('approval_history')
    .insert({
      period_id: periodId,
      timestamp: now,
      actor: approverId,
      action: 'approved'
    });
  
  if (historyError) throw historyError;
}

export async function rejectTimesheet(
  periodId: string,
  approverId: string,
  reason: string
): Promise<void> {
  const now = new Date().toISOString();
  
  const { error: updateError } = await supabase
    .from('timesheet_periods')
    .update({
      status: 'rejected',
      rejected_at: now,
      rejected_by: approverId,
      rejection_reason: reason
    })
    .eq('id', periodId);
  
  if (updateError) throw updateError;
  
  const { error: historyError } = await supabase
    .from('approval_history')
    .insert({
      period_id: periodId,
      timestamp: now,
      actor: approverId,
      action: 'rejected',
      comment: reason
    });
  
  if (historyError) throw historyError;
}

export async function bulkApprove(
  periodIds: string[],
  approverId: string
): Promise<void> {
  await Promise.all(
    periodIds.map(id => approveTimesheet(id, approverId))
  );
}

// ===== Monthly Aggregation =====

export async function getMonthlyView(
  contractId: string,
  month: string // YYYY-MM format
): Promise<MonthlyTimesheetView | null> {
  const periods = await fetchPeriodsByContract(contractId);
  
  // Filter to specific month
  const monthPeriods = periods.filter(p => {
    const startDate = new Date(p.weekStartDate);
    const periodMonth = startDate.toISOString().slice(0, 7);
    return periodMonth === month;
  });
  
  if (monthPeriods.length === 0) return null;
  
  // Aggregate (use existing logic from demo-data-multi-party.ts)
  // ... aggregation logic here ...
  
  return monthlyView;
}

// ===== Helper Functions =====

async function fetchApprovalHistory(periodId: string) {
  const { data, error } = await supabase
    .from('approval_history')
    .select('*')
    .eq('period_id', periodId)
    .order('timestamp');
  
  if (error) throw error;
  return data;
}

async function fetchAttachments(periodId: string) {
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('period_id', periodId);
  
  if (error) throw error;
  return data;
}

async function fetchReviewFlags(periodId: string) {
  const { data, error } = await supabase
    .from('review_flags')
    .select('*')
    .eq('period_id', periodId);
  
  if (error) throw error;
  return data;
}

async function fetchAllocatedTasks(periodId: string) {
  const { data, error } = await supabase
    .from('allocated_tasks')
    .select('*')
    .eq('period_id', periodId);
  
  if (error) throw error;
  return data;
}
```

**Checklist:**
- [ ] All fetch functions implemented
- [ ] All mutation functions implemented
- [ ] Error handling added
- [ ] Type safety ensured
- [ ] Helper functions for related data

### 2.2 Create React Hooks

**File:** `/utils/api/timesheets-hooks.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './timesheets';
import { toast } from 'sonner';

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: api.fetchOrganizations
  });
}

export function useContractsByOrganization(organizationId: string) {
  return useQuery({
    queryKey: ['contracts', organizationId],
    queryFn: () => api.fetchContractsByOrganization(organizationId),
    enabled: !!organizationId
  });
}

export function useApproveTimesheet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ periodId, approverId }: { periodId: string; approverId: string }) =>
      api.approveTimesheet(periodId, approverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periods'] });
      toast.success('Timesheet approved successfully');
    },
    onError: (error) => {
      toast.error(`Failed to approve: ${error.message}`);
    }
  });
}

// ... more hooks
```

**Checklist:**
- [ ] React Query hooks created
- [ ] Cache invalidation configured
- [ ] Toast notifications added
- [ ] Loading states handled
- [ ] Error states handled

---

## Phase 3: Component Integration (3-4 hours)

### 3.1 Update ApprovalsV2Tab.tsx

**Before:**
```typescript
import { DEMO_ORGANIZATIONS, DEMO_CONTRACTS } from './demo-data-multi-party';
```

**After:**
```typescript
import { useOrganizations, useContracts } from '@/utils/api/timesheets-hooks';

export function ApprovalsV2Tab() {
  const { data: organizations, isLoading, error } = useOrganizations();
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;
  
  // ... rest of component
}
```

**Checklist:**
- [ ] Replace DEMO_ORGANIZATIONS with useOrganizations()
- [ ] Replace DEMO_CONTRACTS with useContracts()
- [ ] Add loading skeletons
- [ ] Add error boundaries
- [ ] Test data fetching

### 3.2 Update OrganizationGroupedTable.tsx

**Checklist:**
- [ ] Ensure props match new data structure
- [ ] Test rendering with real data
- [ ] Verify checkbox selection still works

### 3.3 Update MonthlyTimesheetDrawer.tsx

**Checklist:**
- [ ] Replace getEntriesByPeriod() with API call
- [ ] Add loading state for entries
- [ ] Ensure month filtering still works
- [ ] Test PDF attachment links (real Supabase Storage URLs)

---

## Phase 4: Real Approval Actions (2-3 hours)

### 4.1 Wire Up Approve Button

**File:** `ApprovalsV2Tab.tsx`

**Before:**
```typescript
const handleApprove = () => {
  alert('DEMO: Approved timesheet');
  handleCloseDrawer();
};
```

**After:**
```typescript
const approveMutation = useApproveTimesheet();

const handleApprove = async () => {
  if (!drawerPeriod) return;
  
  try {
    await approveMutation.mutateAsync({
      periodId: drawerPeriod.id,
      approverId: currentUser.id // Get from auth context
    });
    handleCloseDrawer();
  } catch (error) {
    // Error toast handled by hook
  }
};
```

**Checklist:**
- [ ] Get current user ID from auth context
- [ ] Replace alert() with real mutation
- [ ] Show loading state on button
- [ ] Handle success/error states
- [ ] Close drawer on success

### 4.2 Wire Up Reject Button

**Checklist:**
- [ ] Add rejection reason dialog
- [ ] Implement useRejectTimesheet() hook
- [ ] Wire up to button click
- [ ] Show loading state
- [ ] Handle success/error

### 4.3 Wire Up Bulk Actions

**Checklist:**
- [ ] Implement useBulkApprove() hook
- [ ] Wire up to "Approve Selected" button
- [ ] Show progress indicator (e.g., "Approving 5 of 12...")
- [ ] Handle partial failures gracefully
- [ ] Show summary toast (e.g., "5 approved, 2 failed")

---

## Phase 5: Testing & Validation (2-3 hours)

### 5.1 Unit Tests

**File:** Create `__tests__/timesheets-api.test.ts`

```typescript
describe('Timesheet API', () => {
  test('fetchOrganizations returns all organizations', async () => {
    const orgs = await fetchOrganizations();
    expect(orgs).toBeDefined();
    expect(orgs.length).toBeGreaterThan(0);
  });
  
  test('approveTimesheet updates status', async () => {
    await approveTimesheet('test-period-id', 'test-user-id');
    const period = await fetchPeriod('test-period-id');
    expect(period.status).toBe('approved');
  });
  
  // ... more tests
});
```

**Checklist:**
- [ ] API function tests
- [ ] React hook tests
- [ ] Component integration tests
- [ ] Edge case tests (null data, errors, etc.)

### 5.2 Manual Testing Checklist

**Approval Workflow:**
- [ ] Load approval tab without errors
- [ ] Organizations display correctly
- [ ] Filters work (org, status, role)
- [ ] Stats dashboard shows correct counts
- [ ] Checkbox selection works
- [ ] Bulk selection works (org-level + individual)
- [ ] Click row opens drawer
- [ ] Drawer shows correct monthly data
- [ ] Month filtering works (no spillover)
- [ ] PDF attachments link correctly
- [ ] Daily entries expand/collapse
- [ ] Approve button works
- [ ] Reject button works
- [ ] Bulk approve works
- [ ] Toast notifications appear
- [ ] Table refreshes after approval
- [ ] Approval history updates

**Edge Cases:**
- [ ] Empty state (no timesheets)
- [ ] Loading state shows skeletons
- [ ] Error state shows error message
- [ ] Network error handling
- [ ] Large dataset (50+ contractors)
- [ ] Bulk action on 20+ items
- [ ] Month with no entries
- [ ] Month with mixed statuses (some approved, some pending)

### 5.3 Performance Testing

**Checklist:**
- [ ] Page load time <2s
- [ ] Drawer open time <500ms
- [ ] Filter change time <200ms
- [ ] Bulk approve 20 items <5s
- [ ] No memory leaks (check React DevTools)
- [ ] Database query optimization (check Supabase logs)

---

## Phase 6: Polish & Documentation (1 hour)

### 6.1 Code Cleanup

**Checklist:**
- [ ] Remove demo-data-multi-party.ts (or mark as deprecated)
- [ ] Remove console.log() debug statements
- [ ] Add JSDoc comments to API functions
- [ ] Update component prop types
- [ ] Run ESLint and fix warnings

### 6.2 Update Documentation

**File:** `/docs/CURRENT_ARCHITECTURE.md`

**Updates:**
- [ ] Change "Demo Data" → "Supabase Database"
- [ ] Update data flow diagrams
- [ ] Add API endpoint documentation
- [ ] Add troubleshooting section for common errors
- [ ] Update "Next Steps" section

**File:** `/docs/APPROVAL_WORKFLOW.md`

**Updates:**
- [ ] Remove "(DEMO)" labels
- [ ] Add real approval action flows
- [ ] Update screenshot references

---

## Completion Criteria

### Must Have (Required for Production)
- [ ] All 8 database tables created and populated
- [ ] RLS policies configured and tested
- [ ] All API functions implemented
- [ ] All components integrated with API
- [ ] Approve/reject actions persist to database
- [ ] Loading and error states handled
- [ ] Toast notifications working
- [ ] Manual testing checklist 100% passed

### Should Have (Important but not blocking)
- [ ] Unit tests for API layer
- [ ] Integration tests for components
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Code cleanup complete

### Nice to Have (Future improvements)
- [ ] Email notifications on approval
- [ ] PDF invoice generation
- [ ] Real-time updates (Supabase Realtime)
- [ ] Advanced filtering (date ranges, amounts)
- [ ] Export to CSV functionality

---

## Rollback Plan

If production deployment fails:

1. **Immediate Rollback:**
   - Revert to demo-data-multi-party.ts
   - Comment out API calls
   - Restore demo alert() actions

2. **Investigation:**
   - Check Supabase logs for errors
   - Review RLS policy denials
   - Test API functions in isolation
   - Verify type compatibility

3. **Fix Forward:**
   - Fix identified issues
   - Test in staging environment
   - Gradual rollout (feature flag)

---

## Sign-Off

**Developer:** _______________ Date: ___________

**QA:** _______________ Date: ___________

**Product Owner:** _______________ Date: ___________

---

**Status:** 🔜 Ready to begin  
**Next Action:** Phase 1.1 - Create Supabase Tables
