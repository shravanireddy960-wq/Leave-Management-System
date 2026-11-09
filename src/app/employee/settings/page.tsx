"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useTheme } from "@/components/theme-provider";
import { Bell, Moon, Sun, Lock, Shield, Check } from "lucide-react";

export default function EmployeeSettingsPage() {
  const { theme, setTheme, isDark } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [holidayReminders, setHolidayReminders] = useState(true);
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <PortalShell portal="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="pb-2 border-b border-[#E9DFD0]">
          <h2 className="text-2xl font-bold tracking-tight text-[#101C35] font-serif">
            Employee Preferences &amp; Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure enterprise presentation, notifications, and communications.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-[#EAF3ED] border border-[#BDDEC8] text-xs text-[#2C6244] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#7FA18B]" />
            <span>Preferences updated successfully!</span>
          </div>
        )}

        {/* Visual Appearance */}
        <div className="bg-white rounded-3xl border border-[#E9DFD0] p-6 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] space-y-4">
          <h3 className="text-sm font-bold text-[#101C35] font-serif">
            Interface Theme &amp; Presentation
          </h3>
          <p className="text-xs text-slate-500">
            Standardized on Royal Luxury &amp; Architectural Pearl Ivory aesthetic.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md pt-2">
            <div className="p-4 rounded-2xl border-2 border-[#C5A46D] bg-[#FAF5EB] text-[#101C35] flex items-center gap-3 shadow-xs">
              <Sun className="w-5 h-5 text-[#C5A46D]" />
              <div>
                <span className="text-xs font-bold font-serif block">Royal Luxury Light</span>
                <span className="text-[10px] text-slate-500">Pearl ivory, warm white &amp; gold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Subscriptions */}
        <div className="bg-white rounded-3xl border border-[#E9DFD0] p-6 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] space-y-4">
          <h3 className="text-sm font-bold text-[#101C35] font-serif">
            Alert &amp; Email Preferences
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] cursor-pointer hover:border-[#C5A46D] transition-colors">
              <div>
                <span className="font-bold text-[#101C35] block font-serif">
                  Leave Decision Instant Alerts
                </span>
                <span className="text-slate-500 text-[11px] block">
                  Notify immediately when your manager reviews, approves, or remarks on a request.
                </span>
              </div>
              <input
                type="checkbox"
                checked={approvalAlerts}
                onChange={(e) => setApprovalAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#C5A46D] focus:ring-[#C5A46D] border-[#E9DFD0]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] cursor-pointer hover:border-[#C5A46D] transition-colors">
              <div>
                <span className="font-bold text-[#101C35] block font-serif">
                  Upcoming Holiday Reminders
                </span>
                <span className="text-slate-500 text-[11px] block">
                  Get notifications 2 days prior to observed holidays.
                </span>
              </div>
              <input
                type="checkbox"
                checked={holidayReminders}
                onChange={(e) => setHolidayReminders(e.target.checked)}
                className="w-4 h-4 rounded text-[#C5A46D] focus:ring-[#C5A46D] border-[#E9DFD0]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] cursor-pointer hover:border-[#C5A46D] transition-colors">
              <div>
                <span className="font-bold text-[#101C35] block font-serif">
                  Digest &amp; Balance Summary
                </span>
                <span className="text-slate-500 text-[11px] block">
                  Monthly executive summary of remaining entitlements.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#C5A46D] focus:ring-[#C5A46D] border-[#E9DFD0]"
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#C5A46D] via-[#DCC49B] to-[#C5A46D] hover:brightness-105 text-[#101C35] text-xs font-extrabold shadow-sm transition-all"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
