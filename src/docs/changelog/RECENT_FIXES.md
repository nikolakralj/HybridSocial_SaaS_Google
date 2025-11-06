# 📝 Recent Fixes & Updates

**Last Updated:** 2025-10-31

This document consolidates all recent bug fixes and updates in chronological order.

---

## 🎯 2025-10-31: Simulation Display Bugs Fixed

### **Bug #1: Rate Extraction**
**Problem:** Simulation showed `rate: ???` because contracts store `hourlyRate`/`dailyRate`/`fixedAmount`, not `rate`  
**Fix:** Updated rate extraction logic in `PolicySimulator.tsx` (lines 110-135)  
**Result:** ✅ Contract dropdown now shows "Contract A ($50/hr)"

### **Bug #2: Field Value Display**
**Problem:** Visible fields showed names only (`hours` instead of `hours: 40`)  
**Fix:** Updated `SimulatorFlowVisualization.tsx` (lines 147-158) to display values  
**Result:** ✅ Now shows `hours: 40`, `week: 2025-10-26`, `contractor: John Smith`

### **Bug #3: Rate Visibility Logic**
**Problem:** hideRateFrom checkboxes were ignored, rates shown to everyone  
**Fix:** Changed visibility logic from OR to AND in `PolicySimulator.tsx` (line 213)  
**Result:** ✅ Non-contract parties now see `rate: •••` (masked)

**Files Modified:**
- `/components/workgraph/PolicySimulator.tsx`
- `/components/workgraph/SimulatorFlowVisualization.tsx`

**Documentation:**
- Consolidated in `/docs/changelog/SIMULATION_BUGS_2025_10_31.md`

---

## 📚 Previous Major Updates

### **Contract-Scoped Rate Visibility** (Earlier Oct 2025)
- Implemented contract party selection in PropertyPanel
- Added hideRateFrom checkboxes for rate privacy
- Fixed Radix UI errors (empty SelectItem values, missing DialogDescription)

**Documentation:** `/docs/architecture/CONTRACT_SCOPED_RATE_VISIBILITY.md`

---

### **Policy Simulator Implementation** (Oct 2025)
- Built comprehensive policy simulator
- Timesheet input form with contract selection
- Approval flow visualization
- Rate visibility testing
- Urgency levels and SLA estimation

**Documentation:** `/docs/POLICY_SIMULATOR_COMPLETE.md`

---

### **Multi-Party Approval Architecture** (Sept 2025)
- Fixed duplicate tables in Approvals tab
- Implemented proper multi-party project structure
- Support for multiple companies/agencies per project
- Hierarchical approval flows
- Contract-based rate privacy

**Documentation:** `/docs/architecture/MULTI_PARTY_ARCHITECTURE.md`

---

### **3-Layer Approval System** (Aug 2025)
- Contract-based visual grouping
- Weekly table → monthly drawer workflow
- PDF invoice generation
- Batch approval capabilities

**Documentation:** `/docs/COMPREHENSIVE_APPROVAL_SYSTEM.md`

---

### **Phase 1A-1C: Drag-Drop Timesheets** (Jul-Aug 2025)
- Multi-person calendar grid
- Drag-and-drop time entry
- Enhanced design system (Warp-inspired)
- Status indicators and variance tracking

**Documentation:** `/docs/PHASE_1C_COMPLETE.md`

---

## 🐛 Known Issues

None currently! All major bugs have been fixed.

---

## 📋 Quick Reference

### **If you see...**
| Issue | Fix | File |
|-------|-----|------|
| `rate: ???` | Rate extraction bug (FIXED) | `PolicySimulator.tsx` |
| Just "hours" not "hours: 40" | Field display bug (FIXED) | `SimulatorFlowVisualization.tsx` |
| Rates visible when they shouldn't be | Visibility logic bug (FIXED) | `PolicySimulator.tsx` |

---

## 🎯 Archived Fixes

All older bug fixes have been consolidated into:
- `/docs/changelog/SIMULATION_BUGS_2025_10_31.md`
- `/docs/archive/BUG_FIXES_ARCHIVE.md`

---

**See Also:**
- `/docs/roadmap/MASTER_ROADMAP.md` - Overall project progress
- `/docs/architecture/` - System architecture docs
- `/docs/guides/` - How-to guides
