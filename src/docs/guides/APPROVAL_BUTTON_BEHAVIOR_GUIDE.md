# Approval Button Behavior - Current vs Full Implementation

**Created:** 2025-10-31  
**Context:** Understanding how approval buttons change based on user role and WorkGraph configuration  
**Status:** Partially implemented - Full integration pending WorkGraph completion

---

## 🎯 Your Question

> "I have buttons for approval but depends on who is using it we suppose to have send approval request or approve... I guess this will be fully implemented once WorkGraphs are fully implemented or?"

**Answer:** YES! You're exactly right. The dynamic button behavior is directly tied to the WorkGraph implementation. Let me explain what's there now vs what's coming.

---

## 📊 Current State (What Exists Now)

### **✅ Built & Working:**

#### **1. Approval UI Components**
**Location:** `/components/timesheets/approval/PersonPeriodCard.tsx`

**What it does:**
```tsx
// Shows buttons based on timesheet STATUS
{status === "submitted" || status === "amended" ? (
  <>
    <Button onClick={onApprove}>Approve</Button>
    <Button onClick={onReject}>Reject</Button>
  </>
) : status === "draft" ? (
  <Button onClick={onSubmit}>Submit for Approval</Button>
) : null}
```

**Current logic:**
- ✅ Status-based button display
- ✅ Visual states (submitted/approved/rejected)
- ✅ Action handlers (approve/reject/send back)

**What's missing:**
- ❌ User role checking (who is viewing?)
- ❌ WorkGraph approval chain (where in the flow?)
- ❌ Permission-based button visibility

---

#### **2. Permission System**
**Location:** `/utils/collaboration/permissions.ts`

**What it does:**
```typescript
// Check if user can perform action
canUserPerform(userRole, 'approve', { currentApprover })
→ true/false

// UI helpers
UIPermissions.canApprove(role)
UIPermissions.canSubmit(role)
UIPermissions.canReject(role)
```

**What exists:**
- ✅ Role definitions (Owner/Editor/Contributor/Viewer)
- ✅ Permission checking functions
- ✅ UI helper methods

**What's missing:**
- ❌ Not wired to approval buttons yet
- ❌ No context about approval flow position

---

#### **3. WorkGraph Approval Compiler**
**Location:** `/components/workgraph/WorkGraphBuilder.tsx`

**What it does:**
```typescript
// Compile graph to approval policy
const policy = compileGraph(nodes, edges);
→ {
    approvalSteps: [
      { step: 1, approvers: ["manager@company.com"], type: "sequential" },
      { step: 2, approvers: ["finance@company.com"], type: "parallel" },
      { step: 3, approvers: ["client@agency.com"], type: "sequential" }
    ],
    visibilityRules: { ... }
  }
```

**What exists:**
- ✅ Visual graph builder
- ✅ Policy compilation (graph → JSON)
- ✅ Approval flow definition
- ✅ Multi-step approval chains

**What's missing:**
- ❌ Not reading current user's position in flow
- ❌ Not determining which button to show
- ❌ Not enforcing step order

---

## 🔄 How It SHOULD Work (Full Implementation)

### **The Complete Flow:**

```
1. WorkGraph defines approval chain
   └─> Contractor → Manager → Finance → Client
   
2. User opens Approvals tab
   └─> System checks: "Who is this user?"
   
3. System determines user's role in THIS timesheet
   └─> Are you: Submitter? Current approver? Future approver? Observer?
   
4. System checks current approval step
   └─> Step 1 (Manager pending)? Step 2 (Finance pending)? Already approved?
   
5. UI shows appropriate buttons
   └─> Different buttons for each role/step
```

---

### **Button Variations by Role:**

#### **Scenario 1: Contractor viewing their OWN timesheet**

**Status: Draft**
```tsx
<Button onClick={onSubmit}>
  Submit for Approval
</Button>
```

**Status: Submitted (pending manager)**
```tsx
<Badge>Awaiting Manager Approval</Badge>
<Button variant="outline" onClick={onWithdraw}>
  Withdraw Submission
</Button>
```

**Status: Rejected by manager**
```tsx
<Badge variant="destructive">Rejected - See notes</Badge>
<Button onClick={onAmend}>
  Amend & Resubmit
</Button>
```

---

#### **Scenario 2: Manager viewing contractor's timesheet**

**Status: Submitted (YOU are current approver - Step 1)**
```tsx
<Button onClick={onApprove}>
  Approve
</Button>
<Button variant="outline" onClick={onReject}>
  Reject
</Button>
<Button variant="ghost" onClick={onSendBack}>
  Send Back to Contractor
</Button>
```

**Status: Manager approved, Finance pending (Step 2)**
```tsx
<Badge variant="secondary">
  You approved on Oct 28
</Badge>
<Badge>
  Awaiting Finance Approval
</Badge>
// No action buttons - already approved
```

---

#### **Scenario 3: Finance viewing contractor's timesheet**

**Status: Submitted, Manager pending (Step 1)**
```tsx
<Badge variant="secondary">
  Awaiting Manager Approval
</Badge>
<Badge variant="outline">
  You're next in the queue
</Badge>
// No action buttons - not your turn yet
```

**Status: Manager approved, Finance pending (YOU are current - Step 2)**
```tsx
<Button onClick={onApprove}>
  Approve
</Button>
<Button variant="outline" onClick={onReject}>
  Reject
</Button>
<Button variant="ghost" onClick={onSendBackToManager}>
  Send Back to Manager
</Button>
```

---

#### **Scenario 4: Client viewing contractor's timesheet**

**Status: Finance approved, Client pending (YOU are current - Step 3)**
```tsx
<Button onClick={onApprove}>
  Final Approval
</Button>
<Button variant="outline" onClick={onReject}>
  Reject
</Button>
```

**Status: Fully approved (all steps complete)**
```tsx
<Badge variant="secondary" className="bg-green-100">
  Fully Approved - Invoice Generated
</Badge>
<Button variant="outline" onClick={onViewInvoice}>
  View Invoice
</Button>
// No approval buttons - already complete
```

---

#### **Scenario 5: Random viewer (not in approval chain)**

**Any status:**
```tsx
<Badge>{currentStatus}</Badge>
<Button variant="ghost" disabled>
  View Only - No Approval Rights
</Button>
// Or just hide buttons entirely
```

---

## 🔧 What Needs to Be Implemented

### **Phase 1: Wire Permission Checks** (Day 2-3)

**File:** `/components/timesheets/approval/PersonPeriodCard.tsx`

**Add:**
```tsx
import { canUserPerform } from '@/utils/collaboration/permissions';

interface PersonPeriodCardProps {
  // ... existing props
  currentUserId: string;           // ✅ NEW: Who is viewing?
  currentUserRole: string;          // ✅ NEW: What's their role?
  approvalChain: ApprovalStep[];    // ✅ NEW: From WorkGraph policy
  currentApprovalStep: number;      // ✅ NEW: Where in the flow?
}

export function PersonPeriodCard({ ... }) {
  // Determine what actions this user can take
  const canApprove = canUserPerform(
    currentUserRole, 
    'approve', 
    { 
      currentStep: currentApprovalStep,
      userPosition: getUserPositionInChain(currentUserId, approvalChain)
    }
  );

  const canSubmit = canUserPerform(currentUserRole, 'submit');
  const canWithdraw = canUserPerform(currentUserRole, 'withdraw');
  const canReject = canUserPerform(currentUserRole, 'reject');

  // Render appropriate buttons
  return (
    <div>
      {canApprove && status === 'submitted' && (
        <Button onClick={onApprove}>Approve</Button>
      )}
      
      {canSubmit && status === 'draft' && (
        <Button onClick={onSubmit}>Submit for Approval</Button>
      )}
      
      {canReject && status === 'submitted' && (
        <Button onClick={onReject}>Reject</Button>
      )}
      
      {/* ... etc */}
    </div>
  );
}
```

---

### **Phase 2: Load WorkGraph Policy** (Day 2-3)

**File:** `/components/ProjectWorkspace.tsx` (Approvals tab)

**Add:**
```tsx
import { getActivePolicy } from '@/utils/api/policy-versions';

function ApprovalsTab() {
  const [approvalPolicy, setApprovalPolicy] = useState(null);
  
  useEffect(() => {
    // Load the active approval policy for this project
    async function loadPolicy() {
      const policy = await getActivePolicy(projectId);
      setApprovalPolicy(policy);
    }
    loadPolicy();
  }, [projectId]);

  // Pass policy to approval components
  return (
    <ComprehensiveApprovalView
      approvalPolicy={approvalPolicy}
      currentUserId={currentUser.id}
      currentUserRole={currentUser.role}
    />
  );
}
```

---

### **Phase 3: Determine Current Approval Step** (Day 3-4)

**File:** `/utils/api/timesheets-approval.ts`

**Add:**
```typescript
// Calculate where in the approval flow we are
export function getCurrentApprovalStep(
  timesheet: Timesheet,
  approvalPolicy: ApprovalPolicy
): number {
  const approvals = timesheet.approvals || [];
  
  // Find which step is currently pending
  for (let i = 0; i < approvalPolicy.approvalSteps.length; i++) {
    const step = approvalPolicy.approvalSteps[i];
    const stepApproved = approvals.some(
      a => a.step === i + 1 && a.status === 'approved'
    );
    
    if (!stepApproved) {
      return i + 1; // This step is pending
    }
  }
  
  return approvalPolicy.approvalSteps.length + 1; // Fully approved
}

// Check if current user is the approver for current step
export function isCurrentApprover(
  userId: string,
  currentStep: number,
  approvalPolicy: ApprovalPolicy
): boolean {
  const step = approvalPolicy.approvalSteps[currentStep - 1];
  if (!step) return false;
  
  return step.approvers.includes(userId);
}
```

---

### **Phase 4: Dynamic Button Rendering** (Day 4-5)

**File:** `/components/timesheets/approval/PersonPeriodCard.tsx`

**Full implementation:**
```tsx
export function PersonPeriodCard({ 
  timesheet,
  currentUserId,
  approvalPolicy,
  ...rest 
}) {
  const currentStep = getCurrentApprovalStep(timesheet, approvalPolicy);
  const isMyTurnToApprove = isCurrentApprover(currentUserId, currentStep, approvalPolicy);
  const isSubmitter = timesheet.userId === currentUserId;
  const isFullyApproved = currentStep > approvalPolicy.approvalSteps.length;

  // Render buttons based on complex logic
  const renderActions = () => {
    // Submitter viewing their own draft
    if (isSubmitter && timesheet.status === 'draft') {
      return <Button onClick={onSubmit}>Submit for Approval</Button>;
    }

    // Submitter viewing their submitted timesheet (pending approval)
    if (isSubmitter && timesheet.status === 'submitted') {
      return (
        <>
          <Badge>Step {currentStep}: Awaiting {getApproverRole(currentStep)}</Badge>
          <Button variant="outline" onClick={onWithdraw}>Withdraw</Button>
        </>
      );
    }

    // Submitter viewing rejected timesheet
    if (isSubmitter && timesheet.status === 'rejected') {
      return <Button onClick={onAmend}>Amend & Resubmit</Button>;
    }

    // Current approver viewing submitted timesheet
    if (isMyTurnToApprove && timesheet.status === 'submitted') {
      return (
        <>
          <Button onClick={onApprove}>Approve</Button>
          <Button variant="outline" onClick={onReject}>Reject</Button>
          <Button variant="ghost" onClick={onSendBack}>Send Back</Button>
        </>
      );
    }

    // Future approver (not your turn yet)
    if (!isMyTurnToApprove && !isFullyApproved && timesheet.status === 'submitted') {
      return (
        <Badge variant="secondary">
          Awaiting Step {currentStep} approval
        </Badge>
      );
    }

    // Already approved by everyone
    if (isFullyApproved) {
      return (
        <>
          <Badge className="bg-green-100 text-green-800">
            Fully Approved
          </Badge>
          <Button variant="outline" onClick={onViewInvoice}>
            View Invoice
          </Button>
        </>
      );
    }

    // Default: View only
    return <Button variant="ghost" disabled>View Only</Button>;
  };

  return (
    <Card>
      {/* ... header, hours, flags ... */}
      
      <div className="flex items-center gap-2">
        <Button variant="default" onClick={onReview}>Review</Button>
        {renderActions()}
      </div>
    </Card>
  );
}
```

---

## 📅 Implementation Timeline

### **Day 2 (Tomorrow) - M5.1 Complete:**
- ✅ Wire WorkGraph Builder to load projects
- ✅ Add "Publish" button to create Policy v1
- ✅ Projects list shows real projects
- ⏳ **START** permission wiring (basic)

### **Day 3-4 - Approval Integration:**
- 🎯 Load approval policy from WorkGraph
- 🎯 Determine current approval step
- 🎯 Check if current user is approver
- 🎯 Show/hide buttons based on role

### **Day 5 - Polish:**
- 🎯 Test all approval scenarios
- 🎯 Handle edge cases (withdrawn, amended)
- 🎯 Add approval history display
- 🎯 Show "next approver" indicators

### **Days 6-7 - Multi-Party Testing:**
- 🎯 Test with real multi-party projects
- 🎯 Verify rate visibility enforcement
- 🎯 Ensure proper button behavior
- 🎯 Invoice generation on final approval

---

## 🎯 Quick Summary

### **What Works NOW:**
- ✅ Approval UI exists
- ✅ Buttons render
- ✅ Status-based display (draft/submitted/approved)
- ✅ Permission system exists
- ✅ WorkGraph policy compiler exists

### **What's PENDING:**
- ⏳ Load approval policy from WorkGraph
- ⏳ Check current user's role in flow
- ⏳ Determine current approval step
- ⏳ Conditionally show buttons based on:
  - Who you are (submitter/approver/observer)
  - Where in the flow (step 1/2/3/complete)
  - What you can do (approve/reject/submit)

### **When It's COMPLETE:**
**You'll get:**
```
Contractor sees: "Submit for Approval"
Manager sees:    "Approve" / "Reject"
Finance sees:    "Awaiting Manager..." (if step 1 pending)
                 "Approve" / "Reject" (if step 2 pending)
Client sees:     "Final Approval" (if step 3 pending)
Random user:     "View Only" or no buttons
```

---

## 🚀 You're Right!

**Your intuition is 100% correct:**

> "I guess this will be fully implemented once WorkGraphs are fully implemented"

**YES!** The button behavior depends on:
1. ✅ WorkGraph defines WHO approves WHEN (exists!)
2. ⏳ System loads that policy (Day 2-3)
3. ⏳ System checks current user's role (Day 3-4)
4. ⏳ UI shows appropriate buttons (Day 4-5)

**Current state:**
- All pieces exist separately
- Just need to wire them together
- 2-3 days of integration work

**The demo you see now:**
- Shows buttons based on STATUS only
- Doesn't check WHO is viewing yet
- That's the missing piece!

---

## 🎨 Visual Example

### **Current (Status-Based Only):**
```
Timesheet Status: "Submitted"
↓
Show: [Approve] [Reject] buttons
(EVERYONE sees same buttons)
```

### **Future (Role + Policy Aware):**
```
Timesheet Status: "Submitted" at Step 2
User: "manager@company.com"
Policy: Contractor → Manager → Finance → Client
↓
Check: Is manager at Step 1? YES (already approved)
       Is manager at Step 2? NO (Finance's turn)
↓
Show: "✅ You approved on Oct 28" + "⏳ Awaiting Finance"
(No action buttons - not your turn)
```

vs

```
Same timesheet
User: "finance@company.com"
↓
Check: Is finance at Step 2? YES (current approver)
↓
Show: [Approve] [Reject] [Send Back to Manager]
(Action buttons - it's YOUR turn)
```

---

## 📋 Testing Checklist (After Implementation)

**Test each role sees correct buttons:**

### **Contractor Tests:**
- [ ] Draft timesheet → "Submit for Approval"
- [ ] Submitted timesheet → "Withdraw" + status badge
- [ ] Rejected timesheet → "Amend & Resubmit"
- [ ] Approved timesheet → View only

### **Manager Tests:**
- [ ] Contractor's submitted → "Approve" / "Reject"
- [ ] Already approved by me → "Approved ✓" badge only
- [ ] Pending other approver → "Awaiting X" badge only

### **Finance Tests:**
- [ ] Pending manager (Step 1) → "Awaiting Manager"
- [ ] Pending me (Step 2) → "Approve" / "Reject"
- [ ] Already approved by me → "Approved ✓"

### **Client Tests:**
- [ ] Pending earlier steps → "Awaiting X"
- [ ] Pending me (final) → "Final Approval"
- [ ] Fully approved → "View Invoice"

### **Random User Tests:**
- [ ] Not in approval chain → No buttons or "View Only"

---

## 🎊 Conclusion

**You identified the key architectural dependency!**

The approval button behavior is the **integration point** between:
- Permission system ✅
- WorkGraph policies ✅
- Approval UI ✅
- User context ⏳
- Role checking ⏳

**All pieces exist.** Just need 2-3 days to wire them together after M5.1 completes.

**Timeline:**
- Day 2: M5.1 complete (basic wiring)
- Days 3-5: Full approval integration
- Days 6-7: Multi-party testing
- **Then:** Buttons work perfectly for each role! 🎉

---

**Created:** 2025-10-31  
**Type:** Implementation guide  
**Status:** Pending Days 2-5  
**Related:** M5.1, Permission System, WorkGraph Builder
