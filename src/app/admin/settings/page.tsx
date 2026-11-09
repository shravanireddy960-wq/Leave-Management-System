"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/components/theme-provider";
import { validateEmail } from "@/lib/validations";
import { Building2, Mail, Check, Sun, Moon, Database, Shield, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAppStore();
  const { setTheme, isDark } = useTheme();

  const [orgName, setOrgName] = useState(settings.org_name || "Nexus Enterprise Technologies Corp.");
  const [corporateYear, setCorporateYear] = useState(settings.fiscal_year || "FY 2025-2026");
  const [contactEmail, setContactEmail] = useState(settings.contact_email || "hr-operations@lms.in");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!orgName || !orgName.trim() || orgName.trim().length < 2) {
      setFormError("Organization name must be at least 2 characters.");
      return;
    }

    const emailVal = validateEmail(contactEmail);
    if (!emailVal.isValid) {
      setFormError(emailVal.error || "Please enter a valid official contact email address.");
      return;
    }

    updateSettings({
      org_name: orgName.trim(),
      fiscal_year: corporateYear.trim(),
      contact_email: contactEmail.trim().toLowerCase(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <PortalShell portal="admin">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Administration & Environment Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure institutional profile, primary contact email, and platform theme.
          </p>
        </div>

        {formError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Institution settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Organization Info */}
          <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#3448A5]" />
              <span>Institution Details</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Institution Name
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Fiscal Year
                  </label>
                  <input
                    type="text"
                    required
                    value={corporateYear}
                    onChange={(e) => setCorporateYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    HR Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Appearance Theme</h3>
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

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#3448A5] hover:bg-[#2B3C8C] text-white text-xs font-bold shadow-md transition-all"
            >
              Save Organization Settings
            </button>
          </div>
        </form>
      </div>
    </PortalShell>
  );
}
