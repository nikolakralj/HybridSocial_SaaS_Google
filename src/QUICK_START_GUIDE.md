# 🚀 WorkGraph Quick Start Guide

## ⚡ Where You Are Right Now

You're looking at the **WorkGraph** - a visual map of your project's people, companies, and contracts. It's set to **October 2025** with real timesheet data.

---

## 📍 How to Navigate

### 1. **Top Tabs** (Main Navigation)
```
Overview | Project Graph | Timesheets | Contracts | Documents
```

- **Overview:** Dashboard summary
- **Project Graph:** 👈 YOU ARE HERE - Visual builder for relationships
- **Timesheets:** Weekly time tracking (Oct 6-12, Oct 13-19)
- **Contracts:** Contract management
- **Documents:** File storage

### 2. **WorkGraph Controls** (Left Side)
```
📦 Node Palette
   - Party/Org (companies like Acme Dev)
   - Team (groups of people)
   - Person (Sarah Johnson, Mike Chen, etc.)
   - Contract
   - SOW
   - PO
   - Budget
   - Milestone
   - Timesheet
   - Expense
```

### 3. **Right Panel** (When Node Selected)
```
Node Properties
├─ Name: Emily Davis
├─ Node Type: person
├─ Email: person@example.com
├─ Role: company_employee
│
└─ Stats & Activity (Phase 5 📊)
   ├─ Total Hours Worked: 73 hrs
   ├─ This Month: 35 hrs (October)
   ├─ Current Week: 40 / 40 hrs
   ├─ Current Month: 73 / 160 hrs
   ├─ Last Timesheet: 10/20/2025
   └─ Pending Timesheets: 1
```

---

## 🗓️ Understanding "October 2025"

### Why October 2025?
Your database is seeded with **October 2025** test data:
- Contracts start: Oct 1, 2025
- Week 1 timesheets: Oct 6-12, 2025
- Week 2 timesheets: Oct 13-19, 2025

### How to Tell It's October?
1. **Last Timesheet date** shows "10/20/2025" ✅
2. **Timesheets tab** month selector shows "October 2025"
3. **Stats panel** shows October hours when you click a person node
4. **Database** `week_start_date` column has 2025-10-06, 2025-10-13, etc.

### What if I Want a Different Month?
- Click **Timesheets tab** → Use "Previous Month" / "Next Month" buttons
- WorkGraph will reload with that month's data
- Stats will update to show the selected month's hours

---

## 🎯 What Each Number Means

### On Person Nodes (e.g., Emily Davis)

| Stat | What It Means | Example |
|------|---------------|---------|
| **Total Hours Worked** | All-time total since contract start | 73 hrs |
| **This Month** | Hours for the viewing month (October) | 35 hrs |
| **Current Week** | First week of viewing month | 40 / 40 hrs (100%) |
| **Current Month** | Monthly progress in viewing month | 73 / 160 hrs (45%) |
| **Last Timesheet** | Most recent submission date | 10/20/2025 |
| **Pending Timesheets** | Count awaiting approval | 1 |

### On Party/Company Nodes (e.g., Acme Dev Studio)

| Stat | What It Means |
|------|---------------|
| **Total Employees** | People employed by this company |
| **Active Workers** | Currently working employees |
| **Total Contracts** | Contracts this company is part of |
| **Total Hours This Month** | Sum of all employees' October hours |
| **Last Activity** | Most recent timesheet submission |

---

## 🔄 How Data Flows

```
1. Database (Supabase)
   ├─ project_contracts (8 contracts for October 2025)
   ├─ timesheet_periods (12 periods: 8 Week 1 + 4 Week 2)
   ├─ timesheet_entries (40+ daily entries)
   └─ graph_versions (WorkGraph layout saved here)
   
2. MonthContext
   ├─ Defaults to: October 2025
   └─ Shared across Timesheets + WorkGraph tabs
   
3. useNodeStats Hook
   ├─ Reads selectedMonth from MonthContext
   ├─ Queries database for that month's timesheets
   └─ Calculates stats and shows in Node Properties panel
   
4. WorkGraph UI
   ├─ Shows visual nodes + edges
   └─ Displays real-time stats when you click a node
```

---

## 🐛 Troubleshooting

### "Stats Show 0 Hours" (FIXED ✅)
**Problem:** Node Properties showed "This Month: 0 hrs"
**Cause:** Code was using `new Date()` (November) instead of `selectedMonth` (October)
**Fix:** Updated `/hooks/useNodeStats.ts` to use viewing month
**Status:** ✅ Fixed - refresh to see October hours

### "No Timesheets Found"
**Problem:** Empty timesheet periods
**Solution:** Run `/COMPLETE_SETUP_WITH_GRAPH.sql` in Supabase SQL Editor

### "Database Not Setup"
**Problem:** Red error in Node Properties panel
**Solution:** 
1. Go to Supabase dashboard
2. Open SQL Editor
3. Paste `/COMPLETE_SETUP_WITH_GRAPH.sql`
4. Click "Run"
5. Refresh app

### "Wrong Month Showing"
**Problem:** WorkGraph shows November data instead of October
**Solution:** 
1. Check `MonthContext` defaults to `new Date('2025-10-01')`
2. Navigate to Timesheets tab → Click "Previous Month" until October
3. Return to WorkGraph → Should sync to October

---

## 📊 Test Scenarios

### Scenario 1: View Emily Davis's October Stats
1. Click on **Emily Davis** node (green person node)
2. Right panel should show:
   - Total Hours: 73 hrs
   - This Month: 35-73 hrs (depending on week)
   - Last Timesheet: 10/20/2025
   - Pending: 1-2 timesheets

### Scenario 2: View Acme Dev Studio's Team Hours
1. Click on **Acme Dev Studio** node (blue company node)
2. Right panel should show:
   - Total Employees: 5 (Sarah, Mike, Emily, Robert, Lisa)
   - Total Hours This Month: ~195 hrs (sum of all employees)
   - Employee list with names

### Scenario 3: Switch to Timesheets and Back
1. Click **Timesheets** tab
2. Verify month selector shows "October 2025"
3. See periods for Oct 6-12 and Oct 13-19
4. Click **Project Graph** tab
5. WorkGraph should still show October stats

---

## 🎓 Key Concepts

### Node Types
- **Person:** Individual workers (Sarah, Mike, Emily)
- **Party/Org:** Companies or freelancers (Acme Dev, BrightWorks)
- **Contract:** Agreements between parties
- **SOW:** Statement of Work documents
- **PO:** Purchase Orders
- **Budget:** Financial allocations
- **Timesheet:** Time tracking records
- **Expense:** Cost records

### Edge Types
- **employs:** Company → Person
- **approves:** Manager → Timesheet (approval flow)
- **pays:** Company → Contractor (payment flow)
- **works_on:** Person → Project
- **bills:** Contractor → Company (invoicing)

### Stats Calculation
- **All-time total:** Sum of ALL periods since contract start
- **This Month:** Sum of periods where `week_start_date` is in October 2025
- **Current Week:** Hours from first week of viewing month (Oct 6-12)
- **Current Month:** Same as "This Month" (redundant for now)

---

## 📖 Documentation

### Quick Reference
- `/PROJECT_STATUS.md` - Where we are, what's working, what's not
- `/OCTOBER_2025_SEED_DATA.md` - Complete seed data reference
- `/FIX_APPLIED.md` - Database schema fixes
- `/COMPLETE_SETUP_WITH_GRAPH.sql` - Database setup script

### Detailed Docs
- `/docs/` - Full documentation folder
- `/docs/DATABASE_SETUP.md` - How to set up database
- `/docs/WORKGRAPH_GUIDE.md` - Complete WorkGraph guide
- Master Roadmap - Phase 1-13 feature plans

---

## ✅ Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Database Schema | ✅ Fixed | TEXT instead of UUID for project_id |
| October 2025 Data | ✅ Loaded | 12 periods, 40+ entries |
| MonthContext | ✅ Working | Defaults to Oct 2025 |
| Graph Versioning | ✅ Working | Saves/loads graph layout |
| Stats Calculation | ✅ Fixed | Now uses selectedMonth |
| Node Properties | ✅ Working | Shows October hours |
| Timesheets Tab | ✅ Working | Week 1 & Week 2 visible |
| WorkGraph UI | ✅ Working | All nodes render correctly |

---

## 🚀 Next Steps

### Immediate (5 minutes)
1. ✅ Refresh app to see fixed stats
2. ✅ Click on Emily Davis → Verify hours show correctly
3. ✅ Navigate to Timesheets → Confirm October 2025 data
4. ✅ Return to WorkGraph → Verify stats persist

### Short-term (This week)
- Test approval workflows (pending → approved)
- Add new contractors for November 2025
- Create graph version 2 with new nodes
- Test month switching (Oct → Nov → Oct)

### Long-term (Phase 5-13)
- Invoice generation for October
- Budget tracking and alerts
- Multi-month analytics
- AI-powered insights
- Platform integrations

---

**Need Help?** Check `/PROJECT_STATUS.md` for detailed context and troubleshooting! 🎉
