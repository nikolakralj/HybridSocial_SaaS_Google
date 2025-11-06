# Approvals v2 Demo - Quick Start Guide

## 🎯 Where to Find It

### Navigation Path:
1. Go to **Project Workspace** (ApprovalSystemDemo component)
2. Look for the **Project Timesheets** section
3. Click the **"Approvals v2 (Demo)"** tab (has a ✨ sparkle icon)

### Tab Layout:
```
┌─────────────────────────────────────────────────────────┐
│  Timesheets  │  Approvals  │  Approvals v2 (Demo) ✨  │
└─────────────────────────────────────────────────────────┘
                                      ↑
                                Click here!
```

## 📊 What You'll See

### Top Section - Stats Dashboard
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total        │ Pending      │ Approved     │ Rejected     │
│ Submissions  │ Review       │              │              │
│     25       │    15        │     8        │     2        │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### Filters Bar
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Filters:                                             │
│  [All Organizations ▼]  [All Statuses ▼]  [All Roles ▼]│
└─────────────────────────────────────────────────────────┘
```

### Organization Grouped Table
```
┌─────────────────────────────────────────────────────────┐
│ ☑ ▼ 🏢 Acme Dev Studio              15 people           │
│         • 9 pending  • 5 approved  • 1 rejected         │
├─────────────────────────────────────────────────────────┤
│   ☐    Sarah Johnson      Jan 13-19    40.0 hrs  Pending│
│   ☐    Mike Chen          Jan 13-19    38.5 hrs  Pending│
│   ☐    Emily Davis        Jan 13-19    42.0 hrs Approved│
│   ...                                                    │
├─────────────────────────────────────────────────────────┤
│ ☑ ▼ 🏢 BrightWorks Design             7 people          │
│         • 4 pending  • 2 approved  • 1 rejected         │
├─────────────────────────────────────────────────────────┤
│   ☐    Zoe Cooper         Jan 13-19    36.0 hrs  Pending│
│   ☐    Marcus Lewis       Jan 13-19    40.0 hrs Approved│
│   ...                                                    │
├─────────────────────────────────────────────────────────┤
│ ☑ ▼ 👤 Alex Chen (Freelancer)         1 person          │
│         • 1 pending                                      │
├─────────────────────────────────────────────────────────┤
│   ☐    Alex Chen          Jan 13-19    40.0 hrs  Pending│
└─────────────────────────────────────────────────────────┘
```

## ✨ Interactive Features to Try

### 1. Organization Collapse/Expand
- Click the **▼/▶** arrow next to org name
- Collapses/expands all people in that organization

### 2. Selection
- **Individual:** Click checkbox next to person's name
- **Group:** Click checkbox next to org name (selects all in org)
- **Indeterminate state:** Org checkbox shows "-" when some (but not all) selected

### 3. Bulk Actions
When you select items, a blue action bar appears:
```
┌─────────────────────────────────────────────────────────┐
│ 5 items selected                                        │
│           [Clear Selection] [✓ Approve] [✗ Reject]      │
└─────────────────────────────────────────────────────────┘
```

### 4. View Details (Opens Drawer)
Two ways to open:
- Click anywhere on the row
- Click "View Details" button on right

### 5. Filters
Try these combinations:
- **Organization:** "Acme Dev Studio" → See only Acme people
- **Status:** "Pending" → See only pending approvals
- **Role:** "Individual Contributors" → See only freelancers
- **Clear All** → Reset to show everything

## 🗂️ Timesheet Drawer (Detail View)

When you click a row, a drawer slides in from the right:

```
┌────────────────────────────────────────────┐
│ Sarah Johnson                         ✗    │
│ Jan 13, 2025 - Jan 19, 2025                │
│ [PENDING]                                  │
├────────────────────────────────────────────┤
│ Contract Details                           │
│ ┌────────────────────────────────────────┐ │
│ │ Contract Type:    Hourly               │ │
│ │ Rate:             $95/hr               │ │
│ │ Role:             Company Employee     │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Time Summary                               │
│ ┌────────────────────────────────────────┐ │
│ │ 🕐 Total Hours        40.0             │ │
│ │ 💵 Total Amount       $3,800           │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Daily Breakdown                            │
│ ┌────────────────────────────────────────┐ │
│ │ 📅 Mon, Jan 13        8.0 hrs          │ │
│ │    Frontend development - Dashboard    │ │
│ │    [Billable]                          │ │
│ │                                        │ │
│ │ 📅 Tue, Jan 14        8.0 hrs          │ │
│ │    Backend API integration             │ │
│ │    [Billable]                          │ │
│ │ ...                                    │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Approval History                           │
│ ┌────────────────────────────────────────┐ │
│ │ ● ✓ Submitted                          │ │
│ │ │   by System                          │ │
│ │ │   Jan 13, 8:00 AM                    │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ [✓ Approve] [⚠ Request Changes] [✗ Reject]│
└────────────────────────────────────────────┘
```

### Drawer Features:
- **Contract Details:** Type, rate, role
- **Time Summary:** Total hours/days + calculated amount
- **Daily Breakdown:** Each day with task descriptions
- **Approval History:** Timeline of all actions
- **Action Buttons:** Only shown if status = "Pending"

## 🎭 Demo Data Overview

### Organizations (3 total)

#### 1. Acme Dev Studio (Company) - 15 people
- Mix of hourly, daily, fixed contracts
- Rates: $85-$160/hr, $680-$980/day
- Status: Mix of pending/approved/rejected

#### 2. BrightWorks Design (Company) - 7 people
- Mix of hourly and daily contracts
- Rates: $95-$165/hr, $760-$940/day
- Status: Mix of pending/approved

#### 3. Freelancers (3 people)
- Alex Chen: Hourly ($125/hr)
- Maria Rodriguez: Daily ($950/day)
- James Kim: Fixed ($35,000)

### Status Distribution:
- **Pending:** 15 (60%)
- **Approved:** 8 (30%)
- **Rejected:** 2 (10%)

## 🧪 Test Scenarios

### Scenario 1: Review Acme Dev Studio
1. Click org filter → "Acme Dev Studio"
2. See 15 people from Acme only
3. Click on "Sarah Johnson" row
4. Review details in drawer
5. Click "Approve" (shows alert)

### Scenario 2: Bulk Approve All Pending
1. Click status filter → "Pending"
2. See 15 pending timesheets
3. Check the checkbox next to "Acme Dev Studio" org header
4. See bulk action bar appear
5. Click "Approve Selected"
6. See success alert

### Scenario 3: Filter by Role
1. Click role filter → "Individual Contributors"
2. See only 3 freelancers
3. Notice different contract types (hourly/daily/fixed)
4. Click "Alex Chen"
5. See hourly rate and hours in drawer

### Scenario 4: Collapse/Expand All
1. Click ▼ arrow next to each org name
2. Collapse all organizations
3. See clean summary view with just org headers
4. Expand one at a time to drill down

## 🎨 Visual Indicators

### Organization Icons:
- 🏢 **Building2** = Company/Agency
- 👤 **User** = Freelancer

### Status Badges:
- **Pending** = Yellow/outline
- **Approved** = Green/default
- **Rejected** = Red/destructive

### Status Dots (Org Header):
- 🟡 Yellow = Pending count
- 🟢 Green = Approved count
- 🔴 Red = Rejected count

## 🔍 What Makes This Different?

### vs. Current "Approvals" Tab:
| Feature                    | Current | v2 Demo |
|----------------------------|---------|---------|
| Organization grouping      | ❌      | ✅      |
| Contract-based periods     | ❌      | ✅      |
| Hierarchical approval      | ❌      | ✅      |
| Approval history timeline  | ❌      | ✅      |
| Multi-org filtering        | ❌      | ✅      |
| Drawer detail view         | ❌      | ✅      |
| Rate visibility by role    | ❌      | ✅      |

## 📝 Known Limitations (Demo Only)

- ✅ **Works:** All UI interactions, filtering, selection, drawer
- ❌ **Doesn't persist:** Actions show alerts instead of saving
- ❌ **No pagination:** All 25 records shown at once
- ❌ **Fixed date:** Only current week data
- ❌ **No backend:** Pure local state, no Supabase

## 🚀 Next Steps After Validation

1. ✅ **Validate UX** - Is org grouping + drawer the right approach?
2. ✅ **Validate Data Model** - Do ProjectContract + TimesheetPeriod work?
3. 🔄 **Connect to Supabase** - Real data persistence
4. 🔄 **Replace Old System** - Remove duplicate tables
5. 🔄 **Add Features** - Comments, exports, advanced filtering

## 💡 Tips for Testing

1. **Start Simple:** Try filters one at a time
2. **Test Combinations:** Org + Status filters together
3. **Check Edge Cases:** Select all, deselect all, mixed selection
4. **Drawer Flow:** Open multiple timesheets in sequence
5. **Mobile View:** (Future) Collapse orgs for mobile

---

**Ready to validate the architecture? Click "Approvals v2 (Demo)" tab!** ✨
