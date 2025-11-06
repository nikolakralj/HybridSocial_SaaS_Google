# 🚀 Phase 5: Integration & Real Data - Sprint Guide

**Duration:** 2 Weeks (10 Days)  
**Goal:** End-to-end approval execution with policy versioning and real data integration  
**Status:** 🟢 ACTIVE

---

## 📋 Sprint Overview

### **What We're Building:**
Connect the WorkGraph Visual Builder to the actual approval system so compiled policies execute on real timesheet submissions with full versioning, audit trails, and notifications.

### **Why This Matters:**
- Makes visual builder **functional** (not just simulation)
- Enables **policy versioning** (critical for production)
- Implements **approval engine** (routes timesheets through steps)
- Adds **audit trails** (who did what when)
- Real **notifications** (emails on state changes)

---

## 🎯 Exit Criteria (Must Complete All)

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

## 📅 Week 1: Foundation & Engine

### **Day 1-2: Policy Versioning + Storage** ⭐ START HERE

#### **Goal:**
Store compiled policies as immutable versions with proper pinning.

#### **Tasks:**
1. **Database Schema**
   - [ ] Create `approval_policies` table
   - [ ] Add `policy_version_id` to `timesheet_entries`
   - [ ] Create indexes for performance
   
2. **Types & Interfaces**
   - [ ] `ApprovalPolicy` type
   - [ ] `PolicyVersion` type
   - [ ] Versioning utilities
   
3. **API Layer**
   - [ ] Save policy endpoint
   - [ ] Load policy endpoint
   - [ ] List versions endpoint
   - [ ] Pin/unpin version
   
4. **UI Components**
   - [ ] Policy version badge ("Pinned to v3")
   - [ ] Version history drawer
   - [ ] One-click rebind wizard
   - [ ] Version comparison view

#### **Files to Create:**
```
/types/policy-versions.ts
/utils/api/policy-versions.ts
/components/workgraph/PolicyVersionBadge.tsx
/components/workgraph/VersionHistoryDrawer.tsx
/components/workgraph/RebindWizard.tsx
/supabase/migrations/003_approval_policies.sql
```

#### **Test:**
- [ ] Save policy → generates v1
- [ ] Save again → generates v2
- [ ] Switch active version → in-flight items stay on old
- [ ] UI shows "Pinned to vN" badge

---

### **Day 3-4: Approval Engine Core**

#### **Goal:**
Parse compiled JSON and route timesheets to correct approvers.

#### **Tasks:**
1. **Engine Core**
   - [ ] Parse compiled policy JSON
   - [ ] Execute sequential steps
   - [ ] Route to correct approver per step
   - [ ] Handle manual vs auto-approve
   
2. **State Machine**
   - [ ] Timesheet states: Draft → Submitted → InReview → Approved → Rejected
   - [ ] Step transitions
   - [ ] Validation rules
   
3. **Database**
   - [ ] `approval_steps` table
   - [ ] `approval_actions` table
   - [ ] Link to policy version
   
4. **API Endpoints**
   - [ ] Submit timesheet → trigger engine
   - [ ] Approve/reject action
   - [ ] Get current approver(s)

#### **Files to Create:**
```
/utils/approval-engine/engine.ts
/utils/approval-engine/state-machine.ts
/utils/approval-engine/route-resolver.ts
/utils/api/approval-actions.ts
/supabase/migrations/004_approval_steps.sql
```

#### **Test:**
- [ ] Submit timesheet → routes to Step 1 approver
- [ ] Step 1 approve → routes to Step 2
- [ ] Final approve → status = Approved
- [ ] Reject at any step → status = Rejected

---

### **Day 5: Outbox Pattern**

#### **Goal:**
Ensure exactly-once delivery for side effects (emails, webhooks).

#### **Tasks:**
1. **Outbox Table**
   - [ ] Create `event_outbox` table
   - [ ] Event types: Submitted, Approved, Rejected, etc.
   - [ ] Deduplication keys
   
2. **Event Emitters**
   - [ ] Emit on approval transitions
   - [ ] Store in outbox transactionally
   - [ ] Mark as processed
   
3. **Event Handlers**
   - [ ] Idempotent handlers
   - [ ] Retry logic
   - [ ] Email webhook stub (console.log for now)
   
4. **Processor**
   - [ ] Poll outbox for unprocessed events
   - [ ] Execute handlers
   - [ ] Update processed status

#### **Files to Create:**
```
/utils/events/outbox.ts
/utils/events/handlers.ts
/utils/events/processor.ts
/supabase/migrations/005_event_outbox.sql
```

#### **Test:**
- [ ] Approve timesheet → event in outbox
- [ ] Retry event → exactly-once effect
- [ ] Failed handler → event stays unprocessed
- [ ] Console shows event logs

---

## 📅 Week 2: Integration & Workbench

### **Day 6-7: Real Data Path**

#### **Goal:**
Wire UnifiedTimesheetView to engine with full audit.

#### **Tasks:**
1. **Submit Integration**
   - [ ] Wire submit button to engine
   - [ ] Create timesheet entry → execute policy
   - [ ] Store approval_step_id
   
2. **Policy Execution**
   - [ ] Load active policy version
   - [ ] Execute compiled JSON
   - [ ] Route to approvers
   
3. **Audit Trail**
   - [ ] `audit_log` table
   - [ ] Log all actions with context
   - [ ] Who, what, when, why
   
4. **Version Switching**
   - [ ] "Publish vN+1" button
   - [ ] In-flight stays on vN
   - [ ] New items use vN+1
   - [ ] Rollback capability

#### **Files to Update:**
```
/components/timesheets/UnifiedTimesheetView.tsx
/utils/api/timesheets.ts
/utils/approval-engine/executor.ts
/supabase/migrations/006_audit_log.sql
```

#### **Test:**
- [ ] Submit real timesheet → full approval flow
- [ ] Policy vN → vN+1 switch works correctly
- [ ] Audit log shows complete trail
- [ ] Rollback restores previous version

---

### **Day 8: Notifications**

#### **Goal:**
Send emails on approval state transitions.

#### **Tasks:**
1. **Email Templates**
   - [ ] Submitted notification (to approver)
   - [ ] Approved notification (to submitter)
   - [ ] Rejected notification (to submitter)
   - [ ] Escalation notification
   
2. **Email Service**
   - [ ] Template renderer
   - [ ] Send via outbox handler
   - [ ] Include action links
   - [ ] Rate masking in emails
   
3. **Notification Preferences**
   - [ ] User notification settings
   - [ ] Email vs in-app
   - [ ] Frequency (immediate, digest)

#### **Files to Create:**
```
/utils/notifications/email-templates.ts
/utils/notifications/email-service.ts
/utils/notifications/preferences.ts
/components/settings/NotificationSettings.tsx
```

#### **Test:**
- [ ] Submit → approver receives email
- [ ] Approve → submitter receives email
- [ ] Reject → submitter receives email
- [ ] Emails contain correct (masked) data

---

### **Day 9: Approvals Workbench**

#### **Goal:**
Read-only approval queue with filters and bulk select.

#### **Tasks:**
1. **Workbench Component**
   - [ ] List of pending approvals
   - [ ] Filter by party/project/step
   - [ ] Sort by urgency/date/amount
   - [ ] Bulk select (checkboxes)
   
2. **Performance**
   - [ ] Pagination
   - [ ] Virtual scrolling for 5k+ items
   - [ ] Indexes on filter columns
   - [ ] p95 < 200ms fetch time
   
3. **UI/UX**
   - [ ] Urgency indicators
   - [ ] Time remaining (SLA)
   - [ ] Preview without opening
   - [ ] Keyboard navigation prep

#### **Files to Create:**
```
/components/approvals/ApprovalsWorkbench.tsx
/components/approvals/ApprovalQueueTable.tsx
/components/approvals/FilterBar.tsx
/utils/api/approval-queue.ts
```

#### **Test:**
- [ ] Load 5k items in < 200ms
- [ ] Filters work instantly
- [ ] Sorting works correctly
- [ ] Bulk select UI functional

---

### **Day 10: Simulator Enhancements**

#### **Goal:**
Add presets and "View on graph" links.

#### **Tasks:**
1. **Scenario Presets**
   - [ ] Overtime scenario
   - [ ] Expired contract scenario
   - [ ] PO overspend scenario
   - [ ] Weekend/holiday scenario
   - [ ] Multi-currency scenario
   
2. **Graph Integration**
   - [ ] "View on graph" button in simulation results
   - [ ] Highlight executed path
   - [ ] Show which nodes participated
   
3. **Export Reports**
   - [ ] Simulation report JSON
   - [ ] Simulation report PDF
   - [ ] Include full trace

#### **Files to Update:**
```
/components/workgraph/PolicySimulator.tsx
/components/workgraph/SimulatorResults.tsx
/components/workgraph/SimulatorPresets.tsx
/utils/simulator/presets.ts
```

#### **Test:**
- [ ] Run all 5 presets → correct results
- [ ] "View on graph" highlights path
- [ ] Export PDF contains full trace
- [ ] Preset scenarios cover edge cases

---

## 🗄️ Database Schema Summary

### **New Tables:**

```sql
-- 003_approval_policies.sql
approval_policies (
  id, project_id, version, compiled_json, 
  is_active, created_by, created_at
)

-- 004_approval_steps.sql
approval_steps (
  id, timesheet_entry_id, policy_version_id,
  step_number, approver_id, status, 
  approved_at, rejected_at, notes
)

approval_actions (
  id, step_id, actor_id, action, 
  timestamp, reason, metadata
)

-- 005_event_outbox.sql
event_outbox (
  id, event_type, aggregate_id, 
  payload, dedupe_key, processed, 
  created_at, processed_at
)

-- 006_audit_log.sql
audit_log (
  id, entity_type, entity_id, 
  actor_id, action, before, after, 
  timestamp, context
)
```

### **Altered Tables:**
```sql
ALTER TABLE timesheet_entries 
ADD COLUMN policy_version_id UUID REFERENCES approval_policies(id);
```

---

## 📊 Performance Targets

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Approval queue fetch | p95 < 200ms | Chrome DevTools Network tab |
| Policy compile | p95 < 500ms | Console timing |
| Policy rollback | < 1s | Test version switch |
| Email delivery | p95 < 2 min | Outbox processing time |
| Audit query | p95 < 100ms | Database query analyzer |

---

## 🧪 Testing Strategy

### **Unit Tests:**
- [ ] Policy versioning logic
- [ ] Approval engine routing
- [ ] Outbox idempotency
- [ ] Rate masking in all paths

### **Integration Tests:**
- [ ] End-to-end approval flow
- [ ] Version switching
- [ ] Email delivery
- [ ] Audit trail completeness

### **Performance Tests:**
- [ ] 5k approval queue
- [ ] 1k version history
- [ ] Concurrent approvals
- [ ] Outbox backlog processing

### **Security Tests:**
- [ ] Rate masking via API
- [ ] Rate masking in emails
- [ ] Unauthorized access attempts
- [ ] Version tampering prevention

---

## 🚨 Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Policy compilation bugs | HIGH | Golden fixtures, extensive testing |
| Performance on 5k items | MEDIUM | Indexes, virtual scrolling, pagination |
| Email delivery failures | MEDIUM | Outbox pattern, retry logic |
| Version migration issues | HIGH | Rollback capability, thorough testing |
| Rate leakage via API | CRITICAL | Server-side masking, API tests |

---

## 🎯 Daily Standup Template

**What I completed yesterday:**
- Task 1
- Task 2

**What I'm working on today:**
- Task 3
- Task 4

**Blockers:**
- None / Blocker description

**On track for exit criteria?**
- Yes / No (reason)

---

## 📚 Key References

### **Existing Code:**
- Visual Builder: `/components/workgraph/WorkGraphBuilder.tsx`
- Policy Simulator: `/components/workgraph/PolicySimulator.tsx`
- Approval V2: `/components/timesheets/approval-v2/`
- Unified Timesheet: `/components/timesheets/UnifiedTimesheetView.tsx`

### **Documentation:**
- Multi-Party Architecture: `/docs/architecture/MULTI_PARTY_ARCHITECTURE.md`
- Rate Visibility: `/docs/CONTRACT_SCOPED_RATE_VISIBILITY.md`
- Approval System: `/docs/COMPREHENSIVE_APPROVAL_SYSTEM.md`

### **Types:**
- Contracts: `/types/contracts.ts`
- Approvals: `/types/approvals.ts`
- WorkGraph: `/types/workgraph.ts`

---

## ✅ Week 1 Checklist

**Day 1-2: Policy Versioning**
- [ ] Database schema
- [ ] Types & interfaces
- [ ] API endpoints
- [ ] UI components
- [ ] Tests passing

**Day 3-4: Approval Engine**
- [ ] Engine core
- [ ] State machine
- [ ] Database tables
- [ ] API endpoints
- [ ] Tests passing

**Day 5: Outbox Pattern**
- [ ] Outbox table
- [ ] Event emitters
- [ ] Event handlers
- [ ] Processor
- [ ] Tests passing

---

## ✅ Week 2 Checklist

**Day 6-7: Real Data Path**
- [ ] Submit integration
- [ ] Policy execution
- [ ] Audit trail
- [ ] Version switching
- [ ] Tests passing

**Day 8: Notifications**
- [ ] Email templates
- [ ] Email service
- [ ] Notification preferences
- [ ] Tests passing

**Day 9: Approvals Workbench**
- [ ] Workbench component
- [ ] Performance optimization
- [ ] UI/UX polish
- [ ] Tests passing

**Day 10: Simulator Enhancements**
- [ ] Scenario presets
- [ ] Graph integration
- [ ] Export reports
- [ ] Tests passing

---

## 🎉 Sprint Completion

**When all exit criteria are met:**
1. Tag release as `v1.0-phase5-complete`
2. Update Master Roadmap
3. Document lessons learned
4. Demo to stakeholders
5. Plan Phase 6 kickoff

---

**Created:** 2025-10-31  
**Status:** 🟢 ACTIVE - Day 1-2 Starting Now  
**Owner:** Dev Team  
**Next Review:** End of Week 1
