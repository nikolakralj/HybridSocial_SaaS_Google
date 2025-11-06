# How to Fix: Timesheet Data Not Showing in Approval Drawer

## Problem Summary

You discovered that **data you enter in the Timesheet Calendar is NOT visible in the Approval Drawer**. This is because they use **different data sources**:

### Current State (BROKEN)

```
┌──────────────────────────────────┐      ┌─────────────────────────────────┐
│ Timesheet Entry (Week 41)        │      │ Approval Drawer                 │
│ /timesheets/TimesheetCalendarView│  ❌  │ /approval-v2/MonthlyTimesheet   │
│                                  │      │                                 │
│ Data: Local State (useState)     │ NOT  │ Data: Demo Data (static)        │
│ When you add: Saved to memory    │SYNCED│ When you open: Shows demo       │
│ Lost on: Page refresh            │      │ Never sees: Your real entries   │
└──────────────────────────────────┘      └─────────────────────────────────┘
```

## Why This Happens

1. **Timesheet Calendar** stores entries in React `useState`
   - File: `/components/timesheets/TimesheetCalendarView.tsx`
   - Line 225: `const [entries, setEntries] = useState(...)`
   - Data only exists in component memory
   - No database save operation

2. **Approval Drawer** uses demo data
   - File: `/components/timesheets/approval-v2/ApprovalsV2Tab.tsx`
   - Line 203: `entries: getEntriesByPeriod(p.id)`
   - This function returns STATIC demo data from `demo-data-multi-party.ts`
   - Never connected to your actual timesheet entries

## Check Console Logs

Open DevTools Console and you'll see:

```
📦 Period period-1 has 5 entries from demo data
⚠️ NOTE: Entries are from DEMO DATA, not from the timesheet calendar you edited!
⚠️ To see your actual entries, both systems must use the same database.
```

## Solution (Quick Fix for Demo)

Since this is a prototype, **both systems currently use demo data**. If you want to see matching data:

### Option 1: Use the SAME contractor in both views

The approval drawer shows contractors from `demo-data-multi-party.ts`:
- Sarah Johnson
- Mike Chen  
- Emily Davis
- etc.

Make sure you're:
1. Entering data for "Sarah Johnson" in the timesheet calendar
2. Opening "Sarah Johnson" in the approval drawer

### Option 2: Modify Demo Data to Match

Edit `/components/timesheets/approval-v2/demo-data-multi-party.ts` to include the data you want to see.

## Solution (Production-Ready Fix)

To properly fix this, you need to implement database-backed timesheet entries:

### Step 1: Create Hooks for Timesheet Entries

```typescript
// /utils/api/timesheets-hooks.ts

export function useTimesheetEntries(params: {
  userId: string;
  startDate: Date;
  endDate: Date;
}) {
  return useQuery({
    queryKey: ['entries', params.userId, params.startDate, params.endDate],
    queryFn: () => fetchEntriesFromDatabase(params),
  });
}

export function useSaveTimesheetEntry() {
  return useMutation({
    mutationFn: (entry: TimesheetEntry) => saveEntryToDatabase(entry),
  });
}
```

### Step 2: Update TimesheetCalendarView

Replace local state with database hooks:

```typescript
// BEFORE
const [entries, setEntries] = useState<Map<string, DayEntry>>(new Map());

// AFTER  
const { data: entries, isLoading } = useTimesheetEntries({
  userId: currentUserId,
  startDate: startOfMonth(currentDate),
  endDate: endOfMonth(currentDate),
});

const saveEntryMutation = useSaveTimesheetEntry();

// When user adds entry
const handleSaveEntry = (entry) => {
  saveEntryMutation.mutate(entry); // Saves to database
};
```

### Step 3: Update Approval Drawer to Use Same Source

```typescript
// In ApprovalsV2Tab.tsx

const monthPeriods = allContractPeriods.map(p => {
  // Fetch REAL entries from database, not demo data
  const { data: entries } = useEntriesByPeriod(p.id);
  
  return {
    ...p,
    entries: entries || [], // Use database entries
  };
});
```

## Database Schema

You'll need a `timesheet_entries` table:

```sql
CREATE TABLE timesheet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  period_id UUID NOT NULL REFERENCES timesheet_periods(id),
  date DATE NOT NULL,
  hours DECIMAL,
  days DECIMAL,
  task_description TEXT,
  start_time TIME,
  end_time TIME,
  break_minutes INTEGER,
  billable BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Current Workaround

For NOW, to see data in the drawer:

**The approval system shows DEMO DATA ONLY**. To test it:
1. Look at what contractors exist in `demo-data-multi-party.ts`
2. Open the approval drawer for one of those contractors
3. You'll see their pre-generated demo entries

The timesheet calendar you're editing is a **separate system** that will need to be connected to the approval system via a shared database.

## Next Steps

1. **Immediate**: Understand that these are two separate systems with separate data
2. **Short-term**: Use demo data to test the approval interface
3. **Long-term**: Implement database-backed entries for both systems to share

---

**TL;DR**: The drawer shows demo data, the calendar uses local state. They don't talk to each other yet. Need database integration to fix properly.
