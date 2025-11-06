# 🎯 Master Roadmap Updated - 2025-10-31

**Major Update:** Added enterprise-grade requirements for Phases 5-13

---

## 📋 What Changed

The Master Roadmap has been significantly expanded with detailed, production-ready requirements based on your comprehensive specifications.

---

## 🚀 New & Enhanced Phases

### **Phase 5: Integration & Real Data (2 Week Sprint)** ⭐ DETAILED
**Was:** Basic integration tasks  
**Now:** Complete 2-week sprint plan with daily breakdown

**New Details:**
- **Week 1:** Policy versioning, approval engine, outbox pattern
- **Week 2:** Real data integration, notifications, workbench
- **Exit Criteria:** 11 specific checkpoints
- **Risk Mitigation:** 5 key risks with mitigations

**Sprint Structure:**
```
Day 1-2: Policy versioning + storage
Day 3-4: Approval engine core
Day 5:   Outbox pattern
Day 6-7: Real data path
Day 8:   Notifications
Day 9:   Approvals workbench
Day 10:  Simulator enhancements
```

---

### **Phase 6: Commercial Controls & Advanced Features** ⭐ EXPANDED
**Was:** Basic policy features  
**Now:** Enterprise commercial controls + advanced features

**New Features:**
1. **Framework Contracts (MSAs) & Child SOWs**
   - Node type: FrameworkContract
   - Inheritance + expiry alerts
   - Escalation formula support (+3%/yr)

2. **Budgets & POs with 3-way match**
   - PO lines ↔ SOW ↔ Invoice
   - Overspend blocks with override + audit
   - Draw-down dashboard

3. **Markups with secrecy**
   - Agency-level markup definition
   - Client sees aggregate, not contractor rates
   - API/export guarantees

4. **Multi-currency & FX lock**
   - Lock FX rate at invoice time
   - Revaluation on payment
   - Basic tax handling

5. **Validator Agent (AI, opt-in)**
   - Detects expired MSAs, overtime, PO limits
   - Human-in-loop proposals

**DoD Added:**
- Cannot invoice when PO consumed (unless override)
- No contractor rates in client exports
- FX rotation without downtime

---

### **Phase 7: Visual Builder UX & Quality** ⭐ EXPANDED
**Was:** Basic UX improvements  
**Now:** Production-quality builder with enterprise features

**New Features:**
1. **Overlay Modes**
   - Approvals (step numbers)
   - Money Flow (BillsTo/PO/Invoice)
   - People (utilization)
   - Access (who sees what)
   - "View path on graph" links

2. **Explainability ("Why?")**
   - Every decision shows conditions
   - Trace back to rules
   - Amount thresholds, validity checks

3. **Templates & Guided Setup**
   - One-click: "Staff-Aug 4-Party", "Freelancer Direct"
   - Wizard attaches company profiles
   - Prewires default roles

4. **Quality at Graph Scale**
   - Policy fuzzer (random graphs)
   - Assert invariants
   - Golden snapshot tests
   - Scenario library (overtime, expired, PO overspend)

**DoD Added:**
- Templates create valid, executable policies
- Fuzzer finds no violations in 1000 graphs
- p95 compile < 500ms

---

### **Phase 8: Security, Governance & Backend** ⭐ COMPLETELY NEW
**Was:** Basic backend integration  
**Now:** Enterprise-grade security and compliance

**New Hard Requirements:**

1. **Policy Versioning + Pinning**
   - Immutable versions
   - In-flight stays on vN, new uses vN+1
   - Rollback < 1s
   - Audit trail

2. **Field-level encryption**
   - Envelope encryption with KMS
   - Quarterly key rotation
   - Zero downtime rotation

3. **Access reviews & attestations**
   - Quarterly reports per project
   - SOC 2 compliance
   - CSV/PDF export with signature

4. **Data residency & DLP**
   - Region pin (US/EU/UK)
   - DLP scan on uploads
   - Auto-redact PII patterns
   - Cross-region export blocking

5. **Workflow Outbox + Idempotency**
   - Exactly-once side-effects
   - Email/webhook retry safety

6. **SLA & Escalation**
   - Per-step SLA timers
   - Auto-escalate to delegate
   - Holiday calendars
   - p95 notification < 2 min

7. **Observability & SLOs**
   - Traces for submit→approval
   - Automation rate dashboards
   - SLOs: p95 page load < 200ms

**Data Model Enhancements:**
- Closure Table for ancestry queries
- Materialized paths
- Precomputed visibility joins
- Optional subledger

---

### **Phase 9: AI Agents (Opt-in, Safe)** ⭐ NEW
**Completely new phase for intelligent automation**

**Features:**
1. **Validator Agent**
   - Observes events
   - Proposes blocks/warnings
   - Human-in-loop required

2. **Summarizer Agent**
   - Drafts summaries
   - Auto-generates rationales
   - Rate masking preserved

3. **Auto-approve Under Thresholds**
   - Policy-driven caps
   - Requires initial confirmation
   - Full audit trail

**Safety Guarantees:**
- Opt-in per project
- All decisions logged
- Rate masking preserved
- SOC 2 compliant

---

### **Phase 10: Admin & UX Excellence** ⭐ NEW
**Power user experience**

**Features:**
1. **Approvals Workbench**
   - Bulk approve/delegate/resolve
   - Keyboard shortcuts (j/k, x, a)
   - Aging approvals view

2. **"Preview as..." Everywhere**
   - Test visibility as any party
   - Works across all views
   - Admin test mode

3. **Offline & Mobile Capture**
   - Local queue
   - Conflict resolution
   - PWA for field work

---

### **Phase 11: Platform & Integrations** ⭐ NEW
**API-first platform**

**Features:**
1. **Event Webhooks + AsyncAPI**
   - Submitted/Approved/Rejected/Posted/Paid
   - Signed deliveries with replay
   - Published AsyncAPI spec

2. **API Surface**
   - REST/GraphQL with viewer arg
   - Server-side masking
   - TypeScript SDK first

3. **Accounting/HRIS Connectors**
   - QuickBooks, Xero, NetSuite
   - BambooHR, HiBob
   - GL account mapping
   - Auto-post invoices

---

### **Phase 12: Packaging & Pricing** ⭐ NEW
**Go-to-market strategy**

**Tiers:**
- **Core** (Free): Builder + basic approvals, 10 users
- **Pro** ($49/user/mo): Budgets/PO/Invoices, multi-currency, 100 users
- **Enterprise** (Custom): Governance, SSO, webhooks, unlimited

**Feature Flags:**
- Back SKUs
- 30-day Pro trial
- Graceful degradation

---

### **Phase 13: Social Features** (renamed from Phase 9)
LinkedIn-style network (future)

---

## 📊 Updated Feature Matrix

**New columns:** Phase, Priority  
**New rows:** 22 planned features tracked

**Status Legend:**
- ✅ Complete (8 features)
- ⏳ Next (4 features, Phase 5)
- 📋 Planned (10 features, Phases 6-13)

---

## 🎯 New Success Metrics & SLOs

### **Performance SLOs:**
- p95 approval page load < 200ms
- p95 policy compile < 500ms
- p95 queue fetch < 200ms on 5k items
- Policy rollback < 1s

### **Reliability SLOs:**
- 99.9% uptime
- Exactly-once event delivery
- Zero data-leak defects

### **Security SLOs:**
- 100% rate masking across all paths
- Field-level encryption
- Quarterly key rotation

### **Compliance SLOs:**
- SOC 2 ready audit trails
- Data residency enforcement
- Access attestation reports

### **Business Metrics:**
- Time to first approval < 5 min
- Approval automation > 60%
- User NPS > 50
- Contract to production < 2 weeks

---

## 📅 Detailed Phase 5 Sprint Plan

**New section added:** Day-by-day breakdown

### **Week 1:**
- Day 1-2: Policy versioning + storage
- Day 3-4: Approval engine core  
- Day 5: Outbox pattern

### **Week 2:**
- Day 6-7: Real data path
- Day 8: Notifications
- Day 9: Approvals workbench
- Day 10: Simulator enhancements

### **Exit Criteria:**
11 specific checkpoints including:
- End-to-end approval through 3-party chain
- Version switching (vN → vN+1)
- Rate masking via API
- Performance benchmarks
- Zero validation errors

### **Risks & Mitigation:**
5 key risks with specific mitigations

---

## 🎨 What Makes This Roadmap Special

### **1. Production-Ready Detail**
Not just "add feature X" but:
- Specific DoD (Definition of Done)
- Performance targets (p95 < 200ms)
- Security requirements (encryption, residency)
- Compliance needs (SOC 2, attestations)

### **2. Real-World Commercial Focus**
- MSAs with SOWs (actual contract structures)
- 3-way match (standard accounting practice)
- Markup secrecy (actual business need)
- Multi-currency (global operations)

### **3. Enterprise Security First**
- Policy versioning (critical for production)
- Field-level encryption (compliance requirement)
- Data residency (GDPR, etc.)
- Access attestations (SOC 2)

### **4. Intelligent Automation (Safe)**
- AI agents with human oversight
- Opt-in per project
- Full audit trails
- Rate masking preserved

### **5. Complete Platform Vision**
- API-first design
- Webhook events
- Accounting connectors
- Clear pricing tiers

---

## 📚 Documentation Structure

```
/docs/roadmap/
├── MASTER_ROADMAP.md          ← Complete roadmap (updated)
└── ROADMAP_UPDATE_2025_10_31.md ← This file

Sections in Master Roadmap:
1. Project Overview
2. Completed Phases (1-4)
3. Current Status
4. Next Phases (5-13) ← EXPANDED
5. Feature Completion Matrix ← UPDATED
6. Success Metrics & SLOs ← NEW
7. Key Documentation
8. Quick Navigation
9. Detailed Phase 5 Sprint Plan ← NEW
10. Immediate Next Steps ← UPDATED
```

---

## 🎯 Key Differences from Before

| Aspect | Before | After |
|--------|--------|-------|
| **Phases** | 9 phases | 13 phases |
| **Detail Level** | High-level tasks | Day-by-day sprint plans |
| **Requirements** | Basic features | Enterprise-grade with DoD |
| **Security** | Mentioned | Complete security/governance phase |
| **Commercial** | Basic budgets | MSAs, POs, 3-way match, FX |
| **AI** | Not mentioned | Complete opt-in AI agent phase |
| **Integrations** | Not detailed | Full webhook + connector plans |
| **Metrics** | Basic | SLOs with specific numbers |
| **Pricing** | Not mentioned | Complete tier structure |

---

## 🚀 Immediate Impact

### **For Development:**
- Clear 2-week sprint plan for Phase 5
- Day-by-day tasks with exit criteria
- Risk mitigation strategies

### **For Planning:**
- 13 phases with priorities
- Resource allocation guidance
- Timeline estimates

### **For Business:**
- Clear pricing tiers
- Enterprise feature list
- SOC 2 compliance roadmap

### **For Security:**
- Complete governance plan
- Encryption requirements
- Data residency strategy

---

## 💡 What to Do Next

### **Option 1: Start Phase 5 Sprint**
- Review detailed sprint plan
- Set up project board
- Begin Day 1-2 tasks (policy versioning)

### **Option 2: Review & Adjust**
- Discuss priorities
- Adjust timelines
- Add/remove features

### **Option 3: Create Guides**
- Build `/docs/guides/PHASE_5_SPRINT_GUIDE.md`
- Create implementation templates
- Write API specifications

---

## 📊 By The Numbers

**Roadmap Stats:**
- **13 phases** (was 9)
- **22 tracked features** in matrix
- **11 exit criteria** for Phase 5
- **5 risk mitigations** planned
- **4 SLO categories** defined
- **3 pricing tiers** detailed
- **2 week sprint** fully planned

**Documentation Growth:**
- Master Roadmap: ~800 lines (was ~200)
- New sections: 5
- Updated sections: 7
- New DoD statements: 12+
- New SLOs: 15+

---

## ✅ Summary

**What Changed:**
✅ Phase 5: Detailed 2-week sprint plan  
✅ Phase 6: Enterprise commercial controls  
✅ Phase 7: Quality & explainability  
✅ Phase 8: Security & governance (completely new)  
✅ Phase 9: AI agents (new phase)  
✅ Phase 10: Admin UX (new phase)  
✅ Phase 11: Platform & integrations (new phase)  
✅ Phase 12: Packaging & pricing (new phase)  
✅ Success metrics: SLOs with numbers  
✅ Feature matrix: Updated with all features  

**Result:**
A production-ready, enterprise-grade roadmap that takes WorkGraph from MVP to market leader.

---

**Created:** 2025-10-31  
**Status:** ✅ Roadmap updated  
**Next:** Review and begin Phase 5 sprint  
**Location:** `/docs/roadmap/MASTER_ROADMAP.md`
