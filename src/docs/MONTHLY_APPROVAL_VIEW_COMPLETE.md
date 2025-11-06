# ✅ Monthly Approval View - Implementation Complete

## 🎯 What Was Built

You asked: *"How can we see monthly breakdown... when i click on one person i would like to see full month timesheet"*

**DONE!** The system now shows complete monthly timesheets with 4 weeks of data aggregated.

## 📊 How It Works

### Table View (Current Week Summary)
```
┌─────────────────────────────────────────────────┐
│ Acme Dev Studio                    15 people    │
├─────────────────────────────────────────────────┤
│ Sarah Johnson    Oct 20-26    38.5h   Pending  │ ← Shows current week only
│ Mike Chen        Oct 20-26    42.0h   Pending  │
│ Emily Davis      Oct 20-26    36.0h   Approved │
└─────────────────────────────────────────────────┘
```

### Drawer View (Full Month Aggregation) 🆕
```
When you click on a person → Opens drawer with ENTIRE MONTH:

┌──────────────────────────────────────────────────────┐
│ Sarah Johnson                                     [X]│
│ October 2025 • Oct 1 - Oct 28                       │
│ [PENDING]  [4 weeks]  [2 attachments]               │
├──────────────────────────────────────────────────────┤
│ 📅 Monthly Summary                                   │
│ ┌─────────────┬─────────────┐                       │
│ │ Total Time  │ Total Amount│                       │
│ │ 156.0 hrs   │ $13,260     │                       │
│ └─────────────┴─────────────┘                       │
│                                                      │
│ 📈 Project Budget                                    │
│   352 / 480 hours (73%)                             │
│   [████████████████░░░░░░] 128h remaining           │
│   This Month: 156h (33% of total)                   │
│                                                      │
│ ⚠️ Review Flags (Month) [3]                         │
│   ⚠️ 46 hours in Week 2 (overtime)                  │
│   ℹ️ Weekend work in Week 3                         │
│                                                      │
│ 🎯 Allocated Tasks (Month Total)                    │
│   User Dashboard: 109.2h / 109.2h ✅ On Track      │
│   API Integration: 39.0h / 31.2h  ⚠️ Over (+25%)   │
│   Bug Fixes: 7.8h / 15.6h ⚠️ Under                  │
│                                                      │
│ 💬 Contractor Notes (by Week)                       │
│   Week 1: "Integration delays..."                   │
│   Week 3: "Weekend pre-approved..."                 │
│                                                      │
│ 📎 Attachments (All Weeks) [4]                      │
│   📄 Signed_Timesheet_Jan2025_Week1.pdf             │
│   📄 Signed_Timesheet_Jan2025_Week2.pdf             │
│   📄 Signed_Timesheet_Jan2025_Week3.pdf             │
│   📄 Signed_Timesheet_Jan2025_Week4.pdf             │
│                                                      │
│ 📅 Weekly Breakdown                                  │
│   ˅ Week 1: Oct 1-7    38.5h  [Approved]           │
│   ˅ Week 2: Oct 8-14   42.0h  [Pending]            │
│   ˅ Week 3: Oct 15-21  40.0h  [Pending]            │
│   ˅ Week 4: Oct 22-28  35.5h  [Pending]            │
│       (Click to expand daily breakdown)             │
├──────────────────────────────────────────────────────┤
│ [Approve Month] [Request Changes] [Reject]          │
└──────────────────────────────────────────────────────┘
```

## 🔢 Data Changes

### 1. **Generated 4 Weeks Per Person** (was 1)
- **Before:** Each person had 1 timesheet period (current week)
- **After:** Each person has 4 timesheet periods (4 weeks = ~1 month)
- **Total periods:** 25 people × 4 weeks = **100 periods**

### 2. **New Monthly Aggregation Type**
```typescript
interface MonthlyTimesheetView {
  contractId: string;
  monthStart: string;           // First Monday
  monthEnd: string;             // Last Sunday
  weeks: TimesheetPeriod[];     // All 4 weeks
  
  // AGGREGATED TOTALS
  totalHours: number;           // Sum of all weeks
  totalDays: number;            // Sum of all weeks
  totalAmount: number | null;   // Calculated from contract
  
  // AGGREGATED CONTEXT
  aggregatedFlags: ReviewFlag[];      // Deduplicated flags
  aggregatedTasks: AllocatedTask[];   // Task hours summed
  aggregatedBudget: {...} | null;     // Monthly budget view
  
  // STATUS
  monthlyStatus: ApprovalStatus;      // Overall month status
  
  // ATTACHMENTS & NOTES
  allAttachments: Attachment[];       // All PDF timesheets
  combinedNotes: string[];            // Week 1: ..., Week 2: ...
}
```

### 3. **Smart Aggregation Logic**

#### Budget:
```typescript
// Combines all 4 weeks into monthly view
allocated: 480h (total project)
spent: 352h (cumulative)
monthPeriod: 156h (this month's 4 weeks)
```

#### Tasks:
```typescript
// Sums hours across all weeks
"User Dashboard Development"
├─ Week 1: 26.0h
├─ Week 2: 28.0h
├─ Week 3: 27.2h
├─ Week 4: 28.0h
└─ TOTAL: 109.2h (vs 109.2h allocated) ✅
```

#### Review Flags:
```typescript
// Deduplicates by message
Week 1: "Overtime detected"
Week 2: "Overtime detected" ← Deduplicated
Week 3: "Weekend work"
→ Shows: 2 flags (not 3)
```

#### Attachments:
```typescript
// Renames PDFs with week identifier
Signed_Timesheet_Jan2025.pdf 
→ Signed_Timesheet_Jan2025_Week1.pdf
→ Signed_Timesheet_Jan2025_Week2.pdf
→ Signed_Timesheet_Jan2025_Week3.pdf
→ Signed_Timesheet_Jan2025_Week4.pdf
```

## 🎨 New UI Component: MonthlyTimesheetDrawer

### Features:
1. **Monthly Summary Cards** - Total hours + amount
2. **Project Budget** - Monthly burn rate vs total allocation
3. **Review Flags** - Aggregated across all weeks
4. **Allocated Tasks** - Monthly totals with variance
5. **Contractor Notes** - All weeks combined with labels
6. **PDF Attachments** - All 4 weekly PDFs listed
7. **Weekly Breakdown** - Collapsible sections with daily detail
8. **Contract Details** - Rate, type, role
9. **Approval Actions** - "Approve Month" button

### Weekly Breakdown (Collapsible):
```
˅ Week 1: Oct 1-7 (38.5 hours) [Approved]
  │
  ├─ Mon, Oct 1     Frontend development         7.8h  ✓ Billable
  ├─ Tue, Oct 2     Backend API integration      8.2h  ✓ Billable
  ├─ Wed, Oct 3     Design system components     7.5h  ✓ Billable
  ├─ Thu, Oct 4     Testing and bug fixes        7.1h  ✓ Billable
  └─ Fri, Oct 5     Code review and docs         7.9h  ✓ Billable
```

## 📂 Files Modified/Created

### Created:
1. `/components/timesheets/approval-v2/MonthlyTimesheetDrawer.tsx`
   - Complete monthly view drawer
   - 450+ lines of aggregated view logic
   - Collapsible weekly sections

### Modified:
1. `/components/timesheets/approval-v2/demo-data-multi-party.ts`
   - Changed period generation: 1 week → 4 weeks per contract
   - Added `MonthlyTimesheetView` interface
   - Added `getMonthlyViewByContract()` function
   - Added `getCurrentWeekPeriodByContract()` function
   - Smart aggregation logic for budget, tasks, flags

2. `/components/timesheets/approval-v2/OrganizationGroupedTable.tsx`
   - Now uses `getCurrentWeekPeriodByContract()` 
   - Shows only current week in table (not all 4)
   - Cleaner table view

3. `/components/timesheets/approval-v2/ApprovalsV2Tab.tsx`
   - Changed drawer from `TimesheetDrawer` → `MonthlyTimesheetDrawer`
   - Passes `monthlyView` instead of single `period`

## 🔄 User Flow

### Before:
```
1. See list of people with current week
2. Click person
3. See current week details
4. Approve/reject single week
```

### After (Monthly):
```
1. See list of people with current week summary
2. Click person
3. See FULL MONTH (4 weeks aggregated)
   ├─ Monthly totals
   ├─ Budget tracking
   ├─ All flags
   ├─ All tasks
   ├─ All notes
   ├─ All 4 PDF attachments
   └─ Weekly breakdown (expandable)
4. Approve/reject ENTIRE MONTH
```

## 🧪 How to Test

1. **Navigate:** Project Workspace → Timesheets → "Approvals v2 (Demo)" tab

2. **Click any person** in the table (e.g., "Sarah Johnson")

3. **Drawer opens** showing:
   - ✅ "October 2025" at top
   - ✅ "4 weeks" badge
   - ✅ Monthly total (e.g., 156 hours)
   - ✅ Monthly budget bar
   - ✅ Aggregated tasks across 4 weeks
   - ✅ Up to 4 PDF attachments
   - ✅ 4 collapsible week sections

4. **Expand a week** to see daily breakdown

5. **Check aggregated tasks:**
   - Hours should be ~4x higher than single week
   - Variance shows monthly totals

6. **Check PDF attachments:**
   - Should see Week1, Week2, Week3, Week4 labels

## 📊 Data Summary

### What Changed:
```
People:   25 (same)
Weeks:    1 → 4 per person
Periods:  25 → 100 total
Entries:  125 → 500 total (5 days × 4 weeks × 25 people)
```

### Monthly Aggregation Example:
```
Sarah Johnson (Hourly @ $85/hr)
├─ Week 1: 38.5h × $85 = $3,272.50  [Approved]
├─ Week 2: 42.0h × $85 = $3,570.00  [Pending]
├─ Week 3: 40.0h × $85 = $3,400.00  [Pending]
├─ Week 4: 35.5h × $85 = $3,017.50  [Pending]
└─ MONTH:  156h × $85 = $13,260.00  [Pending - has pending weeks]
```

### Monthly Status Logic:
```
if (any week is rejected)        → Month = REJECTED
else if (any week is pending)    → Month = PENDING
else if (all weeks approved)     → Month = APPROVED
```

## ✨ Key Benefits

### For Approvers:
1. ✅ **One-click access** to full month
2. ✅ **All context in one place** (no switching)
3. ✅ **Monthly budget view** (not just weekly)
4. ✅ **All PDF timesheets** together
5. ✅ **Approve entire month** at once

### For Monthly Workflow:
1. ✅ **See patterns** across 4 weeks
2. ✅ **Compare weekly variance** easily
3. ✅ **Track monthly burn rate**
4. ✅ **Review all notes** together
5. ✅ **Validate against budget** monthly

### For AI Future:
1. ✅ **Monthly patterns** for learning
2. ✅ **Aggregated task data** for estimation
3. ✅ **Budget forecasting** from monthly data
4. ✅ **Detect monthly trends** (not just weekly)

## 🎯 Perfect for Your Use Case

> "contractors will fill hours and they will probably have to upload pdf signed timesheet with hours"

**Now you can:**
- ✅ See all 4 weekly PDFs in one drawer
- ✅ Cross-reference monthly total vs PDFs
- ✅ Approve entire month after reviewing all docs
- ✅ Track budget across full month
- ✅ See all contractor explanations together

## 🚀 Next Steps

### To Make This Real:

1. **Supabase Schema:**
   ```sql
   -- Already have timesheet_periods table
   -- Just query by date range to get 4 weeks
   SELECT * FROM timesheet_periods
   WHERE contract_id = 'xxx'
     AND week_start_date >= '2025-10-01'
     AND week_end_date <= '2025-10-31'
   ORDER BY week_start_date;
   ```

2. **Month Selector:**
   - Add dropdown: "October 2025 ▼"
   - Filter table by selected month
   - Drawer shows that month's 4 weeks

3. **PDF Upload (per week):**
   - Contractor uploads 1 PDF per week
   - Drawer shows all 4 for the month
   - OCR can validate total matches

4. **Monthly Approval:**
   - "Approve Month" → approves all pending weeks
   - "Reject Month" → rejects all weeks
   - Or approve/reject individual weeks

## 📝 Important Notes

- **Table still shows current week** (clean view)
- **Drawer shows full month** (complete context)
- **All 100 periods are generated** (25 people × 4 weeks)
- **Demo data is realistic** (varied hours, statuses, attachments)
- **Monthly aggregation is automatic** (no manual calculation needed)

---

## ✅ Summary

**You asked:** "How can we see monthly breakdown when I click on one person?"

**We delivered:**
- ✅ Click person → See full month (4 weeks)
- ✅ Monthly totals (hours, amount, budget)
- ✅ All PDF attachments (1 per week)
- ✅ Aggregated tasks, flags, notes
- ✅ Collapsible weekly breakdown
- ✅ Approve entire month at once

**Test it now:** Click any person in the Approvals v2 (Demo) tab! 🚀
