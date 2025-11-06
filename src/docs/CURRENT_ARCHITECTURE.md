# WorkGraph - Current Architecture (2025)

**Last Updated:** January 2025  
**Status:** Production Ready - Approval-v2 System

---

## Overview

WorkGraph is a hybrid SaaS + social work network for technical freelancers with Apple-inspired design and multi-tenant architecture. The system separates Personal Profiles from Worker Records and focuses on core work management features: timesheets, contracts, and project documentation.

---

## Core Architecture Principles

### 1. **Profile Separation**
- **Personal Profile:** Owned by the individual, portable across jobs
- **Worker Record:** Owned by organizations, contains employment/contract data
- **Benefit:** Clean data ownership, enables agency representation

### 2. **Multi-Tenant Context System**
Users can operate in multiple contexts:
- **Personal:** Individual freelancer managing their own work
- **Company:** Company owner/manager managing team timesheets
- **Agency:** Agency managing represented candidates

### 3. **Multi-Party Approval Architecture**
Supports real-world hierarchical approval flows:
```
Individual → Company → Agency → Client
```
Each layer has different contracts, rates, and approval permissions.

---

## Timesheet System Architecture

### Current Implementation: **Approval-v2**

**Location:** `/components/timesheets/approval-v2/`

**Files:**
- `ApprovalsV2Tab.tsx` - Main container with filters and stats
- `OrganizationGroupedTable.tsx` - Weekly rows with checkbox selection
- `MonthlyTimesheetDrawer.tsx` - Monthly aggregation drawer
- `demo-data-multi-party.ts` - Demo data (to be replaced with Supabase)

**Workflow:**
```
Weekly Table Display → Click Row → Monthly Drawer Opens
├─ Table: Shows weekly rows (Mon-Sun, 40 hrs, Pending)
└─ Drawer: Shows full month aggregation (4 weeks, 160 hrs, PDF attachments)
```

**Why This Design:**
- Contractors submit **weekly** timesheets (granular tracking)
- Customers invoice **monthly** (business requirement)
- Approvers review **weekly rows** but approve **entire months**
- PDF signed timesheets are monthly (side-by-side verification)

### Key Features

#### **Organization Grouping**
- 2+ Companies (e.g., Acme Dev Studio, BrightWorks Design)
- 3+ Freelancers (individual contributors)
- Collapsible groups with org-level stats

#### **Checkbox-Based Filtering**
- **Single source of truth:** `OrganizationGroupedTable` component
- Centralized state in `ApprovalsV2Tab`
- Enables bulk approve/reject across organizations
- Individual + organization-level selection

#### **Monthly Aggregation**
- `getMonthlyViewByContract()` combines weekly periods
- Aggregates: hours, budget, flags, tasks, attachments, notes
- **Month-only filtering:** Oct 1-31, no spillover from adjacent months
- Prevents confusion (e.g., showing Sep 29-30 in October view)

#### **Enhanced Approval Context**
Optimized for quick scanning and verification:
- ✅ **PDF Attachments:** Signed timesheets with week identifiers
- ✅ **Budget Tracking:** Allocated vs spent vs current month
- ✅ **Review Flags:** Auto-detected anomalies (overtime, weekend work)
- ✅ **Task Allocation:** Planned vs actual hours per task
- ✅ **Approval History:** Complete audit trail with timestamps
- ✅ **Contractor Notes:** Weekly explanations and justifications

#### **Filters & Bulk Actions**
- **Filter by:** Organization, Status (pending/approved/rejected), Role
- **Bulk Actions:** Approve/reject multiple timesheets
- **Stats Dashboard:** Total/Pending/Approved/Rejected counts

### Contractor Types & Permissions

| Type | Description | Rate Visibility |
|------|-------------|-----------------|
| **Individual Contributor** | Direct freelancer | Sees own rate |
| **Company Employee** | Staff augmentation | Company controls visibility |
| **Agency Contractor** | Represented by agency | Agency controls visibility |

---

## Type System

**Location:** `/types/`

**Files:**
- `index.ts` - Core identity types + re-exports
- `approvals.ts` - Multi-layer approval chain types
- `contracts.ts` - Multi-layer rate chain types
- `people.ts` - Person and organization types
- `permissions.ts` - Role-based permissions
- `timesheets.ts` - **NEW:** Production-ready timesheet types

**Type Flow:**
```typescript
import { 
  MonthlyTimesheetView, 
  ProjectContract, 
  ApprovalStatus 
} from '@/types'; // All types available from single import
```

---

## Data Flow (Current Demo → Future Production)

### Current State (Demo)
```
ApprovalsV2Tab 
  ├─ DEMO_ORGANIZATIONS (hardcoded)
  ├─ DEMO_CONTRACTS (hardcoded)
  └─ getPeriodsByContract() (local function)
       └─ getMonthlyViewByContract() (aggregation)
```

### Future State (Production)
```
ApprovalsV2Tab
  ├─ API: fetchOrganizations() → Supabase
  ├─ API: fetchContracts() → Supabase
  └─ API: fetchPeriodsByContract() → Supabase
       └─ getMonthlyViewByContract() (client-side aggregation)
```

---

## Component Inventory

### ✅ **Active Components (Approval-v2)**
- `ApprovalsV2Tab.tsx`
- `OrganizationGroupedTable.tsx`
- `MonthlyTimesheetDrawer.tsx`

### ✅ **Active Components (Timesheet Entry)**
- `EnhancedTimesheetCalendar.tsx` - Calendar grid view
- `MultiPersonTimesheetCalendar.tsx` - Multi-person drag-and-drop
- `TimesheetCalendarView.tsx` - Calendar wrapper
- `EnhancedDayEntryModal.tsx` - Daily entry form
- Various table/modal components

### ⚠️ **To Be Deprecated (After Migration)**
- Old approval components in `/timesheets/approval/`
- Duplicate timesheet table views
- Legacy demo data files

---

## Database Schema (Supabase - To Be Implemented)

### Tables Needed

#### **organizations**
```sql
id, name, type, logo, created_at
```

#### **project_contracts**
```sql
id, user_id, user_name, user_role, organization_id, project_id,
contract_type, rate, hourly_rate, daily_rate, fixed_amount,
hide_rate, start_date, end_date
```

#### **timesheet_periods** (Weekly)
```sql
id, contract_id, week_start_date, week_end_date,
total_hours, total_days, status, submitted_at,
approved_at, approved_by, rejected_at, rejected_by,
rejection_reason, contractor_notes
```

#### **timesheet_entries** (Daily)
```sql
id, period_id, date, hours, days, task_description,
billable, start_time, end_time, break_minutes, notes
```

#### **approval_history**
```sql
id, period_id, timestamp, actor, action, comment
```

#### **attachments**
```sql
id, period_id, name, type, url, uploaded_at, size
```

#### **review_flags**
```sql
id, period_id, type, message, severity
```

#### **allocated_tasks**
```sql
id, period_id, name, allocated_hours, logged_hours, status
```

---

## Next Steps (Option A: Production Ready)

### Phase 1: Database Setup
- [ ] Create Supabase tables with proper RLS policies
- [ ] Set up foreign key relationships
- [ ] Create indexes for performance
- [ ] Seed with test data

### Phase 2: API Layer
- [ ] Create API utilities in `/utils/api/timesheets.ts`
- [ ] Implement CRUD operations
- [ ] Add error handling and loading states
- [ ] Create React hooks for data fetching

### Phase 3: Component Integration
- [ ] Replace demo data with API calls
- [ ] Add loading skeletons
- [ ] Implement error boundaries
- [ ] Add toast notifications for actions

### Phase 4: Real Approval Actions
- [ ] POST approval/rejection to backend
- [ ] Update approval history
- [ ] Send email notifications (optional)
- [ ] Generate PDF invoices (optional)

### Phase 5: Testing & Validation
- [ ] Test with real multi-party data
- [ ] Verify month filtering accuracy
- [ ] Test bulk actions at scale
- [ ] Performance optimization

---

## Design Philosophy

### Apple-Inspired Principles
1. **Clarity:** Information hierarchy optimized for scanning
2. **Consistency:** Unified component patterns
3. **Feedback:** Clear visual states (hover, selected, loading)
4. **Simplicity:** Remove unnecessary UI chrome

### Timesheet-Specific UX
1. **Quick Scanning:** Drawer designed for rapid review
2. **Side-by-Side Verification:** PDF + daily entries visible together
3. **One-Click Bulk Actions:** Approve multiple timesheets efficiently
4. **Smart Defaults:** Collapsed rows, relevant filters pre-selected

---

## File Organization

```
components/timesheets/
├── approval-v2/          ← CURRENT SYSTEM (Production)
│   ├── ApprovalsV2Tab.tsx
│   ├── OrganizationGroupedTable.tsx
│   ├── MonthlyTimesheetDrawer.tsx
│   └── demo-data-multi-party.ts
├── approval/             ← OLD SYSTEM (To be deprecated)
├── EnhancedTimesheetCalendar.tsx
├── MultiPersonTimesheetCalendar.tsx
└── ... (entry components)

types/
├── index.ts              ← Re-exports all types
├── timesheets.ts         ← NEW: Consolidated timesheet types
├── approvals.ts
├── contracts.ts
└── people.ts

docs/
├── CURRENT_ARCHITECTURE.md  ← THIS FILE
├── APPROVAL_WORKFLOW.md     ← Detailed approval flow
├── TIMESHEET_ENTRY.md       ← Entry system guide
└── archive/                 ← Historical docs (100+ files)
```

---

## Support & Troubleshooting

### Common Issues

**Issue:** Seeing dates from adjacent months in drawer  
**Fix:** Already fixed - month filtering on lines 68-90 of MonthlyTimesheetDrawer.tsx

**Issue:** Badge showing wrong task count  
**Fix:** Already fixed - using `filteredEntriesCount` instead of `allDailyEntries.length`

**Issue:** Checkbox state not syncing  
**Fix:** Ensure `selectedPeriods` state flows from `ApprovalsV2Tab` → `OrganizationGroupedTable`

---

**For questions or updates, contact the development team.**
