# WorkGraph Documentation

**Last Updated:** January 2025

---

## Quick Navigation

### 📚 **Core Documentation (Start Here)**

1. **[CURRENT_ARCHITECTURE.md](./CURRENT_ARCHITECTURE.md)** ⭐
   - Complete system overview
   - Approval-v2 architecture
   - Type system guide
   - Database schema (future)
   - Migration roadmap

2. **[APPROVAL_WORKFLOW.md](./APPROVAL_WORKFLOW.md)** ⭐
   - Step-by-step approval workflow
   - Side-by-side PDF verification
   - Business rules & permissions
   - Troubleshooting guide

3. **[TIMESHEET_ENTRY.md](./TIMESHEET_ENTRY.md)** ⭐ (To be created)
   - Calendar view usage
   - Multi-person drag-and-drop
   - Daily entry forms
   - Copy/paste workflows

---

## 📂 **Historical Documentation**

The `/docs/` folder contains **100+ historical documentation files** tracking the evolution of WorkGraph from initial concepts to the current production-ready system.

### **Why Keep Historical Docs?**
- **Architectural Decisions:** Understand why certain approaches were chosen
- **Migration Path:** See how components evolved over time
- **Learning Resource:** Study implementation patterns and problem-solving

### **Recommended Reading Order (Historical Context)**

If you want to understand the evolution of the timesheet system:

1. `MULTI_PARTY_APPROVAL_ARCHITECTURE.md` - Initial concept
2. `APPROVALS_V2_DEMO_GUIDE.md` - Prototype walkthrough
3. `CHECKBOX_SELECTION_WORKFLOW_COMPLETE.md` - Selection system redesign
4. `MONTHLY_APPROVAL_VIEW_COMPLETE.md` - Monthly aggregation implementation
5. `CURRENT_ARCHITECTURE.md` - Final production-ready system ⭐

### **Archive Categories**

Historical docs are organized by topic:

#### **Approval System Evolution**
- `APPROVAL_SYSTEM_*.md` - Various approval system iterations
- `COMPREHENSIVE_APPROVAL_VIEW.md`
- `UNIFIED_APPROVAL_*.md`
- `BATCH_APPROVAL_*.md`

#### **Timesheet Entry System**
- `TIMESHEET_*.md` - Entry system iterations
- `DRAG_DROP_*.md` - Drag-and-drop implementation
- `ENHANCED_*.md` - UI enhancements
- `MULTI_PERSON_*.md` - Multi-person features

#### **UI/UX Design**
- `WARP_*.md` - Apple-inspired design system
- `DESIGN_*.md` - Design decisions
- `APPLE_STYLE_*.md` - Visual redesigns

#### **Phase Completions**
- `PHASE_*.md` - Sprint completion summaries
- `SPRINT_*.md` - Development sprints
- `IMPLEMENTATION_COMPLETE.md` - Various completion markers

---

## 🎯 **For New Developers**

### Getting Started (5 mins)
1. Read: `CURRENT_ARCHITECTURE.md` (Overview)
2. Explore: `/components/timesheets/approval-v2/` (Code)
3. Test: Run app → Project Timesheets → "Approvals v2 (Demo)" tab

### Deep Dive (30 mins)
1. Read: `APPROVAL_WORKFLOW.md` (User flows)
2. Read: `MULTI_PARTY_APPROVAL_ARCHITECTURE.md` (Design rationale)
3. Study: `demo-data-multi-party.ts` (Data structure)
4. Explore: `/types/timesheets.ts` (Type definitions)

### Implementation (Next Steps)
1. Read: `CURRENT_ARCHITECTURE.md` → "Next Steps (Option A)"
2. Set up: Supabase database tables
3. Create: API utilities in `/utils/api/timesheets.ts`
4. Replace: Demo data with real API calls

---

## 🔍 **Finding Specific Topics**

### Search Patterns

**To find docs about approval system:**
```bash
ls docs/*APPROVAL*.md
```

**To find docs about drag-and-drop:**
```bash
ls docs/*DRAG*.md
```

**To find phase completion summaries:**
```bash
ls docs/PHASE_*.md
```

### Common Searches

| Topic | Search |
|-------|--------|
| Approval system | `*APPROVAL*.md` |
| Timesheet entry | `TIMESHEET_*.md` |
| Drag-and-drop | `*DRAG*.md` |
| UI design | `*DESIGN*.md`, `WARP_*.md` |
| Implementation status | `*COMPLETE.md`, `PHASE_*.md` |
| User guides | `*GUIDE.md`, `HOW_TO_*.md` |
| Architecture decisions | `*ARCHITECTURE*.md` |

---

## 📝 **Documentation Guidelines**

### When to Create New Docs

**DO create docs for:**
- ✅ New system architectures (e.g., `APPROVAL_V3_ARCHITECTURE.md`)
- ✅ Major feature completions (e.g., `REAL_TIME_SYNC_COMPLETE.md`)
- ✅ Breaking changes (e.g., `MIGRATION_GUIDE_V2_TO_V3.md`)
- ✅ Complex workflows (e.g., `INVOICE_GENERATION_WORKFLOW.md`)

**DON'T create docs for:**
- ❌ Minor bug fixes (use git commit messages)
- ❌ Small UI tweaks (use git commit messages)
- ❌ Temporary debugging notes (use code comments)

### Documentation Standards

**File Naming:**
```
TOPIC_DESCRIPTION_STATUS.md

Examples:
✓ APPROVAL_SYSTEM_V2_COMPLETE.md
✓ DRAG_DROP_IMPLEMENTATION.md
✓ MIGRATION_GUIDE_2025.md
✗ notes.md (too vague)
✗ temp_doc.md (temporary)
```

**Document Structure:**
```markdown
# Title

**Status:** [Draft|In Progress|Complete]
**Last Updated:** [Date]

## Overview
Brief summary (2-3 sentences)

## Problem Statement
What problem does this solve?

## Solution
How does it work?

## Implementation
Code locations, key files

## Usage
How to use the feature

## Next Steps
Future improvements
```

---

## 🗂️ **Archive Management**

### When to Archive

Move docs to `/docs/archive/` when:
- They describe deprecated systems
- They've been superseded by newer docs
- They're purely historical (no actionable info)

### Suggested Archive Structure
```
docs/
├── README.md (this file)
├── CURRENT_ARCHITECTURE.md ⭐
├── APPROVAL_WORKFLOW.md ⭐
├── TIMESHEET_ENTRY.md ⭐
└── archive/
    ├── 2024/
    │   ├── approval-system/
    │   ├── timesheet-entry/
    │   └── ui-design/
    └── 2025/
        └── (ongoing)
```

---

## 📞 **Support**

### Questions About Docs?
- Check: `CURRENT_ARCHITECTURE.md` first
- Search: Historical docs for context
- Ask: Development team if still unclear

### Found an Error?
- Update: The relevant doc
- Commit: With clear message (e.g., "docs: fix approval workflow diagram")

### Want to Contribute?
- Follow: Documentation Standards above
- Review: Existing docs for style consistency
- Update: This README if adding new categories

---

## 📊 **Documentation Health**

**Current Status:**
- ✅ Core architecture documented (`CURRENT_ARCHITECTURE.md`)
- ✅ Approval workflow documented (`APPROVAL_WORKFLOW.md`)
- ⚠️ Timesheet entry guide needed (`TIMESHEET_ENTRY.md`)
- ⚠️ 100+ historical docs need archiving (low priority)

**Recommended Actions:**
1. Create `TIMESHEET_ENTRY.md` guide
2. Organize historical docs into `/archive/` folders (optional)
3. Create `API_REFERENCE.md` when Supabase integration complete

---

**Last Updated:** January 2025  
**Maintainer:** WorkGraph Development Team
