"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { ExportButtons } from "@/components/ui/export-buttons";
import { LeaveTable } from "@/components/ui/leave-table";
import { formatDate } from "@/lib/utils";
import {
  FileSpreadsheet,
  Download,
  Filter,
  BarChart3,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function AdminReportsPage() {
  const { profiles, departments, leaveRequests, leaveTypes, balances } = useAppStore();

  const [activeReportTab, setActiveReportTab] = useState<
    "utilization" | "department" | "pending" | "annual"
  >("utilization");

  const [selectedDeptId, setSelectedDeptId] = useState("all");

  const enrichedRequests = leaveRequests.map((r) => ({
    ...r,
    user: profiles.find((p) => p.id === r.user_id),
  }));

  // Filter requests based on department
  const filteredRequests = enrichedRequests.filter((r) => {
    if (selectedDeptId === "all") return true;
    const user = profiles.find((p) => p.id === r.user_id);
    return user?.department_id === selectedDeptId;
  });

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Executive Reports & Audit Exports
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive institutional compliance reporting with PDF, Excel, and CSV generation.
            </p>
          </div>

          <ExportButtons
            data={filteredRequests}
            leaveTypes={leaveTypes}
            filenamePrefix={`institution-leave-report-${activeReportTab}`}
          />
        </div>

        {/* Tab Controls & Department Filter */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveReportTab("utilization")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeReportTab === "utilization"
                  ? "bg-white dark:bg-[#161F30] text-[#3448A5] dark:text-[#7485D8] shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Quota Utilization
            </button>
            <button
              onClick={() => setActiveReportTab("department")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeReportTab === "department"
                  ? "bg-white dark:bg-[#161F30] text-[#3448A5] dark:text-[#7485D8] shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Department Summary
            </button>
            <button
              onClick={() => setActiveReportTab("pending")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeReportTab === "pending"
                  ? "bg-white dark:bg-[#161F30] text-[#3448A5] dark:text-[#7485D8] shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Pending Compliance
            </button>
            <button
              onClick={() => setActiveReportTab("annual")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeReportTab === "annual"
                  ? "bg-white dark:bg-[#161F30] text-[#3448A5] dark:text-[#7485D8] shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Annual Registry
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Division:</span>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
            >
              <option value="all">All Divisions</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab 1: Quota Utilization Table */}
        {activeReportTab === "utilization" && (
          <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Employee Quota Utilization Analysis
              </h3>
              <p className="text-xs text-slate-400">
                Entitlement allocation vs. actual consumed days
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] font-semibold border-b">
                  <tr>
                    <th className="py-3 px-4">Corporate Employee</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4 text-center">Allocated Total</th>
                    <th className="py-3 px-4 text-center">Used Total</th>
                    <th className="py-3 px-4 text-center">Available Balance</th>
                    <th className="py-3 px-4 text-center">Burn Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {profiles.map((p) => {
                    const dept = departments.find((d) => d.id === p.department_id);
                    const userBals = balances.filter((b) => b.user_id === p.id);
                    const totalAlloc = userBals.reduce((sum, b) => sum + b.allocated, 0) || 52;
                    const totalUsed = userBals.reduce((sum, b) => sum + b.used, 0) || 0;
                    const totalAvail = userBals.reduce((sum, b) => sum + b.available, 0) || totalAlloc;
                    const burnPercent = Math.min(100, Math.round((totalUsed / totalAlloc) * 100));

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {p.full_name} ({p.employee_id})
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {dept?.code || "GEN"}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold">{totalAlloc} d</td>
                        <td className="py-3 px-4 text-center font-semibold text-rose-600">{totalUsed} d</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600">{totalAvail} d</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {burnPercent}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Department Summary */}
        {activeReportTab === "department" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept) => {
              const dMembers = profiles.filter((p) => p.department_id === dept.id);
              const dMemberIds = new Set(dMembers.map((m) => m.id));
              const dRequests = leaveRequests.filter((r) => dMemberIds.has(r.user_id));
              const approved = dRequests.filter((r) => r.status === "approved").length;

              return (
                <div
                  key={dept.id}
                  className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-5 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#3448A5]">
                        {dept.code}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {dept.name}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      {dMembers.length} Employee
                    </span>
                  </div>

                  <div className="pt-2 border-t space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Total Requests:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{dRequests.length}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Approved Sanctions:</span>
                      <span className="font-bold text-emerald-600">{approved}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Approval Rate:</span>
                      <span className="font-bold text-[#3448A5]">
                        {dRequests.length > 0 ? Math.round((approved / dRequests.length) * 100) : 100}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3 & 4: Master Table */}
        {(activeReportTab === "pending" || activeReportTab === "annual") && (
          <LeaveTable
            requests={
              activeReportTab === "pending"
                ? filteredRequests.filter((r) => r.status === "pending")
                : filteredRequests
            }
            leaveTypes={leaveTypes}
            showEmployeeColumn={true}
          />
        )}
      </div>
    </PortalShell>
  );
}
