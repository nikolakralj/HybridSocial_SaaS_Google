import type { TimesheetStatus } from "./PersonPeriodCard";

// Demo data for comprehensive approval system

export interface DemoTimesheetEntry {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  hours: number;
  task?: string;
  category?: string;
  notes?: string;
  status: TimesheetStatus;
}

export interface DemoDayGroup {
  date: Date;
  entries: DemoTimesheetEntry[];
  totalHours: number;
  isWeekend: boolean;
  isHoliday: boolean;
  status: TimesheetStatus;
}

export interface DemoPerson {
  id: string;
  name: string;
  initials: string;
  role: string;
  company?: string;
}

export interface DemoContract {
  id: string;
  rate: number;
  currency: string;
  dailyCap?: number;
  weeklyCap?: number;
  monthlyCap?: number;
  validFrom: Date;
  validTo: Date;
  poNumber?: string;
  costCenter?: string;
}

export interface DemoAuditEntry {
  id: string;
  action: "submit" | "approve" | "reject" | "request-changes" | "recall" | "amend";
  byUser: string;
  byUserRole: string;
  at: Date;
  comment?: string;
}

export interface DemoTimesheetPeriod {
  id: string;
  personId: string;
  periodStart: Date;
  periodEnd: Date;
  totalHours: number;
  overtimeHours: number;
  estimatedCost: number;
  status: TimesheetStatus;
  submittedAt?: Date;
  dueAt: Date;
  flags: {
    hasWeekend?: boolean;
    hasHoliday?: boolean;
    overDailyLimit?: boolean;
    missingTasks?: boolean;
    outsideContract?: boolean;
  };
  dayGroups: DemoDayGroup[];
  contractId: string;
  auditTrail: DemoAuditEntry[];
}

// People
export const demoPeople: DemoPerson[] = [
  { id: "sarah-1", name: "Sarah Chen", initials: "SC", role: "Senior Developer" },
  { id: "mike-2", name: "Mike Johnson", initials: "MJ", role: "Developer" },
  { id: "emma-3", name: "Emma Davis", initials: "ED", role: "Designer", company: "CreativeLab" },
  { id: "tom-4", name: "Tom Martinez", initials: "TM", role: "QA Engineer", company: "Acme Corp" },
  { id: "lisa-5", name: "Lisa Park", initials: "LP", role: "Developer", company: "Acme Corp" },
  { id: "james-6", name: "James Wilson", initials: "JW", role: "DevOps Engineer", company: "TechStaff Inc" },
  { id: "alex-7", name: "Alex Kim", initials: "AK", role: "Developer", company: "TechStaff Inc" },
  { id: "jordan-8", name: "Jordan Lee", initials: "JL", role: "PM", company: "TechStaff Inc" },
];

// Contracts
export const demoContracts: DemoContract[] = [
  {
    id: "contract-1",
    rate: 95,
    currency: "USD",
    dailyCap: 8,
    weeklyCap: 40,
    monthlyCap: 160,
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2025-12-31"),
    poNumber: "PO-2025-001",
    costCenter: "ENG-001",
  },
  {
    id: "contract-2",
    rate: 85,
    currency: "USD",
    dailyCap: 8,
    weeklyCap: 40,
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2025-06-30"),
    poNumber: "PO-2025-002",
  },
  {
    id: "contract-3",
    rate: 120,
    currency: "USD",
    dailyCap: 10,
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2025-12-31"),
  },
];

// Helper to create demo entries
function createDayEntries(date: Date, hours: number, hasTask: boolean = true): DemoTimesheetEntry[] {
  return [
    {
      id: `entry-${date.toISOString()}-1`,
      date,
      startTime: "09:00",
      endTime: "17:00",
      breakMinutes: 60,
      hours: hours,
      task: hasTask ? "Feature development" : undefined,
      category: "Development",
      notes: hours > 8 ? "Overtime for critical release" : undefined,
      status: "submitted" as TimesheetStatus,
    },
  ];
}

// Create demo timesheet periods
const now = new Date();
const weekStart = new Date(now);
weekStart.setDate(now.getDate() - now.getDay()); // Start of this week

export const demoTimesheetPeriods: DemoTimesheetPeriod[] = [
  // Sarah Chen - Submitted, due soon
  {
    id: "period-1",
    personId: "sarah-1",
    periodStart: new Date(weekStart),
    periodEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
    totalHours: 38.5,
    overtimeHours: 0,
    estimatedCost: 3657.5,
    status: "submitted",
    submittedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    dueAt: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours from now
    flags: {},
    contractId: "contract-1",
    dayGroups: [
      {
        date: new Date(weekStart),
        entries: createDayEntries(new Date(weekStart), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() + 1 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 1 * 24 * 60 * 60 * 1000), 7.5),
        totalHours: 7.5,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 3 * 24 * 60 * 1000), 7.5),
        totalHours: 7.5,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000), 7.5),
        totalHours: 7.5,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
    ],
    auditTrail: [
      {
        id: "audit-1",
        action: "submit",
        byUser: "Sarah Chen",
        byUserRole: "Contributor",
        at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        comment: "Week of Oct 20 - standard hours",
      },
    ],
  },

  // Mike Johnson - Submitted with flags
  {
    id: "period-2",
    personId: "mike-2",
    periodStart: new Date(weekStart),
    periodEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
    totalHours: 42,
    overtimeHours: 2,
    estimatedCost: 3990,
    status: "submitted",
    submittedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    dueAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
    flags: {
      hasWeekend: true,
      overDailyLimit: true,
      missingTasks: true,
    },
    contractId: "contract-1",
    dayGroups: [
      {
        date: new Date(weekStart),
        entries: createDayEntries(new Date(weekStart), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() + 1 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 1 * 24 * 60 * 60 * 1000), 10),
        totalHours: 10,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000), 8, false), // Missing task
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() + 5 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 5 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: true,
        isHoliday: false,
        status: "submitted",
      },
    ],
    auditTrail: [
      {
        id: "audit-2",
        action: "submit",
        byUser: "Mike Johnson",
        byUserRole: "Contributor",
        at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        comment: "Includes weekend work for release deadline",
      },
    ],
  },

  // Emma Davis - Overdue
  {
    id: "period-3",
    personId: "emma-3",
    periodStart: new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000), // Last week
    periodEnd: new Date(weekStart.getTime() - 1 * 24 * 60 * 60 * 1000),
    totalHours: 40,
    overtimeHours: 0,
    estimatedCost: 3400,
    status: "submitted",
    submittedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    dueAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Overdue
    flags: {},
    contractId: "contract-2",
    dayGroups: [
      {
        date: new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() - 6 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() - 6 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() - 5 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() - 5 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() - 4 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() - 4 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() - 3 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() - 3 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
    ],
    auditTrail: [
      {
        id: "audit-3",
        action: "submit",
        byUser: "Emma Davis",
        byUserRole: "Contributor",
        at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
  },

  // Tom Martinez - Amended (previously approved, edited)
  {
    id: "period-4",
    personId: "tom-4",
    periodStart: new Date(weekStart.getTime() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    periodEnd: new Date(weekStart.getTime() - 8 * 24 * 60 * 60 * 1000),
    totalHours: 41,
    overtimeHours: 1,
    estimatedCost: 3895,
    status: "amended",
    submittedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    dueAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
    flags: {},
    contractId: "contract-1",
    dayGroups: [
      {
        date: new Date(weekStart.getTime() - 14 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() - 14 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() - 13 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() - 13 * 24 * 60 * 60 * 1000), 9),
        totalHours: 9,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() - 12 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() - 12 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() - 11 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() - 11 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() - 10 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() - 10 * 24 * 60 * 60 * 1000), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
    ],
    auditTrail: [
      {
        id: "audit-4a",
        action: "submit",
        byUser: "Tom Martinez",
        byUserRole: "Contributor",
        at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "audit-4b",
        action: "approve",
        byUser: "Jane Smith",
        byUserRole: "Project Approver",
        at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        comment: "Approved for Oct 7-13 period",
      },
      {
        id: "audit-4c",
        action: "amend",
        byUser: "Tom Martinez",
        byUserRole: "Contributor",
        at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        comment: "Added 1 hour for Tuesday - forgot to log",
      },
    ],
  },

  // Lisa Park - Partial approval
  {
    id: "period-5",
    personId: "lisa-5",
    periodStart: new Date(weekStart),
    periodEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
    totalHours: 36,
    overtimeHours: 0,
    estimatedCost: 3420,
    status: "partial",
    submittedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    dueAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
    flags: {},
    contractId: "contract-1",
    dayGroups: [
      {
        date: new Date(weekStart),
        entries: createDayEntries(new Date(weekStart), 8),
        totalHours: 8,
        isWeekend: false,
        isHoliday: false,
        status: "approved",
      },
      {
        date: new Date(weekStart.getTime() + 1 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 1 * 24 * 60 * 60 * 1000), 7),
        totalHours: 7,
        isWeekend: false,
        isHoliday: false,
        status: "approved",
      },
      {
        date: new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000), 7),
        totalHours: 7,
        isWeekend: false,
        isHoliday: false,
        status: "approved",
      },
      {
        date: new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000), 7),
        totalHours: 7,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
      {
        date: new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000),
        entries: createDayEntries(new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000), 7),
        totalHours: 7,
        isWeekend: false,
        isHoliday: false,
        status: "submitted",
      },
    ],
    auditTrail: [
      {
        id: "audit-5a",
        action: "submit",
        byUser: "Lisa Park",
        byUserRole: "Contributor",
        at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "audit-5b",
        action: "approve",
        byUser: "Jane Smith",
        byUserRole: "Project Approver",
        at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        comment: "Approved Mon-Wed, reviewing remaining days",
      },
    ],
  },
];

// Quick filters
export const demoQuickFilters = [
  { type: "team" as const, id: "team-eng", name: "Engineering", count: 5 },
  { type: "team" as const, id: "team-design", name: "Design", count: 1 },
  { type: "team" as const, id: "team-qa", name: "QA", count: 1 },
  { type: "agency" as const, id: "agency-creative", name: "CreativeLab", count: 1 },
  { type: "agency" as const, id: "agency-tech", name: "TechStaff Inc", count: 3 },
  { type: "company" as const, id: "company-acme", name: "Acme Corp", count: 2 },
];

// Queue counts
export const demoQueueCounts = {
  submitted: 3,
  amended: 1,
  dueSoon: 2,
  overdue: 1,
};
