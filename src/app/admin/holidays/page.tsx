"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import type { Holiday, HolidayType } from "@/types/database";
import { CalendarCheck2, Plus, Edit, Trash2, Search, Check, AlertCircle } from "lucide-react";

export default function AdminHolidaysPage() {
  const { holidays, addHoliday, updateHoliday, deleteHoliday } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  const [name, setName] = useState("");
  const [date, setDate] = useState("2025-12-31");
  const [type, setType] = useState<HolidayType>("mandatory");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [formError, setFormError] = useState("");

  const filtered = holidays.filter((h) =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormError("");
    setName("");
    setDate("2025-11-28");
    setType("mandatory");
    setDescription("");
    setIsRecurring(false);
    setIsAddOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name || !name.trim() || name.trim().length < 2) {
      setFormError("Holiday name must be at least 2 characters.");
      return;
    }

    if (!date || !date.trim()) {
      setFormError("Please select a valid holiday date.");
      return;
    }

    if (holidays.some((h) => h.date === date.trim())) {
      setFormError(`A holiday is already scheduled on ${date.trim()}.`);
      return;
    }

    addHoliday({
      name: name.trim(),
      date: date.trim(),
      type,
      description: description.trim(),
      is_recurring: isRecurring,
    });
    setIsAddOpen(false);
  };

  const handleOpenEdit = (h: Holiday) => {
    setFormError("");
    setEditingHoliday(h);
    setName(h.name);
    setDate(h.date);
    setType(h.type);
    setDescription(h.description || "");
    setIsRecurring(h.is_recurring);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHoliday) return;
    setFormError("");

    if (!name || !name.trim() || name.trim().length < 2) {
      setFormError("Holiday name must be at least 2 characters.");
      return;
    }

    if (!date || !date.trim()) {
      setFormError("Please select a valid holiday date.");
      return;
    }

    if (holidays.some((h) => h.id !== editingHoliday.id && h.date === date.trim())) {
      setFormError(`Another holiday is already scheduled on ${date.trim()}.`);
      return;
    }

    updateHoliday(editingHoliday.id, {
      name: name.trim(),
      date: date.trim(),
      type,
      description: description.trim(),
      is_recurring: isRecurring,
    });
    setEditingHoliday(null);
  };

  const handleDelete = (id: string, hName: string) => {
    if (confirm(`Are you sure you want to remove ${hName} from the institutional holiday schedule?`)) {
      deleteHoliday(id);
    }
  };

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Holiday Master
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Declare official closures, public holidays, and discretionary festival breaks.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3448A5] hover:bg-[#2B3C8C] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Holiday</span>
          </button>
        </div>

        {/* Holiday Table */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200/70 dark:border-slate-800 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Holiday Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Annual Recurring</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filtered.map((h) => (
                  <tr
                    key={h.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {formatDate(h.date, "EEE, MMM dd, yyyy")}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {h.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60">
                        {h.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {h.description || "General corporate closure"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {h.is_recurring ? "Yes (Every Year)" : "One-Time"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(h)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(h.id, h.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Holiday Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Schedule Institutional Holiday"
        description="Add a public holiday, corporate recess, or regional festival day."
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1">Holiday Name *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thanksgiving Recess"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Date *</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Holiday Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as HolidayType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-medium"
              >
                <option value="mandatory">Mandatory Institutional Holiday</option>
                <option value="restricted">Restricted / Discretionary</option>
                <option value="corporate_break">Quarter Recess / Break</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details regarding office operations and employee commitments..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded text-[#3448A5]"
            />
            <span className="text-xs font-medium">Repeats Annually on Same Calendar Date</span>
          </label>

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
              Schedule Holiday
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Holiday Modal */}
      {editingHoliday && (
        <Modal
          isOpen={Boolean(editingHoliday)}
          onClose={() => setEditingHoliday(null)}
          title={`Edit Holiday: ${editingHoliday.name}`}
          description={`Date: ${editingHoliday.date}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Date</label>
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as HolidayType)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-medium"
                >
                  <option value="mandatory">Mandatory Institutional Holiday</option>
                  <option value="restricted">Restricted / Discretionary</option>
                  <option value="corporate_break">Quarter Recess / Break</option>
                </select>
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

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingHoliday(null)}
                className="px-3.5 py-1.5 border rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#3448A5] text-white rounded-xl text-xs font-bold"
              >
                Save Updates
              </button>
            </div>
          </form>
        </Modal>
      )}
    </PortalShell>
  );
}
