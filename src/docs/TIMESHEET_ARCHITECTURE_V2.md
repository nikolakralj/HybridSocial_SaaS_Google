# 📋 Timesheet Architecture V2 - Individual Timesheets with Bulk Entry

## 🎯 Core Principle

**Each contractor has their own separate monthly timesheet for each project.**

- ✅ Clean accountability (one person, one timesheet)
- ✅ Individual status tracking (draft → submitted → approved/rejected)
- ✅ Manager aggregate view with drill-down to individuals
- ✅ Bulk entry as a **convenience tool** (not shared data)

---

## 🏗️ Architecture Overview

### Data Model

```typescript
// Each contractor has their own timesheet
interface Timesheet {
  id: string;
  contractorId: string;
  projectId: string;
  month: Date;  // e.g., "2025-10-01"
  status: "draft" | "submitted" | "approved" | "rejected";
  entries: TimesheetEntry[];
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  managerNotes?: string;
}

// Individual entries within a timesheet
interface TimesheetEntry {
  id: string;
  date: Date;
  hours: number;
  task: string;
  notes: string;
  startTime?: string;
  endTime?: string;
}

// Manager aggregate view (computed)
interface DayAggregate {
  date: Date;
  totalHours: number;
  totalCost: number;
  contributors: {
    contractorId: string;
    contractor: ContractorInfo;
    timesheetId: string;  // Link to individual timesheet
    entry: TimesheetEntry;
    status: string;
  }[];
}
```

---

## 👤 Individual Contractor View

### Component: `IndividualTimesheet`

**Features:**
- Monthly calendar showing contractor's own entries
- Status badge (Draft/Submitted/Approved/Rejected)
- Inline quick-add (click "+")
- Copy previous day (click copy icon)
- Drag & drop to duplicate entries
- Submit button when ready

**States:**
1. **Draft** - Contractor is editing
2. **Submitted** - Waiting for manager approval
3. **Approved** - Manager approved, locked
4. **Rejected** - Manager rejected, back to draft for revision

**Workflow:**
```
1. Contractor opens "My Timesheet"
2. Sees monthly calendar (empty or partially filled)
3. Adds hours:
   - Click "+" → Quick add
   - Click copy → Copy previous day
   - Drag entry → Duplicate to another day
4. Clicks "Submit for Approval"
5. Status → Submitted (locked for editing)
6. Manager reviews
7. Status → Approved or Rejected
8. If rejected → Contractor edits and resubmits
```

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Sarah Chen's Timesheet                             │
│ Mobile App Redesign · October 2025                 │
│                                                    │
│ [🟡 Pending Approval] [Submit for Approval]       │
├────────────────────────────────────────────────────┤
│ Mon  Tue  Wed  Thu  Fri  Sat  Sun                 │
├────────────────────────────────────────────────────┤
│      1    2    3    4    5    6                   │
│      8h   8h   8h   8h   8h   --   --             │
│                                                    │
│  7    8    9   10   11   12   13                  │
│  8h   8h   8h   8h   8h   --   --                 │
├────────────────────────────────────────────────────┤
│ Total: 80h · 10 days · Status: Submitted          │
└────────────────────────────────────────────────────┘
```

---

## 👔 Manager Aggregate View

### Component: `TimesheetManagerCalendarView`

**Features:**
- Monthly calendar showing **total project hours per day**
- Click day → Drill down to see all contributors
- Click contractor → **View their full individual timesheet**
- Approve/reject individual entries
- Bulk approve all pending for a day
- Filter by person or task

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Team Timesheet Overview                            │
│ October 2025 · 3 active contractors                │
├────────────────────────────────────────────────────┤
│ Mon  Tue  Wed  Thu  Fri  Sat  Sun │ Week          │
├────────────────────────────────────────────────────┤
│                 1    2    3    4  │               │
│                24h  24h  24h  24h │  96h          │
│                3ppl 3ppl 3ppl 3ppl│               │
│                 🟡   🟡   🟡   🟡 │               │
└────────────────────────────────────────────────────┘
                     ↓ Click Oct 2
┌────────────────────────────────────────────────────┐
│ Wednesday, October 2, 2025                         │
│ 3 Contributors | 24h total | $2,580                │
├────────────────────────────────────────────────────┤
│ Sarah Chen       8h  Development   🟡 Pending      │
│ [View Full Timesheet]              [Approve]       │
│                                                    │
│ Mike Johnson     8h  UI Design     🟡 Pending      │
│ [View Full Timesheet]              [Approve]       │
│                                                    │
│ Lisa Park        8h  UI Design     ✓ Approved     │
│ [View Full Timesheet]                              │
├────────────────────────────────────────────────────┤
│                     [Approve All Pending (2)]      │
└────────────────────────────────────────────────────┘
```

**Key Point:** Each contractor's name has a **"View Full Timesheet"** link that opens their complete individual timesheet in a side panel or new view.

---

## 👥 Bulk Entry Tool

### Component: `BulkTimesheetEntry`

**Purpose:** Convenience tool for when multiple contractors have **identical hours**

**What it does:**
- Manager selects multiple contractors
- Defines pattern (hours/day, task, working days)
- System creates **separate entries** in each contractor's **individual timesheet**
- Each contractor can still edit their own entries before submitting

**Important:** This is NOT a shared entry. It's a **bulk creation** tool that generates individual entries.

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Bulk Timesheet Entry                               │
├────────────────────────────────────────────────────┤
│ Select Contractors:              [Select All]      │
│                                                    │
│ ✓ Sarah Chen                                       │
│ ✓ Mike Johnson                                     │
│ ✓ Lisa Park                                        │
├────────────────────────────────────────────────────┤
│ Entry Details:                                     │
│ Hours/Day: [8.0]      Task: [Development]         │
│ Working Days: [Mon] [Tue] [Wed] [Thu] [Fri]      │
├────────────────────────────────────────────────────┤
│ What will be created:                              │
│ • 3 contractors                                    │
│ • 5 days (per person)                             │
│ • 15 total entries                                 │
│ • 120 total hours                                  │
│                                                    │
│ ℹ️ Each contractor gets their own separate        │
│   timesheet entries that they can edit            │
├────────────────────────────────────────────────────┤
│                     [Create 15 Entries]            │
└────────────────────────────────────────────────────┘
```

**Behind the scenes:**
```typescript
// When manager clicks "Create 15 Entries"
contractors.forEach(contractor => {
  selectedDays.forEach(day => {
    createEntryInContractorTimesheet({
      contractorId: contractor.id,
      date: day,
      hours: pattern.hours,
      task: pattern.task,
      notes: pattern.notes,
    });
  });
});

// Result: 3 separate timesheets, each with 5 entries
// Sarah's timesheet: 5 entries (Mon-Fri)
// Mike's timesheet: 5 entries (Mon-Fri)
// Lisa's timesheet: 5 entries (Mon-Fri)
```

---

## 🔄 Complete Workflow Examples

### Scenario 1: Team Sprint with Identical Hours

**Setup:** 3 developers, all work Mon-Fri, 8h/day, same sprint

**Steps:**
1. **Manager:** Opens project timesheets
2. **Manager:** Clicks "Bulk Entry"
3. **Manager:** Selects all 3 developers
4. **Manager:** Pattern: 8h/day, Development, Mon-Fri
5. **Manager:** Clicks "Create 15 Entries"
6. **System:** Creates 5 entries in Sarah's timesheet
7. **System:** Creates 5 entries in Mike's timesheet
8. **System:** Creates 5 entries in Lisa's timesheet
9. **Sarah:** Opens "My Timesheet"
10. **Sarah:** Reviews entries, adds notes
11. **Sarah:** Clicks "Submit for Approval"
12. **Mike & Lisa:** Do the same
13. **Manager:** Sees 3 pending timesheets
14. **Manager:** Reviews aggregate view
15. **Manager:** Approves all 3

**Time saved:** 10 minutes (no repetitive entry) vs 2 minutes (bulk entry)

### Scenario 2: Mixed Hours

**Setup:**
- Sarah: Mon-Fri, 8h/day (full-time)
- Mike: Mon-Wed, 6h/day (part-time)
- Lisa: Tue-Thu, 4h/day (part-time)

**Steps:**
1. **Option A: Three bulk entries**
   - Bulk entry #1: Sarah, Mon-Fri, 8h
   - Bulk entry #2: Mike, Mon-Wed, 6h
   - Bulk entry #3: Lisa, Tue-Thu, 4h

2. **Option B: Individual entry**
   - Sarah adds her own hours
   - Mike adds his own hours
   - Lisa adds her own hours

3. **Option C: Bulk + Edit**
   - Bulk entry: All 3, Mon-Fri, 8h
   - Mike deletes Thu-Fri, edits hours to 6h
   - Lisa deletes Mon+Fri, edits hours to 4h

**Best approach:** Option A (three targeted bulk entries)

### Scenario 3: Manager Review & Approval

**Manager's view:**

1. **Dashboard:** "3 pending timesheets for approval"
2. **Click:** Opens aggregate calendar view
3. **See:** October calendar with daily totals
4. **Filter:** By person (Sarah Chen)
5. **View:** Sarah's full month at a glance
6. **Click:** Oct 15 (has pending entry)
7. **Review:** 8h Development, "Built API endpoints"
8. **Click:** "View Full Timesheet" (opens Sarah's complete timesheet)
9. **Review:** All of Sarah's October entries
10. **Click:** "Approve All" (approves Sarah's entire timesheet)
11. **Repeat:** For Mike and Lisa
12. **Result:** All 3 timesheets approved in <5 minutes

---

## 🎨 UI Components

### 1. IndividualTimesheet.tsx

**Props:**
```typescript
{
  contractorId: string;
  contractorName: string;
  projectId: string;
  projectName: string;
  month: Date;
  status: "draft" | "submitted" | "approved" | "rejected";
  entries: TimesheetEntry[];
  onUpdateEntry: (entry: TimesheetEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  onSubmit: () => void;
}
```

**Features:**
- Monthly calendar grid
- Inline quick-add
- Copy previous day button
- Drag & drop entries
- Status badge
- Submit button

### 2. BulkTimesheetEntry.tsx

**Props:**
```typescript
{
  projectId: string;
  projectName: string;
  contractors: Contractor[];
  month: Date;
  onCreateEntries: (contractorIds: string[], pattern: EntryPattern) => void;
}
```

**Features:**
- Multi-select contractors
- Pattern definition (hours, task, days)
- Preview of what will be created
- Creates separate entries per person

### 3. TimesheetManagerCalendarView.tsx

**Props:**
```typescript
{
  onViewIndividualTimesheet?: (contractorId: string, contractorName: string) => void;
}
```

**Features:**
- Aggregate calendar (daily totals)
- Drill-down to see contributors
- Link to view individual timesheets
- Approve/reject entries
- Filter by person/task

### 4. TimesheetManagerListView.tsx

**Features:**
- Person-by-person list
- Expandable daily breakdown
- Link to view full individual timesheet
- Bulk approve checkboxes

---

## 📊 Database Schema

```sql
-- Timesheets table (one per contractor per project per month)
CREATE TABLE timesheets (
  id UUID PRIMARY KEY,
  contractor_id UUID REFERENCES contractors(id),
  project_id UUID REFERENCES projects(id),
  month DATE,  -- First day of month
  status VARCHAR(20),  -- draft, submitted, approved, rejected
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  rejected_at TIMESTAMP,
  manager_notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(contractor_id, project_id, month)
);

-- Timesheet entries table
CREATE TABLE timesheet_entries (
  id UUID PRIMARY KEY,
  timesheet_id UUID REFERENCES timesheets(id) ON DELETE CASCADE,
  date DATE,
  hours DECIMAL(4,2),
  task VARCHAR(255),
  notes TEXT,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(timesheet_id, date)
);

-- Indexes
CREATE INDEX idx_timesheets_contractor ON timesheets(contractor_id);
CREATE INDEX idx_timesheets_project ON timesheets(project_id);
CREATE INDEX idx_timesheets_status ON timesheets(status);
CREATE INDEX idx_entries_timesheet ON timesheet_entries(timesheet_id);
```

---

## 🔐 Permission Model

### Contractor (Owner)
**Can:**
- ✅ View their own timesheet
- ✅ Add/edit/delete entries (when status = draft or rejected)
- ✅ Submit timesheet (when status = draft)
- ✅ View approval status

**Cannot:**
- ❌ Edit after submission (unless rejected)
- ❌ Approve their own timesheet
- ❌ View other contractors' timesheets

### Manager (Approver)
**Can:**
- ✅ View all contractor timesheets for their projects
- ✅ View aggregate calendar
- ✅ Approve/reject timesheets
- ✅ Add manager notes
- ✅ View timesheet history
- ✅ Use bulk entry tool (creates draft entries for contractors)

**Cannot:**
- ❌ Edit contractor entries directly
- ❌ Submit on behalf of contractor

---

## 🚀 Key Benefits

### For Contractors

**Clean ownership:**
```
Sarah opens "My Timesheets"
→ Sees only her timesheets
→ One per project per month
→ Clear status for each
→ Easy to track what's pending vs approved
```

**Edit control:**
```
If manager rejects:
→ Timesheet returns to "draft"
→ Contractor sees manager notes
→ Contractor edits and resubmits
→ Clear revision history
```

### For Managers

**Aggregate overview:**
```
Manager opens "Team Timesheets"
→ Sees calendar with daily totals
→ Color-coded by status
→ Can filter by person
→ Can drill down to individuals
```

**Flexible approval:**
```
Options:
1. Approve entire timesheet (all entries)
2. Approve individual day
3. Approve all pending for a day
4. Reject with notes
```

### For Accounting

**Clean records:**
```
Query: "Show all approved timesheets for October"
→ Returns list of timesheet IDs
→ Each timesheet = one person, one project, one month
→ Status = approved
→ Easy to export to payroll
```

**Audit trail:**
```
Timesheet lifecycle:
- Created at: 2025-10-01
- Submitted at: 2025-10-31
- Approved at: 2025-11-01
- Approved by: Manager ID
- Manager notes: "Looks good, thanks"
```

---

## 🎯 Best Practices

### When to Use Bulk Entry

**✅ Good for:**
- Team sprints with identical hours
- Regular schedules (e.g., Mon-Fri, 8h)
- Recurring patterns (e.g., weekly meetings)
- Pre-filling drafts for contractors to review

**❌ Not good for:**
- Mixed hours across team
- Variable daily schedules
- Different tasks per person
- When contractors prefer to enter their own

### Manager Workflow

**Daily:**
1. Check dashboard for new submissions
2. Review aggregate calendar
3. Approve straightforward entries

**Weekly:**
1. Review all pending timesheets
2. Check for anomalies (>40h weeks, etc.)
3. Bulk approve consistent patterns

**Monthly:**
1. Close out month
2. Export approved timesheets
3. Send to accounting

### Contractor Workflow

**Weekly:**
1. Fill in timesheet as you go
2. Don't wait until month-end
3. Add detailed notes

**Month-end:**
1. Review full month
2. Check totals
3. Submit for approval
4. Follow up if not approved in 48h

---

## 🔄 Migration from Shared Entries

If you previously had shared entries, migrate with:

```typescript
// Old model (shared)
{
  date: "2025-10-15",
  hours: 8,
  task: "Development",
  persons: [Sarah, Mike, Lisa]
}

// New model (individual)
// Sarah's timesheet
{
  timesheet_id: "ts-sarah-oct",
  entries: [
    { date: "2025-10-15", hours: 8, task: "Development" }
  ]
}

// Mike's timesheet
{
  timesheet_id: "ts-mike-oct",
  entries: [
    { date: "2025-10-15", hours: 8, task: "Development" }
  ]
}

// Lisa's timesheet
{
  timesheet_id: "ts-lisa-oct",
  entries: [
    { date: "2025-10-15", hours: 8, task: "Development" }
  ]
}
```

**Migration script:**
```sql
-- For each shared entry
INSERT INTO timesheet_entries (timesheet_id, date, hours, task)
SELECT 
  ts.id,
  se.date,
  se.hours,
  se.task
FROM shared_entries se
CROSS JOIN LATERAL (
  SELECT id FROM timesheets 
  WHERE contractor_id = ANY(se.person_ids)
  AND month = DATE_TRUNC('month', se.date)
) ts;
```

---

## 🎉 Summary

WorkGraph's Timesheet V2 Architecture provides:

✅ **Clean separation** - One timesheet per contractor per project per month
✅ **Individual ownership** - Each contractor controls their own entries
✅ **Status tracking** - Draft → Submitted → Approved/Rejected
✅ **Manager aggregate** - See totals, drill down to individuals
✅ **Bulk entry tool** - Convenience for identical hours (creates separate entries)
✅ **Flexible approval** - Approve by timesheet, day, or entry
✅ **Audit trail** - Complete history of submissions and approvals
✅ **Clean accounting** - One approved timesheet = one payment record

**Result:** Clear accountability, efficient workflows, happy contractors and managers! 🎉
