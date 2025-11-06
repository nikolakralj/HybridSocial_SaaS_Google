# 🏗️ WorkGraph System Architecture

**Last Updated:** 2025-10-31

Complete overview of the WorkGraph system architecture.

---

## 🎯 System Overview

WorkGraph is a hybrid SaaS + social work network for technical freelancers combining:

1. **Work Management** - Timesheets, contracts, invoices, approvals
2. **Social Network** - Profiles, endorsements, job matching (future)
3. **Multi-Tenant** - Personal Profiles ↔ Worker Records separation
4. **Apple-Inspired Design** - Clean, minimal, functional

---

## 📐 Core Architecture Concepts

### **1. Multi-Tenant Architecture**

```
Personal Profile (Sarah)
  ├── Worker Record @ TechStaff Agency
  │   └── Projects, contracts, timesheets as agency employee
  ├── Worker Record @ DevShop Inc
  │   └── Projects, contracts, timesheets as contractor
  └── Freelance Profile
      └── Direct client work
```

**Key Principle:** Separate personal identity from work relationships

**Documentation:** `/docs/CURRENT_ARCHITECTURE.md`

---

### **2. Multi-Party Project Architecture**

Real-world contractor chains:

```
Project: AI Dashboard Development

Global Corp (Client)
  ↓ pays $175/hr
TechStaff Agency (Staffing Partner)
  ↓ pays $150/hr
DevShop Inc (Vendor)
  ↓ pays $50/hr
John Smith (Contractor)
```

Each relationship has:
- **Separate contract** (A, B, C)
- **Different rates** ($50, $150, $175)
- **Rate privacy** (John doesn't see what Global pays)
- **Approval flow** (DevShop → TechStaff → Global)

**Documentation:** `/docs/architecture/MULTI_PARTY_ARCHITECTURE.md`

---

### **3. Contract-Scoped Rate Visibility**

**The Problem:**
```
John works for DevShop at $50/hr
DevShop bills TechStaff at $150/hr
TechStaff bills Global at $175/hr

If everyone sees all rates:
  → John demands $150/hr from DevShop
  → Global is upset about $125/hr markup
  → Business relationships destroyed!
```

**The Solution:**
Each contract has:
- **Party A & Party B** (the two parties in the contract)
- **Rate visibility** (only parties can see the rate)
- **hideRateFrom** (explicitly hide from specific approvers)

```
Contract A: John ↔ DevShop ($50/hr)
  - John can see: $50/hr
  - DevShop can see: $50/hr
  - TechStaff CANNOT see (hidden)
  - Global CANNOT see (hidden)
```

**Documentation:** `/docs/architecture/CONTRACT_SCOPED_RATE_VISIBILITY.md`

---

## 🏛️ System Layers

### **Layer 1: Data Model**

**Core Types:** (in `/types/`)

```typescript
// People
Person: Individual human (Sarah)
WorkerRecord: Person in organization context

// Organizations  
Company: Business entity
Agency: Staffing company
Contractor: Solo freelancer or vendor

// Contracts
Contract: Agreement between two parties
  - partyA, partyB (the contracting parties)
  - hourlyRate, dailyRate, or fixedAmount
  - visibility settings (hideRateFrom)

// Timesheets
TimesheetEntry: Hours worked
  - person, contract, hours, week
  - status (draft, submitted, approved)
  - tasks, notes

// Approvals
ApprovalStep: One step in approval chain
ApprovalPolicy: Complete approval workflow
CompiledApproval: Executable approval flow
```

**Key Files:**
- `/types/people.ts`
- `/types/contracts.ts`
- `/types/timesheets.ts`
- `/types/approvals.ts`
- `/types/workgraph.ts`

---

### **Layer 2: Components**

**Timesheet System:** (`/components/timesheets/`)

```
UnifiedTimesheetView
  ├── Calendar View (grid-based)
  │   ├── MultiPersonTimesheetCalendar
  │   ├── EnhancedCalendarCell (drag-drop)
  │   └── EnhancedDayEntryModal
  ├── Table View (list-based)
  │   ├── MonthlyTable
  │   └── WeeklyTable
  └── Approval View
      ├── ApprovalsV2Tab
      ├── OrganizationGroupedTable
      └── MonthlyTimesheetDrawer
```

**WorkGraph Builder:** (`/components/workgraph/`)

```
WorkGraphBuilder
  ├── Visual Canvas (node-based editor)
  │   ├── PartyNode, ContractNode, PersonNode
  │   ├── CustomEdge (approval routes)
  │   └── PropertyPanel (configuration)
  ├── Compilation
  │   ├── CompileModal
  │   └── CompiledPolicyViewer
  └── Simulation
      ├── PolicySimulator
      ├── SimulatorInputForm
      └── SimulatorFlowVisualization
```

**Key Principle:** Component composition, not monoliths

---

### **Layer 3: Business Logic**

**Approval Flow Execution:**

1. **Design** (Visual Builder)
   - Create nodes (parties, contracts, people)
   - Connect with edges (approval routes)
   - Configure properties (rates, visibility)

2. **Compile** (Transform to executable)
   - Extract approval chain
   - Compute visibility rules
   - Generate approval policy

3. **Simulate** (Test before deployment)
   - Input: hours, contract, contractor
   - Output: approval flow with visible fields
   - Validate: rate visibility, SLA times

4. **Execute** (Run on real timesheets) - FUTURE
   - Apply policy to submitted timesheets
   - Route to approvers
   - Track approval status

**Documentation:** `/docs/POLICY_SIMULATOR_COMPLETE.md`

---

### **Layer 4: Data Storage**

**Current:** In-memory (demo data)

**Future:** Supabase
- `/supabase/migrations/` - Database schema
- `/utils/api/` - API layer
- `/utils/supabase/` - Supabase client

**Key Tables:**
- `people` - Personal profiles
- `worker_records` - Work relationships
- `contracts` - Agreements
- `timesheet_entries` - Time logs
- `approval_policies` - Compiled workflows
- `approval_history` - Audit trail

---

## 🔄 Key Workflows

### **Workflow 1: Timesheet Entry**

```
1. Contractor logs in
2. Selects project/contract
3. Opens calendar week
4. Drags hours to days (or uses table entry)
5. Adds task descriptions
6. Submits for approval
```

**Components:**
- `MultiPersonTimesheetCalendar`
- `EnhancedDayEntryModal`
- `TimesheetCalendarView`

---

### **Workflow 2: Approval Processing**

```
1. Manager opens Approvals tab
2. Sees grouped by contract
3. Expands monthly drawer
4. Reviews weekly breakdown
5. Checks PDF timesheet
6. Approves or rejects
7. Routes to next approver
```

**Components:**
- `ApprovalsV2Tab`
- `OrganizationGroupedTable`
- `MonthlyTimesheetDrawer`

---

### **Workflow 3: Approval Policy Design**

```
1. Admin opens WorkGraph Builder
2. Adds party nodes (companies)
3. Adds contract nodes (agreements)
4. Connects approval flow
5. Configures rate visibility
6. Compiles policy
7. Simulates test scenarios
8. Deploys to production
```

**Components:**
- `WorkGraphBuilder`
- `CompileModal`
- `PolicySimulator`

---

## 🎨 Design System

**Inspired by:**
- Apple Design (clean, minimal)
- Warp Terminal (modern gradients)
- Linear (fast, keyboard-driven)

**Key Principles:**
1. **Clarity** - Every element has purpose
2. **Speed** - Keyboard shortcuts, quick actions
3. **Consistency** - Shared patterns across features
4. **Delight** - Subtle animations, polished details

**Files:**
- `/styles/globals.css` - Global styles, design tokens
- `/components/ui/` - shadcn/ui component library

---

## 🔐 Security & Privacy

### **Rate Privacy**
- Contract parties see only their rate
- Non-parties see masked rates (`•••`)
- Explicit hideRateFrom for additional control

### **Data Isolation**
- Personal Profiles separate from Worker Records
- Project data scoped to participants
- Role-based access control

### **Audit Trail**
- All approvals logged
- Changes tracked with timestamps
- User attribution for accountability

---

## 📊 Data Flow Diagrams

### **Timesheet Approval Flow:**

```
Contractor
  ↓ submits timesheet
Direct Manager (DevShop)
  ↓ approves (sees rate: $50/hr)
Agency Manager (TechStaff)
  ↓ approves (sees rate: •••)
Client Manager (Global Corp)
  ↓ final approval (sees rate: •••)
System
  ↓ generates invoice
Contractor
  ← receives payment
```

### **Rate Visibility:**

```
Contract A: John ↔ DevShop ($50/hr)
Contract B: DevShop ↔ TechStaff ($150/hr)
Contract C: TechStaff ↔ Global ($175/hr)

John's timesheet approval:
  Step 1 (DevShop):  sees $50/hr  ← Contract A rate
  Step 2 (TechStaff): sees •••    ← Not in Contract A
  Step 3 (Global):    sees •••    ← Not in Contract A
```

---

## 🚀 Technology Stack

**Frontend:**
- React + TypeScript
- Tailwind CSS v4
- shadcn/ui components
- React Flow (node editor)
- Recharts (visualizations)

**Backend (Future):**
- Supabase (database, auth, storage)
- Edge Functions (business logic)
- PostgreSQL (data)

**Tools:**
- Figma (design)
- Figma Make (prototyping)

---

## 📚 Documentation Index

### **Architecture:**
- `/docs/architecture/SYSTEM_ARCHITECTURE.md` - This file
- `/docs/architecture/MULTI_PARTY_ARCHITECTURE.md` - Multi-party system
- `/docs/architecture/CONTRACT_SCOPED_RATE_VISIBILITY.md` - Rate privacy

### **Implementation:**
- `/docs/roadmap/MASTER_ROADMAP.md` - Project roadmap
- `/docs/changelog/RECENT_FIXES.md` - Latest updates

### **Components:**
- `/components/timesheets/README.md` - Timesheet system
- `/components/timesheets/approval-v2/README.md` - Approval system
- `/components/workgraph/` - Visual builder (no README yet)

### **Guides:**
- `/docs/guides/` - How-to guides (to be created)

---

## 🎯 Next Steps

### **Immediate:**
1. Create integration between visual builder and approval system
2. Save/load approval policies
3. Test with real data

### **Near-term:**
1. Backend integration (Supabase)
2. Real-time notifications
3. Audit logs

### **Future:**
1. Social features
2. Job matching
3. Network discovery

---

**Last Updated:** 2025-10-31  
**Status:** Architecture stable, ready for integration phase  
**See Also:** `/docs/roadmap/MASTER_ROADMAP.md` for implementation progress
