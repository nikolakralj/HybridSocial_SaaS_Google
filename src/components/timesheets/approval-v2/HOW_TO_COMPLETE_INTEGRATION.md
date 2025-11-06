# How to Complete the Data Sync Integration

## ✅ What's Already Done

I've created all the infrastructure you need:

1. ✅ **Hooks Created** - `/utils/api/timesheets-hooks.ts`
2. ✅ **API Functions** - `fetchEntriesByUserAndDateRange()` in `/utils/api/timesheets-approval.ts`
3. ✅ **Types Defined** - All TypeScript interfaces ready
4. ✅ **Documentation** - Complete guides written

## ❌ What Still Needs To Be Done

You need to update 2 files to complete the integration:

### File 1: `/components/timesheets/TimesheetCalendarView.tsx`

**Current Problem:** Saves to local state (line 225)

**What to change:**

```typescript
// ❌ REMOVE THIS (Line 225)
const [entries, setEntries] = useState<Map<string, DayEntry>>(new Map());

// ✅ ADD THIS INSTEAD
import { useTimesheetEntries, useSaveTimesheetEntry, formatDateForAPI } from '../../utils/api/timesheets-hooks';
import { useMemo } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

// Inside component:
const startDate = formatDateForAPI(startOfMonth(currentDate));
const endDate = formatDateForAPI(endOfMonth(currentDate));

const { data: entriesArray, isLoading } = useTimesheetEntries({
  userId: contractorName, // or proper userId
  companyId: 'company-1', // from props or context
  startDate,
  endDate,
});

const saveEntryMutation = useSaveTimesheetEntry();

// Convert API entries to Map format
const entries = useMemo(() => {
  const map = new Map<string, DayEntry>();
  if (!entriesArray) return map;
  
  entriesArray.forEach(entry => {
    const dateKey = entry.date;
    const existing = map.get(dateKey) || {
      date: new Date(entry.date),
      hours: 0,
      status: entry.status,
      entries: [],
    };
    existing.entries.push(entry);
    existing.hours += entry.hours || 0;
    map.set(dateKey, existing);
  });
  
  return map;
}, [entriesArray]);
```

**Then find where entries are saved (search for `setEntries`) and replace with:**

```typescript
// ❌ OLD
setEntries(prev => {
  const newMap = new Map(prev);
  newMap.set(dateKey, entry);
  return newMap;
});

// ✅ NEW
saveEntryMutation.mutate({
  userId: contractorName,
  companyId: 'company-1',
  date: formatDateForAPI(date),
  hours: entry.hours,
  status: 'draft',
  notes: entry.notes,
  taskDescription: entry.task,
  // ... other fields
});
```

### File 2: `/components/timesheets/approval-v2/ApprovalsV2Tab.tsx`

**Current Problem:** Uses demo data (line 203)

**What to change:**

```typescript
// ❌ REMOVE LINES 196-204 (the current demo data approach)
const monthPeriods = allContractPeriods
  .filter(p => {
    const periodDate = new Date(p.weekStartDate);
    return periodDate.getFullYear() === clickedYear && periodDate.getMonth() === clickedMonth;
  })
  .map(p => {
    const periodEntries = getEntriesByPeriod(p.id);
    console.log(`📦 Period ${p.id} has ${periodEntries.length} entries from demo data`);
    return {
      ...p,
      entries: periodEntries, // ❌ Demo data
    };
  });

// ✅ ADD THIS INSTEAD
import { fetchEntriesByUserAndDateRange } from '../../../utils/api/timesheets-approval';

// Make the function async
const handleOpenDrawer = async (period: TimesheetPeriod, contract: ProjectContract) => {
  console.log('🔵 handleOpenDrawer called with:', {
    period: period,
    contract: contract,
    periodWeek: period.weekStartDate,
  });

  // Find ALL periods for this contract in the same month
  const clickedDate = new Date(period.weekStartDate);
  const clickedYear = clickedDate.getFullYear();
  const clickedMonth = clickedDate.getMonth();
  
  // Calculate month boundaries
  const monthStart = new Date(clickedYear, clickedMonth, 1);
  const monthEnd = new Date(clickedYear, clickedMonth + 1, 0);
  
  // Get all periods for this contract
  const allContractPeriods = getPeriodsByContract(contract.id);
  
  // Filter to only periods in the same month
  const monthPeriods = allContractPeriods.filter(p => {
    const periodDate = new Date(p.weekStartDate);
    return periodDate >= monthStart && periodDate <= monthEnd;
  });
  
  // ✅ FETCH REAL ENTRIES from database
  try {
    const entries = await fetchEntriesByUserAndDateRange(
      contract.userId,
      monthStart.toISOString().split('T')[0],
      monthEnd.toISOString().split('T')[0]
    );
    
    console.log(`✅ Fetched ${entries.length} REAL entries from database for ${contract.userName}`);
    
    // Attach entries to periods based on date range
    const periodsWithEntries = monthPeriods.map(p => {
      const periodStart = new Date(p.weekStartDate);
      const periodEnd = new Date(p.weekEndDate);
      
      const periodEntries = entries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate >= periodStart && entryDate <= periodEnd;
      });
      
      console.log(`📊 Period ${p.weekStartDate} has ${periodEntries.length} entries`);
      
      return {
        ...p,
        entries: periodEntries,
      };
    });
    
    setDrawerPeriods(periodsWithEntries);
    setDrawerContract(contract);
    setClickedPeriodId(period.id);
  } catch (error) {
    console.error('❌ Failed to fetch entries from database:', error);
    console.log('⚠️ Falling back to demo data');
    
    // Fallback to demo data if database fetch fails
    const periodsWithDemoData = monthPeriods.map(p => ({
      ...p,
      entries: getEntriesByPeriod(p.id),
    }));
    
    setDrawerPeriods(periodsWithDemoData);
    setDrawerContract(contract);
    setClickedPeriodId(period.id);
  }
};
```

## Quick Test After Changes

1. **Start the app** and open browser console
2. **Add timesheet entry** in the calendar view
3. **Check console** - you should see:
   ```
   ✅ Entry saved
   Your timesheet entry has been saved.
   ```
4. **Open approval drawer** for that contractor
5. **Check console** - you should see:
   ```
   ✅ Fetched 5 REAL entries from database for Sarah Johnson
   📊 Period 2025-10-07 has 3 entries
   ```
6. **Verify** - The drawer shows the SAME data you just entered!

## Troubleshooting

### If you see "No entries" in the drawer:

1. Check console for error messages
2. Verify the `userId` in the contract matches the `userId` used when saving entries
3. Make sure the date range includes the dates you entered
4. Check that the database actually has the entries (inspect in Supabase dashboard)

### If entries still don't save:

1. Check that you're calling `saveEntryMutation.mutate()` with all required fields
2. Verify the `userId` and `companyId` are correct
3. Look for error toasts in the bottom-right corner
4. Check browser console for API errors

### If the drawer shows demo data instead of real data:

1. The try/catch is falling back to demo data
2. Check the error in console
3. Verify the `fetchEntriesByUserAndDateRange()` function is working
4. Make sure the `contract.userId` field exists and is correct

## Summary

**Total changes needed:** 2 files, ~30 lines of code

**Time to implement:** 10-15 minutes

**Result:** Both systems will be perfectly synced through the shared Supabase database!

Once these changes are made, you'll be able to:
- ✅ Enter timesheets in the calendar
- ✅ See them immediately in the approval drawer
- ✅ Have data persist across page refreshes
- ✅ Use the same data in both views

Good luck! Let me know if you need help with the implementation.
