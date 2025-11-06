# Timesheet Modal Components

This directory contains modal components for the multi-person timesheet system.

## Components

### `MultiPersonDayModal.tsx`

**Purpose:** Display and edit all entries for a single day across multiple people.

**When it opens:**
- User clicks on a calendar day (without Ctrl/Shift)
- System needs to show detailed view of day's entries

**Features:**
- Shows all people with entries on that day
- Displays each person's hours, task, status, and billable amount
- Detects and highlights exceptions (variance, overtime, missing entries)
- Provides individual edit/delete actions
- Collapsible exceptions table

**Props:**
```typescript
interface MultiPersonDayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  entries: PersonEntry[];
  people: Person[];
  selectedPeopleIds: Set<string>;
  onAddEntry: (personId, hours, task, notes?) => void;
  onEditEntry: (personId, hours, task, notes?) => void;
  onDeleteEntry: (personId) => void;
  onDeleteAll?: () => void;
}
```

**Exception Types:**
- `variance` - Person's hours differ significantly from team average
- `overtime` - Person logged more than 8 hours
- `missing` - Selected person has no entry for this day
- `conflict` - (Future) Overlapping time blocks

---

### `DragDropConflictDialog.tsx`

**Purpose:** Handle conflicts when dragging entries to a day that already has entries.

**When it opens:**
- User drags entries from Day A to Day B
- One or more people already have entries on Day B
- System needs to ask how to handle the conflict

**Features:**
- Shows source and target dates
- Lists all conflicting people with existing vs. new data
- Lists non-conflicting people (clean copies)
- Provides 3 resolution strategies:
  - **Replace** - Delete existing, create new
  - **Merge** - Keep both (multiple entries per person)
  - **Skip** - Only copy non-conflicting people

**Props:**
```typescript
interface DragDropConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draggedData: DraggedData | null;
  conflicts: ConflictingEntry[];
  onConfirm: (resolution: ConflictResolution, skipIds?: Set<string>) => void;
  onCancel: () => void;
}
```

**Resolution Types:**
```typescript
type ConflictResolution = "replace" | "merge" | "skip";
```

---

## Usage Example

### Day Modal

```typescript
import { MultiPersonDayModal } from './modal/MultiPersonDayModal';

function MyCalendar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };
  
  return (
    <>
      {/* Calendar cells */}
      
      {selectedDate && (
        <MultiPersonDayModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          date={selectedDate}
          entries={getEntriesForDate(selectedDate)}
          people={allPeople}
          selectedPeopleIds={selectedPeople}
          onAddEntry={(personId, hours, task) => {
            // Add entry to state/API
          }}
          onEditEntry={(personId, hours, task) => {
            // Update entry in state/API
          }}
          onDeleteEntry={(personId) => {
            // Remove entry from state/API
          }}
        />
      )}
    </>
  );
}
```

### Conflict Dialog

```typescript
import { DragDropConflictDialog } from './modal/DragDropConflictDialog';

function MyCalendar() {
  const [conflictOpen, setConflictOpen] = useState(false);
  const [dragData, setDragData] = useState<DraggedData | null>(null);
  const [conflicts, setConflicts] = useState<ConflictingEntry[]>([]);
  
  const handleDrop = (source: Date, target: Date, entries: Entry[]) => {
    // Check for conflicts
    const existingEntries = getEntriesForDate(target);
    const conflicts = detectConflicts(entries, existingEntries);
    
    if (conflicts.length > 0) {
      // Show conflict dialog
      setDragData({ sourceDate: source, targetDate: target, entries });
      setConflicts(conflicts);
      setConflictOpen(true);
    } else {
      // No conflicts, copy directly
      performCopy(entries, target);
    }
  };
  
  const handleResolve = (resolution: ConflictResolution, skipIds?: Set<string>) => {
    if (!dragData) return;
    
    switch (resolution) {
      case 'replace':
        deleteExisting(dragData.targetDate);
        copyEntries(dragData.entries, dragData.targetDate);
        break;
      case 'merge':
        copyEntries(dragData.entries, dragData.targetDate, { merge: true });
        break;
      case 'skip':
        const toSkip = skipIds || new Set(conflicts.map(c => c.personId));
        const filtered = dragData.entries.filter(e => !toSkip.has(e.personId));
        copyEntries(filtered, dragData.targetDate);
        break;
    }
  };
  
  return (
    <>
      {/* Draggable calendar cells */}
      
      <DragDropConflictDialog
        open={conflictOpen}
        onOpenChange={setConflictOpen}
        draggedData={dragData}
        conflicts={conflicts}
        onConfirm={handleResolve}
        onCancel={() => {
          setDragData(null);
          setConflicts([]);
        }}
      />
    </>
  );
}
```

---

## Design Patterns

### Modal Consistency
Both modals follow the same design system:
- DialogHeader with icon + title + description
- ScrollArea for content (supports long lists)
- DialogFooter with action buttons
- Max-width and max-height constraints
- Apple-inspired styling

### State Management
Modals are controlled components:
- Parent manages `open` state
- Parent provides data via props
- Parent handles callbacks for actions
- Modals are presentational only

### Error Handling
Both modals handle edge cases:
- Null/undefined dates
- Empty entry arrays
- Missing person data
- Invalid resolution types

---

## Accessibility

### Keyboard Support
- **Tab** - Navigate between interactive elements
- **Enter** - Activate focused button
- **Escape** - Close modal
- **Space** - Toggle radio buttons/checkboxes

### ARIA Attributes
- Dialog role on modal overlay
- Descriptive labels on all buttons
- Status announcements for actions
- Proper heading hierarchy

### Focus Management
- Focus trap within modal
- Return focus to trigger element on close
- Visible focus indicators

---

## Testing

### Day Modal Tests
```typescript
test('opens when date is provided', () => {
  // Test modal opens with date
});

test('displays all entries for date', () => {
  // Test entry list rendering
});

test('detects variance exceptions', () => {
  // Test variance calculation
});

test('detects overtime exceptions', () => {
  // Test overtime detection
});

test('calls onDeleteEntry when delete clicked', () => {
  // Test delete callback
});
```

### Conflict Dialog Tests
```typescript
test('shows conflicts when provided', () => {
  // Test conflict rendering
});

test('defaults to merge resolution', () => {
  // Test default selection
});

test('calls onConfirm with correct resolution', () => {
  // Test resolution callback
});

test('calculates clean entries correctly', () => {
  // Test non-conflicting entry filtering
});
```

---

## Future Enhancements

1. **Inline Editing** - Edit fields directly in modal
2. **Batch Actions** - Select multiple entries, bulk edit/delete
3. **History** - Show entry edit history
4. **Comments** - Add notes/comments to exceptions
5. **Export** - Download day summary as PDF/CSV
6. **Templates** - Save common entry patterns
7. **Smart Suggestions** - AI-powered conflict resolution
8. **Keyboard Shortcuts** - Quick actions with hotkeys
