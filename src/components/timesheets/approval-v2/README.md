# Approvals v2 - Multi-Party Architecture Prototype

## 📍 Location
Click "Approvals v2 (Demo)" tab in Project Timesheets view

## ✨ What This Is
A **standalone demo prototype** of the proposed multi-party approval architecture with organization-grouped tables, hierarchical contracts, approval flows, **and enhanced verification context for real-world monthly approvals**.

**IMPORTANT:** This is 100% demo-only with local state. It does NOT touch:
- Existing timesheet calendar components
- Existing approval tables (ContractorRoleLayer, SimpleApprovalTable)
- Supabase database
- Any functional timesheet data

## 🏗️ Architecture Features

### Organization Grouping
- **2 Companies:** Acme Dev Studio (15 people), BrightWorks Design (7 people)
- **3 Freelancers:** Individual contributors
- Collapsible groups with org-level stats

### Contract Model
- Each person has a unique `ProjectContract` with:
  - Contract type: hourly, daily, fixed
  - Rate information (role-based visibility)
  - User role: individual_contributor, company_employee, agency_contractor
  
### Timesheet Periods
- Scoped to contracts (not just users)
- Hierarchical approval state
- Approval history timeline

### Status Distribution (Realistic)
- 60% Pending
- 30% Approved  
- 10% Rejected

## 📂 Files Created

```
components/timesheets/approval-v2/
├── README.md (this file)
├── demo-data-multi-party.ts       # Organizations, Contracts, Periods, Entries
├── OrganizationGroupedTable.tsx   # Main table with collapsible org groups
├── TimesheetDrawer.tsx            # Right-side detail drawer
└── ApprovalsV2Tab.tsx             # Main tab container with filters
```

## 🎯 Key Features

### 1. Organization Grouped Table
- Collapsible organization sections
- Checkbox selection (individual + group)
- Inline status badges
- Summary stats per org (pending/approved/rejected)

### 2. Filters
- **Organization:** Filter by specific company/freelancer or view all
- **Status:** pending, approved, rejected, changes_requested
- **Role:** individual_contributor, company_employee, agency_contractor
- Clear all button

### 3. Bulk Actions
- Select multiple timesheets across organizations
- Bulk approve / reject
- Floating action bar when items selected

### 4. Timesheet Drawer
- Contract details (type, rate, role)
- Time summary (hours/days + total amount)
- Daily breakdown with task descriptions
- **Approval history timeline** with icons and timestamps
- Action buttons (Approve/Reject/Request Changes) - only for pending items

### 4. Enhanced Timesheet Drawer (Real-World Approval Context) 🆕
**Critical for monthly approvals and future AI optimization:**

- **📊 Project Budget Context** - Budget utilization, burn rate, remaining hours
- **⚠️ Review Flags** - Auto-detected anomalies (overtime, weekend work, task mismatches)
- **📋 Allocated Tasks Comparison** - Planned vs actual hours per task
- **💬 Contractor Notes** - Explanations and justifications
- **📎 PDF Attachments** - Signed timesheet uploads (240KB sample PDFs)
- **Contract Details** - Type, rate, role
- **Time Summary** - Total hours/days with calculated amounts
- **Daily Breakdown** - Task descriptions per day
- **Approval History Timeline** - Complete audit trail

**Purpose:** Enable approvers to:
1. Verify hours against allocated budget
2. Cross-reference with signed PDF timesheets
3. Validate work was done on assigned tasks
4. Understand and approve anomalies (overtime, weekend work)
5. Make informed approve/reject decisions

**Future AI Benefits:**
- All data structured for ML pattern recognition
- OCR extraction from PDFs
- Auto-flagging of unusual patterns
- Budget forecasting and risk prediction

### 5. Stats Dashboard
- Total submissions
- Pending review count
- Approved count
- Rejected count

## 🔄 User Flow

1. **Browse:** View timesheets grouped by organization
2. **Filter:** Narrow down by org/status/role
3. **Select:** Check individual or entire org groups
4. **Review:** Click row or "View Details" to open drawer
5. **Act:** Approve/reject individual (drawer) or bulk (action bar)

## 🚀 Next Steps (Post-Validation)

Once this prototype is validated:

1. **Data Layer:** Connect to Supabase with proper schema
2. **Replace Old System:** Swap out duplicate tables (ContractorRoleLayer + SimpleApprovalTable)
3. **File Cleanup:** Delete ~20 redundant timesheet components
4. **Add Features:**
   - Finance approval layer (optional 3rd level)
   - Advanced filtering (date ranges, amounts)
   - Export to PDF/CSV
   - Comments/notes on rejections

## 💡 Design Decisions

### Why Organization Grouping?
Real-world projects have multiple companies/agencies/freelancers with different contracts and rates. Grouping by org makes approval workflows scalable.

### Why Drawer Instead of Modal?
- Keeps context visible (table stays in view)
- Better for reviewing multiple timesheets sequentially
- More space for approval history and details

### Why 2-Level Hierarchy?
- Simple for MVP
- Covers most use cases:
  - Freelancer → Project Owner (1 step)
  - Company/Agency → Lead → Project Owner (2 steps)
- Finance layer can be added later

## 📊 Demo Data Stats

- **25 total people** (15 Acme + 7 BrightWorks + 3 Freelancers)
- **25 contracts** (mix of hourly/daily/fixed)
- **25 timesheet periods** (current week)
- **125 timesheet entries** (5 days × 25 people)
- **Realistic variation** in hours, tasks, and rates

## ⚠️ Limitations (Demo Only)

- No server persistence
- No real authentication/authorization
- Actions show alerts instead of saving
- Fixed to current week only
- No pagination (all 25 records shown)

## 🎨 UI Components Used

- Shadcn: Table, Drawer, Badge, Button, Select, Checkbox, ScrollArea
- Lucide icons: Building2, User, CheckCircle, XCircle, AlertCircle, etc.
- Tailwind CSS for styling

---

**Built as a validation prototype for the multi-party approval architecture decision.**