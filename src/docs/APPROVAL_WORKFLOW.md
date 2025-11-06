# Approval Workflow - Quick Reference

**System:** Approval-v2 (Monthly Timesheet Approvals)  
**Location:** Project Timesheets → "Approvals v2 (Demo)" tab

---

## User Journey

### 1. **Browse Timesheets**
```
Organization Grouped Table
├─ Acme Dev Studio (15 people)
│   ├─ Sarah Johnson • Jan 6-12 • 40 hrs • Pending
│   ├─ Mike Chen • Jan 6-12 • 40 hrs • Pending
│   └─ ...
├─ BrightWorks Design (7 people)
└─ Alex Chen (Freelancer)
```

**Actions:**
- Click org header to expand/collapse
- Check org checkbox to select all contractors
- Check individual checkbox to select single timesheet

### 2. **Filter & Search**
```
Filters: [Organization ▼] [Status ▼] [Role ▼] [Clear All]
```

**Filter Options:**
- **Organization:** All, Acme Dev Studio, BrightWorks Design, Individual freelancers
- **Status:** All, Pending, Approved, Rejected, Changes Requested
- **Role:** All, Individual Contributors, Company Employees, Agency Contractors

**Stats Dashboard:**
```
[Total: 25] [Pending: 15] [Approved: 8] [Rejected: 2]
```

### 3. **Review Timesheet Details**

**Click any row → Monthly Drawer Opens**

```
╔══════════════════════════════════════════════════════════╗
║ Sarah Johnson                                       [✕]  ║
║ January 2025 • $85/hr                                    ║
║                                                          ║
║ Monthly Total: 160 hours • $13,600                       ║
║                                                          ║
║ ┌─ Signed Timesheets (PDF) ─────────────────────┐       ║
║ │ 📄 Timesheet_Week1.pdf • 240 KB  [View PDF]   │       ║
║ │ 📄 Timesheet_Week2.pdf • 240 KB  [View PDF]   │       ║
║ │ 📄 Timesheet_Week3.pdf • 240 KB  [View PDF]   │       ║
║ │ 📄 Timesheet_Week4.pdf • 240 KB  [View PDF]   │       ║
║ └────────────────────────────────────────────────┘       ║
║                                                          ║
║ ┌─ Daily Timesheet Entries ─────────────────────┐       ║
║ │ 22 days with 65 tasks                         │       ║
║ │                                                │       ║
║ │ ▸ Mon, Jan 6   • 3 tasks                 8.0h │       ║
║ │ ▸ Tue, Jan 7   • 2 tasks                 8.0h │       ║
║ │ ▸ Wed, Jan 8   • 1 task     9:00-17:30  8.0h │  ← Single task shows time
║ │ ▸ Thu, Jan 9   • 4 tasks                 9.0h │  ← Overtime flagged
║ │ ...                                            │       ║
║ └────────────────────────────────────────────────┘       ║
║                                                          ║
║ Total for January: 160.0 hours                          ║
║                                                          ║
║ [✓ Approve Timesheet] [✕ Reject]                        ║
╚══════════════════════════════════════════════════════════╝
```

**Expand Day Details (Click Row):**
```
▾ Thu, Jan 9 • 4 tasks                              9.0h
  ├─ Feature development                            4.0h
  │  ⏰ 09:00 – 13:00
  ├─ Bug fixes                                      2.5h
  │  ⏰ 13:30 – 16:00
  ├─ Code review                                    1.5h
  │  💬 "Reviewed PR #234 and #235"
  └─ Client meeting                                 1.0h
     ⏰ 16:00 – 17:00
```

### 4. **Approve or Reject**

#### **Single Approval (Drawer)**
- Click **[Approve Timesheet]** button in drawer
- Approves entire month (all 4 weeks)
- Updates status from "Pending" → "Approved"

#### **Bulk Approval (Table)**
1. Select multiple timesheets (checkboxes)
2. Bulk action bar appears:
   ```
   [3 items selected] [Clear Selection] [✓ Approve Selected] [✕ Reject Selected]
   ```
3. Click **[Approve Selected]**
4. All selected timesheets approved at once

---

## Verification Workflow

### Side-by-Side PDF Verification

**Use Case:** Contractor uploaded signed PDF timesheet

**Workflow:**
1. Open monthly drawer
2. Click **[View PDF]** next to PDF attachment
3. PDF opens in new tab
4. Compare PDF hours with "Daily Timesheet Entries" section
5. Verify totals match
6. Click **[Approve Timesheet]** if verified

**Example:**
```
PDF Shows: January 2025 • 160 hours
Drawer Shows: Total for January • 160.0 hours
✓ Match → Approve
✗ Mismatch → Reject or Request Changes
```

### Review Flags (Future Feature)

Auto-detected anomalies will appear as:
```
⚠️ Weekend Work Detected (Jan 13-14)
⚠️ Overtime: 9.5h on Jan 18 (>8h threshold)
ℹ️  Task Mismatch: "Marketing" not in allocated tasks
```

---

## Business Rules

### Monthly Aggregation Logic

**Weekly Periods → Monthly View:**
```
Contract: Sarah Johnson (#contract-acme-1)

Week 1 (Jan 1-7):   40 hrs • Pending
Week 2 (Jan 8-14):  40 hrs • Pending
Week 3 (Jan 15-21): 40 hrs • Pending
Week 4 (Jan 22-28): 40 hrs • Pending
─────────────────────────────────────
Monthly Total:     160 hrs • Pending
```

**Monthly Status Calculation:**
- If ANY week is "Rejected" → Monthly status = "Rejected"
- If ANY week is "Pending" → Monthly status = "Pending"
- If ALL weeks are "Approved" → Monthly status = "Approved"

### Date Filtering

**Month Boundaries:**
```
October 2025 View:
├─ Shows: Oct 1 - Oct 31 ONLY
├─ Hides: Sep 29-30 (even if in same week)
└─ Hides: Nov 1-2 (even if in same week)
```

**Why:** Prevents confusion when approving monthly invoices.

### Contractor Types & Permissions

| Type | Can Submit | Can Approve | Can See Rates |
|------|-----------|-------------|---------------|
| **Individual Contributor** | ✓ Own timesheets | ✗ | ✓ Own rate |
| **Company Employee** | ✓ Own timesheets | ✗ | ⚠️ If allowed by company |
| **Company Manager** | ✓ Own timesheets | ✓ Team timesheets | ✓ Team rates |
| **Agency Contractor** | ✓ Own timesheets | ✗ | ⚠️ If allowed by agency |
| **Agency Manager** | ✗ | ✓ Represented contractors | ✓ All rates |
| **Client PM** | ✗ | ✓ All contractors | ✓ Billed rates only |

---

## Keyboard Shortcuts (Future)

| Key | Action |
|-----|--------|
| `Space` | Toggle row selection |
| `Shift + Click` | Select range |
| `Cmd/Ctrl + A` | Select all visible |
| `Enter` | Open drawer for selected row |
| `Esc` | Close drawer |
| `→` | Expand organization group |
| `←` | Collapse organization group |
| `↓` / `↑` | Navigate rows |

---

## API Endpoints (Future Production)

### GET Endpoints
```
GET /api/timesheets/organizations
GET /api/timesheets/contracts?organizationId={id}
GET /api/timesheets/periods?contractId={id}
GET /api/timesheets/entries?periodId={id}
GET /api/timesheets/monthly?contractId={id}&month={YYYY-MM}
```

### POST Endpoints
```
POST /api/timesheets/approve
  Body: { periodIds: string[], approverId: string }

POST /api/timesheets/reject
  Body: { periodIds: string[], approverId: string, reason: string }

POST /api/timesheets/bulk-approve
  Body: { periodIds: string[], approverId: string }
```

---

## Troubleshooting

### Issue: Can't see any timesheets
**Solution:** Check filters - ensure "Status" isn't set to exclude pending items

### Issue: Bulk approve button disabled
**Solution:** Select at least one timesheet checkbox

### Issue: Drawer shows wrong month
**Solution:** This shouldn't happen - month is determined by `monthlyView.monthStart`. Report as bug.

### Issue: PDF link returns 404
**Solution:** Demo PDFs are placeholders. Production will use Supabase Storage signed URLs.

### Issue: Badge shows wrong task count
**Solution:** This was fixed - ensure you're on latest version with `filteredEntriesCount`

---

## Future Enhancements

### Planned Features
- [ ] Inline PDF preview (no new tab)
- [ ] Month navigation in drawer (Previous/Next buttons)
- [ ] Comments on rejections
- [ ] Email notifications
- [ ] Export to CSV/PDF
- [ ] Advanced filtering (date ranges, amounts)
- [ ] Finance approval layer (3rd tier)
- [ ] AI-powered anomaly detection
- [ ] OCR extraction from PDF timesheets

---

**For implementation details, see `/docs/CURRENT_ARCHITECTURE.md`**
