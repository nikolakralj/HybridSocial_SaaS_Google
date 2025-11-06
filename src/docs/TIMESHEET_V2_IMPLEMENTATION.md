# 🚀 Timesheet V2 Implementation Guide

## Quick Start

WorkGraph's Timesheet V2 follows a **clean separation** architecture:
- ✅ Individual timesheets (one per contractor per project per month)
- ✅ Bulk entry tool (convenience, not shared data)
- ✅ Manager aggregate view with drill-down

---

## 🎨 Components Created

### 1. **IndividualTimesheet.tsx**
Individual contractor's monthly timesheet

**Usage:**
```tsx
import { IndividualTimesheet } from "./components/timesheets/IndividualTimesheet";

<IndividualTimesheet
  contractorId="c1"
  contractorName="Sarah Chen"
  projectId="proj-1"
  projectName="Mobile App Redesign"
  month={new Date(2025, 9, 1)} // October 2025
  status="draft"
  entries={[
    {
      id: "e1",
      date: new Date(2025, 9, 6),
      hours: 8,
      task: "Development",
      notes: "Built API endpoints",
    },
    // ... more entries
  ]}
  onUpdateEntry={(entry) => {
    // Save entry to database
  }}
  onDeleteEntry={(entryId) => {
    // Delete entry from database
  }}
  onSubmit={() => {
    // Change timesheet status to "submitted"
  }}
/>
```

**Features:**
- Monthly calendar grid
- Inline quick-add (click "+")
- Copy previous day (click copy icon)
- Drag & drop to duplicate entries
- Status badge and submit button
- Locked when submitted/approved

---

### 2. **BulkTimesheetEntry.tsx**
Bulk entry tool for creating entries across multiple contractors

**Usage:**
```tsx
import { BulkTimesheetEntry } from "./components/timesheets/BulkTimesheetEntry";

<BulkTimesheetEntry
  projectId="proj-1"
  projectName="Mobile App Redesign"
  contractors={[
    { id: "c1", name: "Sarah Chen", avatar: "SC", role: "Senior Engineer" },
    { id: "c2", name: "Mike Johnson", avatar: "MJ", role: "Frontend Dev" },
    { id: "c3", name: "Lisa Park", avatar: "LP", role: "UI Designer" },
  ]}
  month={new Date(2025, 9, 1)}
  onCreateEntries={(contractorIds, pattern) => {
    // For each contractor, create entries in their individual timesheet
    contractorIds.forEach(contractorId => {
      // Create entries based on pattern
      const days = getDaysInPattern(pattern);
      days.forEach(day => {
        createEntry({
          contractorId,
          date: day,
          hours: pattern.hours,
          task: pattern.task,
          notes: pattern.notes,
        });
      });
    });
  }}
/>
```

**What it does:**
- Opens dialog with contractor selection
- Defines pattern (hours, task, working days)
- Creates **separate entries** in each contractor's **individual timesheet**
- Shows preview: "15 entries will be created"

---

### 3. **TimesheetManagerCalendarView.tsx** (Updated)
Manager's aggregate calendar with drill-down

**Usage:**
```tsx
import { TimesheetManagerCalendarView } from "./components/timesheets/TimesheetManagerCalendarView";

<TimesheetManagerCalendarView
  onViewIndividualTimesheet={(contractorId, contractorName) => {
    // Open contractor's full timesheet
    // Options:
    // 1. Navigate to dedicated page
    // 2. Open in modal/drawer
    // 3. Open in side panel
    console.log("View timesheet for:", contractorName);
  }}
/>
```

**Features:**
- Monthly calendar with daily totals
- Click day → See all contributors
- Click "View Full Timesheet" → Opens contractor's individual timesheet
- Approve/reject individual entries
- Bulk approve all pending for a day

---

## 🔄 Complete Integration Example

### Project Workspace Integration

```tsx
// In ProjectWorkspace.tsx
import { IndividualTimesheet } from "./components/timesheets/IndividualTimesheet";
import { BulkTimesheetEntry } from "./components/timesheets/BulkTimesheetEntry";
import { TimesheetManagerCalendarView } from "./components/timesheets/TimesheetManagerCalendarView";

function ProjectWorkspace() {
  const [view, setView] = useState<"my-timesheet" | "team-timesheets">("my-timesheet");
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null);
  const currentUser = useCurrentUser();
  const isManager = currentUser.role === "manager";

  return (
    <div>
      {/* Tab switcher */}
      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="my-timesheet">My Timesheet</TabsTrigger>
          {isManager && (
            <TabsTrigger value="team-timesheets">Team Timesheets</TabsTrigger>
          )}
        </TabsList>

        {/* My Timesheet (Individual) */}
        <TabsContent value="my-timesheet">
          <div className="space-y-4">
            {/* Only show if contractor can use bulk entry */}
            {isManager && (
              <BulkTimesheetEntry
                projectId={currentProject.id}
                projectName={currentProject.name}
                contractors={projectContractors}
                month={currentMonth}
                onCreateEntries={handleBulkCreate}
              />
            )}

            <IndividualTimesheet
              contractorId={currentUser.id}
              contractorName={currentUser.name}
              projectId={currentProject.id}
              projectName={currentProject.name}
              month={currentMonth}
              status={myTimesheet.status}
              entries={myTimesheet.entries}
              onUpdateEntry={handleUpdateEntry}
              onDeleteEntry={handleDeleteEntry}
              onSubmit={handleSubmitTimesheet}
            />
          </div>
        </TabsContent>

        {/* Team Timesheets (Manager Aggregate) */}
        {isManager && (
          <TabsContent value="team-timesheets">
            {selectedContractor ? (
              // Show individual contractor's timesheet
              <div>
                <Button onClick={() => setSelectedContractor(null)}>
                  ← Back to Aggregate
                </Button>
                
                <IndividualTimesheet
                  contractorId={selectedContractor.id}
                  contractorName={selectedContractor.name}
                  projectId={currentProject.id}
                  projectName={currentProject.name}
                  month={currentMonth}
                  status={contractorTimesheet.status}
                  entries={contractorTimesheet.entries}
                  onUpdateEntry={() => {}} // Manager can't edit
                  onDeleteEntry={() => {}} // Manager can't delete
                  onSubmit={() => {}} // Manager can't submit
                />
              </div>
            ) : (
              // Show aggregate calendar
              <TimesheetManagerCalendarView
                onViewIndividualTimesheet={(contractorId, contractorName) => {
                  setSelectedContractor({ id: contractorId, name: contractorName });
                }}
              />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
```

---

## 🗃️ Database Implementation

### Supabase Tables

```sql
-- Timesheets table
CREATE TABLE timesheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id UUID REFERENCES users(id) NOT NULL,
  project_id UUID REFERENCES projects(id) NOT NULL,
  month DATE NOT NULL,  -- First day of month (e.g., 2025-10-01)
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  rejected_at TIMESTAMP,
  manager_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_contractor_project_month UNIQUE(contractor_id, project_id, month)
);

-- Timesheet entries table
CREATE TABLE timesheet_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timesheet_id UUID REFERENCES timesheets(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  hours DECIMAL(4,2) NOT NULL,
  task VARCHAR(255) NOT NULL,
  notes TEXT,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_timesheet_date UNIQUE(timesheet_id, date)
);

-- Indexes
CREATE INDEX idx_timesheets_contractor ON timesheets(contractor_id);
CREATE INDEX idx_timesheets_project ON timesheets(project_id);
CREATE INDEX idx_timesheets_status ON timesheets(status);
CREATE INDEX idx_timesheets_month ON timesheets(month);
CREATE INDEX idx_entries_timesheet ON timesheet_entries(timesheet_id);
CREATE INDEX idx_entries_date ON timesheet_entries(date);

-- RLS Policies
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheet_entries ENABLE ROW LEVEL SECURITY;

-- Contractors can view/edit their own timesheets
CREATE POLICY "Contractors can view own timesheets"
  ON timesheets FOR SELECT
  USING (contractor_id = auth.uid());

CREATE POLICY "Contractors can create own timesheets"
  ON timesheets FOR INSERT
  WITH CHECK (contractor_id = auth.uid());

CREATE POLICY "Contractors can update own draft/rejected timesheets"
  ON timesheets FOR UPDATE
  USING (contractor_id = auth.uid() AND status IN ('draft', 'rejected'));

-- Managers can view all timesheets for their projects
CREATE POLICY "Managers can view project timesheets"
  ON timesheets FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

-- Managers can approve timesheets
CREATE POLICY "Managers can approve timesheets"
  ON timesheets FOR UPDATE
  USING (
    project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

-- Similar policies for timesheet_entries...
```

---

## 📝 API Implementation

### Create/Get Timesheet

```typescript
// Get or create timesheet for contractor + project + month
async function getOrCreateTimesheet(
  contractorId: string,
  projectId: string,
  month: Date
): Promise<Timesheet> {
  const { data, error } = await supabase
    .from('timesheets')
    .select('*, entries:timesheet_entries(*)')
    .eq('contractor_id', contractorId)
    .eq('project_id', projectId)
    .eq('month', month.toISOString().split('T')[0])
    .single();

  if (error && error.code === 'PGRST116') {
    // Not found, create new
    const { data: newTimesheet } = await supabase
      .from('timesheets')
      .insert({
        contractor_id: contractorId,
        project_id: projectId,
        month: month.toISOString().split('T')[0],
        status: 'draft',
      })
      .select('*, entries:timesheet_entries(*)')
      .single();
    
    return newTimesheet;
  }

  return data;
}
```

### Add Entry

```typescript
async function addEntry(
  timesheetId: string,
  entry: {
    date: Date;
    hours: number;
    task: string;
    notes: string;
  }
) {
  const { data, error } = await supabase
    .from('timesheet_entries')
    .insert({
      timesheet_id: timesheetId,
      date: entry.date.toISOString().split('T')[0],
      hours: entry.hours,
      task: entry.task,
      notes: entry.notes,
    })
    .select()
    .single();

  return data;
}
```

### Submit Timesheet

```typescript
async function submitTimesheet(timesheetId: string) {
  const { data, error } = await supabase
    .from('timesheets')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
    .eq('id', timesheetId)
    .select()
    .single();

  return data;
}
```

### Bulk Create Entries

```typescript
async function bulkCreateEntries(
  contractorIds: string[],
  projectId: string,
  month: Date,
  pattern: {
    hours: number;
    task: string;
    notes: string;
    weekdays: number[];
  }
) {
  // Get or create timesheets for each contractor
  const timesheets = await Promise.all(
    contractorIds.map(id => getOrCreateTimesheet(id, projectId, month))
  );

  // Generate dates based on pattern
  const dates = getDatesForPattern(month, pattern.weekdays);

  // Create entries
  const entriesToCreate = [];
  timesheets.forEach(timesheet => {
    dates.forEach(date => {
      entriesToCreate.push({
        timesheet_id: timesheet.id,
        date: date.toISOString().split('T')[0],
        hours: pattern.hours,
        task: pattern.task,
        notes: pattern.notes,
      });
    });
  });

  const { data, error } = await supabase
    .from('timesheet_entries')
    .insert(entriesToCreate)
    .select();

  return data;
}

function getDatesForPattern(month: Date, weekdays: number[]): Date[] {
  const dates: Date[] = [];
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, monthIndex, day);
    if (weekdays.includes(date.getDay())) {
      dates.push(date);
    }
  }

  return dates;
}
```

---

## 🎯 Key Points

### ✅ DO

1. **Create individual timesheets** - One per contractor per project per month
2. **Use bulk entry** - For teams with identical hours (it creates separate entries)
3. **Lock submitted timesheets** - Contractors can't edit after submission
4. **Allow rejection workflow** - Manager rejects → Contractor edits → Resubmits
5. **Link aggregate to individual** - "View Full Timesheet" button in manager view

### ❌ DON'T

1. **Don't share entries** - Each contractor has their own data
2. **Don't let managers edit contractor data** - They approve/reject only
3. **Don't auto-submit** - Contractors must review before submitting
4. **Don't mix months** - One timesheet = one month
5. **Don't allow editing after approval** - Create audit trail

---

## 🎉 Summary

**Architecture:**
```
Individual Timesheets
├── Sarah's October timesheet (draft)
├── Mike's October timesheet (submitted)
└── Lisa's October timesheet (approved)

Manager Aggregate View
├── Shows daily totals
├── Drills down to see contributors
└── Links to individual timesheets

Bulk Entry Tool
└── Creates separate entries in each individual timesheet
```

**Components:**
- `IndividualTimesheet.tsx` - Contractor's own timesheet
- `BulkTimesheetEntry.tsx` - Convenience tool for identical hours
- `TimesheetManagerCalendarView.tsx` - Manager's aggregate view

**Result:** Clean separation, clear accountability, efficient workflows! 🚀
