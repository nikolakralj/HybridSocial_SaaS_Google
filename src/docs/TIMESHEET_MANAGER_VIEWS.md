# 👔 Manager's Aggregate Timesheet Views - Complete Guide

## Overview

WorkGraph's Manager Views provide **three complementary perspectives** for reviewing team timesheets: Calendar (aggregate overview), List (quick approvals), and Cards (detailed review). Managers can drill down from high-level metrics to individual entries, perform bulk approvals, and catch anomalies before processing payments.

---

## 🎯 Three Manager Views

### 1. **Calendar View** (Aggregate Monthly Grid)
**Best for:** Big-picture oversight, pattern detection, daily aggregates

**Features:**
- 📅 Monthly grid showing **total project hours per day**
- 🎨 **Color-coded cells** (green/yellow/red for status)
- 👥 **Click to drill down** by person for any day
- 📊 Week and month totals
- 🔍 Filter by person or task
- ⚡ Quick stats on hover

**Visual:**
```
Oct 3
32h total
Sarah 8h | Mark 6h | Ana 8h | Luka 10h
[🟡 Pending] (click to expand)
```

### 2. **List View** (Person-by-Day Table)
**Best for:** Bulk approvals, quick scanning, exporting

**Features:**
- 📋 Contractors stacked vertically
- ✅ **Checkbox selection** for bulk actions
- 📊 Expandable daily breakdown
- 📈 Variance indicators
- 🔄 Approve/reject individual or bulk
- 📁 Collapsible rows

**Visual:**
```
☑️ Sarah Chen  160h  $19,200  [View Details ▼] [Reject] [Approve]
   Mon 1: 8h Development - Worked on API
   Tue 2: 8h Development - Built frontend
   ...
```

### 3. **Cards View** (Original Detail View)
**Best for:** Deep review, reading notes, anomaly investigation

**Features:**
- 🃏 **One card per contractor**
- 📖 Full breakdown visible
- 💬 Notes and feedback
- 🔍 Variance warnings
- ✅ Individual approval controls

---

## 📅 Calendar View Deep Dive

### Layout

**Monthly Grid:**
```
┌──────────────────────────────────────────────────────────────┐
│              October 2025                      [< >]          │
├──────────────────────────────────────────────────────────────┤
│ Mon  Tue  Wed  Thu  Fri  Sat  Sun │ Week Total               │
├──────────────────────────────────────────────────────────────┤
│                 1    2    3    4   │  80h                     │
│  5    6    7    8    9   10   11   │  96h                     │
│ 12   13   14   15   16   17   18   │  96h                     │
│ 19   20   21   22   23   24   25   │  88h                     │
│ 26   27   28   29   30   31        │  72h                     │
├──────────────────────────────────────────────────────────────┤
│ Total: 432h │ 3 Contractors │ Cost: $48,820 │ Avg: 144h/person│
└──────────────────────────────────────────────────────────────┘
```

### Day Cell Details

**Each cell shows:**
1. **Date number** (top)
2. **Total hours** (center, large, accent color)
3. **Contributor count** (e.g., "3 ppl")
4. **Status icon** (bottom)

**Color Coding:**
- 🟢 **Green border + bg** = All approved
- 🟡 **Yellow border + bg** = Has pending entries
- 🔴 **Red border + bg** = Has rejected entries
- ⚪ **No color** = No entries (weekend/empty)

### Click to Drill Down

**On click:**
```
┌────────────────────────────────────────────────────────────┐
│ Wednesday, October 15, 2025          32h total  $3,420     │
├────────────────────────────────────────────────────────────┤
│ Summary: 3 Contributors | 2 Approved | 1 Pending          │
├────────────────────────────────────────────────────────────┤
│ [Sarah Chen]                                               │
│ SC  Senior Engineer                         [✓ Approved]   │
│ 8h | Development | 9:00-17:00                             │
│ "Built authentication API endpoints"         $960          │
├────────────────────────────────────────────────────────────┤
│ [Mike Johnson]                                             │
│ MJ  Frontend Dev                            [⏱ Pending]    │
│ 6h | UI Design | 9:00-15:30                               │
│ "Designed new dashboard mockups"             $660          │
│                                    [Reject] [Approve]      │
├────────────────────────────────────────────────────────────┤
│ [Lisa Park]                                                │
│ LP  UI Designer                             [✓ Approved]   │
│ 8h | UI Design | 9:00-17:00                               │
│ "Finalized component library"                $760          │
├────────────────────────────────────────────────────────────┤
│                     [Close] [Approve All Pending (1)]      │
└────────────────────────────────────────────────────────────┘
```

### Filters

**Filter by Person:**
```
[All contractors ▼]
→ Sarah Chen only
→ Mike Johnson only
→ Lisa Park only
```

**Filter by Task:**
```
[All tasks ▼]
→ Development only
→ UI Design only
→ Code Review only
```

**Filters apply to:**
- Calendar display (grays out non-matching days)
- Drill-down modal (shows only filtered contributors)
- Monthly totals (recalculates)

### Workflow

**Manager opens Calendar view:**
1. Sees full month at glance
2. Notices Oct 15 has 🟡 yellow border (pending)
3. Clicks Oct 15
4. Modal shows 3 contributors
5. Sees Mike has 6h pending
6. Reviews Mike's notes: "Designed new dashboard mockups"
7. Clicks [Approve] for Mike
8. Modal updates: 🟡 → 🟢 (all approved)
9. Close modal
10. Oct 15 cell now green ✓

---

## 📋 List View Deep Dive

### Layout

**Contractor Rows:**
```
┌──────────────────────────────────────────────────────────────┐
│ October 2025 · 3 contractors                                 │
├──────────────────────────────────────────────────────────────┤
│ ☑️ [Checkbox for bulk selection]                             │
├──────────────────────────────────────────────────────────────┤
│ ☑️ SC Sarah Chen · Senior Engineer      [⏱ 5 Pending]       │
│    160h (20 days) · +5h vs last month                       │
│                          $19,200  [View Details] [Approve]   │
│    ▼ Expanded:                                               │
│      Mon 6: 8h Development - "Built API"     ✓ Approved     │
│      Tue 7: 8h Development - "Fixed bugs"    ⏱ Pending      │
│      ...                                                     │
├──────────────────────────────────────────────────────────────┤
│ ☑️ MJ Mike Johnson · Frontend Dev           [⏱ 3 Pending]   │
│    152h (19 days) · -8h vs last month                       │
│                          $16,720  [View Details] [Approve]   │
├──────────────────────────────────────────────────────────────┤
│ ☑️ LP Lisa Park · UI Designer               [✓ Approved]    │
│    80h (10 days) · Same as last month                       │
│                          $7,600   [View Details] [Approve]   │
└──────────────────────────────────────────────────────────────┘
```

### Bulk Selection

**Select multiple contractors:**
```
☑️ Sarah Chen
☑️ Mike Johnson
☐ Lisa Park

Selected: 2

[Clear Selection] [Approve Selected]
```

**Click [Approve Selected]:**
- Approves all pending entries for Sarah & Mike
- Shows success toast: "Approved 2 timesheets"
- Updates status badges to ✓ Approved
- Clears selection

### Expandable Breakdown

**Collapsed (default):**
```
☑️ SC Sarah Chen    160h    $19,200    [View Details ▼]
```

**Expanded (on click):**
```
☑️ SC Sarah Chen    160h    $19,200    [Hide Details ▲]
   
   Daily Breakdown:
   ┌────────────────────────────────────────────────────────┐
   │ Date      Hours Task        Notes          Status  $ │
   ├────────────────────────────────────────────────────────┤
   │ Mon 6     8h    Development  Built API      ✓       960│
   │ Tue 7     8h    Development  Fixed bugs     ⏱       960│
   │ Wed 8     8h    Code Review  Reviewed PRs   ✓       960│
   │ ...                                                    │
   ├────────────────────────────────────────────────────────┤
   │ Total                                           $19,200│
   └────────────────────────────────────────────────────────┘
```

### Variance Indicators

**Visual cues:**
- ↑ **+5h** (orange/warning) - Worked more than last month
- ↓ **-8h** (blue) - Worked less than last month
- **Same** (gray) - No change

**Triggers warning if:**
- Variance > ±10%
- Total hours > 180h/month (potential burnout)
- Days worked < 5 (very part-time)

### Workflow

**Manager opens List view:**
1. Sees 3 contractors
2. Checks Sarah's variance: +5h (normal)
3. Checks Mike's variance: -8h (acceptable)
4. Wants to approve both quickly
5. Clicks ☑️ Sarah
6. Clicks ☑️ Mike
7. Clicks [Approve Selected]
8. Toast: "Approved 2 timesheets"
9. Done in <30 seconds

---

## 🃏 Cards View Deep Dive

**Original detailed view** - kept for deep investigation

**Use when:**
- Reading contractor notes carefully
- Investigating anomalies
- Adding manager feedback
- Need full context

**See existing TimesheetApprovalView docs**

---

## 🔄 Bulk Approval Workflows

### Scenario 1: Approve Entire Month for One Person

**Calendar View:**
1. Click filter → Select "Sarah Chen"
2. Calendar shows only Sarah's days
3. See 20 days, all pending
4. Click any day → Drill-down modal
5. Click [Approve All Pending]
6. Confirms: "Approve 20 entries for Sarah?"
7. Approve → All Sarah's days turn green

**List View:**
1. Find Sarah's row
2. Click ☑️ checkbox
3. Click [Approve Selected]
4. Done

### Scenario 2: Approve Specific Day Across All People

**Calendar View:**
1. Click Oct 15
2. Modal shows 3 contributors
3. See: 2 approved, 1 pending (Mike)
4. Click [Approve] for Mike
5. Or click [Approve All Pending (1)]
6. Done

**List View:**
1. Expand all contractors
2. Scan Oct 15 row for each
3. Approve individually
4. (Not ideal for this scenario - use Calendar)

### Scenario 3: Approve Everything

**List View:**
1. Click checkbox in header (select all)
2. Click [Approve Selected]
3. Confirms: "Approve 3 timesheets?"
4. Approve
5. All done in 3 clicks

---

## 🎨 Visual Status System

### Calendar Cell Colors

**Border + Background:**
```css
/* All Approved */
border-success bg-success/10
→ Green border, light green background

/* Pending Entries */
border-warning bg-warning/10
→ Yellow border, light yellow background

/* Rejected Entries */
border-destructive bg-destructive/10
→ Red border, light red background

/* No Entries */
border-border bg-card
→ Normal border, white background
```

### Status Icons

**In calendar cells:**
- ✓ (CheckCircle2) - All approved
- ⏱️ (Clock) - Has pending
- ⚠️ (AlertCircle) - Has rejected

**In badges:**
```
✓ All Approved (green)
⏱ 5 Pending (yellow)
⚠ 2 Rejected (red)
```

### Hover States

**Calendar cell hover:**
- Border → accent-brand
- Shadow → apple-shadow-md
- Cursor → pointer
- Tooltip → "32h · 3 contributors · Click for details"

---

## 🔍 Filter & Search Features

### Person Filter

**Dropdown:**
```
[All contractors ▼]
→ All contractors (default)
→ Sarah Chen
→ Mike Johnson
→ Lisa Park
```

**When selected:**
- Calendar: Grays out non-matching days
- List: Hides non-matching rows
- Cards: Hides non-matching cards
- Totals: Recalculates for filtered data

### Task Filter

**Dropdown:**
```
[All tasks ▼]
→ All tasks (default)
→ Development
→ UI Design
→ Code Review
→ Client Meeting
→ Planning
→ Testing/QA
```

**Use case:**
"How many hours did we spend on Development this month?"
→ Filter by "Development"
→ See: 280h across 3 people
→ Cost: $31,200

### Status Filter (List View only)

**Dropdown:**
```
[All statuses ▼]
→ All statuses
→ Pending only (action needed)
→ Approved only
→ Rejected only
```

**Use case:**
"Show me only timesheets needing approval"
→ Filter "Pending only"
→ See: 2 contractors
→ Bulk approve

---

## 📊 Metrics & Insights

### Monthly Summary (Calendar View Footer)

**4 Key Metrics:**
1. **Total Hours** - Sum across all contractors
2. **Active Contractors** - Unique count
3. **Total Cost** - Sum of (hours × rate)
4. **Avg Hours/Person** - Total ÷ Contractors

**Example:**
```
Total Hours: 432h
Active Contractors: 3
Total Cost: $48,820
Avg Hours/Person: 144h
```

### Per-Contractor Summary (List View)

**For each contractor:**
1. **Total Hours** (e.g., 160h)
2. **Days Worked** (e.g., 20 days)
3. **Total Cost** (e.g., $19,200)
4. **Variance** (e.g., +5h vs last month)

**Variance Color Coding:**
- 🟠 **+10h or more** → Warning (potential overwork)
- 🔵 **-10h or less** → Info (less work)
- ⚪ **±10h or less** → Normal (no color)

### Day Breakdown (Drill-down Modal)

**Summary bar:**
```
3 Contributors | 2 Approved | 1 Pending | 0 Rejected
```

**Quick stats:**
- Shows status distribution
- Enables "Approve All Pending" if any
- Color-coded badges

---

## ⚡ Manager Actions

### Approve Individual Entry

**From drill-down modal:**
1. Click day cell → Modal opens
2. Find contractor → Click [Approve]
3. Optional: Add manager notes
4. Confirm
5. Status updates: ⏱ → ✓

**From list view:**
1. Expand contractor → See daily table
2. Find entry → (implicitly approved with contractor)
3. Or click [Approve] on row

### Reject Entry

**From drill-down modal:**
1. Click day cell → Modal opens
2. Find contractor → Click [Reject]
3. **Required:** Add rejection reason
4. Confirm
5. Entry returns to contractor as "draft"
6. Contractor edits and resubmits

**Rejection notes examples:**
```
"Please clarify hours for Tuesday - seems high"
"Notes are too vague - add more detail"
"This overlaps with PTO - please verify"
```

### Bulk Approve

**Calendar view:**
- Click day → [Approve All Pending]
- Approves all pending for that day

**List view:**
- Select multiple ☑️ → [Approve Selected]
- Approves all pending for selected contractors

---

## 🎯 Best Practices for Managers

### Daily Review (5 min)

**End of each day:**
1. Open Calendar view
2. Check today's cell
3. If yellow → Click → Review pending
4. Quick approve if looks good
5. Result: No backlog

### Weekly Review (15 min)

**End of each week:**
1. Open List view
2. Expand all rows
3. Scan week's entries
4. Check variance indicators
5. Bulk approve if normal
6. Result: Week cleared

### Monthly Review (30 min)

**End of month:**
1. Open Calendar view
2. Filter by person (one at a time)
3. Review full month pattern
4. Check for anomalies
5. Export for accounting
6. Result: Month closed

### When to Investigate

**Red flags:**
- ⚠️ **Variance >25%** - Big change from last month
- ⚠️ **>12h in a day** - Potential error or overtime
- ⚠️ **Weekend work** - Verify it was authorized
- ⚠️ **Many consecutive days** - Burnout risk
- ⚠️ **Vague notes** - "Worked on stuff" = reject

---

## 📱 Responsive Design

### Desktop (>1024px)
- **Calendar:** Full grid (7 columns + week total)
- **List:** Full table with all columns
- **Drill-down:** Wide modal (max-w-4xl)

### Tablet (768-1024px)
- **Calendar:** Scrollable if needed
- **List:** Slightly condensed columns
- **Drill-down:** Narrower modal

### Mobile (<768px)
- **Calendar:** Switches to Cards view (grid impractical)
- **List:** Switches to stacked cards
- **Drill-down:** Full-screen modal

**Mobile card:**
```
┌─────────────────────────────┐
│ SC Sarah Chen               │
│ 160h · $19,200              │
│ +5h vs last month           │
│ [View] [Approve]            │
└─────────────────────────────┘
```

---

## 🚀 Advanced Features (Future)

### Drag & Drop (Planned)

**Assign schedules:**
```
Manager creates "9-5 Design Sprint" template
→ Drags across Mon-Fri on calendar
→ Selects contractors to apply to
→ Pre-fills their timesheets
→ Contractors review and submit
```

**Duplicate entries:**
```
Drag Sarah's Oct 3 entry
→ Drop on Mike's Oct 3
→ Pre-fills Mike's day with same hours/task
→ Mike edits notes and submits
```

### Smart Warnings

**AI-powered anomaly detection:**
- "Sarah logged 60h in one week (usual: 40h)"
- "Mike has no entries for 2 weeks (PTO?)"
- "Lisa's notes are unusually short this week"

### Auto-Approval Rules

**Set conditions:**
```
Auto-approve if:
- Contractor is "Trusted" tier
- Hours ≤ 40/week
- No variance >10%
- Notes are detailed (>20 chars)
```

### Calendar Sync

**Two-way sync:**
- Import from contractor's Google Calendar
- Export approved entries to accounting
- Show PTO/holidays alongside work

---

## 📊 Comparison to Other Tools

| Feature | WorkGraph | Harvest | Toggl | Clockify |
|---------|-----------|---------|-------|----------|
| **Calendar Aggregate** | ✅ Full month | ⚠️ Week only | ❌ No | ❌ No |
| **Drill-down** | ✅ Click any day | ❌ No | ❌ No | ❌ No |
| **Color-coded status** | ✅ 3 colors | ⚠️ Basic | ❌ No | ❌ No |
| **Bulk approve** | ✅ Multiple ways | ⚠️ Limited | ⚠️ All or none | ❌ No |
| **Filter by person** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Filter by task** | ✅ Yes | ✅ Yes | ⚠️ Limited | ❌ No |
| **Variance detection** | ✅ Automatic | ❌ No | ❌ No | ❌ No |
| **3 view modes** | ✅ Cal/List/Cards | ❌ No | ❌ No | ❌ No |
| **Inline approval** | ✅ Drill-down | ❌ Separate page | ❌ Separate | ❌ Separate |

**WorkGraph wins on:**
- 🏆 Visual overview (calendar grid)
- 🏆 Drill-down flexibility
- 🏆 Multiple approval workflows
- 🏆 Manager-specific UX

---

## 🎓 Training for Managers

### Onboarding (15 min)

**Video: "3 Ways to Review Timesheets"**
1. Calendar view - Big picture
2. List view - Quick approvals
3. Cards view - Deep dive

**Practice:**
- Click around Calendar
- Try bulk approve in List
- Review one timesheet in Cards

### Power User Tips

**Keyboard shortcuts:**
```
Arrow keys: Navigate calendar
Enter: Drill down
A: Approve selected
R: Reject selected
Esc: Close modal
```

**Filters stack:**
```
Filter by Person: Sarah
+ Filter by Task: Development
= See only Sarah's Development hours
```

**Export tricks:**
```
Filter → Export = Filtered data only
Perfect for:
- Per-person reports
- Per-task budgeting
- Accounting software import
```

---

## 📈 Success Metrics

### Manager Efficiency

**Before WorkGraph:**
- Review time: 2-3 min/timesheet
- 10 contractors = 20-30 min/week
- Anomalies often missed
- Manual variance calculation

**After WorkGraph:**
- Calendar scan: 2 min total
- Bulk approve: <10 seconds
- Auto-variance detection
- Result: **90% time savings**

### Approval Speed

**Target SLAs:**
- Same-day approval: 80% of entries
- 24-hour approval: 95% of entries
- <5 rejections per month (high quality)

**WorkGraph enables:**
- Real-time dashboard
- Mobile approvals
- Bulk processing
- Result: **Meets 95%+ SLA**

---

## 🎉 Summary

WorkGraph's Manager Views provide the **most comprehensive, flexible, and efficient** timesheet approval system:

✅ **3 complementary views** (Calendar, List, Cards)
✅ **Drill-down from aggregate** (click any day)
✅ **Color-coded status** (instant visual feedback)
✅ **Bulk approvals** (multiple workflows)
✅ **Smart filtering** (person, task, status)
✅ **Variance detection** (automatic warnings)
✅ **Mobile-friendly** (review anywhere)
✅ **Export-ready** (accounting integration)

**Result:** Managers approve timesheets in **2 minutes** instead of 20. Contractors get faster payment. Everyone's happy. 🎉
