/**
 * Date utilities for financial period calculations and display formatting.
 */

/** Format a date string as "Mar 28, 2026". */
export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Format a date string as "Mar 28" (no year). */
export function formatDateShort(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/** Get today's date as YYYY-MM-DD. */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/** Get a date N days from now as YYYY-MM-DD. */
export function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

/** Get a date N days ago as YYYY-MM-DD. */
export function daysAgo(n: number): string {
  return daysFromNow(-n);
}

/** Get the first day of the current month as YYYY-MM-DD. */
export function startOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

/** Get the last day of the current month as YYYY-MM-DD. */
export function endOfMonth(): string {
  const d = new Date();
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}

/** Calculate the number of days between two YYYY-MM-DD date strings. */
export function daysBetween(start: string, end: string): number {
  const ms = new Date(end + 'T00:00:00').getTime() - new Date(start + 'T00:00:00').getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/** Get the first day of a specific month as YYYY-MM-DD. */
export function startOfMonthFor(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}-01`;
}

/** Get the last day of a specific month as YYYY-MM-DD. */
export function endOfMonthFor(year: number, month: number): string {
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}
