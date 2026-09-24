const LOCALE = 'en-US';

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const numberFormatter = new Intl.NumberFormat(LOCALE, { notation: 'compact' });
const relativeFormatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
}

/** Compact counts: 1200 -> "1.2K", so card metrics never wrap. */
export function formatCount(value) {
  return numberFormatter.format(Number(value) || 0);
}

const RELATIVE_UNITS = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
];

/** "3 days ago" / "just now", via Intl so the wording stays idiomatic. */
export function formatRelativeTime(value) {
  if (!value) return '';
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return '';

  const elapsed = Date.now() - timestamp;
  if (elapsed < 60_000) return 'just now';

  for (const [unit, ms] of RELATIVE_UNITS) {
    const amount = Math.floor(elapsed / ms);
    if (amount >= 1) return relativeFormatter.format(-amount, unit);
  }
  return 'just now';
}
