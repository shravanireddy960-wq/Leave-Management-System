"use client";

import React, { useState, useRef } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import { validateName, validateEmail, validatePhone, validateEmployeeId } from "@/lib/validations";
import type { Profile, UserRole } from "@/types/database";
import {
  Users,
  UserPlus,
  Search,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Edit,
  Power,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Briefcase,
  UserCheck,
  AlertCircle,
  Calendar,
  Lock,
  Camera,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

const CORPORATE_PRESET_AVATARS = [
  { label: "Executive 1", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" },
  { label: "Executive 2", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300" },
  { label: "Executive 3", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300" },
  { label: "Executive 4", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300" },
  { label: "Executive 5", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300" },
  { label: "Executive 6", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300" },
];

export default function AdminEmployeesPage() {
  const { profiles, departments, addEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus } = useAppStore();

  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Profile | null>(null);
  const [viewingEmp, setViewingEmp] = useState<Profile | null>(null);
  const [deletingEmp, setDeletingEmp] = useState<Profile | null>(null);
  const [modalError, setModalError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState<UserRole>("employee");
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
  const [reportingManagerId, setReportingManagerId] = useState("");
  const [designation, setDesignation] = useState("Senior Software Engineer");
  const [phone, setPhone] = useState("+91 98450 12345");
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split("T")[0]);
  const [isActive, setIsActive] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(CORPORATE_PRESET_AVATARS[0].url);
  const [showPresets, setShowPresets] = useState(false);

  // Available managers & admins who can be assigned as reporting managers
  const availableManagers = profiles.filter((p) => p.role === "manager" || p.role === "admin");

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === "all" || p.department_id === deptFilter;
    const matchesRole = roleFilter === "all" || p.role === roleFilter;

    return matchesSearch && matchesDept && matchesRole;
  });

  const showSuccessBanner = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(""), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setModalError("The selected photo exceeds the 5MB size limit. Please select a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        setModalError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setModalError("");
    setFullName("");
    setEmail("");
    setEmployeeId(`EMP-${Math.floor(100 + Math.random() * 900)}`);
    setRole("employee");
    setDepartmentId(departments[0]?.id || "");
    const defaultManager = availableManagers.find((m) => m.role === "manager") || availableManagers[0];
    setReportingManagerId(defaultManager ? defaultManager.id : "");
    setDesignation("Senior Software Engineer");
    setPhone("+91 98450 12345");
    setJoiningDate(new Date().toISOString().split("T")[0]);
    setIsActive(true);
    setAvatarUrl(CORPORATE_PRESET_AVATARS[Math.floor(Math.random() * CORPORATE_PRESET_AVATARS.length)].url);
    setShowPresets(false);
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    // Name Validation
    const nameVal = validateName(fullName);
    if (!nameVal.isValid) {
      setModalError(nameVal.error || "Please enter a valid full name.");
      return;
    }

    // Email Validation
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setModalError(emailVal.error || "Please enter a valid official email address.");
      return;
    }

    // Duplicate Email Check
    if (profiles.some((p) => p.email.toLowerCase() === email.trim().toLowerCase())) {
      setModalError(`An employee account with email ${email.trim()} is already registered.`);
      return;
    }

    // Employee ID Validation
    const empIdVal = validateEmployeeId(employeeId);
    if (!empIdVal.isValid) {
      setModalError(empIdVal.error || "Please enter a valid employee ID.");
      return;
    }

    // Duplicate Employee ID Check
    if (profiles.some((p) => p.employee_id.toUpperCase() === employeeId.trim().toUpperCase())) {
      setModalError(`Employee ID ${employeeId.trim().toUpperCase()} is already assigned to another staff member.`);
      return;
    }

    // Phone Validation
    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      setModalError(phoneVal.error || "Please enter a valid 10-15 digit phone number.");
      return;
    }

    addEmployee({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      employee_id: employeeId.trim().toUpperCase(),
      role,
      department_id: departmentId,
      reporting_manager_id: reportingManagerId || undefined,
      designation: designation.trim(),
      phone: phone.trim(),
      joining_date: joiningDate,
      is_active: isActive,
      avatar_url: avatarUrl,
    });

    setIsAddModalOpen(false);
    showSuccessBanner(`Employee ${fullName.trim()} (${employeeId.trim().toUpperCase()}) created successfully!`);
  };

  const handleOpenEdit = (emp: Profile) => {
    setModalError("");
    setEditingEmp(emp);
    setFullName(emp.full_name);
    setEmail(emp.email);
    setEmployeeId(emp.employee_id);
    setRole(emp.role);
    setDepartmentId(emp.department_id || departments[0]?.id || "");
    setReportingManagerId(emp.reporting_manager_id || "");
    setDesignation(emp.designation);
    setPhone(emp.phone || "");
    setJoiningDate(emp.joining_date || new Date().toISOString().split("T")[0]);
    setIsActive(emp.is_active);
    setAvatarUrl(emp.avatar_url || CORPORATE_PRESET_AVATARS[0].url);
    setShowPresets(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;
    setModalError("");

    // Name Validation
    const nameVal = validateName(fullName);
    if (!nameVal.isValid) {
      setModalError(nameVal.error || "Please enter a valid full name.");
      return;
    }

    // Email Validation
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setModalError(emailVal.error || "Please enter a valid corporate email address.");
      return;
    }

    // Duplicate Email Check (excluding current)
    if (profiles.some((p) => p.id !== editingEmp.id && p.email.toLowerCase() === email.trim().toLowerCase())) {
      setModalError(`An employee account with email ${email.trim()} is already registered.`);
      return;
    }

    // Employee ID Validation
    const empIdVal = validateEmployeeId(employeeId);
    if (!empIdVal.isValid) {
      setModalError(empIdVal.error || "Please enter a valid employee ID.");
      return;
    }

    // Duplicate Employee ID Check excluding current record
    if (profiles.some((p) => p.id !== editingEmp.id && p.employee_id.toUpperCase() === employeeId.trim().toUpperCase())) {
      setModalError(`Employee ID ${employeeId.trim().toUpperCase()} belongs to another staff record.`);
      return;
    }

    // Phone Validation
    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      setModalError(phoneVal.error || "Please enter a valid 10-15 digit phone number.");
      return;
    }

    updateEmployee(editingEmp.id, {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      employee_id: employeeId.trim().toUpperCase(),
      role,
      department_id: departmentId,
      reporting_manager_id: reportingManagerId || undefined,
      designation: designation.trim(),
      phone: phone.trim(),
      joining_date: joiningDate,
      is_active: isActive,
      avatar_url: avatarUrl,
    });

    const updatedName = fullName.trim();
    setEditingEmp(null);
    showSuccessBanner(`Employee ${updatedName} updated successfully.`);
  };

  const handleDeleteConfirm = () => {
    if (!deletingEmp) return;
    const name = deletingEmp.full_name;
    const id = deletingEmp.id;
    deleteEmployee(id);
    setDeletingEmp(null);
    showSuccessBanner(`Employee ${name} was permanently removed.`);
  };

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E9DFD0] text-[#C5A46D] text-[10px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Workforce Administration Terminal</span>
            </div>
            <h2 className="text-2xl font-bold font-serif tracking-tight text-[#101C35]">
              Corporate Employee Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive personnel directory with complete CRUD operations, manager assignments, designations, photo management, and governance clearance.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#101C35] hover:bg-[#1A2C54] text-[#DCC49B] text-xs font-bold shadow-[0_4px_15px_rgba(16,28,53,0.2)] transition-all hover:scale-[1.02] cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#DCC49B]" />
            <span>Add New Employee</span>
          </button>
        </div>

        {/* Action feedback toast */}
        {actionSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Filter controls */}
        <div className="bg-white rounded-3xl border border-[#E9DFD0] p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-2xl">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, ID, title, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
            >
              <option value="all">All Corporate Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
            >
              <option value="all">All Corporate Roles</option>
              <option value="employee">Corporate Employee</option>
              <option value="manager">Engineering / Dept Manager</option>
              <option value="admin">Administrator / HR Executive</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            <strong className="text-[#101C35]">{filteredProfiles.length}</strong> Registered Employees
          </span>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-3xl border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.06)] overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[840px] text-left text-xs">
              <thead className="bg-[#FAF7F2] text-slate-500 font-semibold border-b border-[#E9DFD0] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Employee / Member</th>
                  <th className="py-3.5 px-5">Employee ID</th>
                  <th className="py-3.5 px-5">Department</th>
                  <th className="py-3.5 px-5">Designation</th>
                  <th className="py-3.5 px-5">Reporting Manager</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">CRUD Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProfiles.map((emp) => {
                  const dept = departments.find((d) => d.id === emp.department_id);
                  const manager = profiles.find((p) => p.id === emp.reporting_manager_id);

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-[#FAF7F2]/60 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                            alt={emp.full_name}
                            className="w-9 h-9 rounded-full object-cover border border-[#E9DFD0] ring-1 ring-[#C5A46D]/30 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#101C35] block text-xs">
                              {emp.full_name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {emp.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 font-mono font-bold text-[#101C35]">
                        {emp.employee_id}
                      </td>

                      <td className="py-3.5 px-5 font-medium text-slate-700">
                        {dept?.name || "Corporate Staff"}
                      </td>

                      <td className="py-3.5 px-5 text-slate-600 font-medium">
                        {emp.designation}
                      </td>

                      {/* Bound Reporting Manager Column */}
                      <td className="py-3.5 px-5">
                        {manager ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={manager.avatar_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100"}
                              alt={manager.full_name}
                              className="w-6 h-6 rounded-full object-cover border border-[#E9DFD0]"
                            />
                            <div>
                              <span className="font-bold text-[#101C35] block text-[11px]">
                                {manager.full_name}
                              </span>
                              <span className="text-[10px] text-[#C5A46D] font-medium capitalize">
                                {manager.role}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                            Direct / Executive HR
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            emp.role === "admin"
                              ? "bg-[#FAF5EB] text-[#101C35] border border-[#E9DFD0]"
                              : emp.role === "manager"
                              ? "bg-[#FDF7E8] text-[#8C6B28] border border-[#ECD9A8]"
                              : "bg-[#EAF3ED] text-[#2C6244] border border-[#BDDEC8]"
                          }`}
                        >
                          {emp.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            emp.is_active
                              ? "bg-[#EAF3ED] text-[#2C6244] border border-[#BDDEC8]"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              emp.is_active ? "bg-[#16A37B]" : "bg-slate-400"
                            }`}
                          />
                          <span>{emp.is_active ? "Active" : "Inactive"}</span>
                        </span>
                      </td>

                      {/* CRUD Actions Column */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Profile */}
                          <button
                            onClick={() => setViewingEmp(emp)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-[#101C35] hover:bg-[#FAF7F2] border border-transparent hover:border-[#E9DFD0] transition-all cursor-pointer"
                            title="View Employee Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-[#C5A46D] hover:bg-[#FAF7F2] border border-transparent hover:border-[#E9DFD0] transition-all cursor-pointer"
                            title="Edit Full Employee Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Active Status */}
                          <button
                            onClick={() => toggleEmployeeStatus(emp.id)}
                            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                              emp.is_active
                                ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={emp.is_active ? "Deactivate Account" : "Activate Account"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Employee */}
                          <button
                            onClick={() => setDeletingEmp(emp)}
                            disabled={emp.email === "admin@lms.in"}
                            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                              emp.email === "admin@lms.in"
                                ? "text-slate-200 cursor-not-allowed"
                                : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                            title={emp.email === "admin@lms.in" ? "Primary Administrator protected" : "Delete Employee Record"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal (CREATE) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Corporate Employee"
        description="Register a corporate team member, assign their corporate department, designation, photo, and reporting manager."
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          {modalError && (
            <div className="p-3 rounded-xl bg-[#FDF0F0] border border-[#F2C5C5] text-xs text-[#9E3E3E] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          {/* Profile Photo Selector in Add Modal */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0]">
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C5A46D] shrink-0"
            />
            <div className="space-y-1.5 flex-1">
              <span className="text-xs font-bold text-[#101C35] block">Employee Profile Photo</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addFileInputRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-[#E9DFD0] text-[#101C35] font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-[#E9DFD0] text-[#C5A46D] font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {showPresets ? "Hide Presets" : "Choose Preset"}
                </button>
              </div>
              <input
                ref={addFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {showPresets && (
            <div className="grid grid-cols-6 gap-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9DFD0]">
              {CORPORATE_PRESET_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAvatarUrl(av.url);
                    setShowPresets(false);
                  }}
                  className={`p-1 rounded-xl border transition-all ${
                    avatarUrl === av.url ? "border-[#C5A46D] bg-[#FAF5EB] ring-1 ring-[#C5A46D]" : "border-[#E9DFD0] bg-white"
                  }`}
                >
                  <img src={av.url} alt="preset" className="w-10 h-10 rounded-lg object-cover mx-auto" />
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#101C35] mb-1">Full Name *</label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rachel Sterling"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#101C35] mb-1">Employee ID *</label>
              <input
                required
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] font-mono focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#101C35] mb-1">Official Corporate Email *</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rachel.s@lms.in"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#101C35] mb-1">Corporate Phone *</label>
              <input
                required
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#101C35] mb-1">Corporate Department *</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#101C35] mb-1">Corporate Designation *</label>
              <input
                required
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              />
            </div>
          </div>

          {/* Bound Reporting Manager Selection */}
          <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0] space-y-1.5">
            <label className="block text-xs font-bold text-[#101C35] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Bind to Reporting Manager / Team Lead *</span>
            </label>
            <p className="text-[11px] text-slate-500">
              The assigned reporting manager will receive and adjudicate this employee&apos;s corporate leave applications.
            </p>
            <select
              value={reportingManagerId}
              onChange={(e) => setReportingManagerId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E9DFD0] rounded-xl text-[#101C35] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
            >
              <option value="">Direct / Executive HR Operations</option>
              {availableManagers.map((mgr) => (
                <option key={mgr.id} value={mgr.id}>
                  {mgr.full_name} — {mgr.designation} ({mgr.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#101C35] mb-1">System Access Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl font-medium text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              >
                <option value="employee">Employee Portal</option>
                <option value="manager">Manager Portal</option>
                <option value="admin">Administrator Portal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#101C35] mb-1">Joining Date</label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E9DFD0]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-[#E9DFD0] rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#FAF7F2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#101C35] hover:bg-[#1A2C54] text-[#DCC49B] rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Add Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal (UPDATE - ALL DETAILS + PHOTO) */}
      {editingEmp && (
        <Modal
          isOpen={Boolean(editingEmp)}
          onClose={() => setEditingEmp(null)}
          title={`Edit Employee: ${editingEmp.full_name}`}
          description={`Update complete personnel details for ${editingEmp.employee_id}.`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {modalError && (
              <div className="p-3 rounded-xl bg-[#FDF0F0] border border-[#F2C5C5] text-xs text-[#9E3E3E] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Profile Photo Selector in Edit Modal */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0]">
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C5A46D] shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <span className="text-xs font-bold text-[#101C35] block">Update Profile Photo</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-[#E9DFD0] text-[#101C35] font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Upload Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-[#E9DFD0] text-[#C5A46D] font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    {showPresets ? "Hide Presets" : "Choose Preset"}
                  </button>
                </div>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {showPresets && (
              <div className="grid grid-cols-6 gap-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9DFD0]">
                {CORPORATE_PRESET_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(av.url);
                      setShowPresets(false);
                    }}
                    className={`p-1 rounded-xl border transition-all ${
                      avatarUrl === av.url ? "border-[#C5A46D] bg-[#FAF5EB] ring-1 ring-[#C5A46D]" : "border-[#E9DFD0] bg-white"
                    }`}
                  >
                    <img src={av.url} alt="preset" className="w-10 h-10 rounded-lg object-cover mx-auto" />
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1">Employee ID *</label>
                <input
                  required
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1">Corporate Email Address *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1">Contact Phone *</label>
                <input
                  required
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1">Corporate Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35]"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1">Corporate Designation</label>
                <input
                  required
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35]"
                />
              </div>
            </div>

            {/* Bound Reporting Manager Selection */}
            <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0] space-y-1.5">
              <label className="block text-xs font-bold text-[#101C35] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>Assigned Reporting Manager / Team Lead</span>
              </label>
              <select
                value={reportingManagerId}
                onChange={(e) => setReportingManagerId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E9DFD0] rounded-xl text-[#101C35] font-medium"
              >
                <option value="">Direct / Executive HR Operations</option>
                {availableManagers
                  .filter((m) => m.id !== editingEmp.id)
                  .map((mgr) => (
                    <option key={mgr.id} value={mgr.id}>
                      {mgr.full_name} — {mgr.designation} ({mgr.role.toUpperCase()})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1">System Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35]"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1">Joining Date</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1">Account Status</label>
                <select
                  value={isActive ? "active" : "inactive"}
                  onChange={(e) => setIsActive(e.target.value === "active")}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E9DFD0]">
              <button
                type="button"
                onClick={() => setEditingEmp(null)}
                className="px-4 py-2 border border-[#E9DFD0] rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#101C35] hover:bg-[#1A2C54] text-[#DCC49B] rounded-xl text-xs font-bold shadow-sm"
              >
                Save All Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Employee Profile Modal (READ) */}
      {viewingEmp && (
        <Modal
          isOpen={Boolean(viewingEmp)}
          onClose={() => setViewingEmp(null)}
          title="Employee Profile Details"
          description={`Corporate dossier for ${viewingEmp.full_name} (${viewingEmp.employee_id})`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0]">
              <img
                src={viewingEmp.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                alt={viewingEmp.full_name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C5A46D]"
              />
              <div>
                <h4 className="text-base font-bold font-serif text-[#101C35]">{viewingEmp.full_name}</h4>
                <p className="text-xs text-[#C5A46D] font-semibold">{viewingEmp.designation}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{viewingEmp.employee_id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#E9DFD0]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                <span className="font-semibold text-[#101C35]">{viewingEmp.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E9DFD0]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                <span className="font-semibold text-[#101C35]">{viewingEmp.phone || "Not set"}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E9DFD0]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                <span className="font-semibold text-[#101C35]">
                  {departments.find((d) => d.id === viewingEmp.department_id)?.name || "Corporate Staff"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E9DFD0]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">System Role</span>
                <span className="font-semibold uppercase text-[#101C35]">{viewingEmp.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E9DFD0]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Reporting Manager</span>
                <span className="font-semibold text-[#101C35]">
                  {profiles.find((p) => p.id === viewingEmp.reporting_manager_id)?.full_name || "Direct / Executive HR"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E9DFD0]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Joining Date</span>
                <span className="font-semibold text-[#101C35]">{formatDate(viewingEmp.joining_date)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E9DFD0]">
              <button
                type="button"
                onClick={() => {
                  const emp = viewingEmp;
                  setViewingEmp(null);
                  handleOpenEdit(emp);
                }}
                className="px-4 py-2 bg-[#101C35] text-[#DCC49B] rounded-xl text-xs font-bold cursor-pointer"
              >
                Edit This Employee
              </button>
              <button
                type="button"
                onClick={() => setViewingEmp(null)}
                className="px-4 py-2 border border-[#E9DFD0] rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#FAF7F2] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Employee Confirmation Modal (DELETE) */}
      {deletingEmp && (
        <Modal
          isOpen={Boolean(deletingEmp)}
          onClose={() => setDeletingEmp(null)}
          title="Delete Employee Record"
          description={`Confirm deletion of ${deletingEmp.full_name} (${deletingEmp.employee_id})`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Permanent Removal Warning</span>
              </div>
              <p>
                Are you sure you want to permanently delete <strong>{deletingEmp.full_name}</strong> from the corporate workforce directory?
              </p>
              <p className="text-[11px] text-rose-700">
                This action will delete their profile account, clear their annual leave balances, and unbind them from their reporting manager.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingEmp(null)}
                className="px-4 py-2 border border-[#E9DFD0] rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#FAF7F2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </PortalShell>
  );
}
