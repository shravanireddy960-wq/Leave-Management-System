"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Users, Mail, Phone, Calendar, Search, ShieldCheck } from "lucide-react";

export default function ManagerTeamPage() {
  const { currentUser, profiles, balances, leaveRequests } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");

  const deptMembers = profiles.filter(
    (p) => p.department_id === currentUser.department_id || p.reporting_manager_id === currentUser.id
  );

  const filtered = deptMembers.filter(
    (m) =>
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalShell portal="manager">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-serif tracking-tight text-[#101C35]">
              Department Team Directory &amp; Roster
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct reports, staff profiles, and leave telemetry for your corporate division.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((member) => {
            const memberBalances = balances.filter((b) => b.user_id === member.id);
            const totalAvailable = memberBalances.reduce((sum, b) => sum + b.available, 0);
            const memberPending = leaveRequests.filter(
              (r) => r.user_id === member.id && r.status === "pending"
            ).length;

            return (
              <div
                key={member.id}
                className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <img
                      src={member.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                      alt={member.full_name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {member.full_name}
                        </h3>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            member.is_active ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                          title={member.is_active ? "Active Employee" : "Inactive"}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {member.designation}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        {member.employee_id}
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 py-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{member.phone || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Joined: {formatDate(member.joining_date, "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>

                {/* Balances footer pill */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Available Leaves:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {totalAvailable} Days
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalShell>
  );
}
