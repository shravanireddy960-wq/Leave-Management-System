"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { Sliders, Check, ShieldCheck, Calendar, Clock, AlertCircle } from "lucide-react";

export default function AdminPoliciesPage() {
  const { settings, updateSettings } = useAppStore();

  const [corporateYear, setCorporateYear] = useState(settings.fiscal_year || "FY 2025-2026");
  const [weekendSat, setWeekendSat] = useState(true);
  const [weekendSun, setWeekendSun] = useState(true);
  const [autoApproveDays, setAutoApproveDays] = useState(settings.auto_approve_days || 5);
  const [carryForwardLimit, setCarryForwardLimit] = useState(settings.carry_forward_limit || 10);
  const [workingHours, setWorkingHours] = useState(settings.working_hours_per_day || 8);
  const [advanceNoticeDays, setAdvanceNoticeDays] = useState(2);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!corporateYear || !corporateYear.trim() || corporateYear.trim().length < 3) {
      setFormError("Please enter a valid fiscal year designation (e.g. FY 2025-2026).");
      return;
    }

    if (isNaN(workingHours) || workingHours < 1 || workingHours > 24) {
      setFormError("Daily working hours must be between 1 and 24 hours.");
      return;
    }

    if (isNaN(carryForwardLimit) || carryForwardLimit < 0) {
      setFormError("Carry-forward limit cannot be negative.");
      return;
    }

    if (isNaN(autoApproveDays) || autoApproveDays < 1) {
      setFormError("Auto-escalation days threshold must be at least 1 day.");
      return;
    }

    const weekendDays: string[] = [];
    if (weekendSat) weekendDays.push("Saturday");
    if (weekendSun) weekendDays.push("Sunday");

    updateSettings({
      fiscal_year: corporateYear.trim(),
      weekend_days: weekendDays,
      auto_approve_days: autoApproveDays,
      carry_forward_limit: carryForwardLimit,
      working_hours_per_day: workingHours,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <PortalShell portal="admin">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Institutional Leave Policies & Operating Rules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure working schedules, weekend days, holiday exclusions, and governance rules.
          </p>
        </div>

        {formError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Institutional policies updated & active!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Corporate Session & Leave Year */}
          <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3448A5] dark:text-[#7485D8]" />
              <span>Fiscal Year & Leave Cycle</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Current Corporate Cycle
                </label>
                <input
                  type="text"
                  value={corporateYear}
                  onChange={(e) => setCorporateYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Daily Working Hours Per Employee
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>
            </div>
          </div>

          {/* Weekend & Working Days Configuration */}
          <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Weekend Days & Automatic Calculation Exclusions</span>
            </h3>
            <p className="text-xs text-slate-500">
              Days marked as weekends will be automatically deducted from leave duration calculations.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={weekendSat}
                  onChange={(e) => setWeekendSat(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3448A5]"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Saturday</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={weekendSun}
                  onChange={(e) => setWeekendSun(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3448A5]"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Sunday</span>
              </label>
            </div>
          </div>

          {/* Governance & Carry-Forward Policies */}
          <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Governance & Escalation Safeguards</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Maximum Carry-Forward Cap (Days)
                </label>
                <input
                  type="number"
                  value={carryForwardLimit}
                  onChange={(e) => setCarryForwardLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Maximum unused Earned Leave days carried over into next corporate session.
                </span>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Manager Approval Window (Days)
                </label>
                <input
                  type="number"
                  value={autoApproveDays}
                  onChange={(e) => setAutoApproveDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Applications pending beyond this limit are automatically escalated to the Administrator.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#3448A5] hover:bg-[#2B3C8C] text-white text-xs font-bold shadow-md transition-all"
            >
              Save Institutional Policies
            </button>
          </div>
        </form>
      </div>
    </PortalShell>
  );
}
