"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import type { LeaveType } from "@/types/database";
import { Compass, Plus, Edit, Check, ShieldCheck, FileCheck, AlertCircle } from "lucide-react";

export default function AdminLeaveTypesPage() {
  const { leaveTypes, addLeaveType, updateLeaveType } = useAppStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingType, setEditingType] = useState<LeaveType | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [annualQuota, setAnnualQuota] = useState(12);
  const [isPaid, setIsPaid] = useState(true);
  const [requiresDoc, setRequiresDoc] = useState(false);
  const [maxDays, setMaxDays] = useState(7);
  const [carryForward, setCarryForward] = useState(false);
  const [color, setColor] = useState("#3448A5");
  const [formError, setFormError] = useState("");

  const handleOpenAdd = () => {
    setFormError("");
    setCode("");
    setName("");
    setDescription("");
    setAnnualQuota(10);
    setIsPaid(true);
    setRequiresDoc(false);
    setMaxDays(5);
    setCarryForward(false);
    setColor("#3448A5");
    setIsAddOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedCode = code.trim().toUpperCase();
    const trimmedName = name.trim();

    if (!trimmedCode || trimmedCode.length < 2) {
      setFormError("Leave category code must be at least 2 characters (e.g. CL, SL, PL).");
      return;
    }

    if (!/^[A-Z0-9_-]{2,8}$/.test(trimmedCode)) {
      setFormError("Leave code must be 2 to 8 uppercase alphanumeric characters.");
      return;
    }

    if (leaveTypes.some((lt) => lt.code.toUpperCase() === trimmedCode)) {
      setFormError(`A leave category with code "${trimmedCode}" already exists.`);
      return;
    }

    if (!trimmedName || trimmedName.length < 2) {
      setFormError("Leave category name must be at least 2 characters.");
      return;
    }

    if (isNaN(annualQuota) || annualQuota < 0 || annualQuota > 365) {
      setFormError("Annual quota must be between 0 and 365 days.");
      return;
    }

    if (isNaN(maxDays) || maxDays < 1 || maxDays > 365) {
      setFormError("Max consecutive days must be at least 1 day.");
      return;
    }

    addLeaveType({
      code: trimmedCode,
      name: trimmedName,
      description: description.trim(),
      annual_quota: annualQuota,
      is_paid: isPaid,
      requires_document: requiresDoc,
      max_consecutive_days: maxDays,
      carry_forward_eligible: carryForward,
      color,
    });
    setIsAddOpen(false);
  };

  const handleOpenEdit = (lt: LeaveType) => {
    setFormError("");
    setEditingType(lt);
    setCode(lt.code);
    setName(lt.name);
    setDescription(lt.description);
    setAnnualQuota(lt.annual_quota);
    setIsPaid(lt.is_paid);
    setRequiresDoc(lt.requires_document);
    setMaxDays(lt.max_consecutive_days);
    setCarryForward(lt.carry_forward_eligible);
    setColor(lt.color);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;
    setFormError("");

    const trimmedCode = code.trim().toUpperCase();
    const trimmedName = name.trim();

    if (!trimmedCode || trimmedCode.length < 2) {
      setFormError("Leave category code must be at least 2 characters.");
      return;
    }

    if (!/^[A-Z0-9_-]{2,8}$/.test(trimmedCode)) {
      setFormError("Leave code must be 2 to 8 uppercase alphanumeric characters.");
      return;
    }

    if (leaveTypes.some((lt) => lt.id !== editingType.id && lt.code.toUpperCase() === trimmedCode)) {
      setFormError(`Another category already uses the code "${trimmedCode}".`);
      return;
    }

    if (!trimmedName || trimmedName.length < 2) {
      setFormError("Leave category name must be at least 2 characters.");
      return;
    }

    if (isNaN(annualQuota) || annualQuota < 0 || annualQuota > 365) {
      setFormError("Annual quota must be between 0 and 365 days.");
      return;
    }

    if (isNaN(maxDays) || maxDays < 1 || maxDays > 365) {
      setFormError("Max consecutive days must be at least 1 day.");
      return;
    }

    updateLeaveType(editingType.id, {
      code: trimmedCode,
      name: trimmedName,
      description: description.trim(),
      annual_quota: annualQuota,
      is_paid: isPaid,
      requires_document: requiresDoc,
      max_consecutive_days: maxDays,
      carry_forward_eligible: carryForward,
      color,
    });
    setEditingType(null);
  };

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Leave Categories & Quotas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure statutory leave types, document requirements, and carry-forward rules.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3448A5] hover:bg-[#2B3C8C] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Leave Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {leaveTypes.map((lt) => (
            <div
              key={lt.id}
              className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: lt.color }}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {lt.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        Code: {lt.code}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(lt)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Rules"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                  {lt.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual Allocation:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{lt.annual_quota} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pay Status:</span>
                    <span className={`font-semibold ${lt.is_paid ? "text-emerald-600" : "text-rose-600"}`}>
                      {lt.is_paid ? "Paid Full Salary" : "Loss of Pay"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Consecutive Days:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {lt.max_consecutive_days} Days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Document Upload:</span>
                    <span className={`font-semibold ${lt.requires_document ? "text-blue-600" : "text-slate-500"}`}>
                      {lt.requires_document ? "Mandatory" : "Optional"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Carry Forward:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {lt.carry_forward_eligible ? "Yes (Eligible)" : "No (Lapses)"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Policy Status</span>
                <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Category
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Leave Category Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Institutional Leave Category"
        description="Define entitlement quotas, pay status, and proof requirements."
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Code *</label>
              <input
                required
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SBL"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Leave Name *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sabbatical Research Leave"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Policy conditions and permissible use cases..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Annual Quota (Days)</label>
              <input
                required
                type="number"
                min={0}
                value={annualQuota}
                onChange={(e) => setAnnualQuota(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Max Consecutive</label>
              <input
                required
                type="number"
                min={1}
                value={maxDays}
                onChange={(e) => setMaxDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Accent Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 rounded-xl p-1 bg-slate-50 dark:bg-slate-800 border cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-4 h-4 rounded text-[#3448A5]"
              />
              <span className="text-xs font-medium">Paid Leave (Full Remuneration)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresDoc}
                onChange={(e) => setRequiresDoc(e.target.checked)}
                className="w-4 h-4 rounded text-[#3448A5]"
              />
              <span className="text-xs font-medium">Require Supporting Document Proof</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={carryForward}
                onChange={(e) => setCarryForward(e.target.checked)}
                className="w-4 h-4 rounded text-[#3448A5]"
              />
              <span className="text-xs font-medium">Eligible for Carry-Forward to Next Session</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-3.5 py-1.5 border rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#3448A5] text-white rounded-xl text-xs font-bold"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      {editingType && (
        <Modal
          isOpen={Boolean(editingType)}
          onClose={() => setEditingType(null)}
          title={`Edit Leave Category: ${editingType.name}`}
          description={`Code: ${editingType.code}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Code</label>
                <input
                  required
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Annual Quota</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={annualQuota}
                  onChange={(e) => setAnnualQuota(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Max Consecutive</label>
                <input
                  required
                  type="number"
                  min={1}
                  value={maxDays}
                  onChange={(e) => setMaxDays(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-9 rounded-xl p-1 bg-slate-50 dark:bg-slate-800 border cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3448A5]"
                />
                <span className="text-xs font-medium">Paid Leave</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresDoc}
                  onChange={(e) => setRequiresDoc(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3448A5]"
                />
                <span className="text-xs font-medium">Require Supporting Document Proof</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={carryForward}
                  onChange={(e) => setCarryForward(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3448A5]"
                />
                <span className="text-xs font-medium">Carry Forward Eligible</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingType(null)}
                className="px-3.5 py-1.5 border rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#3448A5] text-white rounded-xl text-xs font-bold"
              >
                Update Category
              </button>
            </div>
          </form>
        </Modal>
      )}
    </PortalShell>
  );
}
