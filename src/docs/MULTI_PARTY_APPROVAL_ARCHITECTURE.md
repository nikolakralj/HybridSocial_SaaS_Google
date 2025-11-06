# 🏗️ Multi-Party Project Approval Architecture

## Executive Summary

**Problem:** Current system shows a flat list of contractors with no organization grouping, contract-based logic, or hierarchical approval support. Duplicate tables are rendering due to architectural confusion.

**Solution:** Implement industry-standard multi-party approval system with organization grouping, contract-based rates, hierarchical approval flow, and drawer-based detail views.

---

## 🎯 Core Requirements

### 1. **Multi-Party Project Model**

```
Project "Website Redesign"
├── Company X (Acme Corp) - 15 people
│   ├── Sarah Chen      Contract: Dev, $80/hr, Hourly, Active
│   ├── Mike Johnson    Contract: Designer, $75/hr, Hourly, Active
│   └── ...
│
├── Company Y (TechStaff Agency) - 7 people
│   ├── Emma Davis      Contract: Dev, $65/hr, Hourly, Active
│   └── ...
│
└── Freelancers (Independent) - 3 people
    ├── John Smith      Contract: Consultant, $95/hr, Hourly, Active
    ├── Lisa Wong       Contract: PM, $1200/day, Daily, Active
    └── Tom Brown       Contract: Design Lead, $50k, Fixed, Milestone-based
```

**Key Insight:** Each person has a **unique contract** with the project, linked to their organization.

---

### 2. **Hierarchical Approval Flow**

```
┌─────────────────────────────────────────────────────┐
│ LEVEL 1: Internal Approval (within organization)   │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Freelancer:  No internal approval needed            │
│             → Goes directly to Project Owner        │
│                                                      │
│ Company:    Employee submits → Company Lead         │
│             → Company Lead approves internally      │
│             → Batch sent to Project Owner           │
│                                                      │
│ Agency:     Contractor submits → Agency Lead        │
│             → Agency Lead approves internally       │
│             → Batch sent to Project Owner           │
│                                                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ LEVEL 2: Project Approval (final approval)         │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Project Owner reviews all submitted timesheets      │
│ grouped by organization                             │
│                                                      │
│ Can approve entire org batch or individual entries  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Status Flow:**
1. `draft` → Employee working on timesheet
2. `submitted-to-org` → Waiting for Company/Agency Lead
3. `approved-by-org` → Company Lead approved, waiting for Project Owner
4. `submitted-to-project` → Freelancer submitted directly to Project Owner
5. `approved-final` → Project Owner approved, ready for payment
6. `rejected` → Rejected at any level
7. `revision-requested` → Needs changes

---

### 3. **Contract-Based Logic**

Each contractor has a **Contract** that defines:

```typescript
interface ProjectContract {
  id: string;
  projectId: string;
  
  // Organization linkage
  organizationId: string;           // Company X, Company Y, or "freelancer"
  organizationName: string;
  organizationType: "company" | "agency" | "freelancer";
  
  // Person linkage
  contractorId: string;             // WorkerRecord ID or PersonalProfile ID
  contractorName: string;
  contractorRole: string;           // "Developer", "Designer", etc.
  
  // Contract terms
  contractType: "hourly" | "daily" | "fixed";
  hourlyRate?: number;              // For hourly contracts
  dailyRate?: number;               // For daily contracts
  fixedAmount?: number;             // For fixed contracts
  workTypeRates?: {                 // Optional: different rates for work types
    regular: number;
    overtime: number;
    travel: number;
  };
  
  // Approval settings
  requiresOrgApproval: boolean;     // true for companies/agencies, false for freelancers
  orgApproverId?: string;           // Company/Agency Lead who approves
  
  // Status
  status: "active" | "paused" | "ended";
  startDate: Date;
  endDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Approval Logic by Contract Type:**

| Contract Type | What Gets Approved | Calculation |
|--------------|-------------------|-------------|
| **Hourly** | Total hours × hourly rate | 40h × $80/hr = $3,200 |
| **Daily** | Days worked × daily rate | 5 days × $1,200/day = $6,000 |
| **Fixed** | Milestone completion flag | Milestone 2 complete → $10,000 |

---

### 4. **Data Model**

```typescript
// Organization entity (already exists in types/index.ts)
interface Organization {
  id: string;
  type: "company" | "agency" | "freelancer-company";
  name: string;
  // ... existing fields
}

// Project-Contract linkage (NEW)
interface ProjectContract {
  // See above
}

// Timesheet Period (contract-based)
interface TimesheetPeriod {
  id: string;
  projectId: string;
  contractId: string;               // Links to specific contract
  
  // Period info
  periodType: "weekly" | "monthly";
  periodStart: Date;
  periodEnd: Date;
  
  // Hours summary
  totalHours: number;
  regularHours: number;
  overtimeHours?: number;
  travelHours?: number;
  
  // Status tracking
  status: "draft" | "submitted-to-org" | "approved-by-org" | 
          "submitted-to-project" | "approved-final" | "rejected";
  
  // Approval trail
  submittedToOrgAt?: Date;
  approvedByOrgAt?: Date;
  orgApproverId?: string;
  submittedToProjectAt?: Date;
  approvedFinalAt?: Date;
  projectApproverId?: Date;
  
  rejectedAt?: Date;
  rejectedBy?: string;
  rejectionReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Timesheet Entry (daily breakdown)
interface TimesheetEntry {
  id: string;
  periodId: string;
  date: Date;
  
  startTime?: string;
  endTime?: string;
  breakMinutes?: number;
  hours: number;
  
  workType: "regular" | "overtime" | "travel" | "oncall";
  category?: string;
  task?: string;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎨 UI Design

### **Approvals Tab Structure**

```
┌──────────────────────────────────────────────────────────────────┐
│ Approvals Tab                                                     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CONTROLS BAR                                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ Organization Grouping                                             │
│ ┌─────────────────────────────────────────────────────┐          │
│ │ [All] [Company X] [Company Y] [Freelancers]        │          │
│ └─────────────────────────────────────────────────────┘          │
│                                                                   │
│ Filters & Actions                                                 │
│ [🔍 Search] [Role▾] [Status▾] [Contract Type▾]                  │
│                                                                   │
│ Bulk Selection (when items selected)                             │
│ 5 selected → [✓ Approve All] [✗ Reject All] [Clear Selection]   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ APPROVAL TABLE (Grouped by Organization)                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ ▼ Company X (Acme Corp)          15 people │ 380h │ 72h pending │
│                                                                   │
│   ☐ │ Contractor │ Role │ Contract │ This Month │ Status │ Actions│
│   ├──┼───────────┼──────┼──────────┼────────────┼────────┼────────│
│   ☐ │ SC  Sarah  │ Dev  │ $80/hr   │ 38.5h total│ ⏳     │[Review]│
│       Chen       │      │ Hourly   │ 24✓ 14.5⏳ │ Pending│ [✓][✗]│
│   ☐ │ MJ  Mike   │ Des  │ $75/hr   │ 38.5h total│ ⏳     │[Review]│
│       Johnson    │      │ Hourly   │ 24✓ 14.5⏳ │ Pending│ [✓][✗]│
│   ...                                                             │
│                                                                   │
│ ▼ Company Y (TechStaff)           7 people  │ 210h │ 30h pending│
│                                                                   │
│   ☐ │ ED  Emma   │ Dev  │ $65/hr   │ 28.5h total│ ⏳     │[Review]│
│       Davis      │      │ Hourly   │ 16✓ 12.5⏳ │ Pending│ [✓][✗]│
│   ...                                                             │
│                                                                   │
│ ▼ Freelancers                      3 people  │ 112h │ 10h pending│
│                                                                   │
│   ☐ │ JS  John   │ Cons │ $95/hr   │ 40h total  │ ⏳     │[Review]│
│       Smith      │      │ Hourly   │ 32✓ 8⏳    │ Pending│ [✓][✗]│
│   ☐ │ LW  Lisa   │ PM   │$1200/day │ 5d total   │ ✓      │[Review]│
│       Wong       │      │ Daily    │ 5✓         │Approved│        │
│   ...                                                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Click "Review" → Opens Timesheet Drawer:**

```
┌────────────────────────────────────────────────────┐
│ DRAWER: Sarah Chen - Week of Jan 15-21           ✕│
├────────────────────────────────────────────────────┤
│                                                    │
│ 👤 Sarah Chen                                      │
│    Developer • Company X (Acme Corp)              │
│    Contract: $80/hr Hourly • Active               │
│                                                    │
│ ─────────────────────────────────────────────────│
│                                                    │
│ 📅 Week Summary                                    │
│    Total Hours: 38.5h                             │
│    Regular: 38.5h × $80/hr = $3,080               │
│    Status: ⏳ Pending Project Approval            │
│    (✓ Approved by Company Lead on Jan 22)        │
│                                                    │
│ ─────────────────────────────────────────────────│
│                                                    │
│ 📊 Daily Breakdown                                 │
│                                                    │
│ Mon Jan 15  │ 8h   │ 9am-5pm │ Auth module        │
│ Tue Jan 16  │ 8h   │ 9am-5pm │ User dashboard     │
│ Wed Jan 17  │ 7.5h │ 9am-4:30│ API integration    │
│ Thu Jan 18  │ 8h   │ 9am-5pm │ Testing & bugfixes │
│ Fri Jan 19  │ 7h   │ 9am-4pm │ Code review        │
│                                                    │
│ ─────────────────────────────────────────────────│
│                                                    │
│ 💬 Notes                                           │
│    "Completed user authentication module and      │
│     started work on dashboard. All tasks on       │
│     schedule."                                     │
│                                                    │
│ ─────────────────────────────────────────────────│
│                                                    │
│ 🔧 Actions                                         │
│                                                    │
│ [✓ Approve]  [✗ Reject]  [💬 Request Changes]    │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 🏛️ Component Architecture

### **Recommended Structure**

```
ProjectTimesheetsView.tsx (KEEP - Container)
├── Tabs
│   ├── Timesheets Tab (KEEP - Browse view)
│   │   ├── Calendar View
│   │   └── Table View
│   │
│   └── Approvals Tab (REFACTOR)
│       ├── ApprovalControlBar.tsx (NEW)
│       │   ├── Organization tabs/filter
│       │   ├── Role/Status/Contract filters
│       │   └── Bulk action toolbar
│       │
│       ├── OrganizationGroupedTable.tsx (NEW - replaces SimpleApprovalTable)
│       │   ├── Organization headers (collapsible)
│       │   ├── Contractor rows
│       │   └── Inline approve/reject actions
│       │
│       └── TimesheetDrawer.tsx (NEW or repurpose ReviewDrawer)
│           ├── Contractor info + contract details
│           ├── Week summary
│           ├── Daily breakdown table
│           └── Approval action buttons
```

### **What to REMOVE**

❌ **Remove from Approvals Tab:**
- `ContractorRoleLayer` (causes duplicate table)

❌ **Delete Unused Components:**
- `ApprovalQueue.tsx` - replaced by OrganizationGroupedTable
- `WorkQueuePanel.tsx` - useless sidebar filters
- `ComprehensiveApprovalView.tsx` - overly complex, not used
- `UnifiedApprovalBar.tsx` - redundant
- `ApprovalSystemDemo.tsx` - demo only
- `BatchApprovalDemo.tsx` - demo only
- `BatchApprovalView.tsx` - demo only

❌ **Delete Unused Timesheet Views:**
- `UnifiedTimesheetView.tsx` - not used
- `ContractorTimesheetBrowser.tsx` - redundant
- `TeamAggregateCalendar.tsx` - redundant (MultiPersonTimesheetCalendar is better)
- `TimesheetCalendarView.tsx` - old version
- `TimesheetListView.tsx` - old version
- `TimesheetManagerCalendarView.tsx` - redundant
- `TimesheetManagerListView.tsx` - redundant

### **What to KEEP**

✅ **Core Components:**
- `ProjectTimesheetsView.tsx` - main container
- `MultiPersonTimesheetCalendar.tsx` - team calendar view
- `TimesheetTableView.tsx` - table view for timesheets tab
- `IndividualTimesheet.tsx` - for contractor self-entry
- `ReviewDrawer.tsx` - can be repurposed as TimesheetDrawer

✅ **Supporting Components:**
- `EnhancedTimesheetCalendar.tsx` - used by MultiPerson
- `EnhancedDayEntryModal.tsx` - day entry modal
- All `/forms` components
- All `/hooks` components
- All `/modal` components
- All `/selection` components
- All `/indicators` components

✅ **Approval Components (to refactor):**
- `SimpleApprovalTable.tsx` → Enhance to `OrganizationGroupedTable.tsx`
- `ReviewDrawer.tsx` → Enhance to `TimesheetDrawer.tsx`
- `BulkActionToolbar.tsx` - integrate into controls
- `MonthSelector.tsx` - useful for period selection

---

## 📝 Implementation Plan

### **Phase 1: Data Model Enhancement**

**File:** `/types/projects.ts` (NEW)

```typescript
export interface ProjectContract {
  id: string;
  projectId: string;
  organizationId: string;
  organizationName: string;
  organizationType: "company" | "agency" | "freelancer";
  contractorId: string;
  contractorName: string;
  contractorRole: string;
  contractType: "hourly" | "daily" | "fixed";
  hourlyRate?: number;
  dailyRate?: number;
  fixedAmount?: number;
  requiresOrgApproval: boolean;
  orgApproverId?: string;
  status: "active" | "paused" | "ended";
  startDate: Date;
  endDate?: Date;
}

export interface TimesheetPeriod {
  id: string;
  projectId: string;
  contractId: string;
  periodType: "weekly" | "monthly";
  periodStart: Date;
  periodEnd: Date;
  totalHours: number;
  status: "draft" | "submitted-to-org" | "approved-by-org" | 
          "submitted-to-project" | "approved-final" | "rejected";
  submittedToOrgAt?: Date;
  approvedByOrgAt?: Date;
  orgApproverId?: string;
  submittedToProjectAt?: Date;
  approvedFinalAt?: Date;
  projectApproverId?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export interface OrganizationGroup {
  organizationId: string;
  organizationName: string;
  organizationType: "company" | "agency" | "freelancer";
  contractorCount: number;
  totalHours: number;
  pendingHours: number;
  approvedHours: number;
  contractors: ContractorWithPeriod[];
}

export interface ContractorWithPeriod {
  contractorId: string;
  contractorName: string;
  contractorInitials: string;
  role: string;
  contract: ProjectContract;
  currentPeriod: TimesheetPeriod;
  entries: TimesheetEntry[];
}
```

---

### **Phase 2: Remove Duplicate Components**

**Files to DELETE:**

```bash
# Approval demos and old systems
rm components/timesheets/approval/ApprovalQueue.tsx
rm components/timesheets/approval/WorkQueuePanel.tsx
rm components/timesheets/approval/ComprehensiveApprovalView.tsx
rm components/timesheets/approval/UnifiedApprovalBar.tsx
rm components/timesheets/ApprovalSystemDemo.tsx
rm components/timesheets/BatchApprovalDemo.tsx
rm components/timesheets/BatchApprovalView.tsx

# Old timesheet views
rm components/timesheets/UnifiedTimesheetView.tsx
rm components/timesheets/ContractorTimesheetBrowser.tsx
rm components/timesheets/TeamAggregateCalendar.tsx
rm components/timesheets/TimesheetCalendarView.tsx
rm components/timesheets/TimesheetListView.tsx
rm components/timesheets/TimesheetManagerCalendarView.tsx
rm components/timesheets/TimesheetManagerListView.tsx
```

**Estimated cleanup:** Remove ~15 files, ~3,000 lines of unused code

---

### **Phase 3: Implement Organization-Grouped Table**

**New Component:** `/components/timesheets/approval/OrganizationGroupedTable.tsx`

Features:
- Groups contractors by organization
- Collapsible organization headers with summary stats
- Inline approve/reject per contractor
- Bulk selection and actions
- Opens drawer on "Review" click
- Filters: Organization tabs, Role, Status, Contract Type

**Replace in:** `ProjectTimesheetsView.tsx`

```tsx
// OLD
<TabsContent value="approvals">
  <ContractorRoleLayer {...} />  ❌ REMOVE
  <Card>
    <SimpleApprovalTable {...} />  ❌ REPLACE
  </Card>
</TabsContent>

// NEW
<TabsContent value="approvals">
  <ApprovalControlBar
    organizations={organizations}
    selectedOrg={selectedOrg}
    onOrgChange={setSelectedOrg}
    filters={filters}
    onFiltersChange={setFilters}
    selectedIds={selectedIds}
    onBulkApprove={handleBulkApprove}
    onBulkReject={handleBulkReject}
  />
  <OrganizationGroupedTable
    organizationGroups={filteredGroups}
    selectedIds={selectedIds}
    onSelectionChange={setSelectedIds}
    onReview={setDrawerContractorId}
    onApprove={handleApprove}
    onReject={handleReject}
  />
  <TimesheetDrawer
    contractorId={drawerContractorId}
    isOpen={!!drawerContractorId}
    onClose={() => setDrawerContractorId(null)}
    onApprove={handleApprove}
    onReject={handleReject}
  />
</TabsContent>
```

---

### **Phase 4: Implement Timesheet Drawer**

**New Component:** `/components/timesheets/approval/TimesheetDrawer.tsx`

Features:
- Shows contractor info + contract details
- Week summary with status badges
- Daily breakdown table
- Approval history (org-level + project-level)
- Inline approve/reject/request changes actions

Can be built by enhancing existing `ReviewDrawer.tsx`.

---

### **Phase 5: Demo Data for Testing**

**File:** `/components/timesheets/approval/demo-data-org-grouped.ts`

Create realistic demo data:
- 3 organizations (Company X, Company Y, Freelancers)
- 25 contractors total (15 + 7 + 3)
- Mix of contract types (hourly, daily, fixed)
- Mix of statuses (pending, approved-by-org, approved-final)
- Timesheet periods with daily entries

---

## 🎯 Success Criteria

After implementation, you should have:

✅ **Single clean table** - no duplicates
✅ **Organization grouping** - contractors grouped by company/agency/freelancer
✅ **Contract-based logic** - each contractor has unique contract with rate/type
✅ **Hierarchical approval** - org-level approval + project-level approval
✅ **Drawer detail view** - click row → opens drawer with full timesheet
✅ **Bulk actions** - approve/reject multiple contractors at once
✅ **Filtering** - by organization, role, status, contract type
✅ **Industry standard UI** - matches Jira/Asana/Monday.com patterns
✅ **Clean codebase** - ~15 unused files deleted

---

## 🚀 Next Steps

Before implementing, please confirm:

1. **Is this the architecture you want?**
   - Organization grouping
   - Contract-based model
   - 2-level approval flow
   - Drawer-based detail view

2. **Do you want Phase 2 (cleanup) first or Phase 3 (new features) first?**
   - Option A: Clean up first, then build new (safer)
   - Option B: Build new alongside old, then remove old (faster to see results)

3. **What demo data should I create?**
   - Which companies/organizations?
   - How many contractors per org?
   - What contract types to showcase?

4. **Any changes to the proposed UI design?**
   - Organization tabs vs dropdown?
   - Collapsible groups vs always expanded?
   - Drawer vs modal for detail view?

Let me know and I'll implement! 🎯
