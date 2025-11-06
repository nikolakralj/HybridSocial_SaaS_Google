# WorkGraph Master Roadmap
## Enterprise-Grade Work Management Platform

**Vision**: A visual, permission-aware platform for managing complex multi-party work relationships from contractor → company → agency → client, with full commercials, compliance, and governance.

---

## 🎯 Phase A — Foundation & Visual Builder (Months 1-3)

**Goal**: Establish the security backbone, visual configuration system, and core work objects with multi-level approvals.

### A1: Visual WorkGraph Builder (Sprint 1-3)

#### User Stories

**US-A1.1**: As a project admin, I can open a visual canvas and drag nodes from a palette to build my project structure.
- **Acceptance Criteria**:
  - ✅ Canvas is zoomable, pannable, with snap-to-grid
  - ✅ Mini-map shows overview of full graph
  - ✅ Palette shows: Party, Team, Person, Contract, SOW, Milestone, PO, Budget
  - ✅ Can drag nodes onto canvas
  - ✅ Can delete nodes with confirmation
  - ✅ Keyboard shortcuts: Delete, Ctrl+Z undo, Ctrl+C/V copy-paste

**US-A1.2**: As a project admin, I can connect nodes with typed edges to define relationships.
- **Acceptance Criteria**:
  - ✅ Can create edges: Approves, Owns, Funds, Assigns, WorksOn, BillsTo, Invoices, Subcontracts
  - ✅ Edge type selector appears when connecting nodes
  - ✅ Visual styling per edge type (color, dashes, arrows)
  - ✅ Can delete edges
  - ✅ Hover shows edge details

**US-A1.3**: As a project admin, I can click a node to edit its properties in a right panel.
- **Acceptance Criteria**:
  - ✅ Right panel shows when node selected
  - ✅ Can edit: name, type, role, rate (for contracts)
  - ✅ Can set permissions: canApprove, canViewRates, canEditTimesheets
  - ✅ Can configure rate visibility: "Hide from [Agency, Client]"
  - ✅ Changes save on blur or button click
  - ✅ Validation errors show inline

**US-A1.4**: As a project admin, I can validate my graph to catch configuration errors.
- **Acceptance Criteria**:
  - ✅ "Validate" button runs checks
  - ✅ Detects: cycles in approval edges, missing approver, disconnected nodes
  - ✅ Detects: orphan contractors (not connected to any project)
  - ✅ Detects: rate visibility conflicts
  - ✅ Errors highlight affected nodes in red
  - ✅ Warnings panel lists all issues with severity

**US-A1.5**: As a project admin, I can compile my graph to approval policies and visibility rules.
- **Acceptance Criteria**:
  - ✅ "Compile & Save" button generates JSON
  - ✅ Creates `approval_policy.json` with sequential/parallel steps
  - ✅ Creates `visibility_rules.json` with field-level masking
  - ✅ Persists to database with version number
  - ✅ Can view compiled JSON in a modal
  - ✅ Shows success message with summary

**US-A1.6**: As a project admin, I can preview how the project looks from different party perspectives.
- **Acceptance Criteria**:
  - ✅ "Preview as..." dropdown with all parties
  - ✅ Selecting a party grays out nodes they can't see
  - ✅ Shows masked fields with 🔒 icon
  - ✅ Approval chain highlights their step
  - ✅ Can toggle between parties without reloading

**Technical Tasks**:
- [ ] Install React Flow library (`reactflow@11.10.0`)
- [ ] Create `ProjectBuilderCanvas.tsx` component
- [ ] Create node types: `PartyNode`, `ContractNode`, `SOWNode`, `PONode`, `MilestoneNode`
- [ ] Create edge types with styling
- [ ] Implement property panel with form validation
- [ ] Build validation engine (cycle detection, connectivity checks)
- [ ] Build policy compiler (graph → JSON)
- [ ] Build preview mode (party-based filtering)
- [ ] Add templates: "Staff Aug (T&M)", "SOW Milestone", "Managed Service"

---

### A2: Security & Permission System (Sprint 2-3)

#### User Stories

**US-A2.1**: As a backend developer, I can ensure all database queries respect party boundaries.
- **Acceptance Criteria**:
  - ✅ Row-Level Security (RLS) policies on all tables
  - ✅ Every table has `tenant_id` (org) and `project_id`
  - ✅ RLS uses `current_user_parties()` function to filter rows
  - ✅ Cannot bypass RLS even with direct SQL
  - ✅ Performance: queries use indexes on (project_id, party_id)

**US-A2.2**: As a backend developer, I can mask sensitive fields based on visibility rules.
- **Acceptance Criteria**:
  - ✅ API middleware reads `visibility_rules` from project config
  - ✅ Before returning JSON, applies masking to prohibited fields
  - ✅ Masked fields return `null` or `"•••"` (never the real value)
  - ✅ Unit tests verify masking for each party type
  - ✅ Audit log records who requested what data

**US-A2.3**: As a user, I can see why I have access to certain data.
- **Acceptance Criteria**:
  - ✅ "Why can I see this?" button on sensitive fields
  - ✅ Shows matching permission rules in a tooltip
  - ✅ Shows my roles and party memberships
  - ✅ Shows inherited permissions from parent orgs

**US-A2.4**: As a security admin, I can audit who accessed what data.
- **Acceptance Criteria**:
  - ✅ `event_log` table records: user, action, resource, timestamp, IP
  - ✅ Immutable (append-only, no updates/deletes)
  - ✅ Can filter by user, resource type, date range
  - ✅ Can export audit log as CSV
  - ✅ Retention policy (7 years for SOC 2 compliance)

**Technical Tasks**:
- [ ] Create RLS policies in migration: `003_row_level_security.sql`
- [ ] Create `current_user_parties()` function
- [ ] Implement API middleware: `applyVisibilityRules(data, viewer, rules)`
- [ ] Create `event_log` table and logging middleware
- [ ] Add "Why can I see this?" explainability component
- [ ] Write RLS + masking integration tests
- [ ] Security audit: pen test RLS bypass attempts

---

### A3: Work Objects & Approvals (Sprint 3-5)

#### User Stories

**US-A3.1**: As a contractor, I can submit my timesheet and see it route through the approval chain.
- **Acceptance Criteria**:
  - ✅ Submit button creates `approval_request` records
  - ✅ Routes to first approver based on compiled policy
  - ✅ Status changes to "Pending Company Approval"
  - ✅ Email notification sent to first approver
  - ✅ Contractor sees "Submitted - awaiting approval" status

**US-A3.2**: As an approver, I can approve/reject timesheets in my queue.
- **Acceptance Criteria**:
  - ✅ "My Approvals" tab shows pending items
  - ✅ Can bulk-select and approve multiple timesheets
  - ✅ Can add rejection reason (required)
  - ✅ On approve: routes to next step OR marks complete
  - ✅ On reject: returns to contractor with reason
  - ✅ Records `approval_action` in audit log

**US-A3.3**: As an approver, I can delegate approvals when I'm out of office.
- **Acceptance Criteria**:
  - ✅ Settings page has "Delegate Approvals To" field
  - ✅ Can set date range for delegation
  - ✅ Delegate sees delegated items in separate section
  - ✅ Original approver still gets notifications
  - ✅ Audit log shows "Approved by [Delegate] on behalf of [Original]"

**US-A3.4**: As a contractor, I can submit expenses with receipts.
- **Acceptance Criteria**:
  - ✅ Can upload receipt image/PDF
  - ✅ Can categorize: Mileage, Per Diem, Hotel, Flight, Other
  - ✅ Can enter amount, date, notes
  - ✅ Routes through approval chain (can be different from timesheet chain)
  - ✅ Validates against policy rules (e.g., max $50/meal without receipt)

**US-A3.5**: As a project manager, I can configure auto-approval rules.
- **Acceptance Criteria**:
  - ✅ In project settings: "Auto-approve timesheets < X hours"
  - ✅ Auto-approved items skip approval queue
  - ✅ Still logged in audit trail
  - ✅ Can set per work type (timesheet vs. expense)
  - ✅ Can set per party (e.g., trusted contractors auto-approve)

**Technical Tasks**:
- [ ] Extend approval engine to execute compiled policies
- [ ] Add delegation table and logic
- [ ] Create expense CRUD + attachment storage (Supabase Storage)
- [ ] Implement policy rules engine (thresholds, auto-approve)
- [ ] Build escalation system (timeout → next approver)
- [ ] Add notification system (email + in-app)

---

### A4: Audit & Reporting (Sprint 5-6)

#### User Stories

**US-A4.1**: As a project manager, I can see a dashboard of approval SLAs.
- **Acceptance Criteria**:
  - ✅ Shows: Avg time to approve, % approved within 48hrs, aging queue
  - ✅ Can filter by party, person, date range
  - ✅ Visual: bar chart of approval times by party
  - ✅ Can export as PDF/CSV

**US-A4.2**: As a finance team member, I can see budget burn vs. allocation.
- **Acceptance Criteria**:
  - ✅ Shows: Allocated budget, Spent to date, Projected EAC
  - ✅ Visual: progress bar with red/yellow/green zones
  - ✅ Breakdown by phase/milestone
  - ✅ Alerts when 80% consumed

**US-A4.3**: As a contractor, I can see my utilization over time.
- **Acceptance Criteria**:
  - ✅ Shows: Hours logged per week, Target vs. Actual
  - ✅ Visual: line chart of weekly hours
  - ✅ Can compare across projects
  - ✅ Can export as CSV

**Technical Tasks**:
- [ ] Create analytics tables (pre-aggregated)
- [ ] Build report components using Recharts
- [ ] Add export to PDF/CSV functions
- [ ] Create scheduled jobs for daily rollups

---

## 🏗️ Phase B — Commercials & Compliance (Months 4-6)

### B1: Contracts, Rate Cards, SOWs (Sprint 7-9)

**US-B1.1**: As a project manager, I can create a contract with rate card.
**US-B1.2**: As a legal team member, I can upload SOW PDFs and collect e-signatures.
**US-B1.3**: As a contractor, I can see which contracts I'm working under.
**US-B1.4**: As a project manager, I can create a change order to modify rate/scope.
**US-B1.5**: As a compliance admin, I can see which contracts are expiring soon.

### B2: Budgets & POs (Sprint 9-11)

**US-B2.1**: As a finance team member, I can create a budget with phases/cost centers.
**US-B2.2**: As a project manager, I can create a PO linked to a budget.
**US-B2.3**: As a finance team member, I can track PO draw-down and alert at 80%.
**US-B2.4**: As an agency, I can see my budget allocation (but not Company→Client rates).

### B3: Invoicing & Payments (Sprint 11-13)

**US-B3.1**: As a contractor, I can generate a monthly invoice from approved timesheets.
**US-B3.2**: As a company, I can generate a client invoice with markup (rates hidden from client).
**US-B3.3**: As a finance team member, I can track AR status (Sent, Overdue, Paid).
**US-B3.4**: As a contractor, I can see payment status and expected payment date.
**US-B3.5**: As a system, I can handle multi-currency invoices with exchange rates.

### B4: Compliance & Onboarding (Sprint 13-15)

**US-B4.1**: As an HR admin, I can create an onboarding checklist for new contractors.
**US-B4.2**: As a contractor, I can upload W-9, I-9, certifications, background check.
**US-B4.3**: As an IT admin, I can provision SSO access and tool licenses.
**US-B4.4**: As a compliance admin, I can see expiring certifications and get alerts.
**US-B4.5**: As a security team, I can track device access and revoke on offboarding.

---

## 📦 Phase C — Delivery & Scale (Months 7-9)

### C1: Deliverables & Milestones (Sprint 16-18)

**US-C1.1**: As a project manager, I can define deliverables with acceptance criteria.
**US-C1.2**: As a contractor, I can mark deliverables as complete and upload artifacts.
**US-C1.3**: As a client, I can accept/reject deliverables.
**US-C1.4**: As a finance team, I can trigger milestone billing on acceptance (ASC 606 compliant).

### C2: Resource Planning (Sprint 18-20)

**US-C2.1**: As a resource manager, I can see team capacity across all projects.
**US-C2.2**: As a project manager, I can forecast resource needs by skill.
**US-C2.3**: As a contractor, I can set my availability and preferred projects.
**US-C2.4**: As a system, I can suggest assignments based on skills and availability.

### C3: Analytics & Forecasting (Sprint 20-22)

**US-C3.1**: As an executive, I can see portfolio health across all projects.
**US-C3.2**: As a finance team, I can see EAC/ETC forecasts with confidence intervals.
**US-C3.3**: As a project manager, I can see burn rate and runway.
**US-C3.4**: As a data analyst, I can export raw data to BI tools (PowerBI, Tableau).

### C4: Integrations (Sprint 22-24)

**US-C4.1**: As an IT admin, I can configure SSO via SAML/OIDC.
**US-C4.2**: As an IT admin, I can enable SCIM for auto-provisioning.
**US-C4.3**: As a finance team, I can sync invoices to QuickBooks/Xero/NetSuite.
**US-C4.4**: As a PM, I can receive Slack/Teams notifications for approvals.
**US-C4.5**: As a payroll admin, I can export timesheet data to payroll system.

---

## 🚀 Phase D — Enterprise Hardening (Months 10-12)

### D1: Performance & Scale (Sprint 25-27)

**Goal**: Support 20+ orgs, 1,000+ users, 10,000+ timesheets/month

**Technical Tasks**:
- [ ] Graph canvas virtualization (only render visible nodes)
- [ ] Node clustering (collapse 50 contractors → 1 group node)
- [ ] Server-side pagination on all lists
- [ ] Pre-computed closure tables for ancestry queries
- [ ] Cached visibility rules (invalidate on policy change)
- [ ] Background jobs for policy recompilation
- [ ] Database connection pooling (PgBouncer)
- [ ] Redis caching layer for hot data
- [ ] CDN for static assets (images, PDFs)
- [ ] Load testing: 1,000 concurrent users

### D2: Governance & Security (Sprint 27-29)

**Technical Tasks**:
- [ ] Data residency options (US, EU, UK)
- [ ] Retention policies (auto-delete after N years)
- [ ] DLP rules (detect SSN, credit cards in uploads)
- [ ] Incident response playbook
- [ ] SOC 2 Type II audit prep
- [ ] GDPR compliance: data export, right-to-delete
- [ ] Penetration testing by 3rd party
- [ ] Advanced audit: "who viewed this rate" queries

### D3: Advanced Workflows (Sprint 29-30)

**Technical Tasks**:
- [ ] Parallel approvals with voting (2 of 3 must approve)
- [ ] Conditional approvals (if amount > $X, add CFO step)
- [ ] Time-based escalations (auto-approve after 7 days)
- [ ] Workflow templates (import/export)
- [ ] Workflow versioning (rollback to previous version)

---

## 📊 Success Metrics (per Phase)

### Phase A Success Metrics
- ✅ 10 projects configured via Visual Builder
- ✅ 100 timesheets approved through multi-level chain
- ✅ Zero security bypasses in pen test
- ✅ 95% of approval SLAs met (<48hrs)
- ✅ Audit log captures 100% of actions

### Phase B Success Metrics
- ✅ 50 contracts with rate cards
- ✅ 20 SOWs with e-signatures
- ✅ 10 POs tracked with draw-down alerts
- ✅ 500 invoices generated (T&M + milestone)
- ✅ 100 contractors onboarded with compliance checks

### Phase C Success Metrics
- ✅ 30 deliverables with milestone billing
- ✅ 200 users across 10 organizations
- ✅ 5 SSO integrations (Google, Okta, Azure AD)
- ✅ 3 accounting integrations (QuickBooks, Xero)
- ✅ 90% resource utilization target hit

### Phase D Success Metrics
- ✅ 1,000 concurrent users, <2s page load
- ✅ SOC 2 Type II certified
- ✅ GDPR compliant with data export
- ✅ 99.9% uptime
- ✅ <10ms p95 API latency

---

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript
- React Flow (visual graph builder)
- TailwindCSS + Shadcn/ui
- Recharts (analytics)
- Motion/Framer Motion (animations)

### Backend
- Supabase (Postgres + Auth + Storage + Edge Functions)
- Hono (web framework for Edge Functions)
- Row-Level Security (Postgres RLS)
- Background jobs (pg_cron or Temporal)

### Security
- SAML/OIDC (SSO)
- SCIM (auto-provisioning)
- RBAC + ABAC
- Field-level encryption (for SSN, bank details)
- Audit logging (immutable)

### Integrations
- Slack/Teams (webhooks)
- QuickBooks/Xero/NetSuite (REST APIs)
- DocuSign/HelloSign (e-signature)
- Stripe/PayPal (payments)

### Infrastructure
- Vercel (frontend hosting)
- Supabase (managed Postgres)
- Cloudflare (CDN, DDoS protection)
- Sentry (error tracking)
- LogRocket (session replay)

---

## 📅 Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **A - Foundation** | Months 1-3 | Visual Builder, Security, Approvals, Audit |
| **B - Commercials** | Months 4-6 | Contracts, Budgets, Invoicing, Compliance |
| **C - Delivery** | Months 7-9 | Deliverables, Planning, Analytics, Integrations |
| **D - Enterprise** | Months 10-12 | Scale, Governance, Advanced Workflows |

**Total**: 12 months to full enterprise platform

---

## 🎯 Immediate Next Steps (Week 1)

1. **Set up Visual Builder foundation**
   - Install React Flow
   - Create canvas component
   - Create first 3 node types (Party, Contract, Person)

2. **Define data model**
   - Create comprehensive TypeScript types
   - Design database schema
   - Write migration for core tables

3. **Security foundation**
   - Write RLS policies
   - Implement visibility masking middleware
   - Create audit log table

4. **Demo milestone**: Build the 4-party chain (Contractor → Company → Agency → Client) in Visual Builder, compile to policy, and show timesheet routing through approval chain with rate masking for Agency.

---

## 📖 Reference Documents

- **Permission Matrix**: See attached image (E/V/A definitions)
- **Standards**: SOC 2, GDPR, WCAG 2.2, NIST ABAC, ASC 606/IFRS 15
- **Graph Example**: Mermaid diagram in original spec
- **Compiled Policy**: JSON examples in original spec

---

## 🤝 Stakeholder Sign-Off

| Stakeholder | Role | Sign-Off Date |
|-------------|------|---------------|
| Product Owner | Vision approval | __________ |
| Tech Lead | Architecture approval | __________ |
| Security Lead | Security model approval | __________ |
| Finance Lead | Commercials scope approval | __________ |

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: Ready for Implementation
