import { eachDayOfInterval, isWeekend, format, parseISO, isValid } from "./date-utils";
import type { Holiday } from "@/types/database";

export interface WorkingDaysCalculation {
  workingDays: number;
  totalDays: number;
  weekendDaysCount: number;
  holidaysCount: number;
  holidayNames: string[];
  datesList: string[];
}

/**
 * Calculates working days between start and end date inclusive,
 * subtracting weekends and official holidays.
 */
export function calculateLeaveDays(
  startDateStr: string,
  endDateStr: string,
  holidays: Holiday[] = [],
  isHalfDay: boolean = false,
  excludeWeekends: boolean = true
): WorkingDaysCalculation {
  if (!startDateStr || !endDateStr) {
    return {
      workingDays: 0,
      totalDays: 0,
      weekendDaysCount: 0,
      holidaysCount: 0,
      holidayNames: [],
      datesList: [],
    };
  }

  const startDate = parseISO(startDateStr);
  const endDate = parseISO(endDateStr);

  if (!isValid(startDate) || !isValid(endDate) || startDate > endDate) {
    return {
      workingDays: 0,
      totalDays: 0,
      weekendDaysCount: 0,
      holidaysCount: 0,
      holidayNames: [],
      datesList: [],
    };
  }

  if (isHalfDay) {
    return {
      workingDays: 0.5,
      totalDays: 1,
      weekendDaysCount: 0,
      holidaysCount: 0,
      holidayNames: [],
      datesList: [format(startDate, "yyyy-MM-dd")],
    };
  }

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const holidayDateMap = new Map<string, string>();
  for (const h of holidays) {
    holidayDateMap.set(h.date, h.name);
  }

  let weekendDaysCount = 0;
  let holidaysCount = 0;
  const holidayNames: string[] = [];
  const datesList: string[] = [];

  for (const day of allDays) {
    const dateStr = format(day, "yyyy-MM-dd");
    const isWknd = excludeWeekends && isWeekend(day);
    const holidayName = holidayDateMap.get(dateStr);

    if (isWknd) {
      weekendDaysCount++;
    } else if (holidayName) {
      holidaysCount++;
      holidayNames.push(`${holidayName} (${dateStr})`);
    } else {
      datesList.push(dateStr);
    }
  }

  const workingDays = Math.max(0, allDays.length - weekendDaysCount - holidaysCount);

  return {
    workingDays,
    totalDays: allDays.length,
    weekendDaysCount,
    holidaysCount,
    holidayNames,
    datesList,
  };
}

/**
 * Check if the candidate date range overlaps with any existing pending/approved requests.
 */
export function hasOverlappingLeave(
  candidateStart: string,
  candidateEnd: string,
  existingRequests: Array<{ start_date: string; end_date: string; status: string; id?: string }>,
  excludeRequestId?: string
): boolean {
  const cStart = parseISO(candidateStart);
  const cEnd = parseISO(candidateEnd);

  for (const req of existingRequests) {
    if (excludeRequestId && req.id === excludeRequestId) continue;
    if (req.status !== "pending" && req.status !== "approved") continue;

    const rStart = parseISO(req.start_date);
    const rEnd = parseISO(req.end_date);

    // Overlap condition: NOT (cEnd < rStart OR cStart > rEnd)
    if (cStart <= rEnd && cEnd >= rStart) {
      return true;
    }
  }

  return false;
}
