# StatusIconRow Error Fix

## ✅ Error Fixed

### **Error Message:**
```
TypeError: Cannot read properties of undefined (reading 'length')
    at StatusIconRow (components/timesheets/indicators/StatusIconRow.tsx:31:12)
```

### **Root Cause:**

The `StatusIconRow` component had **two different usage patterns** that weren't compatible:

1. **Calendar View Usage:** Passes `icons` prop (array of StatusIcon objects)
2. **Table View Usage:** Passes `entry` prop (TimesheetEntry object)

The component only handled the `icons` prop, so when `EditableTableCell` tried to pass `entry`, it crashed trying to read `icons.length` on undefined.

---

## 🔧 Fix Applied

### **Made Component Accept Both Patterns:**

```typescript
interface StatusIconRowProps {
  icons?: StatusIcon[];         // ← Made optional
  entry?: any;                  // ← Added for table view
  maxVisible?: number;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
}
```

### **Added Conversion Logic:**

```typescript
export function StatusIconRow({ icons, entry, ... }) {
  // Handle entry prop from table view (convert to icons format)
  let statusIcons: StatusIcon[] = [];
  
  if (icons) {
    // Calendar view: use icons directly
    statusIcons = icons;
  } else if (entry?.entries) {
    // Table view: convert entry.entries to icons format
    statusIcons = entry.entries.map((e: any, idx: number) => ({
      personId: `entry-${idx}`,
      personName: e.category || 'Task',
      status: e.status || 'draft',
      hours: e.hours,
    }));
  }
  
  if (!statusIcons || statusIcons.length === 0) return null;
  // ... rest of component
}
```

### **Added "pending" Status:**

```typescript
export type EntryStatus = 
  | "draft" 
  | "submitted" 
  | "approved" 
  | "rejected" 
  | "pending";  // ← Added
```

Updated both status icon and label functions to handle "pending" (same as "submitted"):

```typescript
function getStatusIcon(status: EntryStatus, sizeClass: string) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className={`${sizeClass} text-success`} />;
    case "submitted":
    case "pending":  // ← Added
      return <Clock className={`${sizeClass} text-warning`} />;
    case "rejected":
      return <XCircle className={`${sizeClass} text-destructive`} />;
    case "draft":
      return <Circle className={`${sizeClass} text-muted-foreground`} />;
  }
}
```

---

## 📊 How It Works Now

### **Table View (EditableTableCell.tsx):**

```typescript
<StatusIconRow entry={entry} size="sm" />
```

**What happens:**
1. Component receives `entry` prop
2. Checks `entry?.entries` (array of EntryDetail objects)
3. Maps each EntryDetail to StatusIcon format:
   - `personId`: Generated ID
   - `personName`: Task category (e.g., "Development", "Meetings")
   - `status`: Entry status (draft/submitted/approved/rejected/pending)
   - `hours`: Task hours
4. Renders status icons for each task

**Example:**
- Entry with 2 tasks (8h Development + 2h Meetings)
- Shows 2 status icons with tooltips:
  - ✅ "Development - 8h · Approved"
  - ⏰ "Meetings - 2h · Pending"

### **Calendar View (MultiPersonDayModal.tsx):**

```typescript
<StatusIconRow 
  icons={[
    { personId: 'user-1', personName: 'Sarah Chen', status: 'approved', hours: 8 },
    { personId: 'user-2', personName: 'Mike Rodriguez', status: 'pending', hours: 6 },
  ]} 
  size="md" 
/>
```

**What happens:**
1. Component receives `icons` prop directly
2. Uses icons as-is
3. Renders status icons for each person

**Example:**
- 2 people logged time on same day
- Shows 2 status icons with tooltips:
  - ✅ "Sarah Chen - 8h · Approved"
  - ⏰ "Mike Rodriguez - 6h · Pending"

---

## 🎨 Visual Indicators

### **Status Icon Colors:**

| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| **Draft** | ⚪ Circle | Gray | Not submitted yet |
| **Submitted/Pending** | ⏰ Clock | Yellow/Warning | Awaiting approval |
| **Approved** | ✅ CheckCircle | Green/Success | Approved by manager |
| **Rejected** | ❌ XCircle | Red/Destructive | Rejected, needs revision |

### **When Multiple Tasks:**

If more than 5 status icons, shows overflow count:
```
✅ ⏰ ✅ ⏰ ⚪ +3
```

---

## ✅ Files Modified

1. **`/components/timesheets/indicators/StatusIconRow.tsx`**
   - Made `icons` prop optional
   - Added `entry` prop for table view compatibility
   - Added conversion logic from TimesheetEntry to StatusIcon[]
   - Added "pending" status support
   - Fixed null/undefined safety

---

## 🧪 Testing

### **Table View:**
1. Go to `/approval-demo`
2. Click **Timesheets** tab
3. Switch to **Table** view
4. Select contractors (click "Add" button)
5. ✅ Should see status icons in each cell with entries
6. ✅ Hover to see tooltips with task category and hours
7. ✅ No console errors

### **Calendar View:**
1. Stay on same page
2. Switch to **Calendar** view
3. ✅ Status icons still work for multi-person entries
4. ✅ No console errors

### **Approvals Tab:**
1. Click **Approvals** tab
2. Try both Queue and Table views
3. ✅ Status icons work in both views
4. ✅ No console errors

---

## 🚀 What This Enables

✅ **Backward Compatible:** Old calendar view code still works  
✅ **Table View Support:** New table cells can show status indicators  
✅ **Null-Safe:** Won't crash if entry or icons are undefined  
✅ **Flexible:** Supports both usage patterns automatically  
✅ **Complete Status Coverage:** Handles all 5 status types  

The table view now properly shows status indicators for each timesheet entry! 🎉
