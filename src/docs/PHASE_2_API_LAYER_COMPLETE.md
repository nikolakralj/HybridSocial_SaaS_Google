# Phase 2: API Layer - COMPLETE ✅

**Date:** January 22, 2025  
**Status:** Complete - Ready for Phase 3 (Component Integration)  
**Time Invested:** ~2 hours

---

## What Was Created

### 1. **Production API Layer** ✅

**File:** `/utils/api/timesheets-approval.ts` (600+ lines)

**Includes:**
- ✅ `fetchOrganizations()` - Get all organizations
- ✅ `fetchOrganizationById(id)` - Get specific organization
- ✅ `fetchAllContracts()` - Get all contracts
- ✅ `fetchContractsByOrganization(orgId)` - Get contracts by org
- ✅ `fetchContractById(id)` - Get specific contract
- ✅ `fetchPeriodsByContract(contractId)` - Get timesheet periods with related data
- ✅ `fetchPeriodById(id)` - Get specific period
- ✅ `fetchEntriesByPeriod(periodId)` - Get daily entries
- ✅ `fetchMonthlyView(contractId, month)` - **Monthly aggregation logic**
- ✅ `approveTimesheet(periodId, approverId, approverName)` - Approve action
- ✅ `rejectTimesheet(periodId, approverId, approverName, reason)` - Reject action
- ✅ `bulkApproveTimesheets(periodIds, ...)` - Bulk approve
- ✅ `bulkRejectTimesheets(periodIds, ...)` - Bulk reject

**Key Features:**
- ✅ **Comprehensive error handling** - Try/catch with detailed logging
- ✅ **Related data fetching** - Automatically loads history, attachments, flags, tasks
- ✅ **Monthly aggregation** - Client-side aggregation matching demo logic
- ✅ **Bulk operations** - Parallel processing with error isolation
- ✅ **Helper functions** - `formatContractRate()`, `getStatusColor()`

**Error Handling Example:**
```typescript
try {
  const { data, error } = await supabase.from('organizations').select('*');
  if (error) throw new Error(`Failed: ${error.message}`);
  return data || [];
} catch (err) {
  console.error('Unexpected error:', err);
  throw err;
}
```

---

### 2. **React Query Hooks** ✅

**File:** `/utils/api/timesheets-approval-hooks.ts` (450+ lines)

**Query Hooks (Data Fetching):**
- ✅ `useOrganizations()` - Fetch organizations (5min cache)
- ✅ `useOrganizationById(id)` - Fetch specific org
- ✅ `useAllContracts()` - Fetch all contracts (5min cache)
- ✅ `useContractsByOrganization(orgId)` - Fetch contracts by org (3min cache)
- ✅ `useContractById(id)` - Fetch specific contract
- ✅ `usePeriodsByContract(contractId)` - Fetch periods (1min cache)
- ✅ `usePeriodById(id)` - Fetch specific period
- ✅ `useEntriesByPeriod(periodId)` - Fetch entries (30sec cache)
- ✅ `useMonthlyView(contractId, month)` - Fetch monthly aggregation

**Mutation Hooks (Actions):**
- ✅ `useApproveTimesheet()` - Approve with cache invalidation + toast
- ✅ `useRejectTimesheet()` - Reject with cache invalidation + toast
- ✅ `useBulkApprove()` - Bulk approve with progress toast
- ✅ `useBulkReject()` - Bulk reject with progress toast

**Combined Hooks (Optimizations):**
- ✅ `useOrganizationsWithContracts()` - Fetch orgs + contracts, group by org
- ✅ `usePrefetchPeriodData()` - Prefetch on hover for faster navigation

**Caching Strategy:**
```typescript
Organizations:   5 minutes (rarely change)
Contracts:       3-5 minutes (rarely change)
Periods:         1 minute (change frequently)
Entries:         30 seconds (change very frequently)
```

**Toast Notifications:**
```typescript
✅ "Timesheet approved successfully"
❌ "Failed to approve timesheet: [error message]"
⚠️ "5 approved, 2 failed" (bulk actions)
```

---

### 3. **React Query Provider** ✅

**File:** `/components/QueryProvider.tsx`

**Features:**
- ✅ QueryClient with sensible defaults
- ✅ Stale time: 1 minute (configurable per hook)
- ✅ Garbage collection: 5 minutes
- ✅ Retry failed requests once
- ✅ Don't refetch on window focus (less annoying)
- ✅ React Query DevTools (development only)

**Integrated into App:**
```typescript
// /components/AppRouter.tsx
<WorkGraphProvider>
  <QueryProvider>       ← NEW
    <AppContent />
  </QueryProvider>
</WorkGraphProvider>
```

---

## How It Works

### **Data Flow (Queries)**

```
Component
  ↓ calls
useOrganizations()
  ↓ queries
fetchOrganizations()
  ↓ calls
Supabase Client
  ↓ returns
organizations[]
  ↓ caches in
React Query
  ↓ provides to
Component
```

### **Action Flow (Mutations)**

```
User clicks "Approve"
  ↓
Component calls
approveMutation.mutateAsync()
  ↓
approveTimesheet(periodId, approverId, approverName)
  ↓
Updates Supabase:
  - timesheet_periods.status = 'approved'
  - timesheet_periods.approved_at = NOW
  - approval_history INSERT
  ↓
On success:
  - queryClient.invalidateQueries(['periods'])
  - toast.success('Approved')
  - Component re-renders with fresh data
  ↓
On error:
  - toast.error('Failed: [message]')
  - No data change
```

---

## Usage Examples

### **Example 1: Fetch Organizations**

```typescript
import { useOrganizations } from '@/utils/api/timesheets-approval-hooks';

function ApprovalsTab() {
  const { data: organizations, isLoading, error } = useOrganizations();
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {organizations?.map(org => (
        <OrgCard key={org.id} org={org} />
      ))}
    </div>
  );
}
```

### **Example 2: Approve Timesheet**

```typescript
import { useApproveTimesheet } from '@/utils/api/timesheets-approval-hooks';

function ApproveButton({ periodId }: { periodId: string }) {
  const approveMutation = useApproveTimesheet();
  
  const handleApprove = async () => {
    await approveMutation.mutateAsync({
      periodId,
      approverId: 'current-user-id',
      approverName: 'John Doe',
    });
  };
  
  return (
    <Button 
      onClick={handleApprove}
      disabled={approveMutation.isPending}
    >
      {approveMutation.isPending ? 'Approving...' : 'Approve'}
    </Button>
  );
}
```

### **Example 3: Bulk Approve**

```typescript
import { useBulkApprove } from '@/utils/api/timesheets-approval-hooks';

function BulkActions({ selectedPeriodIds }: { selectedPeriodIds: string[] }) {
  const bulkApproveMutation = useBulkApprove();
  
  const handleBulkApprove = async () => {
    const result = await bulkApproveMutation.mutateAsync({
      periodIds: selectedPeriodIds,
      approverId: 'current-user-id',
      approverName: 'John Doe',
    });
    
    console.log('Succeeded:', result.succeeded.length);
    console.log('Failed:', result.failed.length);
  };
  
  return (
    <Button onClick={handleBulkApprove}>
      Approve {selectedPeriodIds.length} Timesheets
    </Button>
  );
}
```

### **Example 4: Prefetch on Hover**

```typescript
import { usePrefetchPeriodData } from '@/utils/api/timesheets-approval-hooks';

function TimesheetRow({ period }: { period: TimesheetPeriod }) {
  const { prefetchPeriod, prefetchEntries } = usePrefetchPeriodData();
  
  return (
    <tr
      onMouseEnter={() => {
        // Prefetch data for instant drawer opening
        prefetchPeriod(period.id);
        prefetchEntries(period.id);
      }}
      onClick={() => openDrawer(period)}
    >
      <td>{period.weekStartDate}</td>
      <td>{period.totalHours}h</td>
      <td>{period.status}</td>
    </tr>
  );
}
```

---

## Integration Points

### **Replace Demo Data In:**

1. **`ApprovalsV2Tab.tsx`**
   ```typescript
   // OLD:
   import { DEMO_ORGANIZATIONS, DEMO_CONTRACTS } from './demo-data-multi-party';
   
   // NEW:
   import { useOrganizations, useAllContracts } from '@/utils/api/timesheets-approval-hooks';
   
   const { data: organizations, isLoading } = useOrganizations();
   const { data: contracts } = useAllContracts();
   ```

2. **`OrganizationGroupedTable.tsx`**
   ```typescript
   // Props remain the same - just pass API data instead of demo data
   <OrganizationGroupedTable
     organizations={organizations} // from useOrganizations()
     contracts={contracts}         // from useAllContracts()
     // ...
   />
   ```

3. **`MonthlyTimesheetDrawer.tsx`**
   ```typescript
   // OLD:
   import { getEntriesByPeriod } from './demo-data-multi-party';
   
   // NEW:
   import { useEntriesByPeriod } from '@/utils/api/timesheets-approval-hooks';
   
   const { data: entries, isLoading } = useEntriesByPeriod(period.id);
   ```

---

## Comparison: Demo vs API

### **Before (Demo Data)**

```typescript
// Hardcoded in demo-data-multi-party.ts
export const DEMO_ORGANIZATIONS: Organization[] = [
  { id: 'org-acme', name: 'Acme Dev Studio', type: 'company' },
  // ... 4 more
];

// Used directly in component
import { DEMO_ORGANIZATIONS } from './demo-data-multi-party';
<OrganizationGroupedTable organizations={DEMO_ORGANIZATIONS} />
```

**Issues:**
- ❌ No loading states
- ❌ No error handling
- ❌ No data refresh
- ❌ No cache
- ❌ Changes don't persist

### **After (API + React Query)**

```typescript
// Fetched from Supabase
import { useOrganizations } from '@/utils/api/timesheets-approval-hooks';

const { data: organizations, isLoading, error } = useOrganizations();

if (isLoading) return <Skeleton />;
if (error) return <Error />;

<OrganizationGroupedTable organizations={organizations} />
```

**Benefits:**
- ✅ Loading states (skeleton)
- ✅ Error handling (error boundary)
- ✅ Auto-refresh (stale time)
- ✅ Cache (5min)
- ✅ Changes persist to database

---

## Error Handling

### **API Layer Errors**

```typescript
// Example: fetchOrganizations() fails
Error: Failed to fetch organizations: permission denied

// Console output:
❌ Error fetching organizations: { code: 'PGRST...' }
❌ Unexpected error in fetchOrganizations: Error: Failed...
```

### **Hook Layer Errors**

```typescript
// Component receives error via useOrganizations()
const { error } = useOrganizations();

if (error) {
  return <div>Error: {error.message}</div>;
}
```

### **Toast Notifications**

```typescript
// Mutation errors automatically show toasts
useApproveTimesheet() → toast.error('Failed to approve: [message]')
useBulkApprove() → toast.warning('5 approved, 2 failed')
```

---

## Performance Optimizations

### **1. Prefetching**
```typescript
// Hover on row → instant drawer open
usePrefetchPeriodData()
```

### **2. Parallel Fetching**
```typescript
// Fetch periods + related data in parallel
Promise.all([
  fetchApprovalHistory(periodId),
  fetchAttachments(periodId),
  fetchReviewFlags(periodId),
  fetchAllocatedTasks(periodId),
])
```

### **3. Smart Caching**
```typescript
// Rarely-changing data cached longer
Organizations: 5 minutes
Contracts: 3-5 minutes
Periods: 1 minute (change frequently)
```

### **4. Selective Invalidation**
```typescript
// Only invalidate affected queries
queryClient.invalidateQueries({ queryKey: ['periods', contractId] });
// NOT: invalidate everything
```

---

## Next Steps: Phase 3 (Component Integration)

### **Tasks:**

1. **Update `ApprovalsV2Tab.tsx`**
   - Replace `DEMO_ORGANIZATIONS` with `useOrganizations()`
   - Replace `DEMO_CONTRACTS` with `useAllContracts()`
   - Add loading skeleton
   - Add error boundary

2. **Update `OrganizationGroupedTable.tsx`**
   - Props remain same (API data matches demo structure)
   - Possibly add loading states for nested data

3. **Update `MonthlyTimesheetDrawer.tsx`**
   - Replace `getEntriesByPeriod()` with `useEntriesByPeriod()`
   - Add loading state for entries
   - Wire up approve/reject buttons

4. **Add Approval Actions**
   - Connect "Approve" button → `useApproveTimesheet()`
   - Connect "Reject" button → `useRejectTimesheet()`
   - Connect bulk actions → `useBulkApprove()`, `useBulkReject()`

5. **Test & Validate**
   - Verify data displays correctly
   - Test approve/reject actions
   - Test bulk actions
   - Verify toasts appear

---

## Files Created

```
✅ /utils/api/timesheets-approval.ts          (600+ lines)
✅ /utils/api/timesheets-approval-hooks.ts    (450+ lines)
✅ /components/QueryProvider.tsx               (40 lines)
✅ /components/AppRouter.tsx                   (UPDATED)
✅ /docs/PHASE_2_API_LAYER_COMPLETE.md        (THIS FILE)
```

**Total:** 1,100+ lines of production-ready code

---

## Success Criteria

Phase 2 is complete when:

- [x] ✅ API functions created for all operations
- [x] ✅ React Query hooks created
- [x] ✅ Error handling implemented
- [x] ✅ Toast notifications configured
- [x] ✅ QueryProvider integrated into app
- [x] ✅ Caching strategy defined
- [x] ✅ Bulk operations with error isolation
- [x] ✅ Monthly aggregation logic
- [x] ✅ Helper functions (formatContractRate, etc.)
- [x] ✅ Documentation complete

---

## Testing Checklist (For Phase 3)

When integrating with components, verify:

- [ ] Organizations load without errors
- [ ] Contracts load and group correctly
- [ ] Loading states show skeletons
- [ ] Error states show error messages
- [ ] Approve action works + shows toast
- [ ] Reject action works + shows toast
- [ ] Bulk approve works + shows summary
- [ ] Data refreshes after mutations
- [ ] Cache works (no redundant fetches)
- [ ] Prefetch works on hover

---

## Summary

**What's Done:**
- ✅ Complete API layer with error handling
- ✅ React Query hooks with caching
- ✅ Toast notifications
- ✅ Bulk operations
- ✅ Monthly aggregation
- ✅ QueryProvider integrated

**What's Next:**
- 🔜 Replace demo data in components (Phase 3)
- 🔜 Wire up approve/reject buttons (Phase 3)
- 🔜 Add loading states (Phase 3)
- 🔜 Test end-to-end (Phase 3)

**Time Investment:**
- Phase 2: 2 hours ✅
- Phase 3: 3-4 hours (estimated)

---

**🎉 Phase 2 complete! Ready to integrate with components.**

**Next Document:** Begin Phase 3 integration following `/docs/OPTION_A_IMPLEMENTATION_CHECKLIST.md` → Phase 3
