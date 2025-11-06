# ⏱️ Timesheet System: Complete Implementation Guide

## Executive Summary

WorkGraph's timesheet system supports **both hourly and daily time tracking** with a smooth approval workflow, auto-invoicing, and payment processing. It's designed to be better than traditional timesheet portals by being flexible, intuitive, and integrated.

---

## 🎯 What We Built

### 1. Dual-Mode Time Tracking

**Hours Only Mode** (Simple)
- Enter total hours worked per day
- Best for: Consultants, designers, simple hourly work
- Example: "I worked 8 hours on Tuesday"

**Start/End Time Mode** (Detailed)
- Log start time, end time, and break duration
- Auto-calculates hours
- Best for: Agencies needing detailed time tracking, compliance
- Example: "9:00 AM - 5:30 PM with 30 min break = 8 hours"

### 2. Weekly View with Daily Breakdown

Unlike the template (which shows a long list of dates), we use:
- **Week navigation** (previous/next buttons)
- **7-day grid** (Mon-Sun) for current week
- **Running totals** and pay estimates
- **Copy previous week** feature for recurring work

### 3. Complete Approval Workflow

**Contractor View:**
1. Fill in hours for the week
2. Add notes for each day
3. Save draft (auto-save)
4. Submit for approval
5. Get notified of approval/rejection

**Manager View:**
1. See all pending timesheets
2. View detailed daily breakdown
3. Compare to previous weeks
4. Approve or reject with notes
5. Auto-generate invoice on approval

---

## 📊 Feature Comparison

| Feature | Traditional Timesheet | WorkGraph Timesheet |
|---------|----------------------|---------------------|
| **Entry Method** | Manual rows, many clicks | Quick weekly grid |
| **Time Tracking** | Hours only | Hours OR start/end time |
| **Break Tracking** | Manual deduction | Auto-calculated from times |
| **Week Navigation** | Dropdown selector | Prev/Next buttons |
| **Copy Previous** | ❌ No | ✅ One-click copy |
| **Task Assignment** | Free text | Dropdown with common tasks |
| **Status Workflow** | Draft → Submit | Draft → Submitted → Approved/Rejected |
| **Auto-Invoice** | ❌ Manual | ✅ On approval |
| **Manager Review** | Separate tool | Integrated view |
| **Variance Detection** | ❌ No | ✅ Auto-flags unusual hours |
| **Mobile-Friendly** | ❌ No | ✅ Responsive |

---

## 🏗️ Technical Architecture

### Component Structure

```
/components/timesheets/
├── TimesheetModule.tsx           // Main contractor view
├── TimesheetApprovalView.tsx     // Manager approval interface
└── (future)
    ├── TimesheetHistory.tsx      // Past timesheets
    ├── TimesheetExport.tsx       // Export/download
    └── TimesheetSettings.tsx     // Preferences
```

### Data Model

```typescript
interface TimesheetEntry {
  id: string;
  date: Date;
  hours: number;              // Total hours (calculated or manual)
  startTime?: string;         // "09:00" (optional)
  endTime?: string;           // "17:30" (optional)
  breakMinutes: number;       // 0, 30, 60, etc.
  notes: string;              // "Worked on API integration"
  projectTask?: string;       // "Development", "Design", etc.
}

interface Timesheet {
  id: string;
  contractorId: string;
  projectId: string;
  weekStart: Date;           // Monday of the week
  weekEnd: Date;             // Sunday of the week
  entries: TimesheetEntry[]; // 7 entries (Mon-Sun)
  status: "draft" | "submitted" | "approved" | "rejected";
  totalHours: number;        // Sum of all entries
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;      // Manager feedback
}
```

### Supabase Schema

```sql
CREATE TABLE timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID REFERENCES users(id) NOT NULL,
  project_id UUID REFERENCES projects(id) NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  status TEXT DEFAULT 'draft',
  total_hours DECIMAL(5,2) DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(contractor_id, project_id, week_start),
  CHECK (status IN ('draft', 'submitted', 'approved', 'rejected'))
);

CREATE TABLE timesheet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timesheet_id UUID REFERENCES timesheets(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hours DECIMAL(5,2) NOT NULL DEFAULT 0,
  start_time TIME,
  end_time TIME,
  break_minutes INTEGER DEFAULT 0,
  notes TEXT,
  project_task TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(timesheet_id, date),
  CHECK (hours >= 0 AND hours <= 24),
  CHECK (break_minutes >= 0 AND break_minutes <= 480)
);

-- Index for fast queries
CREATE INDEX idx_timesheets_contractor ON timesheets(contractor_id, week_start);
CREATE INDEX idx_timesheets_status ON timesheets(status);
CREATE INDEX idx_timesheets_project ON timesheets(project_id, status);
```

---

## 🎨 User Experience Flow

### Contractor: Filling Timesheet

```
1. Open project workspace
2. Click "Timesheets" tab
3. See current week (Mon-Sun)
4. Choose tracking mode:
   - "Hours Only" → Enter 8, 7.5, 8, etc.
   - "Start/End Time" → Enter 9:00 AM, 5:30 PM, 30 min break → Auto-calc
5. Select task from dropdown (optional)
6. Add notes: "Worked on user authentication"
7. See running total update in real-time
8. Click "Save Draft" (auto-saves every 30s)
9. Click "Submit for Approval" when ready
10. Confirmation: "You logged 40 hours for $3,800"
11. Submit → Status changes to "Pending Approval"
12. Wait for manager review
```

### Manager: Approving Timesheet

```
1. See notification: "3 timesheets pending"
2. Open "Timesheets" → "Pending Approvals" tab
3. See list of pending timesheets with:
   - Contractor name and role
   - Total hours and amount
   - Comparison to previous weeks
   - Warning if unusual variance
4. Click "View Details" to expand
5. See day-by-day breakdown:
   - Mon: 8 hrs - Development - "Fixed login bug"
   - Tue: 8 hrs - Code Review - "Reviewed 3 PRs"
   - etc.
6. Decide: Approve or Reject
7. If approve:
   - Optional: Add positive feedback
   - Click "Approve & Generate Invoice"
   - System creates invoice automatically
   - Contractor notified
8. If reject:
   - Required: Explain why
   - Click "Reject & Return"
   - Timesheet goes back to contractor as draft
   - They can edit and resubmit
```

---

## 🚀 Key Features Explained

### 1. Week Navigation

**Why weekly?**
- Most contractors work Mon-Fri or recurring weekly schedules
- Easier to review than scrolling through months
- Matches payment cycles (weekly/bi-weekly)

**How it works:**
- Always starts on Monday
- Shows week number (e.g., "Week 2 of 2024")
- Previous/Next buttons to navigate
- Date range display: "Jan 8 - Jan 14"

### 2. Dual Tracking Modes

**Hours Only Mode:**
```
| Date    | Hours | Task        | Notes                |
|---------|-------|-------------|----------------------|
| Mon 8th | 8.0   | Development | Fixed authentication |
| Tue 9th | 7.5   | Code Review | Reviewed 3 PRs       |
```

**Start/End Time Mode:**
```
| Date    | Start | End   | Break | Hours | Task        |
|---------|-------|-------|-------|-------|-------------|
| Mon 8th | 09:00 | 17:30 | 30    | 8.0   | Development |
| Tue 9th | 09:00 | 17:00 | 30    | 7.5   | Code Review |
```

**Auto-calculation:**
```javascript
function calculateHours(startTime, endTime, breakMinutes) {
  const start = parseTime(startTime); // 9:00 → 540 minutes
  const end = parseTime(endTime);     // 17:30 → 1050 minutes
  const workMinutes = end - start - breakMinutes;
  return workMinutes / 60; // Convert to hours
}
```

### 3. Copy Previous Week

**Use Case:**
Contractor works same hours every week (e.g., 40 hrs Mon-Fri)

**Flow:**
1. Click "Copy Previous Week"
2. System fetches last week's timesheet
3. Copies hours, tasks, and notes
4. Adjusts dates to current week
5. Status set to "draft"
6. Contractor can edit before submitting

**Saves ~5 minutes per week** for regular contractors

### 4. Task Assignment

**Why dropdowns vs free text?**
- Consistent categorization
- Easy reporting ("How many hours on Development?")
- Auto-suggest based on project type

**Common Tasks:**
- Development
- UI Design
- Code Review
- Client Meeting
- Planning
- Testing/QA
- Documentation
- Bug Fixes

**Customizable per project** in settings

### 5. Status Workflow

```
Draft
  ↓ (Contractor clicks "Submit")
Submitted
  ↓ (Manager reviews)
  ├→ Approved → Invoice Generated → Payment Processed
  └→ Rejected → Back to Draft → Contractor edits → Re-submit
```

**Email Notifications:**
- Draft saved: ❌ No email (auto-save is silent)
- Submitted: ✅ Manager gets email
- Approved: ✅ Contractor gets email + invoice PDF
- Rejected: ✅ Contractor gets email with feedback

### 6. Variance Detection

**Problem:**
Manager needs to catch errors (forgot to log hours, double-counted)

**Solution:**
Auto-compare to previous weeks:

```javascript
const variance = currentHours - previousHours;
const percentChange = (variance / previousHours) * 100;

if (percentChange > 20) {
  // Flag: "↑ 25% vs last week"
  // Show warning badge
}
```

**Display:**
- Normal (within ±10%): No badge
- High (+10-25%): 🟡 Yellow badge "↑ 15% vs last week"
- Very High (>25%): 🟠 Orange badge "↑ 32% - review carefully"
- Low (<-10%): 🔵 Blue badge "↓ 12% vs last week"

### 7. Auto-Invoice Generation

**When timesheet approved:**

1. Create invoice record in database
2. Generate PDF with:
   - Contractor details
   - Company billing info
   - Line items (40 hrs @ $95/hr = $3,800)
   - Tax breakdown (if applicable)
   - Payment terms (Net 5, Net 15, etc.)
3. Email to company accounts payable
4. Email copy to contractor
5. Mark as "pending payment"

**Invoice #:** `WG-2024-0015`

**Payment Status:**
- Pending → Processing → Paid
- Expected payment date shown

---

## 💡 Better Than Template

### Template Issues We Fixed

❌ **Long scrolling list** → ✅ Weekly grid view  
❌ **Manual date entry** → ✅ Pre-populated week  
❌ **No variance checking** → ✅ Auto-compare weeks  
❌ **Separate approval tool** → ✅ Integrated manager view  
❌ **No draft saving** → ✅ Auto-save every 30s  
❌ **Manual calculations** → ✅ Auto-totals  
❌ **No task categorization** → ✅ Dropdown selectors  
❌ **Hard to review** → ✅ Collapsible daily breakdown  
❌ **No mobile support** → ✅ Fully responsive  
❌ **No bulk actions** → ✅ Approve all, Export all  

---

## 📱 Mobile Experience

### Contractor (iPhone)

```
┌─────────────────────────┐
│ Timesheet               │
│ John Doe · $95/hr       │
├─────────────────────────┤
│  [<]  Jan 8-14  [>]     │
│  Week 2                 │
├─────────────────────────┤
│ Mode: [Hours] [Time]    │
├─────────────────────────┤
│ Mon 8    [8.0 hrs]  ✓   │
│ Development             │
│ "Fixed auth bug"        │
│                         │
│ Tue 9    [7.5 hrs]  ✓   │
│ Code Review             │
│ "Reviewed PRs"          │
│                         │
│ Wed 10   [8.0 hrs]  ✓   │
│ ...                     │
├─────────────────────────┤
│ Total: 40 hrs           │
│ Pay: $3,800             │
├─────────────────────────┤
│ [Save Draft] [Submit]   │
└─────────────────────────┘
```

### Manager (iPad)

```
┌───────────────────────────────────────┐
│ Pending Approvals (3)                 │
├───────────────────────────────────────┤
│ Sarah Chen                    40 hrs  │
│ Senior Engineer              $4,800   │
│ Jan 8-14 · 2 hours ago                │
│ ↑ 5% vs last week (normal)            │
│ [View Details ▼] [Reject] [Approve]   │
│                                       │
│ Mike Johnson                  35 hrs  │
│ Controls Engineer            $3,850   │
│ Jan 8-14 · 3 hours ago                │
│ ↓ 12% vs last week                    │
│ [View Details ▼] [Reject] [Approve]   │
└───────────────────────────────────────┘
```

---

## 🔧 Configuration Options

### Project-Level Settings

```typescript
interface TimesheetSettings {
  // Tracking
  defaultMode: "hours" | "time";
  requireNotes: boolean;
  requireTaskSelection: boolean;
  
  // Schedule
  weekStartDay: "monday" | "sunday";
  submissionDeadline: "friday" | "saturday" | "sunday";
  reminderDay: "thursday" | "friday";
  
  // Approval
  autoApproveUnder?: number;  // e.g., 40 hrs (skip approval)
  requireManagerNotes: boolean;
  
  // Tasks
  availableTasks: string[];
  customTasks: boolean;
  
  // Payment
  paymentSchedule: "weekly" | "biweekly" | "monthly";
  invoiceTemplate: "standard" | "detailed";
}
```

### Company-Level Defaults

```typescript
interface CompanyTimesheetDefaults {
  defaultHourlyRate: number;
  defaultBreakMinutes: number;
  overtimeThreshold: number;     // e.g., 40 hrs/week
  overtimeMultiplier: number;    // e.g., 1.5x
  requireTimesheetApproval: boolean;
  allowBackdating: boolean;
  maxBackdatingDays: number;
}
```

---

## 📊 Reporting & Analytics

### For Contractors

**My Timesheet History:**
- List of all past timesheets
- Filter by: Date, Status, Project
- Totals: Hours, Earnings (YTD, QTD, MTD)
- Export: CSV, PDF

**Example:**
```
2024 Year-to-Date Summary
─────────────────────────
Total Hours:     520 hrs
Total Earnings:  $49,400
Avg Weekly:      40 hrs
Projects:        3 active
```

### For Managers

**Team Timesheet Dashboard:**
- Hours by contractor (this week, this month)
- Hours by project
- Approval queue (pending count)
- Budget tracking (hours used vs allocated)
- Variance alerts (unusual patterns)

**Example:**
```
Mobile App Project - January
────────────────────────────
Total Hours:      180 hrs
Total Cost:       $17,100
Budget Used:      68% (on track)
Contractors:      3 active

Breakdown:
• Development:    120 hrs (67%)
• Design:         40 hrs (22%)
• Review:         20 hrs (11%)
```

---

## 🚦 Validation & Error Handling

### Entry Validation

```typescript
// Hours validation
if (hours < 0 || hours > 24) {
  error("Hours must be between 0 and 24");
}

// Time validation
if (startTime && endTime) {
  const hours = calculateHours(startTime, endTime, breakMinutes);
  if (hours < 0) {
    error("End time must be after start time");
  }
  if (hours > 16) {
    warning("You logged more than 16 hours. Is this correct?");
  }
}

// Break validation
if (breakMinutes < 0 || breakMinutes > 480) {
  error("Break must be between 0 and 480 minutes (8 hours)");
}

// Week validation
if (totalHours > 100) {
  warning("You logged over 100 hours this week. Please double-check.");
}
```

### Submission Validation

```typescript
function canSubmit(timesheet: Timesheet): boolean {
  if (timesheet.totalHours === 0) {
    toast.error("Please add hours before submitting");
    return false;
  }
  
  if (timesheet.entries.some(e => e.hours > 0 && !e.notes)) {
    if (settings.requireNotes) {
      toast.error("Please add notes for all days worked");
      return false;
    }
  }
  
  if (timesheet.entries.some(e => e.hours > 0 && !e.projectTask)) {
    if (settings.requireTaskSelection) {
      toast.error("Please select a task for all entries");
      return false;
    }
  }
  
  return true;
}
```

---

## 🔐 Security & Permissions

### Access Control

```typescript
// Who can do what
const permissions = {
  contractor: {
    create: ["own_timesheets"],
    read: ["own_timesheets", "own_invoices"],
    update: ["own_draft_timesheets"],
    delete: ["own_draft_timesheets"],
  },
  
  manager: {
    create: [],
    read: ["project_timesheets", "team_timesheets"],
    update: ["approve_timesheets", "reject_timesheets"],
    delete: [],
  },
  
  admin: {
    create: ["any_timesheet"],
    read: ["all_timesheets"],
    update: ["any_timesheet"],
    delete: ["any_timesheet"],
  },
};
```

### Audit Trail

```sql
CREATE TABLE timesheet_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timesheet_id UUID REFERENCES timesheets(id),
  action TEXT NOT NULL,  -- 'created', 'updated', 'submitted', 'approved', 'rejected'
  actor_id UUID REFERENCES users(id),
  changes JSONB,         -- What changed
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Track all changes
INSERT INTO timesheet_audit_log (timesheet_id, action, actor_id, changes)
VALUES (
  'ts-001',
  'updated',
  'user-123',
  '{"hours": {"old": 7.5, "new": 8.0}, "date": "2024-01-08"}'
);
```

---

## 📈 Future Enhancements

### Phase 2 (Post-MVP)

- [ ] **Overtime calculation** (>40 hrs = 1.5x rate)
- [ ] **Holiday pay** (2x rate on holidays)
- [ ] **Multiple projects** (split hours across projects)
- [ ] **Expense tracking** (add receipts to timesheet)
- [ ] **GPS tracking** (for field workers)
- [ ] **Photo attachments** (proof of work)

### Phase 3 (Advanced)

- [ ] **Timesheet templates** (recurring schedules)
- [ ] **Bulk approval** (approve all at once)
- [ ] **AI anomaly detection** (flag suspicious patterns)
- [ ] **Integration with accounting** (QuickBooks, Xero)
- [ ] **Mobile app** (native iOS/Android)
- [ ] **Offline mode** (log hours without internet)

---

## 🎓 Best Practices

### For Contractors

**DO:**
- ✅ Log hours daily (don't wait until Friday)
- ✅ Be specific in notes ("Fixed login bug" not "Worked on stuff")
- ✅ Double-check totals before submitting
- ✅ Submit on time (Friday by 5 PM)
- ✅ Save drafts frequently

**DON'T:**
- ❌ Log rounded hours (8.0, 8.0, 8.0) - vary naturally
- ❌ Submit without reviewing
- ❌ Leave notes blank
- ❌ Wait until last minute
- ❌ Forget to include breaks

### For Managers

**DO:**
- ✅ Review timesheets within 24 hours
- ✅ Provide constructive feedback
- ✅ Approve legitimate work immediately
- ✅ Check variance warnings
- ✅ Communicate payment timeline

**DON'T:**
- ❌ Delay approvals (blocks payment)
- ❌ Reject without explanation
- ❌ Micro-manage every minute
- ❌ Ignore unusual patterns
- ❌ Skip variance review

---

## 🎯 Success Metrics

### Contractor Satisfaction
- Time to fill timesheet: <5 minutes (target)
- Submission rate: >95% on time
- Approval speed: <24 hours
- Payment accuracy: 100%

### Manager Efficiency
- Review time per timesheet: <2 minutes
- Approval rate: >90% first-try
- Rejection rate: <5%
- Variance detection accuracy: >80%

### System Health
- Auto-save success: >99.9%
- Invoice generation: 100% automated
- Mobile usage: >40% of submissions
- Error rate: <0.1%

---

## 🚀 Summary

WorkGraph's timesheet system is **better than traditional portals** because:

1. ✅ **Dual modes** (hours or time tracking)
2. ✅ **Weekly grid view** (not endless scrolling)
3. ✅ **Auto-calculations** (no math errors)
4. ✅ **Variance detection** (catch mistakes early)
5. ✅ **Integrated approval** (managers see everything)
6. ✅ **Auto-invoicing** (no manual billing)
7. ✅ **Mobile-friendly** (log hours anywhere)
8. ✅ **Real-time updates** (see totals instantly)

**Result:** Contractors spend less time on admin, managers catch errors faster, and everyone gets paid on time.

Ready to ship! 🚀
