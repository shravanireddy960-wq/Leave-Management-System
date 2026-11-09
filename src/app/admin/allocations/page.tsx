"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { PieChart, Plus, Search, Check, Sliders, ArrowUpDown } from "lucide-react";

export default function AdminAllocationsPage() {
  const { profiles, leaveTypes, balances, adjustBalance } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState(leaveTypes[0]?.id || "");
  const [newQuota, setNewQuota] = useState(12);
  const [reason, setReason] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filteredEmployee = profiles.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdjust = (userId: string, typeId: string, currentAlloc: number) => {
    setSelectedEmployeeId(userId);
    setSelectedLeaveTypeId(typeId);
    setNewQuota(currentAlloc);
    setReason("Annual quota adjustment sanctioned by Administrator.");
  };

  const handleSaveAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) return;

    adjustBalance(selectedEmployeeId, selectedLeaveTypeId, newQuota, reason);
    const employee = profiles.find((p) => p.id === selectedEmployeeId);
    setSuccessMsg(`Balance updated for ${employee?.full_name}.`);
    setSelectedEmployeeId(null);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Employee Leave Allocations & Balance Adjustments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review and calibrate annual leave quotas, discretionary credits, and audited adjustments.
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

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Allocations Table */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200/70 dark:border-slate-800 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Corporate Employee</th>
                  <th className="py-3 px-4">Employee ID</th>
                  {leaveTypes.slice(0, 4).map((lt) => (
                    <th key={lt.id} className="py-3 px-4 text-center">
                      {lt.code} Balance
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredEmployee.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                          alt={member.full_name}
                          className="w-7 h-7 rounded-full object-cover border shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {member.full_name}
                          </span>
                          <span className="text-[10px] text-slate-400">{member.designation}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium">{member.employee_id}</td>

                    {leaveTypes.slice(0, 4).map((lt) => {
                      const bal = balances.find(
                        (b) => b.user_id === member.id && b.leave_type_id === lt.id && b.year === 2025
                      );

                      return (
                        <td key={lt.id} className="py-3.5 px-4 text-center">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {bal?.available ?? lt.annual_quota}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            / {bal?.allocated ?? lt.annual_quota} d
                          </span>
                        </td>
                      );
                    })}

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() =>
                          handleOpenAdjust(member.id, leaveTypes[0].id, leaveTypes[0].annual_quota)
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#3448A5] hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        Adjust Balance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Adjust Balance Modal */}
      {selectedEmployeeId && (
        <Modal
          isOpen={Boolean(selectedEmployeeId)}
          onClose={() => setSelectedEmployeeId(null)}
          title="Adjust Employee Leave Balance"
          description={`Employee: ${profiles.find((p) => p.id === selectedEmployeeId)?.full_name}`}
        >
          <form onSubmit={handleSaveAdjust} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Leave Category</label>
              <select
                value={selectedLeaveTypeId}
                onChange={(e) => setSelectedLeaveTypeId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-medium"
              >
                {leaveTypes.map((lt) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.name} ({lt.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">New Total Allocation (Days)</label>
              <input
                required
                type="number"
                min={0}
                value={newQuota}
                onChange={(e) => setNewQuota(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Mandatory Reason for Adjustment</label>
              <textarea
                required
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Administrator special sanction, service anniversary credit, compensatory credit..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setSelectedEmployeeId(null)}
                className="px-3.5 py-1.5 border rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#3448A5] text-white rounded-xl text-xs font-bold"
              >
                Save Adjustment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </PortalShell>
  );
}
