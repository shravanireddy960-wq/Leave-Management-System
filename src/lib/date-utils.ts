/**
 * Precision Indian Standard Time (IST - Asia/Kolkata, UTC+05:30) date & time utilities
 */

export function isValid(date: any): boolean {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }
  if (typeof date === "string" || typeof date === "number") {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }
  return false;
}

export function parseISO(dateString: string): Date {
  if (!dateString) return new Date(NaN);
  // Support YYYY-MM-DD cleanly without timezone offset drift
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString.trim())) {
    const [y, m, d] = dateString.trim().split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dateString);
}

export interface ISTDateParts {
  year: number;
  month: number; // 0-11
  day: number; // 1-31
  hours: number; // 0-23
  minutes: number;
  seconds: number;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
}

/**
 * Extracts date & time components strictly calibrated in Indian Standard Time (IST - UTC+05:30).
 */
export function getISTParts(input: Date | string | number | null | undefined): ISTDateParts | null {
  if (!input) return null;

  // Pure calendar date strings like YYYY-MM-DD without time component
  if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.trim())) {
    const [y, m, d] = input.trim().split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return {
      year: y,
      month: m - 1,
      day: d,
      hours: 0,
      minutes: 0,
      seconds: 0,
      dayOfWeek: dateObj.getDay(),
    };
  }

  const dateObj = input instanceof Date ? input : new Date(input);
  if (!isValid(dateObj)) return null;

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    const parts = formatter.formatToParts(dateObj);
    const map: Record<string, string> = {};
    for (const p of parts) map[p.type] = p.value;

    const y = parseInt(map.year, 10);
    const m = parseInt(map.month, 10) - 1;
    const d = parseInt(map.day, 10);
    let h = parseInt(map.hour, 10);
    if (h === 24) h = 0;
    const min = parseInt(map.minute, 10);
    const sec = parseInt(map.second, 10);

    const dayShortMap: Record<string, number> = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
    };
    const dayOfWeek = dayShortMap[map.weekday] ?? 0;

    return { year: y, month: m, day: d, hours: h, minutes: min, seconds: sec, dayOfWeek };
  } catch {
    return {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth(),
      day: dateObj.getDate(),
      hours: dateObj.getHours(),
      minutes: dateObj.getMinutes(),
      seconds: dateObj.getSeconds(),
      dayOfWeek: dateObj.getDay(),
    };
  }
}

/**
 * Returns current date and time strictly in IST
 */
export function getCurrentISTParts(): ISTDateParts {
  return getISTParts(new Date()) || {
    year: 2026,
    month: 10,
    day: 9,
    hours: 12,
    minutes: 0,
    seconds: 0,
    dayOfWeek: 1,
  };
}

/**
 * Returns current IST date as YYYY-MM-DD
 */
export function getCurrentISTDateString(): string {
  const ist = getCurrentISTParts();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${ist.year}-${pad(ist.month + 1)}-${pad(ist.day)}`;
}

/**
 * Returns dynamic greeting based on current hour in IST
 */
export function getISTGreeting(): string {
  const ist = getCurrentISTParts();
  const h = ist.hours;
  if (h >= 4 && h < 12) return "Good Morning";
  if (h >= 12 && h < 17) return "Good Afternoon";
  return "Good Evening";
}

/**
 * Returns formatted live time in IST e.g. "12:45 PM IST"
 */
export function getCurrentISTTimeString(): string {
  const ist = getCurrentISTParts();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const h12 = ist.hours % 12 || 12;
  const ampm = ist.hours >= 12 ? "PM" : "AM";
  return `${pad(h12)}:${pad(ist.minutes)} ${ampm} IST`;
}

export function isWeekend(date: Date | string): boolean {
  const ist = getISTParts(date);
  if (!ist) return false;
  return ist.dayOfWeek === 0 || ist.dayOfWeek === 6; // Sunday or Saturday
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Formats any Date or timestamp string accurately into Indian Standard Time (IST).
 */
export function format(date: Date | string | number, formatStr: string): string {
  const ist = getISTParts(date);
  if (!ist) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");

  const tokens: Record<string, string> = {
    yyyy: ist.year.toString(),
    yy: ist.year.toString().slice(-2),
    MMMM: MONTH_NAMES[ist.month],
    MMM: MONTH_SHORT[ist.month],
    MM: pad(ist.month + 1),
    M: (ist.month + 1).toString(),
    dd: pad(ist.day),
    d: ist.day.toString(),
    EEEE: DAY_NAMES[ist.dayOfWeek],
    EEE: DAY_SHORT[ist.dayOfWeek],
    HH: pad(ist.hours),
    H: ist.hours.toString(),
    hh: pad(ist.hours % 12 || 12),
    h: (ist.hours % 12 || 12).toString(),
    mm: pad(ist.minutes),
    m: ist.minutes.toString(),
    ss: pad(ist.seconds),
    s: ist.seconds.toString(),
    a: ist.hours >= 12 ? "PM" : "AM",
  };

  // Safe token replacement to prevent nested replacement collisions (e.g. 'a' in 'Monday')
  return formatStr.replace(
    /yyyy|yy|MMMM|MMM|MM|\bM\b|dd|\bd\b|EEEE|EEE|HH|\bH\b|hh|\bh\b|mm|\bm\b|ss|\bs\b|\ba\b/g,
    (m) => tokens[m] ?? m
  );
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}

export function subMonths(date: Date, amount: number): Date {
  return addMonths(date, -amount);
}

export function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfWeek(date: Date, options?: { weekStartsOn?: number }): Date {
  const weekStartsOn = options?.weekStartsOn ?? 0; // 0 = Sunday
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfWeek(date: Date, options?: { weekStartsOn?: number }): Date {
  const d = startOfWeek(date, options);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function eachDayOfInterval({ start, end }: { start: Date; end: Date }): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  const endTime = new Date(end).setHours(0, 0, 0, 0);

  while (current.getTime() <= endTime) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function isSameMonth(dateLeft: Date, dateRight: Date): boolean {
  const istLeft = getISTParts(dateLeft);
  const istRight = getISTParts(dateRight);
  if (!istLeft || !istRight) return false;
  return istLeft.year === istRight.year && istLeft.month === istRight.month;
}

export function isSameDay(dateLeft: Date, dateRight: Date): boolean {
  const istLeft = getISTParts(dateLeft);
  const istRight = getISTParts(dateRight);
  if (!istLeft || !istRight) return false;
  return (
    istLeft.year === istRight.year &&
    istLeft.month === istRight.month &&
    istLeft.day === istRight.day
  );
}

export function isToday(date: Date | string): boolean {
  const istDate = getISTParts(date);
  const istNow = getCurrentISTParts();
  if (!istDate) return false;
  return (
    istDate.year === istNow.year &&
    istDate.month === istNow.month &&
    istDate.day === istNow.day
  );
}
