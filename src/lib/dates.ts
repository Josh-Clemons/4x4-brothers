/**
 * Format an ISO date string (YYYY-MM-DD) as e.g. "May 22, 2026".
 * Parses as a local date to avoid the UTC-offset day shift.
 */
export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

/** Like formatDate, without the year — e.g. "May 22". */
export function formatDateShort(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric',
  })
}
