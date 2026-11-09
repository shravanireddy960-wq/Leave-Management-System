"use client";

import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isWeekend,
  parseISO,
} from "@/lib/date-utils";
import type { LeaveRequest, Holiday, LeaveType } from "@/types/database";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle2,
  Clock,
  Landmark,
  X,
  UserCheck,
} from "lucide-react";

interface LeaveCalendarViewProps {
  requests: LeaveRequest[];
  holidays: Holiday[];
  leaveTypes: LeaveType[];
}

export function LeaveCalendarView({ requests, holidays, leaveTypes }: LeaveCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // Default to Nov 2025 where seed data is concentrated
  const [selectedDayInfo, setSelectedDayInfo] = useState<{
    date: Date;
    holidays: Holiday[];
    leaves: LeaveRequest[];
  } | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");

    // Holidays
    const dayHolidays = holidays.filter((h) => h.date === dayStr);

    // Leaves
    const dayLeaves = requests.filter((r) => {
      if (r.status !== "approved" && r.status !== "pending") return false;
      const s = r.start_date;
      const e = r.end_date;
      return dayStr >= s && dayStr <= e;
    });

    return { holidays: dayHolidays, leaves: dayLeaves };
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const resetToToday = () => setCurrentDate(new Date());

  return (
    <div className="rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.06)] overflow-hidden relative">
      {/* Top subtle golden rim */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent" />

      {/* Calendar Luxury Header */}
      <div className="p-4 sm:p-5 border-b border-[#E9DFD0] flex flex-wrap items-center justify-between gap-4 bg-[#FAF7F2]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0] flex items-center justify-center text-[#C5A46D]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif tracking-tight text-[#101C35]">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium font-sans">
              Company Schedule &amp; Leave Matrix
            </p>
          </div>
          <button
            onClick={resetToToday}
            className="text-xs px-3 py-1 rounded-xl bg-white text-[#101C35] border border-[#E9DFD0] hover:bg-[#FAF5EB] font-semibold transition-all ml-2 shadow-2xs font-sans"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Legend */}
          <div className="hidden lg:flex items-center gap-3 text-xs mr-2 font-sans">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF3ED] text-[#2C6244] border border-[#BDDEC8] text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#7FA18B]" /> Approved
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF7E8] text-[#8C6B28] border border-[#ECDAB0] text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C5A46D]" /> Pending Review
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF5EB] text-[#101C35] border border-[#E9DFD0] text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#101C35]" /> Holiday
            </span>
          </div>

          {/* Month switcher buttons */}
          <div className="flex items-center bg-[#FAF7F2] rounded-2xl p-1 border border-[#E9DFD0]">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-xl hover:bg-white text-[#101C35] transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-xl hover:bg-white text-[#101C35] transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-[#E9DFD0] bg-[#FAF5EB] text-center text-xs font-serif font-bold text-[#101C35] py-2.5">
        <span>Sunday</span>
        <span>Monday</span>
        <span>Tuesday</span>
        <span>Wednesday</span>
        <span>Thursday</span>
        <span>Friday</span>
        <span>Saturday</span>
      </div>

      {/* Calendar Day Grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#E9DFD0]/60">
        {days.map((day: Date) => {
          const isCurrMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          const isWknd = isWeekend(day);
          const { holidays: dayHolidays, leaves: dayLeaves } = getEventsForDay(day);
          const isSelected = selectedDayInfo && isSameDay(selectedDayInfo.date, day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => {
                setSelectedDayInfo({ date: day, holidays: dayHolidays, leaves: dayLeaves });
              }}
              className={`min-h-[105px] p-2 transition-all cursor-pointer relative group ${
                !isCurrMonth
                  ? "bg-[#FAF7F2]/50 opacity-40"
                  : isWknd
                  ? "bg-[#FAF7F2]/30"
                  : "bg-white hover:bg-[#FAF7F2]/60"
              } ${isSelected ? "ring-2 ring-[#C5A46D] bg-[#FAF5EB]/50" : ""}`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-xl flex items-center justify-center font-serif ${
                    isTodayDate
                      ? "bg-gradient-to-tr from-[#C5A46D] to-[#DCC49B] text-[#101C35] font-extrabold shadow-sm ring-2 ring-[#C5A46D]/40"
                      : "text-[#101C35] group-hover:text-[#C5A46D]"
                  }`}
                >
                  {format(day, "d")}
                </span>

                <div className="flex items-center gap-1">
                  {dayHolidays.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#101C35]" title="Official Holiday" />
                  )}
                  {dayLeaves.some((l) => l.status === "approved") && (
                    <span className="w-2 h-2 rounded-full bg-[#7FA18B]" title="Approved Leave" />
                  )}
                </div>
              </div>

              {/* Event Pills */}
              <div className="space-y-1">
                {dayHolidays.map((h) => (
                  <div
                    key={h.id}
                    className="text-[10px] leading-tight font-semibold px-1.5 py-0.5 rounded-lg bg-[#FAF5EB] text-[#101C35] border border-[#E9DFD0] truncate flex items-center gap-1 shadow-2xs font-sans"
                    title={h.name}
                  >
                    <span>🏛️</span>
                    <span className="truncate">{h.name}</span>
                  </div>
                ))}

                {dayLeaves.map((l) => {
                  const lt = leaveTypes.find((t) => t.id === l.leave_type_id);
                  const isApproved = l.status === "approved";

                  return (
                    <div
                      key={l.id}
                      className={`text-[10px] leading-tight font-semibold px-1.5 py-0.5 rounded-lg border truncate flex items-center gap-1 shadow-2xs font-sans ${
                        isApproved
                          ? "bg-[#EAF3ED] text-[#2C6244] border-[#BDDEC8]"
                          : "bg-[#FDF7E8] text-[#8C6B28] border-[#ECDAB0]"
                      }`}
                      title={`${l.user?.full_name || "Employee"}: ${lt?.name} (${l.status})`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" />
                      <span className="truncate">
                        {l.user?.full_name ? l.user.full_name.split(" ")[0] : "Employee"} • {lt?.code || "LV"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Inspection Drawer */}
      {selectedDayInfo && (
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E9DFD0] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
          <div className="space-y-1.5 font-sans">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C5A46D] font-serif">
                Schedule Telemetry
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
              <h4 className="text-sm font-bold text-[#101C35] font-serif">
                {format(selectedDayInfo.date, "EEEE, MMMM dd, yyyy")}
              </h4>
            </div>

            {selectedDayInfo.holidays.length === 0 && selectedDayInfo.leaves.length === 0 && (
              <p className="text-xs text-slate-500">
                Regular working day. No official holidays or leaves scheduled.
              </p>
            )}

            {selectedDayInfo.holidays.map((h: Holiday) => (
              <p key={h.id} className="text-xs text-[#101C35] flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[#C5A46D]" />
                <strong>Official Holiday:</strong> {h.name} ({h.type}) — {h.description}
              </p>
            ))}

            {selectedDayInfo.leaves.map((l: LeaveRequest) => {
              const lt = leaveTypes.find((t) => t.id === l.leave_type_id);
              return (
                <p key={l.id} className="text-xs text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#7FA18B]" />
                  <strong>{l.user?.full_name || "Employee"}</strong>: {lt?.name} (
                  <span className={l.status === "approved" ? "text-[#2C6244] font-bold" : "text-[#8C6B28] font-bold"}>
                    {l.status}
                  </span>
                  ) — Reason: &ldquo;{l.reason}&rdquo;
                </p>
              );
            })}
          </div>

          <button
            onClick={() => setSelectedDayInfo(null)}
            className="self-start md:self-center px-3.5 py-1.5 rounded-xl bg-white border border-[#E9DFD0] hover:bg-[#FAF5EB] text-xs font-semibold text-[#101C35] flex items-center gap-1 transition-colors shadow-2xs"
          >
            <X className="w-3.5 h-3.5" />
            <span>Dismiss</span>
          </button>
        </div>
      )}
    </div>
  );
}
