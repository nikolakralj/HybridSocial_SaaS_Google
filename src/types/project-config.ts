/**
 * Project-Level Configuration Types
 * 
 * These settings control how timesheets work for a specific project.
 * Different clients have different requirements.
 */

/**
 * Timesheet Entry Mode
 * 
 * HOURS_ONLY: Contractors only enter total hours (e.g., "8h")
 *   - Simple, fast entry
 *   - No clock-in/out tracking
 *   - Good for: Fixed-rate projects, salaried contractors
 * 
 * TIME_TRACKING: Contractors enter start time, end time, breaks
 *   - Detailed time tracking
 *   - Automatically calculates hours
 *   - Good for: Hourly contractors, compliance requirements
 * 
 * FLEXIBLE: User can choose either method per entry
 *   - Most flexible but potentially confusing
 *   - Default mode
 */
export type TimesheetEntryMode = 'hours_only' | 'time_tracking' | 'flexible';

/**
 * Timesheet Configuration
 * 
 * Project-level settings that control timesheet behavior.
 * These should be set when creating/configuring a project.
 */
export interface TimesheetConfig {
  /** Entry mode - how contractors enter time */
  entryMode: TimesheetEntryMode;
  
  /** Require task descriptions for each entry */
  requireTaskDescriptions: boolean;
  
  /** Require PDF timesheet upload at end of period */
  requireSignedTimesheet: boolean;
  
  /** Allow contractors to edit after submission */
  allowEditAfterSubmit: boolean;
  
  /** Default break duration in minutes (for time_tracking mode) */
  defaultBreakMinutes: number;
  
  /** Default start time (for time_tracking mode) */
  defaultStartTime: string; // e.g., "09:00"
  
  /** Default end time (for time_tracking mode) */
  defaultEndTime: string; // e.g., "17:00"
  
  /** Approval levels (1-3) */
  approvalLevels: 1 | 2 | 3;
  
  /** Invoice frequency */
  invoiceFrequency: 'weekly' | 'biweekly' | 'monthly';
}

/**
 * Default Timesheet Configuration
 * 
 * Used when creating a new project without specific settings.
 */
export const DEFAULT_TIMESHEET_CONFIG: TimesheetConfig = {
  entryMode: 'flexible', // Let users choose
  requireTaskDescriptions: true,
  requireSignedTimesheet: true, // Based on your use case
  allowEditAfterSubmit: false,
  defaultBreakMinutes: 30,
  defaultStartTime: '09:00',
  defaultEndTime: '17:00',
  approvalLevels: 1,
  invoiceFrequency: 'monthly',
};

/**
 * Example Configurations for Different Use Cases
 */

export const SIMPLE_HOURLY_CONFIG: TimesheetConfig = {
  entryMode: 'hours_only',
  requireTaskDescriptions: false,
  requireSignedTimesheet: false,
  allowEditAfterSubmit: true,
  defaultBreakMinutes: 0,
  defaultStartTime: '09:00',
  defaultEndTime: '17:00',
  approvalLevels: 1,
  invoiceFrequency: 'monthly',
};

export const DETAILED_COMPLIANCE_CONFIG: TimesheetConfig = {
  entryMode: 'time_tracking',
  requireTaskDescriptions: true,
  requireSignedTimesheet: true,
  allowEditAfterSubmit: false,
  defaultBreakMinutes: 30,
  defaultStartTime: '09:00',
  defaultEndTime: '17:00',
  approvalLevels: 3,
  invoiceFrequency: 'monthly',
};
