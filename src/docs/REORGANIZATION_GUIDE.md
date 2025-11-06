# 📁 Documentation Reorganization Guide

**Date:** 2025-10-31  
**Purpose:** Consolidate 36+ root-level .md files into organized structure

---

## 🎯 New Structure

```
/docs/
├── roadmap/
│   └── MASTER_ROADMAP.md         ← All progress tracking
├── architecture/
│   ├── SYSTEM_ARCHITECTURE.md    ← Overall system design
│   ├── MULTI_PARTY_ARCHITECTURE.md
│   └── CONTRACT_SCOPED_RATE_VISIBILITY.md
├── changelog/
│   ├── RECENT_FIXES.md           ← Latest updates
│   └── SIMULATION_BUGS_2025_10_31.md
├── guides/
│   └── (to be created as needed)
└── archive/
    └── (old/superseded docs)
```

---

## 📋 Files to Archive

### **Root-Level .md Files** (36 files → archive most)

**Keep Active:**
- `README.md` ← Main project README (update to point to new structure)
- `Attributions.md` ← Keep for credits

**Archive (delete after consolidation):**

**Bug Fix Logs** (consolidated into `/docs/changelog/SIMULATION_BUGS_2025_10_31.md`):
- [ ] `ALL_BUGS_FIXED_SUMMARY.md`
- [ ] `ALL_ERRORS_FIXED.md`
- [ ] `ALL_SIMULATION_DISPLAY_BUGS_FIXED.md`
- [ ] `RATE_VISIBILITY_LOGIC_BUG_FIXED.md`
- [ ] `RATE_HIDING_NOW_WORKS.md`
- [ ] `RATE_DISPLAY_FIXED_AND_EXPLAINED.md`
- [ ] `SIMULATION_RATE_DISPLAY_FIXED.md`
- [ ] `VISIBLE_FIELDS_NOW_SHOW_VALUES.md`
- [ ] `RATE_VISIBILITY_FIX_APPLIED.md`
- [ ] `RATE_VISIBILITY_BEFORE_AFTER.md`
- [ ] `CRITICAL_FIXES_APPLIED.md`
- [ ] `ERRORS_FIXED.md`
- [ ] `INPUT_FIXES_COMPLETE.md`
- [ ] `DELETE_KEY_FIX_COMPLETE.md`
- [ ] `URGENT_EDGE_FIX.md`
- [ ] `EDGE_TYPE_FIX_MULTI_CONTRACT.md`
- [ ] `COMPILE_MODAL_FIX.md`

**Quick Guides** (consolidate into `/docs/guides/`):
- [ ] `QUICK_RATE_ANSWER.md`
- [ ] `QUICK_FIX_AND_TEST.md`
- [ ] `QUICK_MIGRATION_VISUAL_GUIDE.md`
- [ ] `QUICK_SETUP_MULTI_CONTRACT_RATES.md`
- [ ] `QUICK_TEST_STEPS.md`
- [ ] `REFRESH_AND_TEST.md`
- [ ] `WHICH_RATE_DO_I_SEE.md`

**Status/Checkpoint Files** (info moved to MASTER_ROADMAP.md):
- [ ] `CHECKPOINT_1_READY.md`
- [ ] `PHASE_1_READY.md`
- [ ] `CLEANUP_COMPLETE.md`
- [ ] `CURRENT_STATUS_AND_NEXT_STEPS.md`

**Implementation Guides** (keep in components or archive):
- [ ] `MIGRATE_TO_MULTI_CONTRACT_SETUP.md` ← Archive (migration done)
- [ ] `FLAT_DAILY_DRAWER_IMPLEMENTATION.md` ← Archive (implemented)
- [ ] `URGENCY_AND_NOTES_FEATURE_ADDED.md` ← Archive (feature complete)

**Simulator Guides** (consolidate):
- [ ] `SIMULATOR_NODE_SETUP_GUIDE.md`
- [ ] `SIMULATOR_QUICK_START.md`
- [ ] `SIMULATOR_TROUBLESHOOTING.md`
- [ ] `SIMULATOR_URGENCY_QUICK_GUIDE.md`

**Testing Guides** (consolidate):
- [ ] `COMPREHENSIVE_TEST_CHECKLIST.md`

---

## ✅ Action Plan

### **Step 1: Already Created ✅**
- [x] `/docs/roadmap/MASTER_ROADMAP.md`
- [x] `/docs/changelog/RECENT_FIXES.md`
- [x] `/docs/changelog/SIMULATION_BUGS_2025_10_31.md`
- [x] `/docs/architecture/SYSTEM_ARCHITECTURE.md`
- [x] `/docs/architecture/MULTI_PARTY_ARCHITECTURE.md`

### **Step 2: Copy Key Content**
Move to `/docs/architecture/`:
- [x] `CONTRACT_SCOPED_RATE_VISIBILITY.md` ← Already in /docs/, move to /docs/architecture/

### **Step 3: Create Guides**
Create `/docs/guides/`:
- [ ] `VISUAL_BUILDER_GUIDE.md` ← Consolidate simulator guides
- [ ] `APPROVAL_SYSTEM_GUIDE.md` ← How approvals work
- [ ] `TIMESHEET_GUIDE.md` ← How to enter time
- [ ] `TESTING_GUIDE.md` ← How to test features

### **Step 4: Update Main README**
- [ ] Point to `/docs/roadmap/MASTER_ROADMAP.md`
- [ ] Link to quick start guides
- [ ] Remove outdated information

### **Step 5: Delete Archived Files**
- [ ] Delete all 30+ root-level .md files after confirming content is preserved

---

## 📚 Content Preservation Map

| Old Files | New Location | Status |
|-----------|--------------|--------|
| All bug fix .md files | `/docs/changelog/SIMULATION_BUGS_2025_10_31.md` | ✅ Consolidated |
| Status/checkpoint files | `/docs/roadmap/MASTER_ROADMAP.md` | ✅ Consolidated |
| Simulator guides | `/docs/guides/VISUAL_BUILDER_GUIDE.md` | ⏳ To create |
| Quick guides | `/docs/guides/` | ⏳ To create |
| Architecture docs | `/docs/architecture/` | ✅ Organized |

---

## 🎯 Benefits

### **Before:**
- 36 root-level .md files
- 142 files in /docs/
- Hard to find relevant information
- Duplicate content
- Outdated guides mixed with current

### **After:**
- 2 root-level .md files (README, Attributions)
- Organized /docs/ structure
- Clear navigation
- No duplicates
- Current docs only

---

## 📝 Next Steps

1. **Review this guide**
2. **Create remaining guides** (`/docs/guides/`)
3. **Move architecture docs**
4. **Update main README.md**
5. **Delete archived files** (after confirmation)

---

## ⚠️ Important

**DO NOT delete files until:**
1. Content is verified in new location
2. All cross-references are updated
3. User confirms organization is good

**Files to NEVER delete:**
- `README.md` (main project file)
- `Attributions.md` (credits)
- Component-specific READMEs in `/components/`
- Type definitions in `/types/`
- Actual code files

---

**Created:** 2025-10-31  
**Status:** Plan ready, awaiting execution approval  
**Next:** Create guides, then clean up
