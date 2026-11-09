"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { calculateLeaveDays, hasOverlappingLeave } from "@/lib/leave-calculator";
import { Modal } from "@/components/ui/modal";
import {
  parseISO,
  eachDayOfInterval,
  isWeekend,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
} from "@/lib/date-utils";
import confetti from "canvas-confetti";
import {
  CalendarPlus,
  CalendarCheck,
  AlertCircle,
  FileUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Phone,
  Info,
  Sparkles,
  Lock,
  Layers,
  ChevronLeft,
  ChevronRight,
  FileCheck,
} from "lucide-react";
import { formatDate, getCurrentISTDateString } from "@/lib/utils";
import { validatePhone, validateLeaveReason } from "@/lib/validations";

export default function ApplyLeavePage() {
  const router = useRouter();
  const { currentUser, leaveTypes, balances, holidays, leaveRequests, submitLeaveRequest } = useAppStore();

  const todayIST = useMemo(() => getCurrentISTDateString(), []);

  const [leaveTypeId, setLeaveTypeId] = useState(leaveTypes[0]?.id || "");
  const [startDate, setStartDate] = useState(todayIST);
  const [endDate, setEndDate] = useState(todayIST);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayPeriod, setHalfDayPeriod] = useState<"first_half" | "second_half">("first_half");
  const [reason, setReason] = useState("");
  const [contactPhone, setContactPhone] = useState(currentUser.phone || "+91 98450 12345");
  const [docUploaded, setDocUploaded] = useState(false);
  const [docFileName, setDocFileName] = useState("");
  const [docHash, setDocHash] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);

  // Selected leave type details
  const selectedType = leaveTypes.find((lt) => lt.id === leaveTypeId) || leaveTypes[0];

  // Available balance for current user and type (supporting current session)
  const userBalance = useMemo(() => {
    const startYear = parseInt(startDate.slice(0, 4), 10) || 2026;
    return (
      balances.find(
        (b) => b.user_id === currentUser.id && b.leave_type_id === leaveTypeId && b.year === startYear
      ) ||
      balances.find(
        (b) => b.user_id === currentUser.id && b.leave_type_id === leaveTypeId
      )
    );
  }, [balances, currentUser.id, leaveTypeId, startDate]);

  // Live working day calculation
  const calculation = useMemo(() => {
    return calculateLeaveDays(startDate, endDate, holidays, isHalfDay, true);
  }, [startDate, endDate, holidays, isHalfDay]);

  // Overlap verification
  const myRequests = leaveRequests.filter((r) => r.user_id === currentUser.id);
  const overlappingRequest = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = parseISO(startDate);
    const end = parseISO(isHalfDay ? startDate : endDate);
    return myRequests.find((r) => {
      if (r.status === "cancelled" || r.status === "rejected") return false;
      const rStart = parseISO(r.start_date);
      const rEnd = parseISO(r.end_date);
      return !(end < rStart || start > rEnd);
    });
  }, [startDate, endDate, isHalfDay, myRequests]);

  // Balance sufficiency check
  const isBalanceSufficient =
    !selectedType?.is_paid || (userBalance && userBalance.available >= calculation.workingDays);

  // Document requirement check
  const isDocumentMissing = selectedType?.requires_document && !docUploaded;

  // Day-by-Day Visual Timeline
  const timelineDays = useMemo(() => {
    try {
      const s = parseISO(startDate);
      const e = parseISO(isHalfDay ? startDate : endDate);
      if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return [];
      const days = eachDayOfInterval({ start: s, end: e });
      return days.map((d) => {
        const dateStr = format(d, "yyyy-MM-dd");
        const isWk = isWeekend(d);
        const hol = holidays.find((h) => h.date === dateStr);
        return {
          date: d,
          dateStr,
          isWeekend: isWk,
          holiday: hol,
          isWorking: !isWk && !hol,
        };
      });
    } catch {
      return [];
    }
  }, [startDate, endDate, isHalfDay, holidays]);

  // Month Grid Calculation for interactive calendar picker
  const currentMonthDisplayDate = useMemo(() => {
    const base = parseISO(todayIST);
    return new Date(base.getFullYear(), base.getMonth() + calendarMonthOffset, 1);
  }, [todayIST, calendarMonthOffset]);

  const monthGridDays = useMemo(() => {
    try {
      const mStart = startOfMonth(currentMonthDisplayDate);
      const mEnd = endOfMonth(mStart);
      const cStart = startOfWeek(mStart);
      const cEnd = endOfWeek(mEnd);
      const days = eachDayOfInterval({ start: cStart, end: cEnd });

      return days.map((d) => {
        const dateStr = format(d, "yyyy-MM-dd");
        const isWk = isWeekend(d);
        const hol = holidays.find((h) => h.date === dateStr);
        return {
          date: d,
          dateStr,
          dayNumber: d.getDate(),
          isWeekend: isWk,
          holiday: hol,
          isCurrentMonth: d.getMonth() === currentMonthDisplayDate.getMonth(),
        };
      });
    } catch {
      return [];
    }
  }, [currentMonthDisplayDate, holidays]);

  const handleSelectDayInGrid = (dateStr: string) => {
    // Strictly prevent clicking past dates
    if (dateStr < todayIST) return;
    setErrorMessage("");

    if (isHalfDay) {
      setStartDate(dateStr);
      setEndDate(dateStr);
      return;
    }

    // Range selection logic
    if (!startDate || dateStr < startDate || (startDate && endDate && startDate !== endDate)) {
      setStartDate(dateStr);
      setEndDate(dateStr);
    } else {
      setEndDate(dateStr);
    }
  };

  const handleValidateAndOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!startDate || !endDate) {
      setErrorMessage("Please select valid start and end dates.");
      return;
    }

    // Blackout check: Past days are blocked
    if (startDate < todayIST) {
      setErrorMessage(
        `Past dates cannot be selected. Leaves can only be scheduled for today (${todayIST}) or future dates.`
      );
      return;
    }

    if (startDate > endDate && !isHalfDay) {
      setErrorMessage("End date cannot precede the start date.");
      return;
    }

    const phoneVal = validatePhone(contactPhone);
    if (!phoneVal.isValid) {
      setErrorMessage(phoneVal.error || "Please enter a valid 10-15 digit contact phone number.");
      return;
    }

    const reasonVal = validateLeaveReason(reason);
    if (!reasonVal.isValid) {
      setErrorMessage(reasonVal.error || "Please state a clear justification or reason (at least 8 characters).");
      return;
    }

    if (calculation.workingDays <= 0) {
      setErrorMessage("The selected dates contain 0 working days (all dates fall on weekends or institutional holidays).");
      return;
    }

    if (overlappingRequest) {
      setErrorMessage(
        `Overlapping request detected: You already have request ${overlappingRequest.request_number} (${overlappingRequest.status}) covering this period.`
      );
      return;
    }

    if (!isBalanceSufficient) {
      setErrorMessage(
        `Insufficient leave balance. You have ${userBalance?.available ?? 0} days available in ${selectedType?.name}, but requested ${calculation.workingDays} days.`
      );
      return;
    }

    if (isDocumentMissing) {
      setErrorMessage(
        `Official documentation is mandatory for ${selectedType?.name}. Please attach your supporting medical certificate or duty order.`
      );
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitting(true);

    const result = submitLeaveRequest({
      leaveTypeId,
      startDate,
      endDate: isHalfDay ? startDate : endDate,
      isHalfDay,
      halfDayPeriod: isHalfDay ? halfDayPeriod : undefined,
      reason,
      contactPhone,
      supportingDocumentUrl: docUploaded ? `uploads/${docFileName}` : undefined,
    });

    if (result.success) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F59E0B", "#10B981", "#3B82F6", "#FBBF24"],
        });
      } catch {}

      setShowConfirmModal(false);
      setTimeout(() => {
        router.push("/employee/requests");
      }, 700);
    } else {
      setIsSubmitting(false);
      setErrorMessage(result.error || "Submission failed. Please verify your inputs.");
    }
  };

  return (
    <PortalShell portal="employee">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Royal Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9DFD0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E9DFD0] text-[#101C35] text-[11px] font-semibold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Employee Self-Service Terminal &bull; Session 2025–2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101C35] font-serif">
              Apply for Leave
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Submit your formal leave request with live working-day computation, balance verification, and automated routing.
            </p>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-[#FDF0F0] border border-[#F2C5C5] text-xs text-[#9E3E3E] flex items-start gap-3 shadow-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#C98787]" />
            <div>
              <p className="font-bold font-serif text-sm">Policy &amp; Validation Alert</p>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Application Form (7 cols) */}
          <form
            onSubmit={handleValidateAndOpenConfirm}
            className="lg:col-span-7 rounded-3xl bg-white border border-[#E9DFD0] p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] space-y-5"
          >
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#101C35] mb-2 font-serif">
                1. Leave Category *
              </label>
              <select
                value={leaveTypeId}
                onChange={(e) => setLeaveTypeId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] font-medium transition-all cursor-pointer"
              >
                {leaveTypes.map((lt) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.name} ({lt.code}) &bull; Quota: {lt.annual_quota} days {lt.is_paid ? "• Paid" : "• Unpaid"}
                  </option>
                ))}
              </select>
              {selectedType && (
                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5 font-sans">
                  <Info className="w-3.5 h-3.5 text-[#C5A46D] shrink-0" />
                  <span>{selectedType.description}</span>
                </p>
              )}
            </div>

            {/* Half-Day Option Toggle */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#101C35] block font-serif">
                  Half-Day Leave Option
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Take a 0.5 day absence for morning or afternoon commitments.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isHalfDay}
                onChange={(e) => setIsHalfDay(e.target.checked)}
                className="w-5 h-5 rounded-lg text-[#C5A46D] focus:ring-[#C5A46D] border-[#E9DFD0] cursor-pointer"
              />
            </div>

            {isHalfDay && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0]">
                <button
                  type="button"
                  onClick={() => setHalfDayPeriod("first_half")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    halfDayPeriod === "first_half"
                      ? "bg-[#DCC49B] text-[#101C35] border-[#C5A46D] shadow-sm"
                      : "bg-white text-slate-700 border-[#E9DFD0]"
                  }`}
                >
                  First Half (Morning)
                </button>
                <button
                  type="button"
                  onClick={() => setHalfDayPeriod("second_half")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    halfDayPeriod === "second_half"
                      ? "bg-[#DCC49B] text-[#101C35] border-[#C5A46D] shadow-sm"
                      : "bg-white text-slate-700 border-[#E9DFD0]"
                  }`}
                >
                  Second Half (Afternoon)
                </button>
              </div>
            )}

            {/* Dates Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101C35] mb-1.5 font-serif">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  min={todayIST}
                  value={startDate}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    if (newStart < todayIST) {
                      setErrorMessage(`Cannot select past dates. Previous days prior to ${todayIST} are locked.`);
                      return;
                    }
                    setStartDate(newStart);
                    if (isHalfDay || newStart > endDate) setEndDate(newStart);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  All previous days before today ({todayIST}) are locked.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101C35] mb-1.5 font-serif">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  disabled={isHalfDay}
                  min={startDate || todayIST}
                  value={isHalfDay ? startDate : endDate}
                  onChange={(e) => {
                    const newEnd = e.target.value;
                    if (newEnd < (startDate || todayIST)) {
                      setErrorMessage("End date cannot precede the start date.");
                      return;
                    }
                    setEndDate(newEnd);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] font-medium disabled:opacity-50"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Minimum selectable date: {startDate || todayIST}.
                </span>
              </div>
            </div>

            {/* Visual Interactive Month Calendar with Blacked-Out Past Days */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#FAF7F2] border border-[#E9DFD0] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#101C35] font-serif uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarCheck className="w-4 h-4 text-[#C5A46D]" />
                    <span>Interactive Calendar Date Picker</span>
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click any active day to set your dates. Past days are locked &amp; blacked out.
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCalendarMonthOffset((prev) => Math.max(0, prev - 1))}
                    disabled={calendarMonthOffset === 0}
                    className="p-1.5 rounded-xl border border-[#E9DFD0] bg-white text-slate-600 hover:text-[#101C35] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Previous month (past months are locked)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-[#101C35] px-2 font-serif min-w-[95px] text-center">
                    {format(currentMonthDisplayDate, "MMM yyyy")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCalendarMonthOffset((prev) => prev + 1)}
                    className="p-1.5 rounded-xl border border-[#E9DFD0] bg-white text-slate-600 hover:text-[#101C35] cursor-pointer transition-colors"
                    title="Next month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider font-serif">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {monthGridDays.map((cell, idx) => {
                  const isPast = cell.dateStr < todayIST;
                  const isTodayCell = cell.dateStr === todayIST;
                  const isSelected = cell.dateStr >= startDate && cell.dateStr <= (isHalfDay ? startDate : endDate);
                  const isStart = cell.dateStr === startDate;
                  const isEnd = cell.dateStr === (isHalfDay ? startDate : endDate);

                  if (isPast) {
                    return (
                      <div
                        key={idx}
                        className="h-10 sm:h-12 rounded-xl bg-slate-200/50 border border-dashed border-slate-300/70 p-1 flex flex-col items-center justify-center text-slate-400 select-none cursor-not-allowed opacity-45 relative"
                        title={`Locked: ${cell.dateStr} is a past date and cannot be selected.`}
                      >
                        <span className="text-[11px] font-mono line-through font-bold text-slate-400">
                          {cell.dayNumber}
                        </span>
                        <span className="text-[8px] uppercase tracking-tighter text-slate-400">Locked</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDayInGrid(cell.dateStr)}
                      className={`h-10 sm:h-12 rounded-xl p-1 flex flex-col items-center justify-between border transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-gradient-to-tr from-[#C5A46D] to-[#DCC49B] border-[#C5A46D] text-[#101C35] shadow-xs font-bold"
                          : isTodayCell
                          ? "bg-white border-[#C5A46D] text-[#101C35] ring-2 ring-[#C5A46D]/40"
                          : cell.holiday
                          ? "bg-[#FAF5EB] border-[#ECDAB0] text-[#8C6B28] hover:border-[#C5A46D]"
                          : cell.isWeekend
                          ? "bg-white/80 border-[#E9DFD0] text-slate-500 hover:border-[#C5A46D]"
                          : "bg-white border-[#E9DFD0] text-[#101C35] hover:border-[#C5A46D] hover:bg-[#FAF5EB]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full px-1">
                        <span className="text-[11px] font-mono font-bold">{cell.dayNumber}</span>
                        {isTodayCell && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A37B]" title="Today in IST" />
                        )}
                      </div>
                      <span className="text-[8px] font-bold truncate max-w-full">
                        {isStart && isEnd ? "Day" : isStart ? "Start" : isEnd ? "End" : cell.holiday ? "Holiday" : cell.isWeekend ? "Wknd" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E9DFD0] text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-200/50 border border-dashed border-slate-300 opacity-60 line-through flex items-center justify-center text-[7px]">✕</span>
                  <span className="font-semibold text-slate-600">Previous Days (Blacked Out)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-white border border-[#C5A46D] ring-1 ring-[#C5A46D]/40" />
                  <span>Today (IST)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-tr from-[#C5A46D] to-[#DCC49B]" />
                  <span>Selected Leave Span</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#FAF5EB] border border-[#ECDAB0]" />
                  <span>Holiday</span>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#101C35] mb-1.5 font-serif">
                Reason &amp; Work Coverage *
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State the detailed reason and work arrangements made during your absence..."
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] placeholder:text-slate-400"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#101C35] mb-1.5 font-serif">
                Emergency Phone During Absence
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35]"
                />
              </div>
            </div>

            {/* Cryptographic Document Upload Zone */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101C35] font-serif">
                  Supporting Verification Document {selectedType?.requires_document && <span className="text-rose-500">* (Mandatory)</span>}
                </label>
                {docHash && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#2C6244] bg-[#EAF3ED] px-2 py-0.5 rounded-full border border-[#BDDEC8]">
                    <Lock className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <div className="border-2 border-dashed border-[#E9DFD0] rounded-2xl p-4 text-center hover:border-[#C5A46D] transition-colors bg-[#FAF7F2]">
                {!docUploaded ? (
                  <div className="space-y-2">
                    <FileUp className="w-8 h-8 text-[#C5A46D] mx-auto" />
                    <p className="text-xs text-slate-700 font-medium font-sans">
                      Attach medical certificate, duty order, or official invitation.
                    </p>
                    <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
                    <button
                      type="button"
                      onClick={() => {
                        setDocUploaded(true);
                        setDocFileName("Medical_Consultation_Certificate.pdf");
                        setDocHash("sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-tr from-[#C5A46D] to-[#DCC49B] hover:brightness-105 text-[#101C35] text-xs font-bold shadow-2xs transition-transform hover:scale-105"
                    >
                      Browse &amp; Attach Document
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#EAF3ED] text-[#2C6244] text-xs border border-[#BDDEC8]">
                    <div className="flex items-center gap-2 font-medium">
                      <FileCheck className="w-5 h-5 text-[#2C6244]" />
                      <div className="text-left">
                        <span className="block font-bold">{docFileName}</span>
                        <span className="block text-[10px] font-mono opacity-80">{docHash.slice(0, 32)}...</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDocUploaded(false);
                        setDocFileName("");
                        setDocHash("");
                      }}
                      className="text-xs text-[#9E3E3E] hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C5A46D] via-[#DCC49B] to-[#C5A46D] hover:brightness-105 text-[#101C35] font-extrabold text-sm shadow-[0_4px_15px_rgba(197,164,109,0.35)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Review &amp; Submit Application</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Column: Day-by-Day Timeline + Balance Telemetry HUD (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Calculation HUD Card */}
            <div className="rounded-3xl bg-white border border-[#E9DFD0] p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9DFD0]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FAF5EB] text-[#C5A46D] flex items-center justify-center border border-[#E9DFD0]">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#101C35] font-serif">
                    Working-Day Telemetry
                  </h3>
                </div>
                <span className="text-xs font-extrabold text-[#101C35] bg-[#FAF5EB] px-2.5 py-0.5 rounded-full border border-[#E9DFD0]">
                  {calculation.workingDays} Day(s) Net
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Calendar Span:</span>
                  <span className="font-semibold text-[#101C35]">
                    {calculation.totalDays} day(s)
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Weekend Days Excluded:</span>
                  <span className="font-semibold text-[#C5A46D]">
                    -{calculation.weekendDaysCount}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Holiday Days Excluded:</span>
                  <span className="font-semibold text-[#C5A46D]">
                    -{calculation.holidaysCount}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E9DFD0] flex justify-between items-baseline font-bold">
                  <span className="text-[#101C35]">Net Quota Deduction:</span>
                  <span className="text-lg text-[#101C35] font-serif">
                    {calculation.workingDays} Day(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Day-by-Day Visual Timeline Matrix */}
            <div className="rounded-3xl bg-white border border-[#E9DFD0] p-5 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#101C35] font-serif flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>Day-by-Day Schedule Matrix</span>
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {timelineDays.map((td, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      td.holiday
                        ? "bg-[#FAF5EB] border-[#ECDAB0] text-[#8C6B28]"
                        : td.isWeekend
                        ? "bg-[#FAF7F2] border-[#E9DFD0] text-slate-600"
                        : "bg-[#EAF3ED] border-[#BDDEC8] text-[#2C6244]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs">{td.dateStr}</span>
                      <span className="text-[11px] opacity-75">
                        ({formatDate(td.date, "EEE")})
                      </span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white shadow-2xs">
                      {td.holiday ? `🏛️ ${td.holiday.name}` : td.isWeekend ? "🌿 Weekend" : "⚡ Working Day"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Entitlement Forecast HUD */}
            <div className="rounded-3xl bg-white border border-[#E9DFD0] p-5 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#101C35] font-serif">
                Balance Forecast
              </h3>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] space-y-2">
                <span className="text-xs font-bold text-[#101C35] block font-serif">
                  {selectedType?.name} ({selectedType?.code})
                </span>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Available Balance:</span>
                  <span className="font-bold text-[#2C6244]">
                    {userBalance?.available ?? 0} days
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Forecast Remaining:</span>
                  <span
                    className={`font-bold ${
                      isBalanceSufficient ? "text-[#101C35] font-serif" : "text-[#9E3E3E]"
                    }`}
                  >
                    {Math.max(0, (userBalance?.available ?? 0) - calculation.workingDays)} days
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-[#E9DFD0]/60 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-[#C5A46D] h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (((userBalance?.available ?? 0) - calculation.workingDays) /
                          (selectedType?.annual_quota || 15)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Status Verification Badge */}
              {!isBalanceSufficient ? (
                <div className="p-2.5 rounded-xl bg-[#FDF0F0] border border-[#F2C5C5] text-xs text-[#9E3E3E] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Insufficient balance available!</span>
                </div>
              ) : overlappingRequest ? (
                <div className="p-2.5 rounded-xl bg-[#FDF7E8] border border-[#ECDAB0] text-xs text-[#8C6B28] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Overlaps with request {overlappingRequest.request_number}</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-[#EAF3ED] border border-[#BDDEC8] text-xs text-[#2C6244] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Verified: All policy rules validated</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Institutional Leave Sanction Confirmation"
        description="Please review your application parameters before official submission."
      >
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-bold text-[#101C35] font-serif">{currentUser.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Employee ID:</span>
              <span className="font-mono text-[#101C35]">{currentUser.employee_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-bold text-[#C5A46D]">{selectedType?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sanctioned Span:</span>
              <span className="font-bold text-[#101C35]">
                {formatDate(startDate, "MMM dd, yyyy")} &rarr; {formatDate(isHalfDay ? startDate : endDate, "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Deduction Days:</span>
              <span className="font-extrabold text-[#101C35] font-serif text-sm">
                {calculation.workingDays} Day(s)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reporting Manager:</span>
              <span className="font-bold text-[#101C35]">Manager (Head of Department)</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 rounded-xl border border-[#E9DFD0] text-xs font-semibold text-slate-700 hover:bg-[#FAF5EB] transition-colors"
            >
              Modify Details
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmSubmit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-tr from-[#C5A46D] to-[#DCC49B] hover:brightness-105 text-[#101C35] text-xs font-extrabold shadow-sm transition-all"
            >
              {isSubmitting ? "Transmitting..." : "Confirm & Sanction Request"}
            </button>
          </div>
        </div>
      </Modal>
    </PortalShell>
  );
}
