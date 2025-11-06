import { cn } from '../../ui/utils';
import type { TimesheetEntry } from '../../../utils/api/timesheets';
import type { Person } from '../../../types/people';

type UserRole = 
  | "individual-contributor"
  | "team-lead"
  | "company-owner"
  | "agency-owner"
  | "client";

interface EnhancedMultiPersonDayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  entries: (TimesheetEntry & { personName: string; task?: string; notes?: string })[];
  people: Person[];
  selectedPeopleIds: Set<string>;
  onUpdateEntry?: (entryId: string, updates: Partial<TimesheetEntry>) => Promise<void>;
  onDeleteEntry?: (entryId: string) => Promise<void>;
  onBulkUpdate?: (entryIds: string[], updates: Partial<TimesheetEntry>) => Promise<void>;
  onSavePersonTasks?: (personId: string, tasks: any[]) => Promise<void>;
  onAddEntry?: () => void;
  userRole?: UserRole;
  hourlyRate?: number;
}

interface PersonGroup {
  person: Person;
  entries: (TimesheetEntry & { personName: string; task?: string; notes?: string })[];
  totalHours: number;
  isExpanded: boolean;
}

interface VarianceException {
  type: 'variance' | 'missing' | 'overtime';
  personName: string;
  message: string;
  severity: 'warning' | 'error' | 'info';
}

export function EnhancedMultiPersonDayModal({
  open,
  onOpenChange,
  date,
  entries,
  people,
  selectedPeopleIds,
  onUpdateEntry,
  onDeleteEntry,
  onBulkUpdate,
  onSavePersonTasks,
  onAddEntry,
  userRole = "company-owner",
  hourlyRate = 75,
}: EnhancedMultiPersonDayModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exceptionsOpen, setExceptionsOpen] = useState(true);

  // Group entries by person
  const personGroups: PersonGroup[] = people
    .filter(p => entries.some(e => e.userId === p.id))
    .map(person => {
      const personEntries = entries.filter(e => e.userId === person.id);
      const totalHours = personEntries.reduce((sum, e) => sum + e.hours, 0);
      return { 
        person, 
        entries: personEntries, 
        totalHours,
        isExpanded: true // Always expanded now
      };
    });

  // Calculate stats
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const uniquePeople = personGroups.length;

  // Calculate exceptions
  const exceptions: VarianceException[] = [];

  // Check for variance
  if (personGroups.length > 1) {
    const avgHours = totalHours / personGroups.length;
    personGroups.forEach(group => {
      const variance = Math.abs(group.totalHours - avgHours);
      if (variance > 1) {
        exceptions.push({
          type: 'variance',
          personName: group.person.name,
          message: `${group.totalHours}h (${variance.toFixed(1)}h ${
            group.totalHours > avgHours ? 'over' : 'under'
          } average)`,
          severity: variance > 2 ? 'warning' : 'info',
        });
      }
    });
  }

  // Check for overtime
  personGroups.forEach(group => {
    if (group.totalHours > 8) {
      exceptions.push({
        type: 'overtime',
        personName: group.person.name,
        message: `${group.totalHours}h logged (${group.totalHours - 8}h overtime)`,
        severity: group.totalHours > 10 ? 'error' : 'warning',
      });
    }
  });

  // Check for missing
  selectedPeopleIds.forEach((personId) => {
    if (!entries.some((e) => e.userId === personId)) {
      const person = people.find((p) => p.id === personId);
      if (person) {
        exceptions.push({
          type: 'missing',
          personName: person.name,
          message: 'No entry for this day',
          severity: 'info',
        });
      }
    }
  });

  // Toggle expand/collapse
  const toggleExpanded = (personId: string) => {
    const newExpanded = new Set(expandedPersonIds);
    if (newExpanded.has(personId)) {
      newExpanded.delete(personId);
    } else {
      newExpanded.add(personId);
    }
    setExpandedPersonIds(newExpanded);
  };

  // Handlers
  const handleSavePersonTasks = async (personId: string, tasks: any[]) => {
    if (!onSavePersonTasks) return;

    setIsSubmitting(true);
    try {
      await onSavePersonTasks(personId, tasks);
      toast.success('Tasks updated successfully');
    } catch (error) {
      console.error('Failed to save tasks:', error);
      toast.error(`Failed to save tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = (personId: string) => {
    // Cancel is now a no-op since we don't collapse - user can just close the modal
  };

  const handleDeletePerson = async (personId: string, entryIds: string[]) => {
    if (!onDeleteEntry) return;
    if (!confirm('Delete all tasks for this person?')) return;

    setIsSubmitting(true);
    try {
      // Delete all entries for this person
      await Promise.all(entryIds.map(id => onDeleteEntry(id)));
      toast.success('Entries deleted successfully');
    } catch (error) {
      console.error('Failed to delete entries:', error);
      toast.error(`Failed to delete entries: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-brand" />
            {formatDate(date)}
          </DialogTitle>
          <DialogDescription>
            {uniquePeople} {uniquePeople === 1 ? 'person' : 'people'} · {totalHours}h total
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6">
            {/* People Chips */}
            {personGroups.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">People with entries:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {personGroups.map(({ person }) => (
                    <Badge key={person.id} variant="secondary" className="gap-1.5 px-3 py-1.5">
                      <div className="w-6 h-6 rounded-full bg-accent-brand/10 flex items-center justify-center text-xs font-medium text-accent-brand">
                        {person.initials}
                      </div>
                      <span>{person.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Entries by Person - Always Expanded */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Entries</h3>
                {onSavePersonTasks && personGroups.length > 1 && (
                  <span className="text-xs text-muted-foreground">
                    Bulk Edit ({personGroups.length})
                  </span>
                )}
              </div>

              {personGroups.length > 0 ? (
                <div className="space-y-6">
                  {personGroups.map(({ person, entries: personEntries, totalHours }) => {
                    return (
                      <div
                        key={person.id}
                        className="space-y-3"
                      >
                        {/* Person Header */}
                        <div className="flex items-center justify-between pb-2 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent-brand/10 flex items-center justify-center font-medium text-accent-brand">
                              {person.initials}
                            </div>
                            <div>
                              <div className="font-medium">{person.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-2">
                              <Clock className="w-3 h-3" />
                              <span className={cn(
                                "font-semibold",
                                totalHours > 8 && "text-orange-600",
                                totalHours > 12 && "text-red-600"
                              )}>
                                {totalHours}h
                              </span>
                            </Badge>
                            <Badge 
                              variant={
                                personEntries[0]?.status === 'approved' ? 'default' :
                                personEntries[0]?.status === 'submitted' ? 'secondary' :
                                'outline'
                              }
                              className="capitalize"
                            >
                              {personEntries[0]?.status || 'draft'}
                            </Badge>
                            {onDeleteEntry && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeletePerson(person.id, personEntries.map(e => e.id))}
                                disabled={isSubmitting}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Full Editor - Always Visible */}
                        {onSavePersonTasks && (
                          <div className="bg-accent/5 rounded-lg p-4 border">
                            <MultiTaskEditor
                              personId={person.id}
                              personName={person.name}
                              date={date}
                              existingEntries={personEntries}
                              onSave={(tasks) => handleSavePersonTasks(person.id, tasks)}
                              onCancel={() => handleCancelEdit(person.id)}
                              isSubmitting={isSubmitting}
                              userRole={userRole}
                              hourlyRate={hourlyRate}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No entries for this day</p>
                </div>
              )}
            </div>

            {/* Exceptions & Alerts */}
            {exceptions.length > 0 && (
              <Collapsible open={exceptionsOpen} onOpenChange={setExceptionsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span>Exceptions & Alerts</span>
                      <Badge variant="secondary">{exceptions.length}</Badge>
                    </div>
                    {exceptionsOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="border rounded-lg divide-y">
                    {exceptions.map((exception, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'p-3 flex items-start gap-3',
                          exception.severity === 'error' && 'bg-red-50/50',
                          exception.severity === 'warning' && 'bg-yellow-50/50',
                          exception.severity === 'info' && 'bg-blue-50/50'
                        )}
                      >
                        <AlertTriangle
                          className={cn(
                            'w-4 h-4 mt-0.5 flex-shrink-0',
                            exception.severity === 'error' && 'text-red-600',
                            exception.severity === 'warning' && 'text-yellow-600',
                            exception.severity === 'info' && 'text-blue-600'
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{exception.personName}</p>
                          <p className="text-sm text-muted-foreground">{exception.message}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            'flex-shrink-0 text-xs',
                            exception.severity === 'error' && 'border-red-600 text-red-600',
                            exception.severity === 'warning' && 'border-yellow-600 text-yellow-600',
                            exception.severity === 'info' && 'border-blue-600 text-blue-600'
                          )}
                        >
                          {exception.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}