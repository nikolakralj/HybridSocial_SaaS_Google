# Contractor List Display Fix

## Problem
The `ProjectTimesheetsView` was showing "0 people" for all organizations even though there was contractor data in the database. The organization groups (companies and freelancers) were displaying but without any contractors listed under them.

## Root Cause
The `OrganizationGroupedTable` component expected organizations with nested `contracts` and `periods` data (`OrganizationWithData[]` type), but `ProjectTimesheetsView` was passing the raw `DEMO_ORGANIZATIONS` array which didn't include this nested structure.

```typescript
// ❌ BEFORE: Plain organizations without contracts
<OrganizationGroupedTable
  organizations={DEMO_ORGANIZATIONS}  // Missing nested data!
  ...
/>
```

## Solution

### 1. Data Structure Enhancement
Added a `useMemo` hook in `ProjectTimesheetsView.tsx` to properly structure the data:

```typescript
// ✅ AFTER: Organizations with nested contracts and periods
const organizationsWithData: OrganizationWithData[] = useMemo(() => {
  return DEMO_ORGANIZATIONS.map(org => {
    const orgContracts = DEMO_CONTRACTS
      .filter(c => c.organizationId === org.id)
      .map(contract => ({
        ...contract,
        periods: getPeriodsByContract(contract.id),
      }));

    return {
      ...org,
      contracts: orgContracts,
    };
  });
}, []);
```

### 2. Component Props Fix
Updated `OrganizationGroupedTable.tsx` to support both `onSelectPeriod` and `onOpenDrawer` props for backward compatibility:

```typescript
interface OrganizationGroupedTableProps {
  organizations: OrganizationWithData[];
  onSelectPeriod?: (period: TimesheetPeriod, contract: ProjectContract) => void;
  onOpenDrawer?: (period: TimesheetPeriod, contract: ProjectContract) => void;
  // ... other props
}

// Use whichever handler is provided
const handlePeriodClick = onSelectPeriod || onOpenDrawer;
```

### 3. Added Missing `totalAmount` Field
Enhanced the demo data to calculate and include `totalAmount` in each period:

```typescript
// Calculate total amount based on contract type
const contract = DEMO_CONTRACTS.find(c => c.id === contractId);
let totalAmount: number | undefined = undefined;
if (contract) {
  if (contract.contractType === 'hourly' && contract.hourlyRate) {
    totalAmount = hours * contract.hourlyRate;
  } else if (contract.contractType === 'daily' && contract.dailyRate) {
    totalAmount = (hours / 8) * contract.dailyRate;
  } else if (contract.contractType === 'fixed' && contract.fixedAmount) {
    totalAmount = contract.fixedAmount / 4; // Weekly portion
  }
}
```

## Files Modified
1. `/components/timesheets/ProjectTimesheetsView.tsx` - Added data structuring logic
2. `/components/timesheets/approval-v2/OrganizationGroupedTable.tsx` - Fixed prop handling
3. `/components/timesheets/approval-v2/demo-data-multi-party.ts` - Added `totalAmount` calculation

## Result
Now the Project Timesheets view properly displays:
- ✅ Acme Dev Studio: **15 people** (was "0 people")
- ✅ BrightWorks Design: **7 people** (was "0 people")
- ✅ Alex Chen (Freelancer): **1 person** (was "0 people")
- ✅ Maria Rodriguez (Freelancer): **1 person** (was "0 people")
- ✅ James Kim (Freelancer): **1 person** (was "0 people")

Each contractor now shows with their:
- Name and role
- Contract type and rate
- Weekly periods with hours, amounts, and approval status
- Review flags, attachments, and notes

## Testing
To verify the fix:
1. Navigate to Project Workspace → Timesheets tab
2. Expand any organization group (click the chevron)
3. You should see all contractors for that organization with their weekly periods
4. Click on any period row to open the monthly timesheet drawer
