declare module "date-fns" {
  export function format(date: Date | number, formatStr: string): string;
  export function parseISO(dateString: string): Date;
  export function isValid(date: any): boolean;
  export function eachDayOfInterval(interval: { start: Date; end: Date }): Date[];
  export function isWeekend(date: Date): boolean;
  export function addMonths(date: Date, amount: number): Date;
  export function subMonths(date: Date, amount: number): Date;
  export function startOfMonth(date: Date): Date;
  export function endOfMonth(date: Date): Date;
  export function startOfWeek(date: Date): Date;
  export function endOfWeek(date: Date): Date;
  export function isSameMonth(dateLeft: Date, dateRight: Date): boolean;
  export function isSameDay(dateLeft: Date, dateRight: Date): boolean;
  export function isToday(date: Date): boolean;
}
