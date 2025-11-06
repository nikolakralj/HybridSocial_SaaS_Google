# WorkGraph 2.0 - Enterprise Platform Master Plan

## 🚀 Vision: From Configuration Tool to Operational Command Center

Transform the Visual WorkGraph Builder from a one-time configuration tool into a **living operational map** that teams use daily to understand, simulate, and manage complex multi-party work relationships.

---

## 📊 12 Major Enhancement Streams

### Priority Matrix

| Enhancement | Business Value | Technical Complexity | Phase | Est. Weeks |
|-------------|---------------|---------------------|-------|------------|
| **1. Overlays & Views** | 🔥🔥🔥 High | 🟡 Medium | A | 2-3 |
| **2. Policy Simulator** | 🔥🔥🔥 High | 🟡 Medium | A | 2-3 |
| **3. Financial Controls** | 🔥🔥🔥 High | 🔴 High | B | 4-6 |
| **4. Scale Optimizations** | 🔥🔥 Medium | 🔴 High | B | 3-4 |
| **5. Advanced Security** | 🔥🔥🔥 High | 🔴 High | B | 4-5 |
| **6. Analytics & ML** | 🔥🔥 Medium | 🔴 High | C | 6-8 |
| **7. Integration Platform** | 🔥🔥🔥 High | 🟡 Medium | B | 3-4 |
| **8. Property Testing** | 🔥🔥 Medium | 🟡 Medium | A | 2-3 |
| **9. UX Enhancements** | 🔥🔥🔥 High | 🟢 Low | A | 1-2 |
| **10. Mobile & Offline** | 🔥 Low | 🔴 High | C | 4-6 |
| **11. Incident Management** | 🔥🔥 Medium | 🟢 Low | A | 1-2 |
| **12. Commercial Packaging** | 🔥🔥🔥 High | 🟢 Low | A | 1 |

---

## 🎯 Phase A: Immediate Impact (Weeks 1-8)

### 1. Overlay Modes - "The Operational Map" ⭐ PRIORITY 1

**Goal**: Transform canvas from static config to dynamic operational view

#### Features

**A. Overlay Switcher**
```typescript
type OverlayMode = 'full' | 'approvals' | 'money' | 'people' | 'access';
```

- **Full View**: All nodes and edges (current behavior)
- **Approvals Overlay**: Only approval edges with step numbers
- **Money Flow Overlay**: Financial edges (BillsTo, Invoices, Funds) with running totals
- **People Overlay**: Capacity heatmap on Party/Team nodes
- **Access Overlay**: Visibility rules visualized (locked icons inline)

**B. Visual Enhancements**
- Approval steps show as numbered badges on edges
- Money flows show amounts in tooltips
- People nodes color-coded by utilization (green < 80%, yellow 80-100%, red > 100%)
- Masked fields show 🔒 icon directly on nodes

**C. Performance Target**
- < 200ms to switch between overlays
- No full re-render (only visibility + styling changes)
- Keyboard shortcuts: `1-5` for overlay modes

**D. Accessibility**
- WCAG 2.2 AA contrast ratios for all overlay colors
- Keyboard navigation between highlighted nodes
- Screen reader announces overlay changes

#### Implementation

```typescript
// /components/workgraph/OverlayController.tsx
interface OverlayConfig {
  mode: OverlayMode;
  visibleEdgeTypes: EdgeType[];
  nodeEnhancements: (node: BaseNode) => NodeEnhancement;
  edgeEnhancements: (edge: BaseEdge) => EdgeEnhancement;
}

// Example: Approvals Overlay
const approvalsOverlay: OverlayConfig = {
  mode: 'approvals',
  visibleEdgeTypes: ['approves'],
  nodeEnhancements: (node) => ({
    opacity: node.data?.canApprove ? 1 : 0.3,
    border: node.data?.canApprove ? 'blue' : 'gray',
  }),
  edgeEnhancements: (edge) => ({
    label: edge.data?.order ? `Step ${edge.data.order}` : '',
    color: '#3b82f6',
    animated: true,
  }),
};
```

**Acceptance Criteria**:
- ✅ 5 overlay modes functional
- ✅ < 200ms switch time (measured via Performance API)
- ✅ Keyboard shortcuts work (1-5)
- ✅ WCAG contrast verified with axe-core
- ✅ Approval steps show numbered badges
- ✅ Money totals calculated correctly

**Deliverable**: Week 2

---

### 2. Policy Lifecycle - "Trust but Verify" ⭐ PRIORITY 2

**Goal**: Simulate policies before deploying, diff changes, manage versions

#### Features

**A. Policy Simulator**

Input: Sample work object (timesheet, expense, invoice)
Output: Step-by-step routing trace

```typescript
interface SimulationStep {
  step: number;
  approverPartyId: string;
  approverRole: string;
  action: 'approve' | 'skip' | 'escalate';
  reason: string;
  timestamp: number;
}

interface SimulationResult {
  workObjectId: string;
  steps: SimulationStep[];
  finalStatus: 'approved' | 'rejected' | 'pending';
  totalTime: number; // estimated SLA
}
```

**Example UI**:
```
📝 Simulating Timesheet #T-123 (40 hours, $6,000)

Step 1: Tech Corp (Project Manager)
  ✓ Approves - "Amount within threshold"
  ⏱️ Est. 24 hours

Step 2: Design Agency (Creative Director)  
  ⊗ SKIP - "Auto-approve enabled for amounts < $10K"
  
Step 3: Retail Co (Finance Team)
  ✓ Approves - "Final approval"
  ⏱️ Est. 48 hours

Total SLA: ~72 hours
Final Status: APPROVED ✓
```

**B. Policy Diff Viewer**

Side-by-side comparison of policy versions:

```
Approval Policy v1 → v2

STEPS ADDED:
  + Step 2: Agency (Creative Director) - Required

STEPS REMOVED:
  - Step 3: Client (CFO) - Only if > $50K

THRESHOLDS CHANGED:
  Auto-approve: $5K → $10K
  
VISIBILITY CHANGED:
  + Contract.hourlyRate hidden from Agency
```

**C. In-Flight Migration**

When policy changes:
- Existing items stay on old policy version (locked)
- New items use new policy
- Optional: "Migrate to new policy" wizard for pending items

**D. Version History**

```typescript
interface PolicyVersion {
  version: number;
  compiledAt: string;
  compiledBy: string;
  changeLog: string;
  isActive: boolean;
  itemsUsingThisVersion: number;
}
```

#### Implementation

```typescript
// /components/workgraph/PolicySimulator.tsx
export function PolicySimulator({
  policy,
  sampleWorkObject,
}: {
  policy: ApprovalPolicy;
  sampleWorkObject: WorkObject;
}) {
  const steps = simulateApprovalFlow(policy, sampleWorkObject);
  
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <SimulationStepCard key={i} step={step} />
      ))}
    </div>
  );
}

function simulateApprovalFlow(
  policy: ApprovalPolicy,
  workObject: WorkObject
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  
  for (const step of policy.steps) {
    // Check auto-approve threshold
    if (policy.autoApprove?.underAmount && 
        workObject.amount < policy.autoApprove.underAmount) {
      steps.push({
        step: step.order,
        approverPartyId: step.partyId,
        approverRole: step.role,
        action: 'skip',
        reason: `Auto-approve: amount $${workObject.amount} < $${policy.autoApprove.underAmount}`,
        timestamp: Date.now() + (step.order * 24 * 60 * 60 * 1000), // Est. 24hrs per step
      });
      continue;
    }
    
    // Check conditions
    if (step.minAmount && workObject.amount < step.minAmount) {
      steps.push({
        step: step.order,
        approverPartyId: step.partyId,
        approverRole: step.role,
        action: 'skip',
        reason: `Amount $${workObject.amount} below threshold $${step.minAmount}`,
        timestamp: Date.now() + (step.order * 24 * 60 * 60 * 1000),
      });
      continue;
    }
    
    // Normal approval step
    steps.push({
      step: step.order,
      approverPartyId: step.partyId,
      approverRole: step.role,
      action: 'approve',
      reason: 'Required approval step',
      timestamp: Date.now() + (step.order * 24 * 60 * 60 * 1000),
    });
  }
  
  return steps;
}
```

**Acceptance Criteria**:
- ✅ Simulator shows step-by-step trace with reasons
- ✅ Diff viewer highlights semantic changes (not just JSON)
- ✅ In-flight items stay on old policy version
- ✅ Version history shows items using each version
- ✅ Can export simulation results as PDF

**Deliverable**: Week 4

---

### 9. UX Enhancements - "Get Users to Success Fast" ⭐ PRIORITY 3

**Goal**: Reduce time-to-first-project from 30min to 5min

#### Features

**A. 5-Step Guided Wizard**

```
Step 1: Name Your Project
  "What are you working on?"
  
Step 2: Choose Template
  ○ Staff Augmentation (T&M)
  ○ SOW with Milestones
  ○ Managed Service
  ○ Start from Scratch
  
Step 3: Add Parties
  [Search existing companies...]
  + Tech Corp (Company) ✓
  + Design Agency (Agency) ✓
  + Retail Co (Client) ✓
  
Step 4: Set Approval Chain
  [Visual: Drag to reorder]
  1. Company (Project Manager)
  2. Agency (Creative Director)
  3. Client (Finance)
  
Step 5: Configure Permissions
  ☑ Hide rates from Agency
  ☑ Hide rates from Client
  ☐ Allow Agency to edit timesheets
```

**B. "Why Can/Can't I See This?" Explainers**

Every masked field gets a tooltip:

```typescript
<Tooltip>
  <TooltipTrigger>
    <div className="flex items-center gap-2">
      <span>Rate: •••</span>
      <HelpCircle className="h-3 w-3 text-gray-400" />
    </div>
  </TooltipTrigger>
  <TooltipContent>
    <div className="space-y-2">
      <p className="font-medium">Why is this hidden?</p>
      <p className="text-sm">
        Based on project policy "Mobile App Redesign" v3:
      </p>
      <div className="bg-gray-100 p-2 rounded text-xs">
        Rule: Hide Contract.hourlyRate from Agency
        Priority: 100
        Set by: john@techcorp.com on 2025-01-15
      </div>
      <p className="text-xs text-gray-500">
        Contact your project admin to request access.
      </p>
    </div>
  </TooltipContent>
</Tooltip>
```

**C. Bulk Actions on Canvas**

- Multi-select nodes (Shift+Click or drag-select box)
- Bulk set "Can Approve" for all selected parties
- Bulk hide rates from selected parties
- Bulk delete selected nodes/edges

**D. Smart Defaults**

When adding a Party node:
- Auto-detect type from organization profile (if linked)
- Pre-fill common roles (Project Manager, Finance, etc.)
- Suggest approval order based on party type

#### Implementation

```typescript
// /components/workgraph/GuidedWizard.tsx
export function ProjectSetupWizard({
  onComplete,
}: {
  onComplete: (project: ProjectConfiguration) => void;
}) {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [template, setTemplate] = useState<'staff_aug' | 'sow' | 'managed' | 'scratch'>('staff_aug');
  const [parties, setParties] = useState<Party[]>([]);
  const [approvalChain, setApprovalChain] = useState<ApprovalStep[]>([]);
  const [permissions, setPermissions] = useState<PermissionConfig>({});
  
  const handleComplete = () => {
    const project = buildProjectFromWizard({
      projectName,
      template,
      parties,
      approvalChain,
      permissions,
    });
    onComplete(project);
  };
  
  return (
    <Dialog open>
      <DialogContent className="max-w-2xl">
        <WizardSteps currentStep={step} totalSteps={5} />
        
        {step === 1 && <NameProjectStep value={projectName} onChange={setProjectName} />}
        {step === 2 && <ChooseTemplateStep value={template} onChange={setTemplate} />}
        {step === 3 && <AddPartiesStep parties={parties} onChange={setParties} />}
        {step === 4 && <SetApprovalChainStep chain={approvalChain} onChange={setApprovalChain} />}
        {step === 5 && <ConfigurePermissionsStep config={permissions} onChange={setPermissions} />}
        
        <DialogFooter>
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 5 && <Button onClick={() => setStep(step + 1)}>Next</Button>}
          {step === 5 && <Button onClick={handleComplete}>Create Project</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Acceptance Criteria**:
- ✅ Wizard completes 4-party chain in < 5 minutes
- ✅ Every masked field has explainer tooltip
- ✅ Bulk actions work on 10+ selected nodes
- ✅ NPS ≥ 8 for setup flow (post-pilot survey)
- ✅ Smart defaults reduce clicks by 50%

**Deliverable**: Week 6

---

### 11. Incident Management - "Oh Sh*t" Buttons ⭐ PRIORITY 4

**Goal**: Instant rollback and freeze during incidents

#### Features

**A. Policy Rollback**

```typescript
interface PolicyRollback {
  targetVersion: number;
  reason: string;
  affectedItems: number;
  rollbackBy: string;
  rollbackAt: string;
}

// One-click rollback UI
<AlertDialog>
  <AlertDialogTrigger>
    <Button variant="destructive">
      <RotateCcw className="h-4 w-4 mr-2" />
      Rollback to v2
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Rollback Policy?</AlertDialogTitle>
    <AlertDialogDescription>
      This will revert approval policy from v3 → v2.
      
      <div className="bg-yellow-50 p-3 rounded mt-3">
        <strong>Affected items:</strong> 23 pending approvals
        
        These will be re-routed according to v2 policy.
      </div>
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleRollback}>
        Confirm Rollback
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**B. Freeze Mode**

```typescript
interface ProjectFreezeState {
  frozen: boolean;
  frozenAt: string;
  frozenBy: string;
  reason: string;
  allowSubmissions: boolean; // Queue but don't route to approvers
}

// Freeze toggle
<Switch
  checked={project.frozen}
  onCheckedChange={handleFreeze}
  disabled={!canFreeze}
/>
<Label>
  Freeze Approvals
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <HelpCircle className="h-3 w-3 ml-1" />
      </TooltipTrigger>
      <TooltipContent>
        Submissions still captured but approvals paused.
        Use during incidents or policy changes.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</Label>
```

**C. Incident Banner**

When project is frozen or rolled back:

```tsx
<div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <AlertTriangle className="h-4 w-4" />
    <span>
      Approvals Frozen - {project.freezeReason}
    </span>
  </div>
  <Button variant="outline" size="sm" onClick={handleUnfreeze}>
    Unfreeze
  </Button>
</div>
```

**Acceptance Criteria**:
- ✅ Rollback completes in < 5 seconds
- ✅ Freeze state visible to all parties
- ✅ Audit log records freeze/unfreeze events
- ✅ Can preview impact before rollback

**Deliverable**: Week 7

---

### 12. Commercial Packaging - "Show Me the Money" ⭐ PRIORITY 5

**Goal**: Clear SKU structure for sales

#### Tiers

**Core (Free / $99/mo)**
- Visual Builder (basic)
- Up to 3 parties
- 1 project
- Basic approvals (sequential only)
- Community support

**Pro ($499/mo)**
- Unlimited parties & projects
- Overlays & Simulator
- Parallel approvals
- Budgets & POs
- Email support

**Enterprise ($2,500+/mo)**
- All Pro features +
- Field encryption
- SSO/SCIM
- Data residency
- Advanced analytics
- Legal hold
- Dedicated CSM

**Add-Ons**
- E-Signature: +$199/mo
- Anomaly Detection: +$299/mo
- Multi-region: +$499/mo

#### Implementation

```typescript
// /types/subscription.ts
export type SubscriptionTier = 'core' | 'pro' | 'enterprise';

export interface FeatureGate {
  tier: SubscriptionTier;
  addOns?: string[];
}

export const FEATURES: Record<string, FeatureGate> = {
  'overlay_modes': { tier: 'pro' },
  'policy_simulator': { tier: 'pro' },
  'parallel_approvals': { tier: 'pro' },
  'field_encryption': { tier: 'enterprise' },
  'sso': { tier: 'enterprise' },
  'anomaly_detection': { tier: 'core', addOns: ['anomaly_detection'] },
  'e_signature': { tier: 'core', addOns: ['e_signature'] },
};

// Usage in code
function canUseFeature(feature: string, subscription: Subscription): boolean {
  const gate = FEATURES[feature];
  if (!gate) return true; // Feature not gated
  
  // Check tier
  const tierOrder = ['core', 'pro', 'enterprise'];
  if (tierOrder.indexOf(subscription.tier) < tierOrder.indexOf(gate.tier)) {
    return false;
  }
  
  // Check add-ons
  if (gate.addOns && !gate.addOns.some(addon => subscription.addOns.includes(addon))) {
    return false;
  }
  
  return true;
}
```

**Acceptance Criteria**:
- ✅ Feature gates work for all tiers
- ✅ Upgrade flow in-app
- ✅ Trial period (30 days Pro)
- ✅ Downgrade path (data preserved)

**Deliverable**: Week 8

---

## 🏗️ Phase B: Enterprise Hardening (Weeks 9-20)

### 3. Financial Controls

**Features**:
- 3-way match (SOW ↔ PO ↔ Invoice) with ±5% tolerance
- Effective-dated rates with retro adjustments
- Multi-currency with FX lock
- Markups with secrecy (Agency markup hidden)
- Invoice dispute workflow

**Deliverable**: Week 14

---

### 4. Scale Optimizations

**Features**:
- Auto-clustering by party (expand/collapse)
- Server-side topological layout
- Materialized views for "My Approvals"
- Outbox pattern + idempotency

**Performance Target**: p95 < 200ms for 10K+ item queues

**Deliverable**: Week 17

---

### 5. Advanced Security

**Features**:
- Field-level encryption (KMS-backed)
- Quarterly access reviews
- Legal hold for projects in dispute
- PII/DLP scanning on uploads
- Region data residency (US/EU/UK)

**Compliance**: SOC 2 Type II audit-ready

**Deliverable**: Week 20

---

### 7. Integration Platform

**Features**:
- Event webhooks (signed + replay)
- GraphQL with policy-lens
- Headless CLI compiler (`workgraph compile`)

**Example Webhook Payload**:
```json
{
  "event": "timesheet.approved",
  "timestamp": "2025-01-30T10:00:00Z",
  "data": {
    "timesheetId": "T-123",
    "projectId": "P-001",
    "approvedBy": "user-456",
    "step": 2,
    "nextStep": 3
  },
  "signature": "sha256=..."
}
```

**Deliverable**: Week 18

---

### 8. Property-Based Testing

**Features**:
- Policy fuzzer (generates random graphs)
- Golden snapshot tests
- RLS penetration tests in CI

**Invariants Tested**:
- Agency never sees Company↔Contractor rates
- No cycles in approval chains
- All contractors connected to projects

**Deliverable**: Week 12

---

## 🚀 Phase C: Intelligence & Scale (Weeks 21-32)

### 6. Analytics & ML

**Features**:
- Anomaly detection (overtime spikes, weekend patterns)
- Approval SLA predictor (who will block, how long)
- Budget overrun forecast (EAC/ETC)

**Success Metrics**:
- Precision > 80%
- False positive rate < 10%

**Deliverable**: Week 28

---

### 10. Mobile & Offline

**Features**:
- Offline timesheet queue (sync when online)
- QR check-in/out (geo-fenced)
- Conflict resolution

**Deliverable**: Week 32

---

## 📅 Revised Timeline (32 Weeks Total)

| Phase | Weeks | Key Deliverables |
|-------|-------|------------------|
| **A** | 1-8 | Overlays, Simulator, UX Wizard, Rollback, Packaging |
| **B** | 9-20 | Financial Controls, Scale, Security, Integrations, Testing |
| **C** | 21-32 | Analytics/ML, Mobile, Advanced Features |

---

## 🎯 Success Metrics (End of Phase A)

| Metric | Target |
|--------|--------|
| Time to first project | < 5 min (from 30 min) |
| Overlay switch time | < 200ms |
| Simulator accuracy | 95% (matches actual routing) |
| Setup NPS | ≥ 8 |
| Incident rollback time | < 5 sec |
| Tier conversion rate | 30% Core → Pro |

---

## 🛠️ Implementation Priority (Next 2 Weeks)

### Week 1: Overlays
- [ ] Create OverlayController component
- [ ] Implement 5 overlay modes
- [ ] Add keyboard shortcuts (1-5)
- [ ] Performance test (< 200ms switch)
- [ ] WCAG contrast validation

### Week 2: Policy Simulator
- [ ] Build simulation engine
- [ ] Create SimulationStepCard component
- [ ] Add diff viewer
- [ ] Implement version history
- [ ] Test with complex policies

---

## 📚 Documentation Updates Needed

- [ ] `/docs/OVERLAY_MODES_GUIDE.md`
- [ ] `/docs/POLICY_SIMULATOR_GUIDE.md`
- [ ] `/docs/FINANCIAL_CONTROLS_SPEC.md`
- [ ] `/docs/SCALE_ARCHITECTURE.md`
- [ ] `/docs/INTEGRATION_API_REFERENCE.md`
- [ ] `/docs/COMMERCIAL_PACKAGING.md`

---

**Status**: Ready to Implement Phase A  
**Next Action**: Start with Overlay Modes (highest ROI, lowest complexity)
