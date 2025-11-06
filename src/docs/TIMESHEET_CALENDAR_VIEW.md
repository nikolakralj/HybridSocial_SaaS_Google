# 📅 Monthly Calendar Timesheet View - Complete Guide

## Overview

The **Monthly Calendar View** provides a visual, intuitive way to track time across an entire month. It complements the weekly grid view by giving contractors and managers a bird's-eye view of work patterns, making it easier to spot trends, plan ahead, and submit monthly timesheets.

---

## 🎯 Why Monthly Calendar View?

### Problems with Traditional Timesheets
- ❌ **No visual context** - Can't see work patterns at a glance
- ❌ **Hard to plan** - Don't know which days have capacity
- ❌ **Endless scrolling** - Monthly views require lots of scrolling
- ❌ **Poor at-a-glance totals** - Hard to see weekly/monthly progress

### Our Solution
- ✅ **Visual calendar grid** - See entire month at once
- ✅ **Color-coded states** - Draft/submitted/approved instantly visible
- ✅ **Weekly totals** - Row summaries show week-by-week
- ✅ **Monthly summary** - Footer shows trends vs. previous month
- ✅ **Quick entry modal** - Click any day to log hours
- ✅ **Dual modes** - Simple (just hours) or detailed (multiple tasks)

---

## 📊 Feature Comparison

| Feature | Weekly Grid | Monthly Calendar |
|---------|-------------|------------------|
| **View Scope** | 7 days | 28-31 days |
| **Best For** | Detail entry | Overview & planning |
| **Entry Method** | Inline table | Modal popup |
| **Visual Feedback** | Row totals | Day + week + month totals |
| **Navigation** | Prev/Next week | Prev/Next month |
| **State Visibility** | Text badges | Color-coded cells |
| **Planning** | Current week only | Entire month |
| **Submission** | Weekly | Monthly bulk |

**Use Cases:**
- **Weekly View** → Day-to-day time logging with detailed notes
- **Monthly View** → Monthly planning, submission, trend analysis

---

## 🏗️ Layout & Components

### 1. Calendar Grid (7×5 or 7×6)

```
┌─────────────────────────────────────────────────────────────────┐
│                     October 2025                   [< >]         │
├─────────────────────────────────────────────────────────────────┤
│ Mon  Tue  Wed  Thu  Fri  Sat  Sun │ Week Total                  │
├─────────────────────────────────────────────────────────────────┤
│              1    2    3    4    5 │  40h                        │
│  6    7    8    9   10   11   12  │  38h                        │
│ 13   14   15   16   17   18   19  │  40h                        │
│ 20   21   22   23   24   25   26  │  35h                        │
│ 27   28   29   30   31            │  32h                        │
├─────────────────────────────────────────────────────────────────┤
│ Total: 185h │ Days: 23 │ Pay: $17,575 │ vs Last: +15h (+8.8%)  │
└─────────────────────────────────────────────────────────────────┘
```

**Design Details:**
- **Week starts Monday** (industry standard for timesheets)
- **Weekend cells** have subtle gray background
- **Today** has accent border highlight
- **Empty cells** for days before month starts
- **Week total column** on the right of each row

### 2. Day Cell States

Each day cell shows:

**Empty Day:**
```
┌─────────┐
│   15    │  ← Day number
│         │
│    +    │  ← Hover: Add icon
└─────────┘
```

**Logged Day (Draft):**
```
┌─────────┐
│   15    │
│  8.0h   │  ← Hours in accent color
│    •    │  ← Draft indicator (gray dot)
└─────────┘
```

**Submitted Day:**
```
┌─────────┐
│   15    │
│  8.0h   │
│   ⏱️    │  ← Clock icon (yellow)
└─────────┘
```

**Approved Day:**
```
┌─────────┐
│   15    │
│  8.0h   │
│   ✓     │  ← Checkmark (green)
└─────────┘
```

**Rejected Day:**
```
┌─────────┐
│   15    │
│  8.0h   │
│   ⚠️    │  ← Alert icon (red)
└─────────┘
```

**Today (with hours):**
```
┌─────────┐ ← Accent border
│   15    │
│  8.0h   │
│    •    │
└─────────┘
```

**Weekend:**
```
┌─────────┐
│   Sat   │ ← Background: accent/20
│   16    │
│  0.0h   │
└─────────┘
```

### 3. Monthly Summary Footer

```
┌─────────────────────────────────────────────────────────┐
│  Total Hours    Days Worked    Estimated Pay    vs Last │
│    185 hrs         23 days      $17,575        +15h ↑   │
└─────────────────────────────────────────────────────────┘
```

**Metrics:**
- **Total Hours** - Sum of all logged hours
- **Days Worked** - Count of days with >0 hours
- **Estimated Pay** - Total hours × hourly rate
- **vs. Last Month** - Variance with trend indicator

**Variance Display:**
- +15h (↑ green) - Worked more
- -10h (↓ gray) - Worked less
- 0h (--) - Same as last month

---

## 🎨 Day Entry Modal

### Quick Entry Mode (Default)

```
┌────────────────────────────────────────────┐
│  Wednesday, October 15, 2025               │
├────────────────────────────────────────────┤
│  [Quick Entry] [Detailed Tasks]            │
├────────────────────────────────────────────┤
│  Time Calculator (Optional)                │
│  Start: [09:00] End: [17:30] Break: [30]  │
│                            [Calculate]      │
├────────────────────────────────────────────┤
│  Total Hours: [8.0]                        │
│  Task/Project: [Development ▼]             │
│  What did you work on?                     │
│  [Implemented user authentication...]      │
├────────────────────────────────────────────┤
│  Total: 8.0 hours · $760                   │
├────────────────────────────────────────────┤
│              [Clear] [Cancel] [Save Entry] │
└────────────────────────────────────────────┘
```

**Features:**
1. **Time Calculator** - Auto-calculate hours from start/end times
2. **Single hours input** - Just enter total (e.g., 8.0)
3. **Task dropdown** - Pre-defined categories
4. **Notes field** - Describe what you did
5. **Real-time total** - See pay estimate

### Detailed Tasks Mode

```
┌────────────────────────────────────────────┐
│  Wednesday, October 15, 2025               │
├────────────────────────────────────────────┤
│  [Quick Entry] [Detailed Tasks]            │
├────────────────────────────────────────────┤
│  Split your day into multiple tasks        │
│                           [+ Add Task]      │
├────────────────────────────────────────────┤
│  Task 1                             [×]    │
│  Type: [Development ▼]  Hours: [5.0]      │
│  Notes: [Built user login API]             │
│  $475                                      │
├────────────────────────────────────────────┤
│  Task 2                             [×]    │
│  Type: [Code Review ▼]  Hours: [2.0]      │
│  Notes: [Reviewed 3 PRs]                   │
│  $190                                      │
├────────────────────────────────────────────┤
│  Task 3                             [×]    │
│  Type: [Client Meeting ▼] Hours: [1.0]    │
│  Notes: [Sprint planning]                  │
│  $95                                       │
├────────────────────────────────────────────┤
│  Total: 8.0 hours · $760                   │
├────────────────────────────────────────────┤
│              [Clear] [Cancel] [Save Entry] │
└────────────────────────────────────────────┘
```

**Features:**
1. **Multiple tasks** - Break day into pieces
2. **Independent tracking** - Each task has hours + notes
3. **Task-level billing** - See $ per task
4. **Add/remove** - Dynamic task list
5. **Detailed reporting** - Better analytics later

---

## 🔄 User Workflows

### Contractor: Logging Time for a Month

```
1. User opens Monthly Calendar view
   → Sees October 2025 grid

2. Clicks on October 3 (Friday)
   → Day Entry Modal opens

3. Chooses "Quick Entry" mode
   → Enters 8 hours
   → Selects "Development" task
   → Writes "Built API endpoints for auth"
   → Clicks "Save Entry"

4. Day cell now shows:
   ┌─────────┐
   │    3    │
   │  8.0h   │
   │    •    │  ← Draft
   └─────────┘

5. Repeats for other days in week

6. End of week, sees Week Total: 40h

7. Continues through month

8. End of month (Oct 31):
   → Total: 185h
   → Days worked: 23
   → Pay: $17,575
   → vs Last: +15h

9. Clicks "Submit Month for Approval"
   → All days change from • to ⏱️
   → Manager notified

10. Manager approves
    → All days change from ⏱️ to ✓
    → Invoice auto-generated
```

### Manager: Reviewing Monthly Timesheet

```
1. Manager sees notification:
   "3 monthly timesheets pending"

2. Opens Sarah Chen's October timesheet

3. Sees calendar grid overview:
   - 185 total hours
   - 23 days worked
   - +15h vs September

4. Notices Oct 15 has 12h (unusual)

5. Clicks Oct 15 day cell
   → Modal opens in read-only mode
   → Shows:
     - Development: 8h
     - Client Meeting: 4h
     → Total: 12h

6. Validates it's legitimate (client meeting ran long)

7. Scans rest of month - looks normal

8. Clicks "Approve Month"
   → All days turn green ✓
   → Invoice generated: $17,575
   → Sarah notified
```

---

## 🎯 Status Workflow

### States

```
Draft (•)
  ↓ Contractor clicks day → enters hours → saves
Submitted (⏱️)
  ↓ Contractor clicks "Submit Month"
Pending Approval (⏱️)
  ↓ Manager reviews
  ├→ Approved (✓) → Invoice → Payment
  └→ Rejected (⚠️) → Back to Draft → Edit → Re-submit
```

### Bulk Submission

Unlike weekly view (submit week-by-week), monthly view allows:

**"Submit All Entries for This Month"**

- One-click submission
- All draft days → submitted
- Cannot edit after submission
- Manager sees entire month at once

**Benefits:**
- Fewer submissions (1/month vs 4/month)
- Better for contractors on retainer
- Cleaner approval process
- Monthly billing cycles

---

## 💡 Interaction Details

### Hover States

**Empty Day (hover):**
- Border changes to accent
- Plus icon appears
- Tooltip: "Click to log hours"

**Logged Day (hover):**
- Subtle shadow
- Border highlights
- Tooltip: "8.0h Development - Click to edit"

**Weekend (hover):**
- Same as weekday
- Can log weekend hours if needed

**Today:**
- Always has accent border
- No additional hover needed

### Click Actions

**Click empty day:**
- Opens Day Entry Modal
- Quick Entry mode pre-selected
- Focus on hours input

**Click logged day:**
- Opens Day Entry Modal
- Pre-filled with existing data
- Can edit/update/delete

**Click week total:**
- Could expand week details (future)
- Or export week data

**Click month total:**
- Could show breakdown (future)
- Or trigger monthly report

### Keyboard Navigation

- **Arrow keys** - Navigate between days
- **Enter** - Open selected day modal
- **Esc** - Close modal
- **Tab** - Move between inputs in modal

---

## 📊 Visual Enhancements

### Weekend Highlighting

```css
.weekend-cell {
  background: var(--accent) / 20%;
  border-color: var(--border);
}
```

Subtle gray background - doesn't distract, just differentiates.

### Today Highlighting

```css
.today-cell {
  border: 2px solid var(--accent-brand);
  background: var(--accent-brand) / 5%;
}
```

Clear visual anchor - always know where "today" is.

### Status Colors

- **Draft** (•) - Gray `--muted-foreground`
- **Submitted** (⏱️) - Yellow `--warning`
- **Approved** (✓) - Green `--success`
- **Rejected** (⚠️) - Red `--destructive`

Consistent with platform-wide status colors.

### Smooth Transitions

All interactions use:
```css
.apple-transition {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

Hover, click, state changes feel fluid.

---

## 🔧 Configuration Options

### Project-Level Settings

```typescript
interface CalendarSettings {
  // Display
  weekStartDay: "monday" | "sunday";
  highlightWeekends: boolean;
  showWeekNumbers: boolean;
  
  // Entry
  defaultEntryMode: "simple" | "detailed";
  allowMultipleTasks: boolean;
  requireNotes: boolean;
  
  // Submission
  submissionMode: "weekly" | "monthly" | "both";
  monthlyDeadline: number; // Day of month (e.g., 5)
  
  // Limits
  maxHoursPerDay: number; // e.g., 12
  warnOnWeekendEntry: boolean;
}
```

### User Preferences

```typescript
interface UserCalendarPrefs {
  defaultView: "weekly" | "monthly";
  autoSaveInterval: number; // seconds
  showPayEstimates: boolean;
  compactMode: boolean; // smaller cells
}
```

---

## 📱 Responsive Design

### Desktop (>1024px)
- Full calendar grid (7 columns + week total)
- 5-6 rows visible
- Large day cells (100px+)
- All totals visible

### Tablet (768-1024px)
- Scrollable calendar
- Slightly smaller cells (80px)
- Week totals below grid
- Collapsible summary

### Mobile (<768px)
- Switch to **list view** grouped by weeks
- Each week = collapsible card
- Days shown as list items
- Tap day → modal

**Mobile Week Card:**
```
┌─────────────────────────────────────┐
│ Week of Oct 6-12           40h ▼    │
├─────────────────────────────────────┤
│ Mon 6    8.0h  Development     •    │
│ Tue 7    8.0h  Development     •    │
│ Wed 8    8.0h  Code Review     •    │
│ Thu 9    8.0h  Development     •    │
│ Fri 10   8.0h  Client Mtg      •    │
│ Sat 11   0.0h                       │
│ Sun 12   0.0h                       │
└─────────────────────────────────────┘
```

---

## 🚀 Advanced Features (Future)

### Copy Patterns

**"Copy Previous Month"**
- Copies all entries from last month
- Adjusts dates to current month
- Maintains hours and tasks
- Perfect for regular schedules

**"Copy Week Pattern"**
- Define weekly schedule once
- Repeat for entire month
- e.g., Mon-Fri: 8h Development

**"Copy Custom Pattern"**
- Save templates (e.g., "Client Sprint Week")
- Apply to multiple weeks
- Mix and match

### Anomaly Detection

Visual warnings for unusual patterns:

**High Hours:**
```
┌─────────┐
│   15    │
│  14h ⚠️  │  ← Warning badge
│    •    │
└─────────┘
```

**Weekend Work:**
```
┌─────────┐
│  Sat 16 │
│  8h 💼  │  ← Weekend work indicator
│    •    │
└─────────┘
```

**Consecutive Days:**
```
Days 1-10: All 8h
→ Tooltip: "10 days straight - consider a break?"
```

### Forecasting

**Projected Month End:**
Based on current pace:
- "At this rate: 190h by Oct 31"
- "On track for $18,050"
- "+5h vs. September pace"

**Budget Tracking:**
If project has budget:
- "45% of monthly hours used"
- "Projected: $16k of $20k budget"

### Integration

**Calendar Export:**
- Export to .ics (Google Calendar, Outlook)
- Shows work hours as events
- Syncs automatically

**Accounting Integration:**
- Export to QuickBooks, Xero
- Approved timesheets → invoices
- Automatic sync

---

## 📈 Analytics Dashboard (Manager View)

### Monthly Overview

```
October 2025 - Team Timesheet Summary
────────────────────────────────────
Total Team Hours:     548h
Total Billable:       $52,060
Contractors Active:   3
Avg Hours/Contractor: 183h

By Contractor:
• Sarah Chen:    185h ($17,575)  ↑ +8%
• Mike Johnson:  175h ($19,250)  ↓ -5%
• Lisa Park:     188h ($17,860)  ↑ +12%

By Task Category:
• Development:   348h (64%)
• Design:        120h (22%)
• Meetings:       80h (14%)

Weekly Trends:
Week 1: 140h
Week 2: 138h
Week 3: 142h
Week 4: 128h  ← Dip (holiday?)
```

### Anomaly Report

```
⚠️ Attention Required:
─────────────────────
• Sarah: Oct 15 (12h) - High hours
• Mike: Oct 20-23 (0h) - No entries
• Lisa: Weekend work (Sat 16, Sun 17)

Suggested Actions:
→ Verify Sarah's 12h day
→ Check if Mike was on PTO
→ Confirm Lisa's weekend work was approved
```

---

## 🎯 Best Practices

### For Contractors

**DO:**
- ✅ Log time daily (don't wait until month end)
- ✅ Use Quick Entry for routine days
- ✅ Use Detailed Tasks for varied days
- ✅ Review week totals each Friday
- ✅ Submit by 5th of next month

**DON'T:**
- ❌ Bulk-fill at month end (looks suspicious)
- ❌ Round all days to exactly 8h
- ❌ Skip notes (makes approval slower)
- ❌ Submit without reviewing totals

### For Managers

**DO:**
- ✅ Review within 2-3 days
- ✅ Check variance warnings
- ✅ Click unusual days to see details
- ✅ Provide feedback when rejecting
- ✅ Approve promptly to ensure timely payment

**DON'T:**
- ❌ Auto-approve without reviewing
- ❌ Reject without explanation
- ❌ Delay beyond 5 business days
- ❌ Ignore repeated patterns (burnout risk)

---

## 🆚 When to Use Each View

### Use **Monthly Calendar** when:
- 📅 Planning the month ahead
- 📊 Submitting end-of-month timesheet
- 📈 Analyzing work patterns
- 🎯 Getting big-picture overview
- 💰 Estimating monthly earnings
- 🔍 Spotting gaps in logging

### Use **Weekly Grid** when:
- ⏰ Logging detailed daily hours
- 📝 Writing specific task notes
- ⌨️ Quick keyboard entry
- 🕐 Tracking start/end times precisely
- ✏️ Making quick edits
- 📄 Printing weekly summary

### Best Workflow:
1. **Daily:** Log in Weekly View (detail)
2. **Friday:** Review week in Weekly View
3. **Month-end:** Review month in Calendar View
4. **Submit:** Use Calendar View for monthly submission
5. **Manager:** Review in Calendar View first, drill into Weekly for details

---

## 🔐 Security & Permissions

### Edit Permissions

**Draft state:**
- Contractor: ✅ Edit, delete
- Manager: ❌ Cannot edit

**Submitted state:**
- Contractor: ❌ Locked (can request un-submit)
- Manager: ✅ Can approve/reject

**Approved state:**
- Contractor: ❌ Locked
- Manager: ❌ Locked (requires admin to reverse)

**Rejected state:**
- Contractor: ✅ Can edit and re-submit
- Manager: ❌ Cannot edit

### Audit Trail

All changes logged:
```typescript
{
  timestamp: "2025-10-15T14:30:00Z",
  user: "sarah-chen",
  action: "updated",
  day: "2025-10-15",
  changes: {
    hours: { from: 8.0, to: 8.5 },
    notes: { from: "Development", to: "Development + bug fix" }
  }
}
```

---

## 🎓 Success Metrics

### Contractor Efficiency
- Time to log month: <30 minutes
- Days with missing entries: <5%
- Submission on time: >95%
- Approval rate: >90% first-try

### Manager Productivity
- Review time per contractor: <10 minutes
- Approval speed: <2 business days
- Anomaly catch rate: >80%
- Rejection rate: <10%

### System Performance
- Calendar load time: <1 second
- Modal open time: <200ms
- Save/update time: <500ms
- Month navigation: Instant

---

## 🚀 Summary

The **Monthly Calendar View** transforms timesheet management from a chore into a visual, intuitive experience:

✅ **See the whole month** at a glance
✅ **Quick entry** via modal (both simple and detailed modes)
✅ **Visual status** (draft, submitted, approved, rejected)
✅ **Weekly + monthly totals** with variance tracking
✅ **Mobile-responsive** (switches to list view)
✅ **Bulk submission** (one-click for entire month)
✅ **Manager-friendly** (easy to review and approve)

**Perfect for:**
- Contractors on monthly retainers
- Projects with monthly billing cycles
- Teams that need big-picture visibility
- Managers reviewing multiple contractors

Combined with the **Weekly Grid View**, WorkGraph now offers the best of both worlds: detailed daily tracking + high-level monthly planning. 🎉
