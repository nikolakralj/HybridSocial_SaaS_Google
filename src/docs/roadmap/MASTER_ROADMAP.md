# 🗺️ WorkGraph Master Roadmap

**Last Updated:** 2025-10-31

---

## 📊 Project Overview

WorkGraph is a hybrid SaaS + social work network for technical freelancers with:
- **Apple-inspired design**
- **Multi-tenant architecture** (Personal Profiles ↔ Worker Records)
- **Core work management** (timesheets, contracts, project docs)
- **Three contractor types** with role-based rate visibility
- **Multi-party approval architecture** (multiple companies/agencies/freelancers)

---

## ✅ Completed Phases

### **Phase 1: Unified Calendar Grid View** ✅
- Multi-person timesheet calendar
- Drag-and-drop time entry
- Weekly table → monthly drawer workflow
- Contract-based time entry
- Status indicators (approval states)

**Location:** `/components/timesheets/`  
**Docs:** `/docs/PHASE_1_COMPLETE_SUMMARY.md`

---

### **Phase 1A-1C: Drag-and-Drop Multi-Person Timesheet** ✅
- **1A:** Basic drag-drop between days
- **1B:** Multi-person support
- **1C:** Enhanced design system (Warp-inspired)

**Location:** `/components/timesheets/drag-drop/`  
**Docs:** `/docs/PHASE_1C_COMPLETE.md`, `/docs/DRAG_DROP_COMPLETE_SUMMARY.md`

---

### **Phase 2: 3-Layer Approval System** ✅
- Contract-based visual grouping
- Weekly granularity with monthly invoicing
- PDF invoice generation
- Batch approval workflows
- Multi-party approval chains

**Location:** `/components/timesheets/approval-v2/`  
**Docs:** `/docs/COMPREHENSIVE_APPROVAL_SYSTEM.md`, `/docs/UNIFIED_MONTHLY_APPROVAL_SYSTEM.md`

---

### **Phase 3: Multi-Party Project Architecture** ✅
- Real-world multi-company scenarios
- Multiple contracts per project
- Different rates per contract
- Hierarchical approval flows
- Contract-scoped rate visibility

**Location:** `/types/contracts.ts`, `/components/workgraph/`  
**Docs:** `/docs/MULTI_PARTY_APPROVAL_ARCHITECTURE.md`, `/docs/CONTRACT_SCOPED_RATE_VISIBILITY.md`

---

### **Phase 4: WorkGraph Visual Builder** ✅
- Node-based approval flow designer
- Party nodes, Contract nodes, Person nodes
- Edge configuration (approval routes)
- Policy compilation
- Policy simulation with rate visibility testing

**Location:** `/components/workgraph/`  
**Docs:** `/docs/WORKGRAPH_VISUAL_BUILDER_IMPLEMENTATION.md`, `/docs/POLICY_SIMULATOR_COMPLETE.md`

---

## 🎯 Current Status (2025-10-31)

### **✅ Just Completed (Today - 2 Hours):**
1. **M5.1 Minimal (80% Complete)** - Project creation system ready!
   - ✅ Database schema (`004_project_collaboration.sql`)
   - ✅ Permission system (`/utils/collaboration/permissions.ts`)
   - ✅ Projects API (`/utils/api/projects.ts`)
   - ✅ ProjectCreateWizard wired to database
   - ✅ ProjectsListView opens wizard

### **Previous Completions:**
1. **Phase 5 Day 1-2** - Policy Versioning + Storage ✅
2. **Documentation cleanup** - Reorganized 36+ files
3. **Roadmap expansion** - Enterprise requirements for Phases 5-13

**Status:** M5.1 Minimal foundation complete, ready for builder integration!  
**Next:** Tomorrow - Wire WorkGraph Builder + Publish button  
**Then:** M5.5 Network Graph (THE MOAT) 🎯

---

## 🚀 Next Phases

### **Phase 5: Project Builder - Collaborative Setup + Compliance** ⭐ REFOCUSED
**Goal:** Multi-party collaborative project setup with contracts, compliance, and gating

**Why this pivot:** Builder becomes immediately useful for real teams setting up real projects, with compliance built-in from day 1.

---

#### **M5.1: Project Creation & Collaborative Canvas** (Week 1)
**Goal:** Multiple stakeholders can co-create a project graph

**Tasks:**
- [ ] **Project Creation Wizard**
  - Name, region, currency, start/end dates
  - Default work week configuration
  - Add Parties from existing company profiles
  - Invite new parties by email
  
- [ ] **Real-time Collaboration**
  - Presence cursors (see who's editing)
  - Optimistic locking (prevent overwrites)
  - Activity feed (who changed what)
  
- [ ] **Roles & Permissions**
  - Owner, Editor, Contributor, Commenter, Viewer
  - Role-based UI gating (what each role can do)
  - Permission matrix enforcement
  
- [ ] **Comments & Mentions**
  - Pin comments to nodes/edges
  - @mention other collaborators
  - Resolve/unresolve threads
  
- [ ] **Publish Draft**
  - "Publish Draft" creates Policy v1
  - Read-only link for external stakeholders
  - Change tracking

**Exit Criteria:**
- ✅ Two orgs can co-edit one project graph
- ✅ Presence shows both users
- ✅ Comments work with @mentions
- ✅ Commenters can't change nodes/edges
- ✅ Publish creates Policy v1

---

#### **M5.2: Contracts & Privacy** (Week 2)
**Goal:** Add real contract nodes with field-level visibility

**Tasks:**
- [ ] **Contract Node Types**
  - FrameworkContract (MSA)
  - NDA
  - SOW/ProjectContract
  - RateCard
  
- [ ] **Contract Edges**
  - Between (Party↔Contract)
  - FrameworkOf (MSA↔SOW)
  - Attaches (SOW↔RateCard)
  
- [ ] **Field-level Visibility**
  - Rates hidden from non-signatories
  - Markup visibility rules
  - Document attachments
  
- [ ] **E-sign Placeholder**
  - Request signature workflow
  - Signature status tracking
  - Document version control

**Exit Criteria:**
- ✅ Create MSA between Agency↔Company, then SOW
- ✅ Policy compiles with FrameworkOf linkage
- ✅ Agency/Client don't see Contractor↔Company rates via API

---

#### **M5.3: Compliance Pack** (Week 3)
**Goal:** Document requirements with gating logic

**Tasks:**
- [ ] **Compliance Node Types**
  - ComplianceRequirement (template)
  - ComplianceItem (uploaded doc)
  
- [ ] **Requirement Categories**
  - Person: A1, right-to-work, visa, background check
  - Party: TPLI insurance, W-9/W-8BEN, GDPR DPA, SOC 2
  - Assignment: client induction, site access
  
- [ ] **Compliance Edges**
  - Requires (Party/Person→Requirement)
  - Satisfies (Item→Requirement)
  
- [ ] **Gating Rules**
  - Can't assign if A1 expired
  - Can't submit timesheet if missing docs
  - Can't invoice without vendor insurance
  
- [ ] **Status & Reminders**
  - Valid / Expiring / Missing / Rejected badges
  - T-30 and T-7 day expiry reminders
  - Verification workflow

**Exit Criteria:**
- ✅ If John's A1 expired, Simulator blocks submission with clear reason
- ✅ If Vendor's TPLI missing, invoice blocked
- ✅ "Request document" button assigns task

---

#### **M5.4: Simulator & Publish Flow** (Week 4)
**Goal:** Test with compliance, version, and share

**Tasks:**
- [ ] **Simulator with Compliance**
  - Compliance checks before Step 1
  - Show which requirements failed
  - Preview gating logic
  
- [ ] **Versioning** (reuse Day 1-2 work!)
  - "Publish v2" creates new version
  - In-flight items stay on v1
  - New items use v2
  
- [ ] **Share for Review**
  - Read-only link with commenter access
  - Client/Agency stakeholders can review
  - Approval sign-off tracking

**Exit Criteria:**
- ✅ Publish v2 keeps existing items on v1
- ✅ "Share for Review" link works
- ✅ Client can comment but not edit
- ✅ Simulator shows compliance blocks

---

**Priority:** CRITICAL  
**Timeline:** 4 weeks (4 milestones)  
**Benefit:** Collaborative project setup with built-in compliance

---

### **Phase 6: Commercial Controls & Advanced Features**
**Goal:** Enterprise-grade financial controls and policy features

#### **Commercial Controls:**
- [ ] **Framework Contracts (MSAs) & Child SOWs**
  - New node type: FrameworkContract
  - Link to SOW/Project contracts with inheritance
  - Expiry alerts and escalation formula support (e.g., +3%/yr)
  - Visibility: signatories only
- [ ] **Budgets & POs with 3-way match**
  - PO lines ↔ SOW ↔ Invoice with tolerances
  - Draw-down tracking and overspend blocks (with override + audit)
  - Cannot create invoice when PO consumed unless override logged
  - Dashboard shows remaining by PO line
- [ ] **Markups with secrecy**
  - Define markup at Agency level
  - Client sees aggregate total, not contractor rates
  - "No rates" guaranteed via API/exports, not just UI
- [ ] **Multi-currency & FX lock**
  - Lock FX rate at invoice time
  - Revaluation on payment
  - Basic tax handling

#### **Advanced Policy Features:**
- [ ] **Conditional approval rules**
  - If hours > X, require extra approval
  - If amount > budget threshold, escalate
  - Weekend/holiday/overtime detection
- [ ] **Budget tracking per contract**
  - Real-time burn rate
  - Forecast overruns
  - Auto-alerts at 80%/90%/100%
- [ ] **Custom approval criteria**
  - Business rule engine
  - Complex AND/OR conditions
  - Time-based rules (weekends, holidays)
- [ ] **Validator Agent (AI, opt-in)**
  - Observes Submitted events
  - Proposes blocks/warnings (expired MSA, overtime, PO near limit)
  - Human-in-loop via "Action Inbox"

#### **DoD (Definition of Done):**
- ✅ Cannot create invoice when PO consumed unless override logged
- ✅ Dashboard shows remaining by PO line
- ✅ Client sees aggregate only, no contractor rates in any export
- ✅ FX rotation without downtime
- ✅ Conditional rules execute correctly in simulation

**Priority:** HIGH  
**Benefit:** Handles complex real-world commercial scenarios

---

### **Phase 7: Visual Builder UX & Quality**
**Goal:** Make builder easier, more powerful, and production-quality

#### **Builder Improvements:**
- [ ] **Overlay Modes (operational)**
  - Approvals overlay (step numbers)
  - Money Flow overlay (BillsTo/PO/Invoice totals)
  - People overlay (utilization)
  - Access overlay (who sees what)
  - "View path on graph" links from Simulator steps
- [ ] **Explainability ("Why?")**
  - Every auto/manual decision shows conditions that fired
  - Amount thresholds, contract validity, budget remaining
  - Trace from decision back to rule
- [ ] **Templates & Guided Setup**
  - One-click: "Staff-Aug 4-Party", "Freelancer Direct", "MSA + Multiple SOWs"
  - Wizard that attaches existing company profiles
  - Prewires default roles/permissions
- [ ] **More node types**
  - BudgetNode, ConditionNode, EscalationNode
  - MSA/SOW relationship nodes
- [ ] **Better edge routing**
  - Auto-layout algorithms
  - Smart snapping and alignment
  - Validation rules (prevent cycles, ensure connectivity)

#### **Quality at Graph Scale:**
- [ ] **Policy Fuzzer & Golden Fixtures**
  - Generate random multi-party graphs
  - Assert invariants (e.g., Agency never sees Company↔Contractor rates)
  - Golden snapshot tests for compiled JSON
  - PRs show policy diffs
- [ ] **Scenario Library in Simulator**
  - Presets: overtime, contract expired, PO overspend, weekend/holiday, multi-currency
  - Export simulation reports (JSON/PDF) for UAT
  - Batch scenario testing
- [ ] **Performance testing**
  - 20+ orgs, 1k people graphs
  - Compile time < 500ms p95
  - Render performance for large graphs

#### **DoD:**
- ✅ One-click templates create valid, executable policies
- ✅ Fuzzer finds no invariant violations in 1000 random graphs
- ✅ Simulator presets cover all edge cases
- ✅ p95 compile time < 500ms on complex graphs

**Priority:** HIGH  
**Benefit:** Production-quality builder with enterprise confidence

---

### **Phase 8: Security, Governance & Backend**
**Goal:** Enterprise-grade security, compliance, and full production system

#### **Security & Governance (Hard Requirements):**
- [ ] **Policy Versioning + Pinning** ⭐ (moved from Phase 5)
  - Immutable policy versions
  - In-flight items stay on vN, new items use vN+1
  - UI: "Pinned to vN" badge on each open timesheet
  - One-click rebind wizard
  - **DoD:** Rollback in <1s; audit shows who changed what/when; 100% masked fields honored across versions
  
- [ ] **Field-level encryption (rates, bank data)**
  - Envelope encryption with KMS
  - Rotate keys quarterly
  - **DoD:** Rotation without downtime; access paths logged
  
- [ ] **Access reviews & attestations**
  - Quarterly "who can approve what" report per project
  - SOC 2 compliance ready
  - **DoD:** Export (CSV/PDF) signed by system, audit-logged
  
- [ ] **Data residency & DLP**
  - Region pin per project (US/EU/UK)
  - DLP scan on uploads (auto-redact PII patterns)
  - **DoD:** Residency enforced by policy; blocked cross-region exports tested

#### **Execution Engine & Reliability:**
- [ ] **Workflow Outbox + Idempotency** ⭐
  - All approval transitions emitted via outbox table
  - Handlers are idempotent with dedupe keys
  - **DoD:** Exactly-once effect for external side-effects (emails, webhooks) under retries
  
- [ ] **SLA & Escalation**
  - Per-step SLA timers
  - Auto-escalate to delegate
  - Holiday calendars per region
  - **DoD:** p95 notification latency < 2 min; missed SLA visible in "Aging Approvals"
  
- [ ] **Observability & SLOs**
  - Traces for submit→final approval
  - Dashboards for automation rate, SLA, error rate
  - **SLOs:** p95 approval page load < 200ms; p95 compile < 500ms; 0 data-leak defects

#### **Backend Integration:**
- [ ] Supabase integration for policy storage
- [ ] Real-time approval notifications (WebSockets)
- [ ] Approval history tracking (immutable log)
- [ ] Comprehensive audit logs
- [ ] Role-based access control (RBAC)
- [ ] **Data Model Enhancements:**
  - Closure Table / Materialized Path for fast ancestry queries (20+ orgs, 1k people)
  - Precompute visibility joins
  - Cache compiled policies by (projectId, version)
  - Optional commanded subledger for invoices/payments reconciliation

**Priority:** CRITICAL  
**Benefit:** Enterprise-ready with security, compliance, and reliability

---

### **Phase 9: AI Agents (Opt-in, Safe)**
**Goal:** Intelligent automation with human oversight

#### **AI Features:**
- [ ] **Validator Agent (Phase 6)**
  - Observes Submitted events
  - Proposes blocks/warnings (expired MSA, overtime, PO near limit)
  - Human-in-loop; proposals in "Action Inbox"
  - Never auto-blocks without confirmation
  
- [ ] **Summarizer Agent**
  - Drafts timesheet/expense summaries
  - Auto-generates approval rationales
  - Masked fields remain masked in AI output
  
- [ ] **Auto-approve Under Thresholds**
  - Policy flag (hours/amount caps)
  - Executed by agent, requires confirm initially
  - Can become fully autonomous under governance
  - Full audit trail of all auto-approvals

#### **Safety Guarantees:**
- ✅ Human-in-loop required for initial training
- ✅ All AI decisions logged and explainable
- ✅ Rate masking preserved in AI-generated content
- ✅ Opt-in per project, can be disabled
- ✅ SOC 2 compliant audit trail

**Priority:** MEDIUM (post Phase 8)  
**Benefit:** Reduces manual work while maintaining control

---

### **Phase 10: Admin & UX Excellence**
**Goal:** Best-in-class approver and admin experience

#### **Approvals Workbench:**
- [ ] One page to bulk approve, delegate, and resolve holds
- [ ] Filters by party/project/step
- [ ] Keyboard shortcuts (j/k navigation, x select, a approve)
- [ ] Batch actions with undo
- [ ] "Aging Approvals" view for SLA tracking

#### **"Preview as..." Everywhere:**
- [ ] Header toggle that applies to all views
- [ ] Builder, simulator, approvals, invoices
- [ ] Verify masking and visibility quickly
- [ ] Test mode for admins

#### **Offline & Mobile Capture:**
- [ ] Local queue for timesheets/expenses
- [ ] Conflict resolution on sync
- [ ] Field-friendly mobile capture
- [ ] Progressive Web App (PWA)

**Priority:** HIGH  
**Benefit:** Power users can work 10x faster

---

### **Phase 11: Platform & Integrations**
**Goal:** API-first platform with enterprise connectors

#### **Event Webhooks + AsyncAPI:**
- [ ] Events: Submitted/Approved/Rejected/Posted/Paid
- [ ] Signed deliveries with replay
- [ ] Publish AsyncAPI spec
- [ ] Webhook management UI
- [ ] Event filtering and routing

#### **API Surface:**
- [ ] REST/GraphQL with viewer argument
- [ ] Responses pre-masked server-side
- [ ] Rate limiting and quotas
- [ ] API key management
- [ ] SDKs: TypeScript first, Python second

#### **Accounting/HRIS Connectors (post-Phase 8):**
- [ ] **Accounting:** QuickBooks, Xero, NetSuite
  - Map GL accounts and cost centers
  - Auto-post approved invoices
  - Reconciliation dashboard
- [ ] **HRIS:** BambooHR, HiBob
  - Sync employee data
  - Time off integration
  - Org chart sync

**Priority:** HIGH (post Phase 8)  
**Benefit:** Seamless integration with existing systems

---

### **Phase 12: Packaging & Pricing**
**Goal:** Clear tiering and go-to-market strategy

#### **Tiers:**
- **Core** (Free/Starter)
  - Builder + Approvals
  - Basic policies
  - Up to 10 users
  
- **Pro** ($49/user/mo)
  - Budgets/PO/Invoices
  - Simulator Advanced
  - Multi-currency
  - Up to 100 users
  
- **Enterprise** (Custom)
  - Governance & Security
  - Data Residency
  - SSO/SCIM
  - Webhooks & API
  - Unlimited users
  - Dedicated support

#### **Feature Flags:**
- Feature flags back these SKUs
- Trial defaults to Pro for 30 days
- Graceful degradation on downgrade

**Priority:** MEDIUM (business strategy)  
**Benefit:** Clear value proposition and revenue model

---

### **Phase 13: Social Features**
**Goal:** LinkedIn-style network for freelancers

#### Tasks:
- [ ] Public profiles
- [ ] Work history visibility controls
- [ ] Endorsements/recommendations
- [ ] Job matching
- [ ] Network discovery

**Priority:** LOW (future)  
**Benefit:** Differentiates from competitors

---

## 📋 Feature Completion Matrix

| Feature | Status | Phase | Location | Priority |
|---------|--------|-------|----------|----------|
| **Calendar Grid View** | ✅ Complete | Phase 1 | `/components/timesheets/` | - |
| **Drag-Drop Entry** | ✅ Complete | Phase 1A-C | `/components/timesheets/drag-drop/` | - |
| **Multi-Person Timesheets** | ✅ Complete | Phase 1 | `/components/timesheets/` | - |
| **3-Layer Approvals** | ✅ Complete | Phase 2 | `/components/timesheets/approval-v2/` | - |
| **Multi-Party Architecture** | ✅ Complete | Phase 3 | `/types/`, `/components/workgraph/` | - |
| **Visual Builder** | ✅ Complete | Phase 4 | `/components/workgraph/` | - |
| **Policy Simulator** | ✅ Complete | Phase 4 | `/components/workgraph/PolicySimulator.tsx` | - |
| **Rate Visibility** | ✅ Complete | Phase 4 | `/components/workgraph/` | - |
| **Policy Versioning** | ⏳ Next | Phase 5 W1 | - | CRITICAL |
| **Approval Engine** | ⏳ Next | Phase 5 W1-2 | - | CRITICAL |
| **Real Data Integration** | ⏳ Next | Phase 5 W2 | - | CRITICAL |
| **Outbox Pattern** | 📋 Planned | Phase 5 W1 | - | CRITICAL |
| **SLA & Escalation** | 📋 Planned | Phase 5 W2 | - | HIGH |
| **Framework Contracts** | 📋 Planned | Phase 6 | - | HIGH |
| **Budgets & POs** | 📋 Planned | Phase 6 | - | HIGH |
| **Multi-Currency** | 📋 Planned | Phase 6 | - | HIGH |
| **Overlay Modes** | 📋 Planned | Phase 7 | - | HIGH |
| **Policy Fuzzer** | 📋 Planned | Phase 7 | - | MEDIUM |
| **Field Encryption** | 📋 Planned | Phase 8 | - | CRITICAL |
| **Data Residency** | 📋 Planned | Phase 8 | - | CRITICAL |
| **Event Webhooks** | 📋 Planned | Phase 11 | - | HIGH |
| **AI Agents** | 📋 Planned | Phase 9 | - | MEDIUM |

---

## 🎯 Success Metrics & SLOs

### **MVP Requirements (Completed ✅)**
- [x] Monthly PDF timesheet upload
- [x] Weekly granularity tracking
- [x] Multi-party approval flows
- [x] Contract-based rate privacy
- [x] Visual approval flow designer
- [x] Policy simulation/testing

### **Phase 5 Requirements (2 Week Sprint)**
- [ ] Policy versioning with immutable versions
- [ ] Execute compiled policies on real timesheets
- [ ] Outbox pattern for exactly-once events
- [ ] Approvals workbench (read-only)
- [ ] Email notifications on state transitions
- [ ] Full audit trail (who/what/when)

### **Production SLOs (Phase 8)**
- [ ] **Performance:**
  - p95 approval page load < 200ms
  - p95 policy compile < 500ms
  - p95 queue fetch < 200ms on 5k items
  - Policy rollback < 1s
  
- [ ] **Reliability:**
  - 99.9% uptime for approval engine
  - Exactly-once event delivery
  - Zero data-leak defects
  
- [ ] **Security:**
  - 100% rate masking across all API/export paths
  - Field-level encryption for sensitive data
  - Quarterly key rotation without downtime
  
- [ ] **Compliance:**
  - SOC 2 ready audit trails
  - Data residency enforcement
  - Access attestation reports

### **Business Metrics (Phase 12)**
- [ ] Time to first approval < 5 minutes
- [ ] Approval automation rate > 60%
- [ ] User NPS > 50
- [ ] Contract to production < 2 weeks

---

## 📚 Key Documentation

### **Getting Started:**
- `/docs/QUICK_START.md` - Project overview
- `/docs/guides/QUICK_START_GUIDE.md` - Setup and first steps

### **Architecture:**
- `/docs/architecture/SYSTEM_ARCHITECTURE.md` - Overall system design
- `/docs/architecture/MULTI_PARTY_ARCHITECTURE.md` - Multi-party approval system
- `/docs/architecture/CONTRACT_SCOPED_RATE_VISIBILITY.md` - Rate privacy system

### **Guides:**
- `/docs/guides/VISUAL_BUILDER_GUIDE.md` - How to use WorkGraph Builder
- `/docs/guides/APPROVAL_SYSTEM_GUIDE.md` - How approvals work
- `/docs/guides/TIMESHEET_GUIDE.md` - Timesheet entry and management

### **Progress:**
- `/docs/roadmap/MASTER_ROADMAP.md` - This file
- `/docs/changelog/RECENT_FIXES.md` - Latest bug fixes and updates

---

## 🔗 Quick Navigation

- **Current Work:** Phase 5 - Integration & Real Data
- **Latest Fixes:** `/docs/changelog/RECENT_FIXES.md`
- **Architecture Docs:** `/docs/architecture/`
- **How-To Guides:** `/docs/guides/`
- **Component READMEs:** Throughout `/components/`

---

## 🚀 Detailed Phase 5 Sprint Plan (2 Weeks)

### **Sprint Goal:**
End-to-end approval execution with policy versioning and real data integration.

---

### **Week 1: Foundation & Engine**

#### **Day 1-2: Policy Versioning + Storage**
- [ ] Create `approval_policies` table with version column
- [ ] Add `policy_version_id` to timesheet_entries
- [ ] Implement "Pinned to vN" badge UI
- [ ] Build one-click rebind wizard
- [ ] **Test:** Switch policy version, verify in-flight items stay on old version

#### **Day 3-4: Approval Engine Core**
- [ ] Parse compiled JSON into executable steps
- [ ] Route timesheet to correct approvers per step
- [ ] Store approval actions in `approval_history` table
- [ ] **Test:** Submit timesheet, verify it routes to Step 1 approver

#### **Day 5: Outbox Pattern**
- [ ] Create `event_outbox` table
- [ ] Emit approval transitions to outbox
- [ ] Implement idempotent handlers with dedupe keys
- [ ] Email webhook stub (console.log for now)
- [ ] **Test:** Retry event, verify exactly-once delivery

---

### **Week 2: Integration & Workbench**

#### **Day 6-7: Real Data Path**
- [ ] Wire UnifiedTimesheetView submit button to engine
- [ ] Create real timesheet entry → execute compiled policy
- [ ] Log all actions to audit table
- [ ] Policy version switching (vN+1)
- [ ] **Test:** Full flow from submit to final approval

#### **Day 8: Notifications**
- [ ] Email on Submitted/Approved/Rejected events
- [ ] Template system for emails
- [ ] Include approval action links
- [ ] **Test:** Receive email on each step transition

#### **Day 9: Approvals Workbench**
- [ ] Read-only list of pending approvals
- [ ] Filter by party/project/step
- [ ] Bulk select UI (checkboxes)
- [ ] Sort by urgency/date/amount
- [ ] **Test:** Filter 5k items in < 200ms

#### **Day 10: Simulator Enhancements**
- [ ] Presets: overtime, expired contract, PO overspend
- [ ] "View on graph" link from simulation steps
- [ ] Export simulation report (JSON/PDF)
- [ ] **Test:** Run all presets, verify correct behavior

---

### **Exit Criteria Checklist:**

- [ ] ✅ Submit timesheet → auto-routes through 3-party chain
- [ ] ✅ Each step executes compiled policy vN correctly
- [ ] ✅ Switching to vN+1 leaves in-flight on vN
- [ ] ✅ New timesheets use vN+1 automatically
- [ ] ✅ Rate masking works via API (not just UI)
- [ ] ✅ p95 approval queue fetch < 200ms on 5k items
- [ ] ✅ Zero validation errors in 10 demo flows
- [ ] ✅ Rollback policy version in < 1s
- [ ] ✅ Audit shows who changed what/when
- [ ] ✅ 100% masked fields honored across all versions
- [ ] ✅ Exactly-once email delivery under retries

---

### **Risks & Mitigation:**

| Risk | Mitigation |
|------|------------|
| Policy compilation bugs | Extensive testing with golden fixtures |
| Performance on 5k items | Add indexes, precompute visibility |
| Email delivery failures | Outbox pattern with retry logic |
| Version migration issues | Rollback capability, thorough testing |
| Rate leakage via API | Server-side masking, API integration tests |

---

## 💡 Immediate Next Steps

### **Today (2025-10-31):**
1. ✅ Review updated roadmap
2. ⏳ Create `/docs/guides/PHASE_5_SPRINT_GUIDE.md` with detailed tasks
3. ⏳ Set up project board (GitHub Issues or similar)
4. ⏳ Create data model for policy versioning

### **This Week:**
1. Implement policy versioning
2. Build approval engine core
3. Set up outbox pattern

### **Next Week:**
1. Real data integration
2. Notifications
3. Approvals workbench

---

**Status:** ✅ All MVP features complete  
**Focus:** Starting Phase 5 - 2 Week Sprint  
**Last Major Update:** 2025-10-31 (Roadmap updated with detailed requirements)  
**Next Milestone:** Phase 5 completion (2 weeks from start)
