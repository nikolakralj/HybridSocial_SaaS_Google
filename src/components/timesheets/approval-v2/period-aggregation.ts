/**
 * Utility functions for aggregating weekly timesheet periods into monthly summaries
 */

import type { TimesheetPeriod, ApprovalStatus } from './demo-data-multi-party';

export interface MonthlyPeriodSummary {
  month: string; // Format: "Oct"
  year: number;
  periods: TimesheetPeriod[]; // All weeks in this month
}

/**
 * Aggregate weekly periods into monthly summaries
 */
export function aggregatePeriodsIntoMonths(
  periods: TimesheetPeriod[]
): MonthlyPeriodSummary[] {
  // Group periods by month
  const monthlyGroups = new Map<string, TimesheetPeriod[]>();
  
  periods.forEach(period => {
    // Extract year-month from the week start date
    const weekStart = new Date(period.weekStartDate);
    const year = weekStart.getFullYear();
    const month = weekStart.toLocaleDateString('en-US', { month: 'short' });
    const monthKey = `${year}-${month}`;
    
    if (!monthlyGroups.has(monthKey)) {
      monthlyGroups.set(monthKey, []);
    }
    monthlyGroups.get(monthKey)!.push(period);
  });
  
  // Create monthly summaries
  const monthlySummaries: MonthlyPeriodSummary[] = [];
  
  monthlyGroups.forEach((weeklyPeriods, monthKey) => {
    const [yearStr, month] = monthKey.split('-');
    const year = parseInt(yearStr);
    
    // Sort periods by week start date
    const sortedPeriods = weeklyPeriods.sort((a, b) => 
      new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime()
    );
    
    monthlySummaries.push({
      month,
      year,
      periods: sortedPeriods,
    });
  });
  
  // Sort by year and month (most recent first)
  return monthlySummaries.sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
  });
}

/**
 * Format month for display (e.g., "Oct 2025")
 */
export function formatMonth(month: string, year: number): string {
  return `${month} ${year}`;
}

/**
 * Get date range string for month (e.g., "Oct 1 - Oct 31")
 */
export function getMonthDateRange(month: string, year: number): string {
  // Map month name to month number
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = monthOrder.indexOf(month);
  
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  
  const startStr = firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return `${startStr} - ${endStr}`;
}