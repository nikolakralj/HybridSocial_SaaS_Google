# 🏗️ Project vs Company Timesheet Architecture

## Executive Summary

WorkGraph now has a **clear separation** between two different timesheet management contexts:

1. **Project Timesheets** (project-scoped) → Shows all contractors on a specific project
2. **Company Team View** (company-scoped) → Shows all employees from a specific company

This document explains the architectural decision, implementation, and future roadmap.

---

## 🎯 The Core Question

**When viewing timesheets, WHO should see WHAT?**

This depends on **context**:
- **Project Owner** viewing Project Workspace → sees ALL contractors on THAT project
- **Company Owner** viewing Company Dashboard → sees ALL employees from THEIR company
- **Agency Owner** viewing Agency Dashboard → sees ALL contractors THEY manage

---

## 📊 Two Different Views

### **View 1: Project Timesheets (PROJECT-SCOPED)**

**File**: `/components/timesheets/ProjectTimesheetsView.tsx`

**Context**: Lives inside Project Workspace
- Path: `Projects → "Mobile App Redesign" → Timesheets`
- Used in: `ApprovalSystemDemo.tsx` (demo), `ProjectWorkspace.tsx` (production)

**Who sees this:**
- ✅ Project Owner (client-side PM)
- ✅ Stakeholders viewing project progress

**Data scope:**
```typescript
// Show ALL contractors on THIS project
SELECT * FROM contractors
WHERE project_id = currentProjectId
// Includes all vendors: Acme Corp, TechStaff Inc, freelancers
```

**Example:**
```
Mobile App Redesign Project → Timesheets
├── Acme Corp (4 people)
│   ├── Mike Wilson
│   ├── Sarah Chen
│   ├── Tom Martinez
│   └── Emma Davis
├── TechStaff Inc (3 people)
│   ├── Alex Rodriguez
│   ├── Alex Kim
│   └── Lisa Park
└── Freelancers (1 person)
    └── Jordan Smith

Total: 8 contractors across 3 vendors
```

---

### **View 2: Company Team View (COMPANY-SCOPED)**

**File**: `/components/timesheets/CompanyTeamView.tsx` *(not yet created)*

**Context**: Lives in Company Dashboard
- Path: `Dashboard → My Team` or `Company → Acme Corp → Team`
- Used in: Company-specific workspace

**Who sees this:**
- ✅ Company Owner (Acme Corp CEO)
- ✅ Agency Owner (staffing agency)
- ✅ Team leads viewing their organization

**Data scope:**
```typescript
// Show only MY employees across ALL projects
SELECT * FROM contractors
WHERE company_id = myCompanyId
// Only shows Acme Corp people, NOT other vendors
```

**Example:**
```
Acme Corp Dashboard → My Team
├── Mike Wilson (on Mobile App project)
├── Sarah Chen (on Mobile App project)
├── Tom Martinez (on Mobile App project)
├── Emma Davis (on Mobile App project)
├── John Doe (on E-commerce project)
└── Jane Smith (on Healthcare project)

Total: 6 Acme employees across 3 different projects
```

---

## 🔄 Key Architectural Differences

| Aspect | Project Timesheets | Company Team View |
|--------|-------------------|-------------------|
| **Scope** | Project-level | Company-level |
| **Filters by** | `project_id` | `company_id` |
| **Shows** | All vendors on project | Only company employees |
| **Used by** | Project owners, PMs | Company owners, agencies |
| **Cross-vendor?** | ✅ Yes | ❌ No |
| **Cross-project?** | ❌ No | ✅ Yes |

---

## 📋 Current Implementation Status

### ✅ **Completed: Project Timesheets View**

**File**: `ProjectTimesheetsView.tsx`

**Features:**
1. **Two-tab system:**
   - **Timesheets Tab** = View-only browser (no bulk selection)
   - **Approvals Tab** = Bulk action workflow (with selection)

2. **Timesheets Tab (View-Only):**
   - ❌ No "Copy Last Week" button
   - ❌ No "Export" button
   - ❌ No bulk selection checkboxes
   - ✅ Role/status filtering
   - ✅ Individual row actions (hover, right-click)
   - ✅ "Copy to Others" for single person
   - ✅ Quick edit popover

3. **Approvals Tab (Bulk Actions):**
   - ✅ Full selection functionality
   - ✅ Bulk approve contracts
   - ✅ Queue view (contract grouping)
   - ✅ Table view (spreadsheet)

**Key Props:**
```typescript
interface ProjectTimesheetsViewProps {
  ownerId: string;        // Project owner ID
  ownerName: string;      // Project owner name
  contractors: Contractor[]; // ALL contractors on THIS project
  hourlyRate?: number;
}
```

---

### 🚧 **TODO: Company Team View**

**File**: `CompanyTeamView.tsx` *(to be created)*

**Features to implement:**
1. **Different columns:**
   - Replace "Default Hours" with "Assigned Projects"
   - Add "Utilization %" (hours logged vs capacity)
   - Add "This Week" progress
   - Add "Next Week" schedule

2. **Bulk actions appropriate for company context:**
   - "Assign to Project"
   - "Set Default Hours"
   - "Export Payroll"
   - "Copy to All"

3. **Project-level grouping:**
   - Show employees grouped by which project they're on
   - Allow filtering by project assignment
   - Show cross-project totals

**Key Props:**
```typescript
interface CompanyTeamViewProps {
  companyId: string;      // Company ID
  companyName: string;    // Company name
  employees: Employee[];  // Only THIS company's employees
  showProjects?: boolean; // Show project assignments
}
```

---

## 🎨 UI/UX Decisions

### **Timesheets vs Approvals Tabs**

**Decision**: Make Timesheets tab a **view-only browser**, keep Approvals tab for **bulk actions**.

**Rationale:**
```
┌─────────────────────────────────────────┐
│ Timesheets Tab (Browse)                 │
├─────────────────────────────────────────┤
│ Use case: "I want to see Sarah's hours" │
│ Action: Click Sarah → view/edit         │
│ Selection: ❌ Not needed                 │
│ Bulk actions: ❌ Removed                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Approvals Tab (Workflow)                │
├─────────────────────────────────────────┤
│ Use case: "Approve all pending"         │
│ Action: Select contracts → bulk approve │
│ Selection: ✅ Required                   │
│ Bulk actions: ✅ Essential               │
└─────────────────────────────────────────┘
```

**Mental Model**: Think of GitHub
- **"Files" tab** = Browse codebase (no bulk selection)
- **"Pull Requests" tab** = Review workflow (selection + bulk actions)

---

## 🔐 Permission Model Integration

Based on `CONTRACTOR_TYPES_AND_PERMISSIONS.md`:

### **Solo Freelancer**
- **Sees**: Own timesheet only
- **Access**: Neither project nor company view (just "My Timesheet")

### **Team Lead / Company Owner**
- **Sees**: Company Team View (their employees only)
- **Access**: Company-scoped, organization-filtered
- **Cannot see**: Other vendors' contractors

### **Project Manager / Client PM**
- **Sees**: Project Timesheets View (all contractors)
- **Access**: Project-scoped, no vendor filtering
- **Can see**: All vendors on their project

---

## 🚀 Migration Guide

### **Before (Confusing)**
```typescript
// Ambiguous name, unclear scope
<CompanyOwnerUnifiedView 
  contractors={contractors} // Who's included?
/>
```

### **After (Clear)**
```typescript
// Project context
<ProjectTimesheetsView 
  contractors={allProjectContractors} // All vendors on THIS project
/>

// Company context (future)
<CompanyTeamView 
  employees={myCompanyEmployees} // Only MY employees
/>
```

---

## 📝 Implementation Checklist

### ✅ Phase 1: Project View (COMPLETE)
- [x] Rename `CompanyOwnerUnifiedView.tsx` → `ProjectTimesheetsView.tsx`
- [x] Remove bulk actions from Timesheets tab
- [x] Make selection conditional on active tab
- [x] Update `ContractorRoleLayer` with `showSelection` prop
- [x] Update `ApprovalSystemDemo.tsx` imports
- [x] Add architectural documentation

### 🚧 Phase 2: Company View (TODO)
- [ ] Create `CompanyTeamView.tsx`
- [ ] Design company-specific columns (Assigned Projects, Utilization)
- [ ] Implement cross-project aggregation
- [ ] Add company-specific bulk actions
- [ ] Create demo: `CompanyTeamDemo.tsx`
- [ ] Integrate with Company Dashboard

### 🔮 Phase 3: Permission Integration (FUTURE)
- [ ] Add role-based data scoping
- [ ] Implement organizational filtering
- [ ] Add vendor privacy boundaries
- [ ] Create permission middleware
- [ ] Update Supabase RLS policies

---

## 🧪 How to Test

### **Test Project View**
1. Navigate to Approval System Demo
2. **Timesheets Tab**:
   - ✅ Should NOT see "Copy Last Week" or "Export" buttons
   - ✅ Should NOT see selection checkboxes
   - ✅ SHOULD see role filter
   - ✅ SHOULD see individual row hover buttons
3. **Approvals Tab**:
   - ✅ SHOULD see selection checkboxes
   - ✅ SHOULD see "Select All" button
   - ✅ SHOULD see selection count footer

### **Test Company View** *(after implementation)*
1. Navigate to Company Dashboard → My Team
2. Should only see YOUR company's employees
3. Should see employees across multiple projects
4. Should see project assignment column

---

## 💡 Key Insights

### **1. Context Determines Scope**
```
Project Workspace  →  Project-scoped data
Company Dashboard  →  Company-scoped data
Agency Dashboard   →  Agency-scoped data
```

### **2. Same UI, Different Data**
- Don't create 3 different interfaces
- Use ONE component with different data scopes
- Control via props: `projectId` vs `companyId`

### **3. Selection Follows Purpose**
```
Browse mode   →  No selection (view-only)
Workflow mode →  Selection (bulk actions)
```

### **4. Future Flexibility**
By separating concerns now, we can easily add:
- Agency-scoped view (for staffing agencies)
- Client-scoped view (for consulting firms)
- Department-scoped view (for large companies)

---

## 🎯 Summary

**What changed:**
- `CompanyOwnerUnifiedView.tsx` → `ProjectTimesheetsView.tsx`
- Timesheets tab = view-only (no selection)
- Approvals tab = bulk actions (with selection)
- Clear architectural separation of concerns

**Why it matters:**
- **Clarity**: Developers know which view to use
- **Scalability**: Easy to add company/agency views
- **User Experience**: Right tools for the right job
- **Performance**: Only load relevant data

**Next steps:**
- Implement `CompanyTeamView.tsx`
- Add permission-based scoping
- Create demo for each context

---

**See also:**
- `CONTRACTOR_TYPES_AND_PERMISSIONS.md` - Permission model
- `MODULAR_PROJECT_ARCHITECTURE.md` - Project workspace design
- `TABLE_VIEW_COPY_TO_OTHERS.md` - Individual row actions
