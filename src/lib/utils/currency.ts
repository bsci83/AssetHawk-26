/**
 * Currency utilities for converting between dollar amounts and integer cents.
 * All monetary values are stored as integer cents in the database
 * to avoid floating-point precision errors.
 */

/** Convert a dollar amount (e.g., from Plaid) to integer cents for storage. */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/** Convert integer cents to a dollar amount for calculations. */
export function toDollars(cents: number): number {
  return cents / 100;
}

/** Format integer cents as a USD currency string (e.g., "$1,234.56"). */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(toDollars(cents));
}

/** Format integer cents as a compact USD string (e.g., "$1.2K"). */
export function formatCurrencyCompact(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
  }).format(toDollars(cents));
}
