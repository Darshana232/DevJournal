import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
  startOfDay,
  differenceInDays,
  eachDayOfInterval,
  subDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from 'date-fns';

/** Format a date for display in entry cards */
export const formatEntryDate = (date) => {
  const d = date instanceof Date ? date : parseISO(date);
  if (isToday(d)) return `Today · ${format(d, 'h:mm a')}`;
  if (isYesterday(d)) return `Yesterday · ${format(d, 'h:mm a')}`;
  return format(d, 'MMM d, yyyy');
};

/** Format a date for page headers */
export const formatPageDate = (date) => {
  const d = date instanceof Date ? date : parseISO(date);
  return format(d, 'EEEE, MMMM d');
};

/** Relative time (e.g. "3 hours ago") */
export const timeAgo = (date) => {
  const d = date instanceof Date ? date : parseISO(date);
  return formatDistanceToNow(d, { addSuffix: true });
};

/** Auto-generate entry title from date */
export const generateEntryTitle = (date = new Date()) => {
  return `Entry · ${format(date, 'MMM d')}`;
};

/** Format a timestamp for AI insight panels */
export const formatInsightTimestamp = (date) => {
  const d = date instanceof Date ? date : parseISO(date);
  return format(d, "MMM d 'at' h:mm a");
};

/** Get start of today as Date */
export const todayStart = () => startOfDay(new Date());

/** Get last N days as array of Date objects */
export const getLastNDays = (n = 30) => {
  const end = new Date();
  const start = subDays(end, n - 1);
  return eachDayOfInterval({ start, end });
};

/** Get last 12 weeks as array of weeks (each week = array of days) */
export const getLast12Weeks = () => {
  const end = new Date();
  const start = subDays(end, 83); // ~12 weeks
  const days = eachDayOfInterval({ start, end });
  const weeks = [];
  let week = [];
  days.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) weeks.push(week);
  return weeks;
};

/** Check if two dates are the same calendar day */
export const isSameCalendarDay = (a, b) => {
  const da = a instanceof Date ? a : parseISO(a);
  const db = b instanceof Date ? b : parseISO(b);
  return isSameDay(da, db);
};

/** Get difference in days between two dates */
export const daysBetween = (a, b) => {
  const da = a instanceof Date ? a : parseISO(a);
  const db = b instanceof Date ? b : parseISO(b);
  return Math.abs(differenceInDays(da, db));
};

/** Format date for Firestore storage (ISO string) */
export const toISO = (date = new Date()) => {
  const d = date instanceof Date ? date : parseISO(date);
  return d.toISOString();
};

/** Get current week range label */
export const currentWeekLabel = () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
};
