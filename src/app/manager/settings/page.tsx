"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Bell, Check, UserCheck, Shield } from "lucide-react";

export default function ManagerSettingsPage() {
  const { setTheme, isDark } = useTheme();
  const [submissionAlerts, setSubmissionAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [autoEscalate, setAutoEscalate] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <PortalShell portal="manager">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manager Preferences & Approval Automation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure approval alerts, escalation deadlines, and interface appearance.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings updated successfully!</span>
          </div>
        )}

        {/* Theme Settings */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Theme Preference</h3>
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                !isDark
                  ? "border-[#3448A5] bg-blue-50/50 text-[#3448A5] ring-2 ring-[#3448A5]/20 font-bold"
                  : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-xs">Premium Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                isDark
                  ? "border-[#7485D8] bg-slate-800 text-[#7485D8] ring-2 ring-[#7485D8]/20 font-bold"
                  : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs">Premium Dark</span>
            </button>
          </div>
        </div>

        {/* Approval Alerts & Escalation */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Approval Alerts & Escalations
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Instant Employee Submission Email
                </span>
                <span className="text-slate-400 text-[11px] block">
                  Receive email immediately when a department employee submits leave.
                </span>
              </div>
              <input
                type="checkbox"
                checked={submissionAlerts}
                onChange={(e) => setSubmissionAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#3448A5]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Morning Absence Briefing
                </span>
                <span className="text-slate-400 text-[11px] block">
                  Daily 8:00 AM summary of employee on sanctioned leave.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dailyDigest}
                onChange={(e) => setDailyDigest(e.target.checked)}
                className="w-4 h-4 rounded text-[#3448A5]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Admin Escalation on Inaction (5 Days)
                </span>
                <span className="text-slate-400 text-[11px] block">
                  Escalate unreviewed applications to Administrator after 5 business days.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.checked)}
                className="w-4 h-4 rounded text-[#3448A5]"
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#3448A5] hover:bg-[#2B3C8C] text-white text-xs font-bold shadow-xs transition-colors"
            >
              Save Manager Settings
            </button>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
