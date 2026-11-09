"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/types/database";
import { Briefcase, UserCheck, Building2, Mail, Phone, Edit, Check, ShieldCheck, Users } from "lucide-react";

export default function AdminManagersPage() {
  const { profiles, departments, updateDepartment, updateEmployee } = useAppStore();

  const [selectedManager, setSelectedManager] = useState<Profile | null>(null);
  const [targetDeptId, setTargetDeptId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const managers = profiles.filter((p) => p.role === "manager" || p.role === "admin");

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManager) return;

    if (targetDeptId) {
      updateDepartment(targetDeptId, { manager_id: selectedManager.id });
      updateEmployee(selectedManager.id, { department_id: targetDeptId });
    }

    setSelectedManager(null);
    setSuccessMsg(`Successfully reassigned approval authority for ${selectedManager.full_name}.`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E9DFD0] text-[#C5A46D] text-[10px] font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Leadership Governance</span>
          </div>
          <h2 className="text-2xl font-bold font-serif tracking-tight text-[#101C35]">
            Corporate Managers &amp; Approval Authority
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure managerial authority, department leadership assignments, and approval routing across business units.
          </p>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2 shadow-sm">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {managers.map((mgr) => {
            const managingDepts = departments.filter((d) => d.manager_id === mgr.id);
            const directReports = profiles.filter((p) => p.reporting_manager_id === mgr.id).length;

            return (
              <div
                key={mgr.id}
                className="bg-white rounded-3xl border border-[#E9DFD0] p-5 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.06)] flex flex-col justify-between hover:border-[#C5A46D]/60 transition-all"
              >
                <div>
                  <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
                    <img
                      src={mgr.avatar_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"}
                      alt={mgr.full_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#E9DFD0] ring-1 ring-[#C5A46D]/30 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-serif text-[#101C35] truncate">
                          {mgr.full_name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#FAF5EB] text-[#C5A46D] border border-[#E9DFD0]">
                          {mgr.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {mgr.designation}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        {mgr.employee_id}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 py-3 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Department Lead for:</span>
                      <span className="font-bold text-[#101C35]">
                        {managingDepts.length > 0
                          ? managingDepts.map((d) => d.code).join(", ")
                          : "Cross-functional"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Direct Reports:</span>
                      <span className="font-bold text-[#101C35]">
                        {directReports} Corporate Employees
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Approval Level:</span>
                      <span className="font-bold text-[#C5A46D]">
                        Level 1 (Direct Manager)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedManager(mgr);
                      setTargetDeptId(managingDepts[0]?.id || "");
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#101C35] hover:text-[#DCC49B] text-xs font-semibold text-[#101C35] border border-[#E9DFD0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Reassign Responsibilities</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reassign Responsibilities Modal */}
      {selectedManager && (
        <Modal
          isOpen={Boolean(selectedManager)}
          onClose={() => setSelectedManager(null)}
          title={`Configure Approval Authority: ${selectedManager.full_name}`}
          description="Assign reporting departments and managerial approval jurisdiction."
        >
          <form onSubmit={handleSaveAssignment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#101C35]">Assigned Department</label>
              <select
                value={targetDeptId}
                onChange={(e) => setTargetDeptId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl font-medium text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              >
                <option value="">Select Department...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E9DFD0]">
              <button
                type="button"
                onClick={() => setSelectedManager(null)}
                className="px-4 py-2 border border-[#E9DFD0] rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#101C35] hover:bg-[#1A2C54] text-[#DCC49B] rounded-xl text-xs font-bold shadow-sm"
              >
                Save Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </PortalShell>
  );
}
