import { TimesheetEntry } from '../../utils/api/timesheets';

// Generate demo timesheet entries for testing
export function generateDemoTimesheets(companyId: string): TimesheetEntry[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Helper to create date strings
  const getDate = (dayOffset: number) => {
    const date = new Date(currentYear, currentMonth, dayOffset);
    return date.toISOString().split('T')[0];
  };

  const entries: TimesheetEntry[] = [];

  // Sarah Chen - Full-time, submitted this week
  const sarahId = 'user-sarah-chen';
  for (let day = 1; day <= 5; day++) {
    entries.push({
      id: `sarah-${day}`,
      userId: sarahId,
      companyId,
      date: getDate(day),
      hours: 8,
      status: day <= 5 ? 'submitted' : 'draft',
      projectId: 'project-alpha',
      notes: 'Working on Project Alpha features',
      updatedAt: new Date().toISOString()
    });
  }

  // Mike Johnson - Part-time, submitted this week
  const mikeId = 'user-mike-johnson';
  for (let day = 1; day <= 5; day++) {
    entries.push({
      id: `mike-${day}`,
      userId: mikeId,
      companyId,
      date: getDate(day),
      hours: 6,
      status: 'submitted',
      projectId: 'project-beta',
      notes: 'Frontend development',
      updatedAt: new Date().toISOString()
    });
  }

  // Emma Davis - Full-time with overtime, submitted
  const emmaId = 'user-emma-davis';
  for (let day = 1; day <= 5; day++) {
    entries.push({
      id: `emma-${day}`,
      userId: emmaId,
      companyId,
      date: getDate(day),
      hours: day === 3 ? 10 : 8, // Overtime on Wednesday
      status: 'submitted',
      projectId: 'project-alpha',
      notes: day === 3 ? 'Overtime for urgent bug fixes' : 'Regular development work',
      updatedAt: new Date().toISOString()
    });
  }

  // Tom Martinez - Already approved last week
  const tomId = 'user-tom-martinez';
  for (let day = -6; day <= -2; day++) {
    entries.push({
      id: `tom-${day}`,
      userId: tomId,
      companyId,
      date: getDate(day),
      hours: 8,
      status: 'approved',
      projectId: 'project-gamma',
      notes: 'Backend API development',
      updatedAt: new Date().toISOString()
    });
  }

  // Lisa Wang - Draft (not ready for approval)
  const lisaId = 'user-lisa-wang';
  for (let day = 1; day <= 3; day++) {
    entries.push({
      id: `lisa-${day}`,
      userId: lisaId,
      companyId,
      date: getDate(day),
      hours: 7,
      status: 'draft',
      projectId: 'project-beta',
      notes: 'UI/UX design work',
      updatedAt: new Date().toISOString()
    });
  }

  // Alex Martinez - Rejected (needs revision)
  const alexId = 'user-alex-martinez';
  for (let day = 1; day <= 5; day++) {
    entries.push({
      id: `alex-${day}`,
      userId: alexId,
      companyId,
      date: getDate(day),
      hours: 12, // Too many hours!
      status: 'rejected',
      projectId: 'project-alpha',
      notes: 'Rejected: Hours exceed approved budget. Please adjust to 8h/day.',
      updatedAt: new Date().toISOString()
    });
  }

  // Rachel Kim - Submitted last week
  const rachelId = 'user-rachel-kim';
  for (let day = -6; day <= -2; day++) {
    entries.push({
      id: `rachel-${day}`,
      userId: rachelId,
      companyId,
      date: getDate(day),
      hours: 8,
      status: 'submitted',
      projectId: 'project-gamma',
      notes: 'QA testing',
      updatedAt: new Date().toISOString()
    });
  }

  // David Park - Part-time, submitted
  const davidId = 'user-david-park';
  for (let day = 1; day <= 5; day++) {
    entries.push({
      id: `david-${day}`,
      userId: davidId,
      companyId,
      date: getDate(day),
      hours: 4,
      status: 'submitted',
      projectId: 'project-beta',
      notes: 'Part-time contract work',
      updatedAt: new Date().toISOString()
    });
  }

  return entries;
}

// User profiles for demo
export const demoUsers = {
  'user-sarah-chen': { name: 'Sarah Chen', role: 'Senior Engineer', hourlyRate: 75 },
  'user-mike-johnson': { name: 'Mike Johnson', role: 'Frontend Developer', hourlyRate: 65 },
  'user-emma-davis': { name: 'Emma Davis', role: 'Full-Stack Developer', hourlyRate: 70 },
  'user-tom-martinez': { name: 'Tom Martinez', role: 'Backend Engineer', hourlyRate: 80 },
  'user-lisa-wang': { name: 'Lisa Wang', role: 'UI/UX Designer', hourlyRate: 60 },
  'user-alex-martinez': { name: 'Alex Martinez', role: 'Tech Lead', hourlyRate: 90 },
  'user-rachel-kim': { name: 'Rachel Kim', role: 'QA Engineer', hourlyRate: 55 },
  'user-david-park': { name: 'David Park', role: 'Consultant', hourlyRate: 85 },
};

export function getDemoUserName(userId: string): string {
  return demoUsers[userId as keyof typeof demoUsers]?.name || userId;
}

export function getDemoUserRole(userId: string): string {
  return demoUsers[userId as keyof typeof demoUsers]?.role || 'Contractor';
}

export function getDemoUserRate(userId: string): number {
  return demoUsers[userId as keyof typeof demoUsers]?.hourlyRate || 75;
}
