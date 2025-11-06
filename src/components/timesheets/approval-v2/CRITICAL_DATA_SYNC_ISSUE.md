# 🚨 CRITICAL: Data Sync Issue Between Timesheet Entry and Approval Views

## Problem Identified

The timesheet entry view and the approval drawer are **NOT sharing the same data source**:

### Current Architecture (BROKEN)

```
┌─────────────────────────────────┐         ┌──────────────────────────────────┐
│  Timesheet Entry Calendar       │         │   Approval Drawer                │
│  (TimesheetCalendarView)        │         │   (MonthlyTimesheetDrawer)       │
│                                 │         │                                  │
│  Data Source:                   │   ❌    │   Data Source:                   │
│  • useState (Local State)       │  NOT    │   • Supabase Database            │
│  • Only in component memory     │ SYNCED  │   • useApprovalsData() hook      │
│  • Lost on page refresh         │         │   • Falls back to DEMO_DATA      │
└─────────────────────────────────┘         └──────────────────────────────────┘
```

## Files Affected

1. **/components/timesheets/TimesheetCalendarView.tsx**
   - Line 225: Uses `useState` for entries
   - Does NOT save to database
   - Data only exists in component memory

2. **/components/timesheets/approval-v2/MonthlyTimesheetDrawer.tsx**
   - Receives periods from `useApprovalsData()`  
   - Tries to get entries from Supabase
   - Falls back to demo data when DB is empty

3. **/utils/api/timesheets-approval-hooks.ts**
   - `useApprovalsData()` queries Supabase
   - Returns empty arrays because no data was saved

## Why It's Broken

**User Journey:**
1. User enters timesheet data in Week 41 (Oct 7-11)
2. Data is saved to `entries` state in `TimesheetCalendarView`
3. User clicks "View Details" to open approval drawer
4. Drawer calls `useApprovalsData()` → queries Supabase
5. Supabase returns EMPTY (no one saved the data there!)
6. Drawer shows DEMO data instead of user's actual entries

## Solution Options

### Option A: Make Timesheet Calendar Save to Database (RECOMMENDED)

**Modify TimesheetCalendarView to use the database:**

```tsx
// BEFORE (Local State Only)
const [entries, setEntries] = useState<Map<string, DayEntry>>(new Map());

// AFTER (Database-backed)
import { useTimesheetEntries, useSaveTimesheetEntry } from '../../utils/api/timesheets-hooks';

const { data: entries, isLoading } = useTimesheetEntries({
  userId: currentUserId,
  startDate: startOfMonth(currentDate),
  endDate: endOfMonth(currentDate),
});

const saveEntry = useSaveTimesheetEntry();
```

**Pros:**
- Single source of truth
- Data persists across page refreshes
- Approval drawer shows real data
- Production-ready

**Cons:**
- Requires implementing the hooks
- Need to handle loading states

### Option B: Pass Entry State Directly to Drawer

**Share the component state:**

```tsx
// In parent component
const [allEntries, setAllEntries] = useState<Map<string, DayEntry>>(new Map());

// Pass to both components
<TimesheetCalendarView entries={allEntries} onSaveEntry={setAllEntries} />
<MonthlyTimesheetDrawer entries={allEntries} />
```

**Pros:**
- Quick fix
- No database changes needed

**Cons:**
- Data lost on refresh
- Not production-ready
- Still doesn't solve the sync issue

### Option C: Use Context/State Management

**Create a shared context:**

```tsx
const TimesheetDataContext = createContext();

<TimesheetDataProvider>
  <TimesheetCalendarView />
  <MonthlyTimesheetDrawer />
</TimesheetDataProvider>
```

**Pros:**
- Proper state sharing
- Cleaner architecture

**Cons:**
- More complex setup
- Still doesn't persist data

## Recommended Fix

**Implement Option A with these steps:**

1. **Create timesheet hooks** (like approval hooks but for entries)
2. **Modify TimesheetCalendarView** to use database hooks
3. **Ensure MonthlyTimesheetDrawer** uses the same hooks
4. **Remove demo data fallback** once database is populated

## Quick Test

To verify the issue:

1. Open DevTools Console
2. Add timesheet entry in calendar
3. Open drawer
4. Check console logs - you'll see:
   ```
   🔵 Opening drawer with X periods
   ⚠️ Periods have no entries from database
   📦 Falling back to DEMO_ENTRIES
   ```

This confirms the data source mismatch!
