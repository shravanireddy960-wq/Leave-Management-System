"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import type { Department } from "@/types/database";
import { Building2, Plus, Edit, Users, ShieldCheck, Check, AlertCircle } from "lucide-react";

export default function AdminDepartmentsPage() {
  const { departments, profiles, addDepartment, updateDepartment } = useAppStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [managerId, setManagerId] = useState("");
  const [formError, setFormError] = useState("");

  const handleOpenAdd = () => {
    setFormError("");
    setCode("");
    setName("");
    setDescription("");
    setManagerId("");
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedCode = code.trim().toUpperCase();
    const trimmedName = name.trim();

    if (!trimmedCode || trimmedCode.length < 2) {
      setFormError("Department code must be at least 2 characters (e.g. ENG, HR).");
      return;
    }

    if (!/^[A-Z0-9_-]{2,8}$/.test(trimmedCode)) {
      setFormError("Department code can only contain 2 to 8 alphanumeric characters or hyphens.");
      return;
    }

    if (departments.some((d) => d.code.toUpperCase() === trimmedCode)) {
      setFormError(`A department with code "${trimmedCode}" already exists.`);
      return;
    }

    if (!trimmedName || trimmedName.length < 2) {
      setFormError("Department name must be at least 2 characters long.");
      return;
    }

    addDepartment({
      code: trimmedCode,
      name: trimmedName,
      description: description.trim(),
      manager_id: managerId || undefined,
    });
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (dept: Department) => {
    setFormError("");
    setEditingDept(dept);
    setCode(dept.code);
    setName(dept.name);
    setDescription(dept.description || "");
    setManagerId(dept.manager_id || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    setFormError("");

    const trimmedCode = code.trim().toUpperCase();
    const trimmedName = name.trim();

    if (!trimmedCode || trimmedCode.length < 2) {
      setFormError("Department code must be at least 2 characters.");
      return;
    }

    if (!/^[A-Z0-9_-]{2,8}$/.test(trimmedCode)) {
      setFormError("Department code can only contain 2 to 8 alphanumeric characters or hyphens.");
      return;
    }

    if (departments.some((d) => d.id !== editingDept.id && d.code.toUpperCase() === trimmedCode)) {
      setFormError(`Another department already uses the code "${trimmedCode}".`);
      return;
    }

    if (!trimmedName || trimmedName.length < 2) {
      setFormError("Department name must be at least 2 characters long.");
      return;
    }

    updateDepartment(editingDept.id, {
      code: trimmedCode,
      name: trimmedName,
      description: description.trim(),
      manager_id: managerId || undefined,
    });
    setEditingDept(null);
  };

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E9DFD0] text-[#C5A46D] text-[10px] font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Corporate Structure Administration</span>
            </div>
            <h2 className="text-2xl font-bold font-serif tracking-tight text-[#101C35]">
              Corporate Departments &amp; Business Units
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure organizational divisions, assign Department Managers &amp; Leads, and monitor workforce headcount.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#101C35] hover:bg-[#1A2C54] text-[#DCC49B] text-xs font-bold shadow-[0_4px_15px_rgba(16,28,53,0.2)] transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#DCC49B]" />
            <span>Create Department</span>
          </button>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => {
            const employeeCount = profiles.filter((p) => p.department_id === dept.id).length;
            const assignedManager = profiles.find((p) => p.id === dept.manager_id);

            return (
              <div
                key={dept.id}
                className="bg-white rounded-3xl border border-[#E9DFD0] p-5 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.06)] flex flex-col justify-between hover:border-[#C5A46D]/60 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold bg-[#FAF5EB] text-[#C5A46D] border border-[#E9DFD0]">
                        {dept.code}
                      </span>
                      <h3 className="text-base font-bold font-serif text-[#101C35] mt-2">
                        {dept.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-[#101C35] hover:bg-[#FAF7F2] border border-transparent hover:border-[#E9DFD0] transition-all cursor-pointer"
                      title="Edit Department"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {dept.description || "Active corporate department."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A46D]" />
                        <span>Department Manager:</span>
                      </span>
                      <span className="font-bold text-[#101C35] truncate max-w-[150px]">
                        {assignedManager?.full_name || "Unassigned"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>Workforce:</span>
                      </span>
                      <span className="font-bold text-[#101C35]">
                        {employeeCount} Members
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Status</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active Division
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Establish New Corporate Department"
        description="Create an organizational business unit and assign a Department Manager."
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-[#FDF0F0] border border-[#F2C5C5] text-xs text-[#9E3E3E] flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#101C35]">Department Code *</label>
              <input
                required
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. ENG, FIN, PRD"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl font-mono uppercase text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#101C35]">Department Name *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Global Operations"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#101C35]">Department Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Business goals, team scope, core functions..."
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#101C35]">Assign Department Manager / Lead</label>
            <select
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl font-medium text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
            >
              <option value="">Select Manager...</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name} ({p.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E9DFD0]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-[#E9DFD0] rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#FAF7F2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#101C35] hover:bg-[#1A2C54] text-[#DCC49B] rounded-xl text-xs font-bold shadow-sm"
            >
              Create Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      {editingDept && (
        <Modal
          isOpen={Boolean(editingDept)}
          onClose={() => setEditingDept(null)}
          title={`Edit Department: ${editingDept.name}`}
          description={`Department Code: ${editingDept.code}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-2xl bg-[#FDF0F0] border border-[#F2C5C5] text-xs text-[#9E3E3E] flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#101C35]">Department Code</label>
                <input
                  required
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl font-mono uppercase text-[#101C35]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#101C35]">Department Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#101C35]">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#101C35]">Department Manager / Lead</label>
              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl font-medium text-[#101C35]"
              >
                <option value="">Unassigned</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E9DFD0]">
              <button
                type="button"
                onClick={() => setEditingDept(null)}
                className="px-4 py-2 border border-[#E9DFD0] rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#101C35] hover:bg-[#1A2C54] text-[#DCC49B] rounded-xl text-xs font-bold shadow-sm"
              >
                Save Department
              </button>
            </div>
          </form>
        </Modal>
      )}
    </PortalShell>
  );
}
