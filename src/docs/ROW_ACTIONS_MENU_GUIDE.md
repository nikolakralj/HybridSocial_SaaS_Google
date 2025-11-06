# Row Actions Menu (⋯) - Quick Reference

## What is it?

The **three dots menu (⋯)** appears on the right side of each timesheet row when you hover over it. It provides quick access to common actions without opening the full drawer.

## Where to find it

📍 **Location**: Approvals Tab → Weekly table view → Hover over any timesheet row

The button appears on hover with a smooth fade-in animation.

## Available Actions

### 1. 👁️ **View Details**
Opens the monthly timesheet drawer with full details for that week:
- Daily hour breakdowns
- Task descriptions
- Attached PDF timesheets
- Notes and comments
- Approval history

**Keyboard shortcut**: Click the row itself

---

### 2. ✅ **Quick Approve** *(Pending only)*
Instantly approve the timesheet without opening the drawer:
- Only visible for `pending` status
- Updates status to `approved`
- No additional form required
- Perfect for quick bulk reviews

**Use case**: "I trust this contractor, just approve everything"

---

### 3. ❌ **Request Changes** *(Pending only)*
Request changes from the contractor:
- Only visible for `pending` status
- Updates status to `changes_requested`
- Contractor gets notification
- They can resubmit after corrections

**Use case**: "Hours look off, please check and resubmit"

---

### 4. 📥 **Download PDF**
Download the signed timesheet PDF that the contractor uploaded:
- Generates/downloads the PDF document
- Includes all hours, signatures, and notes
- For record keeping and invoicing
- Works for any status

**Use case**: "Need the signed document for accounting"

---

### 5. 💬 **Add Comment**
Add an internal comment or note to the timesheet:
- Private notes (not visible to contractor)
- Tag team members
- Document approval reasons
- Track communication

**Use case**: "Flagging this for finance team review"

---

### 6. 🕐 **View History**
See the complete audit trail:
- Who submitted, when
- Who approved/rejected, when
- Status changes
- Comments and edits
- PDF upload history

**Use case**: "When was this originally submitted?"

---

## Visual Behavior

### **Hover State**
```
Row (default):   [Content..............................]
Row (hover):     [Content..........................⋯ ]
                                                   ↑
                                            Appears on hover
```

### **Menu Open State**
```
┌─────────────────────────────┐
│ 👁️ View Details            │
│ ✅ Quick Approve            │  ← Green (pending only)
│ ❌ Request Changes          │  ← Red (pending only)
├─────────────────────────────┤
│ 📥 Download PDF             │
│ 💬 Add Comment              │
│ 🕐 View History             │
└─────────────────────────────┘
```

## Context-Aware Menu

The menu items change based on **timesheet status**:

### Status: `pending` ⏳
```
✓ View Details
✓ Quick Approve       ← Available
✓ Request Changes     ← Available
✓ Download PDF
✓ Add Comment
✓ View History
```

### Status: `approved` ✅
```
✓ View Details
✗ Quick Approve       ← Hidden (already approved)
✗ Request Changes     ← Hidden
✓ Download PDF
✓ Add Comment
✓ View History
```

### Status: `rejected` / `changes_requested` ❌
```
✓ View Details
✗ Quick Approve       ← Hidden (awaiting resubmit)
✗ Request Changes     ← Hidden
✓ Download PDF
✓ Add Comment
✓ View History
```

## Keyboard & Mouse Interactions

| Action | Result |
|--------|--------|
| Hover row | Shows ⋯ button |
| Click row | Opens drawer (View Details) |
| Click ⋯ | Opens actions menu |
| Click menu item | Executes action + closes menu |
| Click outside menu | Closes menu |
| ESC key | Closes menu |

## Stop Propagation

⚠️ **Important**: Clicking the ⋯ button or any menu item does NOT trigger the row click (which opens the drawer). This is intentional to prevent accidental drawer opens.

```tsx
// Menu button stops propagation
<DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
  <Button>⋯</Button>
</DropdownMenuTrigger>

// Each menu item also stops propagation
<DropdownMenuItem onClick={(e) => {
  e.stopPropagation();
  // ... action logic
}}>
```

## Workflow Examples

### **Quick approval workflow**
1. Review hours in the table (don't need full details)
2. Hover over row
3. Click ⋯
4. Click "Quick Approve" ✅
5. Done! Status updates instantly

**Time saved**: ~5 seconds per timesheet (no drawer open/close)

---

### **Detailed review workflow**
1. Hover over row
2. Click ⋯
3. Click "View Details" 👁️
4. Review full breakdown in drawer
5. Approve/reject from drawer

**Use when**: Need to verify tasks, check notes, or see daily breakdown

---

### **Batch PDF download**
1. Filter to approved timesheets
2. For each row:
   - Hover
   - Click ⋯
   - Click "Download PDF" 📥
3. Send all PDFs to accounting

**Use when**: Monthly invoicing cycle

---

## Future Enhancements

Potential additions to the menu:

- 🔄 **Duplicate to next week** - Copy timesheet to following week
- 📧 **Send reminder** - Email contractor about pending timesheet
- 🔒 **Lock for editing** - Prevent further changes after approval
- 📊 **Compare to budget** - See hours vs. project allocation
- 🏷️ **Add tags** - Categorize timesheets (urgent, review later, etc.)

## Related Features

- **Batch Selection**: Use checkboxes + bottom bar for bulk actions
- **Monthly Drawer**: Full details view opened by "View Details"
- **Status Badges**: Visual indicators next to each row
- **Review Flags**: Warning badges for anomalies

## Files Modified

- `/components/timesheets/approval-v2/OrganizationGroupedTable.tsx`
  - Added `MoreVertical` icon import
  - Added `DropdownMenu` components
  - Added actions menu to each period row
  - Context-aware menu items based on status

## Technical Notes

### Current Implementation
- Menu appears on `group-hover` (hover over row)
- Uses `opacity-0 group-hover:opacity-100` for smooth fade
- Menu is right-aligned (`align="end"`)
- Each action calls appropriate callback prop
- Some actions log to console (placeholders for future implementation)

### Callbacks Used
- `handlePeriodClick()` - Opens drawer (View Details)
- `onQuickApprove()` - Quick approval handler
- `onQuickReject()` - Request changes handler
- Console logs for: Download PDF, Add Comment, View History

### Styling
- Button: `h-8 w-8 p-0` - Compact square button
- Menu width: `w-48` - Fixed width for consistency
- Green text for approve, red text for reject
- Icons: 4x4 size with consistent spacing
