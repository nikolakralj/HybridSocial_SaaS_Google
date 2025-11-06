# 🎯 Three-Surface Approvals Architecture

**Date:** 2025-10-31  
**Status:** Design Complete - Ready for Implementation  
**Context:** Solving multi-project approval workflows with global workbench

---

## 🎪 The Problem You Identified

### **Scenario:**
```
TechCorp (company) participates in:
├─ Project A: Mobile App Redesign
├─ Project B: E-commerce Platform  
├─ Project C: API Integration
└─ Project D: Marketing Site

Sarah (TechCorp manager) needs to approve:
- 8 timesheets from Project A
- 3 timesheets from Project B
- 5 timesheets from Project C
- 2 timesheets from Project D

Total: 18 approvals across 4 projects
```

### **Current Problem:**
❌ Sarah has to open each project individually  
❌ No cross-project view  
❌ Can't bulk approve  
❌ Loses context switching between projects

### **Solution: Three-Surface Pattern** ✅

---

## 🎨 The Three Surfaces

### **Surface 1: Global "My Approvals" Workbench** 🎯
**Route:** `/approvals`  
**Audience:** Anyone who approves (cross-project)  
**Purpose:** Speed - single inbox with all pending approvals

**UI:**
```
┌─────────────────────────────────────────────────────────────┐
│ My Approvals                               🔔 18 pending    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Filters:  [All Projects ▾]  [All Parties ▾]  [All Steps ▾] │
│          [Timesheet ▾]  [This Week ▾]  [⚠️ SLA Breach]      │
│                                                              │
│ Bulk: [Select All] [Approve Selected] [Reject Selected]     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Item         Person      Project    Step  SLA    Hours  $   │
├─────────────────────────────────────────────────────────────┤
│ TS-Week-42   Jane Doe    Mobile App  2/3  ⚠️2h    40   $6k  │
│ ⚡ Why?  📊 View path on graph  [Approve] [Reject]          │
├─────────────────────────────────────────────────────────────┤
│ TS-Week-42   Mike Chen   E-commerce  1/2  ✅3d    38   •••  │
│ ⚡ Why?  📊 View path on graph  [Approve] [Reject]          │
├─────────────────────────────────────────────────────────────┤
│ TS-Week-42   Alex Lee    Mobile App  2/3  🟡1d    42   $6.3k│
│ ⚡ Why?  📊 View path on graph  [Approve] [Reject]          │
└─────────────────────────────────────────────────────────────┘

Keyboard shortcuts: j/k = navigate, x = select, a = approve, r = reject
```

**Key Features:**
- ✅ Server-side pagination (fast on 5k+ items)
- ✅ RLS + field masking (rate visibility per contract)
- ✅ SLA badges (red = breach, amber = <24h, green = OK)
- ✅ Bulk approve with threshold (policy-driven)
- ✅ "Why?" explainer (shows approval condition)
- ✅ **"View path on graph"** → Opens builder overlay

---

### **Surface 2: Project → Approvals Tab** 📊
**Route:** `/projects/:id/approvals`  
**Audience:** Project managers, approvers who need context  
**Purpose:** Context - full project view with graph integration

**UI:**
```
┌─────────────────────────────────────────────────────────────┐
│ Mobile App Redesign                    Project Settings ⚙️  │
├─────────────────────────────────────────────────────────────┤
│ [Overview] [Timesheets] [Approvals] [Builder] [Settings]   │
│                          ────────                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Approvals for Mobile App Redesign        📊 Mini-graph →    │
│                                                              │
│ Same queue as Surface 1, but filtered to this project       │
│                                                              │
│ Right Drawer:                           ┌────────────────┐  │
│ ┌──────────────────────────────────┐    │ Approval Path  │  │
│ │ Timesheet Details                │    │                │  │
│ │ ─────────────────                │    │ Contractor     │  │
│ │ Jane Doe - Week 42               │    │    ↓           │  │
│ │ Total: 40 hours                  │    │ Manager (YOU)  │  │
│ │                                  │    │    ↓           │  │
│ │ Visibility:                      │    │ Finance        │  │
│ │ ✅ You can see hours             │    │    ↓           │  │
│ │ ✅ You can see tasks             │    │ Client         │  │
│ │ ❌ Rate masked (no visibility)   │    │                │  │
│ │                                  │    │ Current: Step 2│  │
│ │ Current Route: Step 2 of 3       │    └────────────────┘  │
│ │ Estimator: ~2h to Finance step   │    [View Full Graph]   │
│ │                                  │                         │
│ │ [Approve] [Reject] [Send Back]   │                         │
│ └──────────────────────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- ✅ Same queue component, project-scoped
- ✅ Right drawer with full timesheet details
- ✅ Visibility preview (what this party can see)
- ✅ Mini-graph showing approval path
- ✅ Current step + ETA to next step
- ✅ "View Full Graph" → Opens builder overlay

---

### **Surface 3: Deep-Link (Email/Notification)** 📧
**Route:** `/approvals/:itemId`  
**Audience:** Approvers clicking from email  
**Purpose:** Direct action - no hunting

**Email Template:**
```
Subject: [Action Required] Timesheet approval needed

Hi Sarah,

Jane Doe submitted a timesheet for your approval:

Project: Mobile App Redesign
Period: Oct 21-27, 2025
Hours: 40.0
Step: 2 of 3 (Manager Approval)
SLA: Due in 2 hours ⚠️

[Approve Now] [Reject] [View Details]

───────────────────────────
Why am I approving this?
You're the Manager in the approval chain for this project.
View the approval path on graph →
```

**Deep-Link Page:**
```
┌─────────────────────────────────────────────────────────────┐
│ Timesheet Approval                        🔙 Back to Queue  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Jane Doe - Week 42 (Mobile App Redesign)                    │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ You are the current approver (Step 2 of 3)             │  │
│ │ SLA: ⚠️ Due in 2 hours                                  │  │
│ │                                                         │  │
│ │ Total Hours: 40.0                                       │  │
│ │ Estimated Cost: $6,000 (based on your visibility)      │  │
│ │                                                         │  │
│ │ ⚡ Why am I approving?                                  │  │
│ │ You're the Manager in the approval chain. Finance      │  │
│ │ will review after you approve.                         │  │
│ │                                                         │  │
│ │ 📊 View path on graph                                  │  │
│ │                                                         │  │
│ │ [✓ Approve] [✗ Reject] [↩ Send Back to Contractor]     │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ Timesheet Details:                                           │
│ [Show full breakdown]                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- ✅ Direct link from email
- ✅ No login if already authenticated
- ✅ Shows current step, SLA, why
- ✅ Approve/Reject without navigation
- ✅ Respects masking (only shows what you can see)
- ✅ Audit trail (who/when/from where)

---

## 🎨 Where the Visual Graph Lives

### **Location: Project → Builder Tab** 🏗️
**Route:** `/projects/:id/builder`  
**Purpose:** Source of truth for policy

**But accessible from anywhere via overlay:**

```
┌─────────────────────────────────────────────────────────────┐
│ My Approvals > TS-Week-42 > 📊 View path on graph          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ [Builder] [Approvals Overlay]                               │
│           ─────────────────                                 │
│                                                              │
│          ┌──────────┐                                        │
│          │Contractor│ ← Jane Doe submitted                  │
│          └──────────┘                                        │
│                ↓ approves                                    │
│          ┌──────────┐                                        │
│     ┌───│ Manager  │───┐ ← YOU ARE HERE (Step 2)           │
│     │   └──────────┘   │                                    │
│     │                  │                                    │
│ billsTo             approves                                │
│     │                  │                                    │
│     ↓                  ↓                                    │
│ ┌────────┐      ┌──────────┐                               │
│ │Contract│      │ Finance  │ ← Next approver                │
│ └────────┘      └──────────┘                                │
│                       ↓                                     │
│                  ┌──────────┐                               │
│                  │  Client  │ ← Final approval               │
│                  └──────────┘                                │
│                                                              │
│ Current Step: Manager Approval (2 of 3)                     │
│ Next: Finance (est. 2h after you approve)                   │
│                                                              │
│ [Close Overlay] [Approve Now] [Reject]                      │
└─────────────────────────────────────────────────────────────┘
```

**Overlay Modes:**
1. **Full** - All nodes and edges
2. **Approvals** - Approval path highlighted ← THIS ONE
3. **Money** - Payment flow
4. **People** - Who works with who
5. **Access** - Visibility rules

---

## 📊 Data Model

### **ApprovalQueueItem:**
```typescript
export type ApprovalQueueItem = {
  id: string;
  objectType: 'timesheet' | 'expense';
  
  // Project context
  project: {
    id: string;
    name: string;
  };
  
  // Approval flow position
  stepOrder: number;           // 1, 2, 3, etc.
  totalSteps: number;          // e.g., 3
  policyVersion: number;       // vN pinned on this item
  
  // Current approver
  partyId: string;             // the party for this step
  partyName: string;
  
  // Timesheet data
  period: { start: string; end: string };
  person: {
    id: string;
    name: string;
    role?: string;
  };
  
  // Metrics
  hours: number;
  amount: number | null;       // null if masked
  canViewRates: boolean;
  
  // Gating
  gating: {
    blocked: boolean;
    reasons: string[];         // ["missing_tasks", "weekend_work"]
  };
  
  // SLA
  sla: {
    dueAt?: string;
    breached: boolean;
    etaHours?: number;         // estimated hours to next step
  };
  
  // Audit
  submittedAt: string;
  submittedBy: string;
};
```

---

## 🔌 API Endpoints

### **Global Workbench:**
```typescript
// Get cross-project approval queue
GET /approvals/queue
  ?projectId=project-123           // optional filter
  &partyId=techcorp                // optional filter
  &step=2                          // optional filter
  &workType=timesheet              // timesheet | expense
  &sla=breach                      // breach | soon | all
  &limit=50
  &offset=0

Response: {
  items: ApprovalQueueItem[],
  total: number,
  filters: {
    projects: { id, name, count }[],
    parties: { id, name, count }[],
    steps: { order, count }[],
  }
}
```

### **Actions:**
```typescript
// Approve item
POST /approvals/:id/approve
{
  approvedBy: "user-123",
  notes?: "Looks good"
}

// Reject item
POST /approvals/:id/reject
{
  rejectedBy: "user-123",
  reason: "Missing task descriptions"
}

// Delegate to another user
POST /approvals/:id/delegate
{
  delegatedBy: "user-123",
  delegatedTo: "user-456",
  reason: "I'm on vacation"
}

// Bulk approve (under threshold)
POST /approvals/bulk-approve
{
  approvedBy: "user-123",
  itemIds: ["item-1", "item-2", "item-3"],
  threshold: 1000,  // policy allows bulk under $1k each
}
```

### **Graph Overlay:**
```typescript
// Get project graph with approval overlay
GET /projects/:id/graph
  ?overlay=approvals
  &focusItemId=approval-123

Response: {
  graph: {
    nodes: BaseNode[],
    edges: BaseEdge[],
  },
  overlay: {
    mode: 'approvals',
    highlightedPath: ['node-1', 'node-2', 'node-3'],
    currentStep: {
      nodeId: 'node-2',
      stepOrder: 2,
      totalSteps: 3,
    },
    nextStep: {
      nodeId: 'node-3',
      etaHours: 2,
    }
  }
}
```

---

## 🏗️ Implementation Plan

### **Sprint 1: Global Workbench (Days 3-5)** 🎯

#### **Day 3: Backend + Queue**
```typescript
// 1. Create approvals route
/pages/approvals/index.tsx → ApprovalsWorkbench

// 2. Build queue API
/utils/api/approvals-queue.ts
  - getApprovalQueue()
  - getQueueFilters()
  - approveItem()
  - rejectItem()

// 3. Add RLS + masking
/supabase/migrations/005_approval_queue.sql
  - Row-level security (only show my party's items)
  - Field-level masking (hide rates if no visibility)
```

**Exit Criteria:**
- ✅ `/approvals` route exists
- ✅ Shows items where viewer is current approver
- ✅ Filters work (project, party, step, SLA)
- ✅ SLA badges render correctly
- ✅ Rates masked based on contract visibility

---

#### **Day 4: Actions + Bulk**
```typescript
// 1. Build action handlers
/components/approvals/ApprovalQueueRow.tsx
  - Approve button → calls API
  - Reject button → shows reason modal
  - Delegate button → shows user picker

// 2. Bulk approve
/components/approvals/BulkActionToolbar.tsx
  - Select all / deselect
  - Approve selected (under threshold)
  - Reject selected (with reason)

// 3. Keyboard shortcuts
- j/k = navigate rows
- x = toggle selection
- a = approve selected
- r = reject selected
```

**Exit Criteria:**
- ✅ Can approve/reject from queue
- ✅ Bulk approve works (with threshold check)
- ✅ Keyboard shortcuts work
- ✅ Audit trail logged

---

#### **Day 5: Graph Overlay**
```typescript
// 1. Add overlay mode to WorkGraphBuilder
/components/workgraph/WorkGraphBuilder.tsx
  - Add overlay prop: 'approvals' | 'money' | 'people' | 'access'
  - Highlight nodes in approval path
  - Mark current step with badge

// 2. "View path on graph" link
/components/approvals/ApprovalQueueRow.tsx
  <Button onClick={openGraphOverlay}>
    📊 View path on graph
  </Button>

// 3. Opens builder in modal/drawer
/components/approvals/GraphOverlayModal.tsx
  - Shows WorkGraphBuilder in overlay mode
  - Focuses on approval path
  - Shows "Approve Now" button at bottom
```

**Exit Criteria:**
- ✅ "View path on graph" opens builder overlay
- ✅ Approval path highlighted
- ✅ Current step marked
- ✅ Can approve directly from overlay

---

### **Sprint 2: Project Approvals Tab (Days 6-7)** 🎯

#### **Day 6: Project Tab**
```typescript
// 1. Reuse queue component in ProjectWorkspace
/components/ProjectWorkspace.tsx
  - Add Approvals tab
  - Pass projectId filter to queue
  - Same component as global workbench

// 2. Add right drawer
/components/approvals/ApprovalDetailsDrawer.tsx
  - Shows full timesheet details
  - Visibility preview (what party can see)
  - Current step + ETA

// 3. Mini-graph sidebar
/components/approvals/MiniGraphSidebar.tsx
  - Read-only graph
  - Shows approval path only
  - "View Full Graph" button
```

**Exit Criteria:**
- ✅ Project → Approvals tab shows scoped queue
- ✅ Right drawer shows details
- ✅ Mini-graph displays path
- ✅ "View Full Graph" opens builder

---

#### **Day 7: Deep-Links**
```typescript
// 1. Deep-link route
/pages/approvals/[itemId].tsx → ApprovalDeepLink

// 2. Email templates
/utils/email/approval-templates.ts
  - Pending approval email
  - Approved notification
  - Rejected notification
  - Escalation warning

// 3. Direct action page
/components/approvals/DeepLinkApprovalView.tsx
  - Shows item details
  - Approve/Reject buttons
  - "Why am I approving?" explainer
  - Link to graph
```

**Exit Criteria:**
- ✅ `/approvals/:id` route works
- ✅ Email link goes directly to item
- ✅ Can approve without navigation
- ✅ Audit trail captures source (email)

---

## 🎯 Integration with Current System

### **What We Already Have:** ✅

```typescript
// ✅ Approval components
/components/timesheets/approval/
  - PersonPeriodCard ← Queue row component
  - ReviewDrawer ← Details drawer
  - ComprehensiveApprovalView ← Table layout

// ✅ WorkGraph Builder
/components/workgraph/WorkGraphBuilder.tsx
  - Visual canvas
  - Node rendering
  - Overlay modes (partial)

// ✅ Permission system
/utils/collaboration/permissions.ts
  - Role checking
  - UI permissions
  - Field masking

// ✅ Projects API
/utils/api/projects.ts
  - Get projects
  - Get members
  - Get roles
```

### **What We Need to Add:** ⏳

```typescript
// ⏳ Global approvals route
/pages/approvals/index.tsx

// ⏳ Approvals queue API
/utils/api/approvals-queue.ts

// ⏳ Cross-project RLS
/supabase/migrations/005_approval_queue.sql

// ⏳ Graph overlay integration
/components/approvals/GraphOverlayModal.tsx

// ⏳ Deep-link route
/pages/approvals/[itemId].tsx

// ⏳ Email templates
/utils/email/approval-templates.ts
```

---

## 🎨 UI Components Breakdown

### **Reusable Components:**

```typescript
// 1. ApprovalQueueTable (used in 3 places)
/components/approvals/ApprovalQueueTable.tsx
  Props: {
    projectId?: string,      // filter to project (Surface 2)
    showFilters?: boolean,   // show in global, hide in project
    showBulk?: boolean,      // bulk actions in global
  }
  Used in:
    - Surface 1: Global Workbench
    - Surface 2: Project Approvals Tab
    - Surface 3: Deep-Link (single item)

// 2. ApprovalQueueRow
/components/approvals/ApprovalQueueRow.tsx
  Shows: Item, Person, Project, Step, SLA, Actions
  Actions: Approve, Reject, "Why?", "View graph"

// 3. ApprovalDetailsDrawer
/components/approvals/ApprovalDetailsDrawer.tsx
  Shows: Full timesheet, Visibility preview, Current step

// 4. GraphOverlayModal
/components/approvals/GraphOverlayModal.tsx
  Wraps: WorkGraphBuilder in overlay mode
  Props: { itemId, projectId, currentStep }

// 5. BulkActionToolbar
/components/approvals/BulkActionToolbar.tsx
  Shows: Select all, Approve selected, Reject selected
```

---

## 🧪 Testing Scenarios

### **Multi-Project Approval Flow:**

```
Setup:
  - Create 3 projects (A, B, C)
  - TechCorp (company) is approver in all 3
  - 2 contractors submit timesheets in each

Test:
  1. Open /approvals (global workbench)
     ✅ Should show 6 items (2 per project)
  
  2. Filter to Project A
     ✅ Should show 2 items
  
  3. Click "View path on graph" on item 1
     ✅ Opens Project A builder
     ✅ Highlights approval path
     ✅ Shows "Step 2 of 3 (YOU)"
  
  4. Approve from overlay
     ✅ Item disappears from queue
     ✅ Toast: "Approved - Finance is next"
  
  5. Bulk select remaining 5 items
     ✅ Shows "5 selected"
  
  6. Click "Approve Selected"
     ✅ All 5 approved in one action
     ✅ Audit trail logs bulk action
```

### **Deep-Link from Email:**

```
Setup:
  - User receives approval email
  - Clicks [Approve Now] button

Test:
  1. Link goes to /approvals/item-123
     ✅ Opens deep-link page
     ✅ Shows item details
     ✅ Shows "Why am I approving?"
  
  2. Click "View path on graph"
     ✅ Opens project builder overlay
     ✅ Highlights step 2
  
  3. Click "Approve" on deep-link page
     ✅ Item approved
     ✅ Audit records source: "email_link"
     ✅ Redirect to /approvals (queue)
```

### **Rate Masking:**

```
Setup:
  - Project A has 2 contracts:
    - Contract 1: $100/hr, visible to Manager
    - Contract 2: $150/hr, HIDDEN from Manager
  
  - Manager logs in

Test:
  1. Open /approvals
     ✅ Contract 1 shows "$4,000"
     ✅ Contract 2 shows "•••" (masked)
  
  2. Click on Contract 2
     ✅ Drawer shows hours
     ✅ Drawer shows "Rate masked by policy"
     ✅ Cannot see amount
  
  3. Approve Contract 2
     ✅ Approved successfully
     ✅ Finance (next step) sees rate
```

---

## 📊 Performance Targets

### **Queue Loading:**
- ✅ p50: < 100ms (for 100 items)
- ✅ p95: < 200ms (for 5,000 items)
- ✅ Server-side pagination
- ✅ Efficient RLS queries

### **Graph Overlay:**
- ✅ Opens in < 500ms
- ✅ Cached policy (no recompile)
- ✅ Smooth transitions

### **Bulk Actions:**
- ✅ 50 items: < 2 seconds
- ✅ Idempotent (safe to retry)
- ✅ Transaction (all or nothing)

---

## 🎯 Why This Accelerates Our Timeline

### **Current Plan:**
```
Day 2: ✅ M5.1 Complete (projects + publish)
Days 3-5: Approval button integration
Days 6-14: Network Graph
```

### **New Plan with Three-Surface Pattern:**
```
Day 2: ✅ M5.1 Complete (projects + publish)
Days 3-5: Global Approvals Workbench 🎯
  → Solves multi-project problem immediately
  → Reuses existing components
  → Adds graph overlay
  
Days 6-7: Project tab + Deep-links
  → Completes three-surface pattern
  
Days 8-14: Network Graph 🏰
  → Build social moat with solid foundation
```

**Benefits:**
1. ✅ Multi-project support from day 1
2. ✅ Reuses all approval components we built
3. ✅ Graph overlay works everywhere
4. ✅ No rework later when scaling
5. ✅ Better UX for real users

---

## 🎊 Bottom Line

### **This Pattern is the Right Architecture Because:**

**Speed for approvers:**
- Single inbox across all projects
- Bulk actions
- Keyboard shortcuts
- No context switching

**Correct context on demand:**
- "View path on graph" from any surface
- Full project view when needed
- Deep-links for quick actions

**Clean mental model:**
- Projects own policies/graphs (versioned)
- Companies participate in many projects
- One queue shows everything I need to approve

**Security by design:**
- RLS enforces party membership
- Field masking per contract
- Audit trail on every action

**Scales naturally:**
- 1 project or 100 projects
- Same UX
- Same components
- Same code

---

## 🚀 Next Steps

### **Immediate Actions:**

1. **Approve this architecture** ✅
2. **Start Day 3: Global Workbench backend**
3. **Build queue table with filters**
4. **Add graph overlay integration**
5. **Test with multi-project scenarios**

### **Timeline:**
```
Day 3: Backend + Queue
Day 4: Actions + Bulk
Day 5: Graph Overlay
Day 6: Project Tab
Day 7: Deep-Links
Day 8-14: Network Graph 🏰
```

**Total: 5 days to complete three-surface approvals!**

Then we have a solid foundation for the Network Graph with real multi-project workflows already working. 🎉

---

**Created:** 2025-10-31  
**Status:** Ready to implement  
**Impact:** Solves multi-project approvals at scale  
**Timeline:** Days 3-7 (5 days)  
**Next:** Start Day 3 backend implementation

**Let's build the right architecture from day 1!** 🚀
