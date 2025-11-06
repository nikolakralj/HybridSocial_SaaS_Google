import { format, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from "date-fns";
import type { TimesheetEntry, EntryDetail } from "../../types";

/**
 * Demo data for Table View
 * Structure: Record<personId, Record<dateString, TimesheetEntry>>
 */

// Generate realistic timesheet data for the current week and month
export function generateTableDemoData() {
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const lastWeekStart = subWeeks(currentWeekStart, 1);
  const twoWeeksAgoStart = subWeeks(currentWeekStart, 2);
  const threeWeeksAgoStart = subWeeks(currentWeekStart, 3);

  const entries: Record<string, Record<string, TimesheetEntry>> = {};

  // Helper to create entry
  const createEntry = (
    personId: string,
    date: Date,
    hours: number,
    status: 'draft' | 'submitted' | 'pending' | 'approved' | 'rejected',
    tasks: Array<{ category: string; description: string; hours: number }>
  ) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!entries[personId]) {
      entries[personId] = {};
    }

    const entryDetails: EntryDetail[] = tasks.map((task, idx) => ({
      id: `${personId}-${dateKey}-${idx}`,
      category: task.category,
      description: task.description,
      hours: task.hours,
      startTime: idx === 0 ? '09:00' : undefined,
      endTime: idx === tasks.length - 1 ? '17:00' : undefined,
      breakMinutes: idx === tasks.length - 1 ? 30 : undefined,
      status: status,
      notes: task.description,
    }));

    entries[personId][dateKey] = {
      date: dateKey,
      entries: entryDetails,
    };
  };

  // Sarah Chen - Consistent 8h days, approved last 2 weeks, pending this week
  const sarahId = 'contractor-1';
  
  // 3 weeks ago - approved
  eachDayOfInterval({ start: threeWeeksAgoStart, end: addDays(threeWeeksAgoStart, 4) }).forEach(day => {
    createEntry(sarahId, day, 8, 'approved', [
      { category: 'Development', description: 'Feature implementation', hours: 6 },
      { category: 'Meetings', description: 'Stand-up & planning', hours: 2 },
    ]);
  });

  // 2 weeks ago - approved
  eachDayOfInterval({ start: twoWeeksAgoStart, end: addDays(twoWeeksAgoStart, 4) }).forEach(day => {
    createEntry(sarahId, day, 8, 'approved', [
      { category: 'Development', description: 'API integration', hours: 7 },
      { category: 'Code Review', description: 'PR reviews', hours: 1 },
    ]);
  });

  // Last week - submitted (pending approval)
  eachDayOfInterval({ start: lastWeekStart, end: addDays(lastWeekStart, 4) }).forEach((day, idx) => {
    createEntry(sarahId, day, idx === 2 ? 9 : 8, 'submitted', [
      { category: 'Development', description: 'Component refactoring', hours: idx === 2 ? 7 : 6 },
      { category: 'Testing', description: 'Unit tests', hours: 2 },
    ]);
  });

  // This week - draft
  eachDayOfInterval({ start: currentWeekStart, end: addDays(currentWeekStart, 2) }).forEach(day => {
    createEntry(sarahId, day, 8, 'draft', [
      { category: 'Development', description: 'New features', hours: 6.5 },
      { category: 'Documentation', description: 'API docs', hours: 1.5 },
    ]);
  });

  // Mike Rodriguez - Part-time (6h/day), mix of approved and pending
  const mikeId = 'contractor-2';

  // 3 weeks ago - approved
  eachDayOfInterval({ start: threeWeeksAgoStart, end: addDays(threeWeeksAgoStart, 4) }).forEach(day => {
    createEntry(mikeId, day, 6, 'approved', [
      { category: 'Development', description: 'Frontend work', hours: 6 },
    ]);
  });

  // 2 weeks ago - approved
  eachDayOfInterval({ start: twoWeeksAgoStart, end: addDays(twoWeeksAgoStart, 4) }).forEach(day => {
    createEntry(mikeId, day, 6, 'approved', [
      { category: 'Development', description: 'UI components', hours: 5 },
      { category: 'Meetings', description: 'Client sync', hours: 1 },
    ]);
  });

  // Last week - submitted
  eachDayOfInterval({ start: lastWeekStart, end: addDays(lastWeekStart, 4) }).forEach(day => {
    createEntry(mikeId, day, 6, 'submitted', [
      { category: 'Development', description: 'React components', hours: 5.5 },
      { category: 'Code Review', description: 'PR feedback', hours: 0.5 },
    ]);
  });

  // This week - draft
  eachDayOfInterval({ start: currentWeekStart, end: addDays(currentWeekStart, 2) }).forEach(day => {
    createEntry(mikeId, day, 6, 'draft', [
      { category: 'Development', description: 'Form validation', hours: 6 },
    ]);
  });

  // Emma Wilson - Full-time with occasional overtime
  const emmaId = 'contractor-3';

  // 3 weeks ago - approved
  eachDayOfInterval({ start: threeWeeksAgoStart, end: addDays(threeWeeksAgoStart, 4) }).forEach((day, idx) => {
    const hours = idx === 3 ? 10 : 8; // Overtime on Thursday
    createEntry(emmaId, day, hours, 'approved', [
      { category: 'Development', description: 'Database optimization', hours: hours - 1 },
      { category: 'Meetings', description: 'Team sync', hours: 1 },
    ]);
  });

  // 2 weeks ago - approved
  eachDayOfInterval({ start: twoWeeksAgoStart, end: addDays(twoWeeksAgoStart, 4) }).forEach(day => {
    createEntry(emmaId, day, 8, 'approved', [
      { category: 'Development', description: 'Backend services', hours: 6.5 },
      { category: 'Testing', description: 'Integration tests', hours: 1.5 },
    ]);
  });

  // Last week - submitted
  eachDayOfInterval({ start: lastWeekStart, end: addDays(lastWeekStart, 4) }).forEach((day, idx) => {
    const hours = idx === 4 ? 10 : 8; // Overtime on Friday
    createEntry(emmaId, day, hours, 'submitted', [
      { category: 'Development', description: 'Critical bug fixes', hours: hours - 2 },
      { category: 'Meetings', description: 'Sprint planning', hours: 1 },
      { category: 'Documentation', description: 'Technical specs', hours: 1 },
    ]);
  });

  // This week - draft
  eachDayOfInterval({ start: currentWeekStart, end: addDays(currentWeekStart, 2) }).forEach(day => {
    createEntry(emmaId, day, 8, 'draft', [
      { category: 'Development', description: 'Feature development', hours: 7 },
      { category: 'Code Review', description: 'PR reviews', hours: 1 },
    ]);
  });

  // James Taylor - Variable hours, some rejected entries
  const jamesId = 'contractor-4';

  // 2 weeks ago - mix of approved and rejected
  eachDayOfInterval({ start: twoWeeksAgoStart, end: addDays(twoWeeksAgoStart, 4) }).forEach((day, idx) => {
    createEntry(jamesId, day, idx === 2 ? 12 : 7, idx === 2 ? 'rejected' : 'approved', [
      { category: 'Development', description: 'Infrastructure work', hours: idx === 2 ? 12 : 7 },
    ]);
  });

  // Last week - submitted
  eachDayOfInterval({ start: lastWeekStart, end: addDays(lastWeekStart, 4) }).forEach(day => {
    createEntry(jamesId, day, 7.5, 'submitted', [
      { category: 'Development', description: 'DevOps tasks', hours: 6 },
      { category: 'Meetings', description: 'Architecture review', hours: 1.5 },
    ]);
  });

  // Lisa Anderson - Designer, different hour patterns
  const lisaId = 'contractor-5';

  // 3 weeks ago - approved
  eachDayOfInterval({ start: threeWeeksAgoStart, end: addDays(threeWeeksAgoStart, 4) }).forEach(day => {
    createEntry(lisaId, day, 8, 'approved', [
      { category: 'Design', description: 'UI mockups', hours: 6 },
      { category: 'Meetings', description: 'Design review', hours: 2 },
    ]);
  });

  // 2 weeks ago - approved
  eachDayOfInterval({ start: twoWeeksAgoStart, end: addDays(twoWeeksAgoStart, 4) }).forEach(day => {
    createEntry(lisaId, day, 8, 'approved', [
      { category: 'Design', description: 'User flows', hours: 5 },
      { category: 'Research', description: 'User testing', hours: 3 },
    ]);
  });

  // Last week - submitted
  eachDayOfInterval({ start: lastWeekStart, end: addDays(lastWeekStart, 4) }).forEach(day => {
    createEntry(lisaId, day, 8, 'submitted', [
      { category: 'Design', description: 'Prototype iteration', hours: 7 },
      { category: 'Meetings', description: 'Stakeholder feedback', hours: 1 },
    ]);
  });

  return entries;
}

// Demo people/contractors for the table view
export const demoTablePeople = [
  {
    id: 'contractor-1',
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'Senior Developer',
  },
  {
    id: 'contractor-2',
    name: 'Mike Rodriguez',
    initials: 'MR',
    role: 'Frontend Developer',
  },
  {
    id: 'contractor-3',
    name: 'Emma Wilson',
    initials: 'EW',
    role: 'Full-Stack Engineer',
  },
  {
    id: 'contractor-4',
    name: 'James Taylor',
    initials: 'JT',
    role: 'DevOps Engineer',
  },
  {
    id: 'contractor-5',
    name: 'Lisa Anderson',
    initials: 'LA',
    role: 'UX Designer',
  },
];

// Export demo data as a singleton
export const demoTableEntries = generateTableDemoData();
