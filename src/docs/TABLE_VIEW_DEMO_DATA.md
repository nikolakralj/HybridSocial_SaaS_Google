# Table View Demo Data Setup

## ✅ Issues Fixed

### **Problem 1: Missing Type Definitions**
**Error:** `Cannot read properties of undefined (reading 'filter')`

**Root Cause:** 
- `EntryDetail` and `TimesheetEntry` types weren't defined in `/types/index.ts`
- Demo data file was trying to import types that didn't exist
- Components were using different type structures

**Fix:**
- Added proper type definitions to `/types/index.ts`:
  ```typescript
  export type EntryStatus = "draft" | "submitted" | "pending" | "approved" | "rejected";

  export interface EntryDetail {
    id: string;
    category?: string;
    description?: string;
    hours: number;
    startTime?: string;
    endTime?: string;
    breakMinutes?: number;
    status: EntryStatus;
    notes?: string;
  }

  export interface TimesheetEntry {
    date: string; // YYYY-MM-DD
    entries: EntryDetail[];
  }
  ```

### **Problem 2: No Seed Data for Table View**
**Root Cause:**
- Table view was receiving empty entries object: `entries={{}}`
- No demo data available to display in the table

**Fix:**
- Created `/components/timesheets/demo-data-table.ts` with realistic timesheet data
- Generated 4 weeks of data for 5 contractors
- Mix of statuses: draft, submitted, pending, approved, rejected
- Multiple tasks per day with different categories

## 📊 Demo Data Structure

### **People (5 Contractors)**
```typescript
export const demoTablePeople = [
  { id: 'contractor-1', name: 'Sarah Chen', initials: 'SC', role: 'Senior Developer' },
  { id: 'contractor-2', name: 'Mike Rodriguez', initials: 'MR', role: 'Frontend Developer' },
  { id: 'contractor-3', name: 'Emma Wilson', initials: 'EW', role: 'Full-Stack Engineer' },
  { id: 'contractor-4', name: 'James Taylor', initials: 'JT', role: 'DevOps Engineer' },
  { id: 'contractor-5', name: 'Lisa Anderson', initials: 'LA', role: 'UX Designer' },
];
```

### **Time Period Coverage**
- ✅ **3 weeks ago:** Fully approved
- ✅ **2 weeks ago:** Fully approved (mix of patterns)
- ✅ **Last week:** Submitted (pending approval)
- ✅ **This week:** Draft (in progress)

### **Entry Patterns**

#### **Sarah Chen - Consistent Full-Time**
- 8 hours/day Monday-Friday
- Mix of Development, Meetings, Code Review
- All approved for past weeks
- Submitted for last week
- Draft for current week

#### **Mike Rodriguez - Part-Time**
- 6 hours/day Monday-Friday
- Frontend development focus
- Consistent schedule

#### **Emma Wilson - Full-Time with Overtime**
- Usually 8 hours/day
- Occasional 9-10 hour days (overtime)
- Multiple tasks per day
- Backend/Full-Stack work

#### **James Taylor - Variable Hours**
- 7-7.5 hours/day
- One rejected entry (12 hours - exceeded budget)
- DevOps and infrastructure work

#### **Lisa Anderson - Designer**
- 8 hours/day
- Design, Research, Meetings
- Consistent approved pattern

### **Task Categories Used**
- Development
- Design
- Testing
- Meetings
- Code Review
- Documentation
- Research

### **Status Distribution**
- **Approved:** 3 weeks ago + 2 weeks ago (60+ entries)
- **Submitted:** Last week (25 entries)
- **Draft:** This week (15 entries)
- **Rejected:** 1 entry (James - excessive hours)

## 🔧 Integration

### **Updated Files**

1. **`/types/index.ts`**
   - Added `EntryDetail` interface
   - Added `TimesheetEntry` interface
   - Added `EntryStatus` type

2. **`/components/timesheets/demo-data-table.ts`** (NEW)
   - `generateTableDemoData()` - Creates 4 weeks of realistic data
   - `demoTablePeople` - 5 contractor profiles
   - `demoTableEntries` - Pre-generated timesheet data

3. **`/components/timesheets/CompanyOwnerUnifiedView.tsx`**
   - Imports demo data: `import { demoTablePeople, demoTableEntries } from "./demo-data-table"`
   - Passes to both Timesheets and Approvals table views
   - Added toast notifications for user feedback

4. **`/components/timesheets/selection/PeopleChipSelector.tsx`**
   - Added null-safety checks
   - Made `people` prop optional with default empty array
   - Added empty state message

## 🎯 Testing the Table View

### **Navigate to Table View:**
1. Go to `/approval-demo`
2. Click **"Timesheets"** tab (should be default)
3. View should default to **"Table"** mode
4. You should see demo data loaded

### **What You'll See:**

#### **Weekly View:**
- Period selector showing current week
- 5 contractors available in people chip selector
- Click to select contractors
- Table shows Mon-Fri with hours and status badges
- Click any cell to open the entry modal

#### **Monthly View:**
- Switch to "Month" in period selector
- See collapsible week rows
- Each week shows total hours and pending count
- Expand weeks to see daily details
- Month summary at bottom

### **Interactive Features:**
- ✅ Click cells to edit (opens MultiPersonDayModal)
- ✅ Status badges show draft/submitted/approved
- ✅ Multiple tasks per day show task count badge
- ✅ Totals calculate automatically
- ✅ Navigate weeks/months with arrow buttons
- ✅ "Today" button to jump to current period

## 📈 Data Patterns to Notice

### **Realistic Scenarios:**

1. **Approval Queue (Last Week)**
   - All contractors have submitted entries
   - Ready for review and approval
   - Switch to "Approvals" tab to see them

2. **Active Work (This Week)**
   - Incomplete week (only 3 days)
   - All entries in draft status
   - Shows current work in progress

3. **Historical Data (2-3 Weeks Ago)**
   - Fully approved
   - Shows completed approval cycles
   - Good for monthly reporting

4. **Edge Cases:**
   - James has 1 rejected entry (12 hours)
   - Emma has overtime days (9-10 hours)
   - Mix of single and multi-task days

## 🚀 Next Steps

### **To Connect Real Data:**

Replace demo data with Supabase queries:

```typescript
// In CompanyOwnerUnifiedView.tsx
const [entries, setEntries] = useState<Record<string, Record<string, TimesheetEntry>>>({});

useEffect(() => {
  // Fetch from Supabase
  fetchTimesheetEntries(periodStart, periodEnd).then(setEntries);
}, [periodStart, periodEnd]);

// Pass real data instead of demo
<TimesheetTableView
  people={contractors}
  entries={entries}
  onEntriesChange={handleSaveEntry}
/>
```

### **To Add More Demo Data:**

Edit `/components/timesheets/demo-data-table.ts`:

```typescript
// Add more contractors
demoTablePeople.push({
  id: 'contractor-6',
  name: 'Your Name',
  initials: 'YN',
  role: 'Your Role',
});

// Add entries in generateTableDemoData()
eachDayOfInterval({ start, end }).forEach(day => {
  createEntry('contractor-6', day, 8, 'draft', [
    { category: 'Development', description: 'Your work', hours: 8 },
  ]);
});
```

## ✅ Summary

**All errors fixed!** The table view now has:

✅ Proper TypeScript types  
✅ Realistic seed/demo data  
✅ 4 weeks of timesheet entries  
✅ 5 contractors with different patterns  
✅ Mix of statuses (draft/submitted/approved/rejected)  
✅ Multiple tasks per day  
✅ Null-safe components  
✅ Toast notifications  
✅ Ready to test!

**Try it now:** Go to `/approval-demo` → Timesheets tab → Table view 🎯
