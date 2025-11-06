# Company Owner Interface - Visual Guide

## Interface Overview

When logged in as a **Company Owner**, you see a single, focused interface for managing your team's timesheets. There are **no tabs** and **no personal timesheet section** - just pure team management.

## Full Interface Layout

```
┌──────────────────────────────────────────────────────────┐
│  WorkGraph Timesheet System                     [Persona] │
│  Unified interface with role-based permissions           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Team Timesheets                                          │
│ Manage and review timesheets for all 3 contractors      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 👥 Viewing Timesheet                                     │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ [All Contractors ▼]                                │  │
│ │                                                    │  │
│ │ Dropdown shows:                                   │  │
│ │ • All Contractors (Team aggregate view)           │  │
│ │ ────────────────────────────────────────          │  │
│ │ • SC  Sarah Chen     (Acme Corp)                  │  │
│ │ • IM  Ian Mitchell   (Acme Corp)                  │  │
│ │ • LP  Lisa Park      (Acme Corp)                  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ─────────────────────────────────────────────────────── │
│                                                          │
│ Total Logged    Approved      Pending        Draft      │
│ 392h            280h          72h            32h         │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ [●Calendar] [○List]                    [Export All ⬇]   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                                                          │
│              OCTOBER 2025                                │
│                                                          │
│ Mon   Tue   Wed   Thu   Fri   Sat   Sun                 │
│                                                          │
│ [Aggregate team calendar showing all contractors]       │
│                                                          │
│ • Sarah: 8h, 8h, 6.5h, 8h, 8h = 38.5h                   │
│ • Ian:   8h, 8h, 8h,   8h, 7h = 39h                     │
│ • Lisa:  8h, 7h, 8h,   8h, 8h = 39h                     │
│                                                          │
│ [Drag-drop enabled for bulk operations]                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## What You DON'T See

### ❌ No Tabs
```
[My Timesheets] [Team Timesheets]  ← NOT SHOWN
```

### ❌ No Personal Timesheet Section
```
┌─ Personal Timesheet (you) ─────┐
│ Your own hours for October     │  ← NOT SHOWN
└────────────────────────────────┘
```

### ❌ No Owner Badge
```
[Owner]  ← NOT SHOWN (you're always the owner)
```

## What You DO See

### ✅ Team Management Only
```
┌─ Team Timesheets ──────────────┐
│ [All Contractors ▼]            │  ← SHOWN
│ Team stats and calendar        │
└────────────────────────────────┘
```

## Two Main Views

### 1. Aggregate View (Default)

```
┌──────────────────────────────────────────────────────────┐
│ 👥 Viewing Timesheet                                     │
│ [All Contractors ▼]                                      │
├──────────────────────────────────────────────────────────┤
│ Total: 392h | Approved: 280h | Pending: 72h | Draft: 32h│
├──────────────────────────────────────────────────────────┤
│                                                          │
│              TEAM AGGREGATE CALENDAR                     │
│                                                          │
│        Mon    Tue    Wed    Thu    Fri    Sat    Sun    │
│                                                          │
│ Sarah  [8h]   [8h]   [6.5h] [8h]   [8h]   [ ]    [ ]    │
│ Ian    [8h]   [8h]   [8h]   [8h]   [7h]   [ ]    [ ]    │
│ Lisa   [8h]   [7h]   [8h]   [8h]   [8h]   [ ]    [ ]    │
│                                                          │
│ • Click any cell to see details                         │
│ • Drag to copy hours across team                        │
│ • Shift+drag to move hours                              │
│ • Bulk edit multiple contractors                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Use this for:**
- Quick team overview
- Bulk hour operations
- Identifying coverage gaps
- Exporting team reports

### 2. Individual View

```
┌──────────────────────────────────────────────────────────┐
│ 🏢 Viewing Timesheet                                     │
│ [Sarah Chen ▼]                                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│           SARAH CHEN - OCTOBER 2025                      │
│                                                          │
│ Mon  Oct 7   ████████ 8.0h  UI Design                   │
│              Notes: Worked on dashboard redesign         │
│              Project: WorkGraph MVP                      │
│              Status: ⏱ Pending Approval                  │
│                                                          │
│ Tue  Oct 8   ████████ 8.0h  Component Library           │
│              Notes: Built reusable button components     │
│              Project: WorkGraph MVP                      │
│              Status: ⏱ Pending Approval                  │
│                                                          │
│ Wed  Oct 9   ██████░░ 6.5h  Client Feedback             │
│              Notes: Incorporated design revisions        │
│              Project: WorkGraph MVP                      │
│              Status: ⏱ Pending Approval                  │
│                                                          │
│ [ ] Approve All    [✓] Approve    [✗] Reject            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Use this for:**
- Reviewing specific contractor's work
- Approving/rejecting individual entries
- Verifying detailed notes
- Exporting individual reports

## View Mode Toggle

### Calendar View (Visual)
```
[●Calendar] [○List]

Shows monthly/weekly calendar with visual bars for hours
Good for: Pattern recognition, visual overview
```

### List View (Detailed)
```
[○Calendar] [●List]

Shows tabular list of all entries with full details
Good for: Detailed review, data entry verification
```

## Common Actions

### 1. Review Weekly Team Hours
```
1. Default view shows "All Contractors"
2. See team stats: 392h total
3. Scan aggregate calendar
4. Identify any issues or gaps
5. Export team report if needed
```

### 2. Approve Individual Timesheet
```
1. Select contractor from dropdown
   Example: "Sarah Chen"
2. Review each day's entries
3. Check notes and project assignments
4. Click "Approve" or "Reject" with notes
5. Move to next contractor
```

### 3. Bulk Operations (Aggregate View)
```
1. View "All Contractors"
2. Drag across a row to copy hours
3. Use Shift+drag to move hours
4. Click "Bulk Edit" for mass updates
5. Save changes
```

### 4. Export Reports
```
AGGREGATE VIEW:
[Export All] → Downloads all contractors' timesheets

INDIVIDUAL VIEW:
[Export Sarah Chen] → Downloads just Sarah's timesheet
```

## Comparison with Other Roles

### Solo Freelancer View
```
┌─ My Timesheet ─────────────────┐
│ October 2025 - Sarah Chen      │
│ [Own timesheet calendar]       │
│ • Can add/edit own hours       │
│ • Cannot see others            │
└────────────────────────────────┘
```

### Company Owner View (YOU)
```
┌─ Team Timesheets ──────────────┐
│ [All Contractors ▼]            │
│ [Team calendar/individual]     │
│ • Cannot add own hours         │
│ • Can view/manage team         │
│ • Can approve/reject           │
└────────────────────────────────┘
```

### Agency Owner View
```
┌────────────────────────────────┐
│ [My Timesheets] [Team...]      │ ← Has tabs
└────────────────────────────────┘

┌─ My Timesheet ─────────────────┐
│ • Can add own hours            │
└────────────────────────────────┘

┌─ Team Timesheets ──────────────┐
│ • Can view all vendors         │
│ • Manages multiple companies   │
└────────────────────────────────┘
```

## Key Differences

| Feature | You (Company Owner) | Solo Freelancer | Agency Owner |
|---------|---------------------|-----------------|--------------|
| **Can log own hours** | ❌ No | ✅ Yes | ✅ Yes |
| **Can view team** | ✅ Yes | ❌ No | ✅ Yes |
| **Tabs shown** | ❌ No | ❌ No | ✅ Yes |
| **Manages** | Your company | Just self | All vendors |
| **Role** | Manager | Worker | Manager + Worker |

## Why No Personal Timesheet?

### Business Reality
- **Company Owners** manage P&L and operations
- They don't bill hours to projects
- Contractors (employees) are the billable resources
- Owner's compensation comes from profit, not hourly billing

### If You Do Billable Work
If you as the owner also do billable work:
1. Create a **contractor record** for yourself
2. You'll appear in the contractors dropdown
3. Select yourself to log hours under that contractor identity
4. Keep owner role separate for management

This separates your **management role** from any **contractor work**.

## Rate Visibility

As a Company Owner, you see:

```
┌─────────────────────────────────────────┐
│ SARAH CHEN                              │
│                                         │
│ Internal Cost:    $30/hr                │ ← What you pay Sarah
│ Billable Rate:    $60/hr                │ ← What you charge agency
│ Margin:           $30/hr (100%)         │ ← Your profit
│                                         │
│ This week: 38.5h                        │
│ Cost:      $1,155  (38.5 × $30)         │
│ Bill:      $2,310  (38.5 × $60)         │
│ Profit:    $1,155                       │
└─────────────────────────────────────────┘
```

Individual contractors only see hours/tasks (no rates).

## Quick Reference

### What You See
✅ Team Timesheets header  
✅ Contractor dropdown  
✅ Team statistics (aggregate view)  
✅ Calendar or List view toggle  
✅ Export functionality  
✅ Approval controls  

### What You DON'T See
❌ "My Timesheets" tab  
❌ Personal timesheet section  
❌ Ability to log your own hours  
❌ Dual-tab system  

### Your Main Actions
1. Review team hours
2. Approve/reject timesheets
3. Monitor team utilization
4. Export reports
5. Manage contractor assignments

---

**Your Role**: Team Management  
**Your Focus**: Oversight, not time tracking  
**Your Interface**: Simple, clean, focused on team  

If you need to track your own billable hours, create a contractor record for yourself!
