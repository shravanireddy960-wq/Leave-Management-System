"use client";

import React, { useState, useRef } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { validatePhone, validateName } from "@/lib/validations";
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  ShieldCheck,
  Check,
  Sparkles,
  AlertCircle,
  Save,
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

export default function EmployeeProfilePage() {
  const { currentUser, updateEmployee, profiles, departments } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(currentUser.full_name || "Employee");
  const [phone, setPhone] = useState(currentUser.phone || "+91 98450 12345");
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url || CORPORATE_PRESET_AVATARS[0].url);
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const reportingManager = profiles.find((p) => p.id === currentUser.reporting_manager_id);
  const userDept = departments.find((d) => d.id === currentUser.department_id);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError("The selected photo exceeds the 5MB size limit. Please choose a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        setFormError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setCustomUrlInput("");
    setShowAvatarPresets(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate Name
    const nameVal = validateName(fullName);
    if (!nameVal.isValid) {
      setFormError(nameVal.error || "Please enter a valid full name.");
      return;
    }

    // Validate Phone Number
    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      setFormError(phoneVal.error || "Please enter a valid 10-15 digit phone number.");
      return;
    }

    updateEmployee(currentUser.id, {
      full_name: fullName.trim(),
      phone: phone.trim(),
      avatar_url: avatarUrl,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PortalShell portal="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="pb-2 border-b border-[#E9DFD0]">
          <h2 className="text-2xl font-bold tracking-tight text-[#101C35] font-serif">
            Employee Profile &amp; Corporate Credentials
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official employee directory records, designation details, profile photo, and contact settings.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-[#EAF3ED] border border-[#BDDEC8] text-xs text-[#2C6244] flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-[#7FA18B]" />
            <span className="font-semibold">Profile details, photo, and contact information updated successfully!</span>
          </div>
        )}

        {formError && (
          <div className="p-3.5 rounded-2xl bg-[#FDF0F0] border border-[#F2C5C5] text-xs text-[#9E3E3E] flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-[#E9DFD0] p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] space-y-6">
          {/* Identity Header with Photo Management */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#E9DFD0]">
            {/* Avatar with Camera Trigger */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#C5A46D] via-[#DCC49B] to-[#F5E6CA] shadow-[0_0_15px_rgba(197,164,109,0.3)]">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full rounded-full object-cover ring-2 ring-white"
                />
              </div>

              {/* Click to change photo overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/45 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
                title="Click to upload new photo from device"
              >
                <Camera className="w-6 h-6 text-[#DCC49B] mb-0.5" />
                <span className="text-[10px] font-bold text-white tracking-wide">Change Photo</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h3 className="text-xl sm:text-2xl font-bold text-[#101C35] font-serif">
                  {fullName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FAF5EB] text-[#101C35] border border-[#E9DFD0]">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {currentUser.designation || "Senior Software Engineer"} &bull; {userDept?.name || "Engineering & Technology"}
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                Corporate Employee ID: <strong className="text-[#101C35]">{currentUser.employee_id}</strong>
              </p>

              {/* Photo action buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#101C35] hover:text-[#DCC49B] text-slate-700 text-xs font-semibold border border-[#E9DFD0] transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF5EB] text-[#C5A46D] text-xs font-semibold border border-[#E9DFD0] transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{showAvatarPresets ? "Hide Avatar Library" : "Choose Preset Avatar"}</span>
                </button>
              </div>

              {/* Avatar Preset Library Drawer */}
              {showAvatarPresets && (
                <div className="mt-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] space-y-3 animate-in fade-in">
                  <span className="text-[11px] font-bold text-[#101C35] block">
                    Select a Corporate Portrait Preset:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {CORPORATE_PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(av.url);
                          setShowAvatarPresets(false);
                        }}
                        className={`relative rounded-2xl p-1 border transition-all cursor-pointer ${
                          avatarUrl === av.url
                            ? "border-[#C5A46D] bg-[#FAF5EB] ring-2 ring-[#C5A46D]/40"
                            : "border-[#E9DFD0] bg-white hover:border-[#C5A46D]"
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.label}
                          className="w-12 h-12 rounded-xl object-cover mx-auto"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E9DFD0] flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Or paste external image URL..."
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-1.5 bg-[#101C35] text-[#DCC49B] rounded-xl text-xs font-bold"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Corporate Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1 font-serif tracking-wider">
                <Mail className="w-3.5 h-3.5 text-[#C5A46D]" /> Official Corporate Email
              </span>
              <span className="text-xs font-bold text-[#101C35] block font-mono">
                {currentUser.email}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1 font-serif tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-[#C5A46D]" /> Date of Joining
              </span>
              <span className="text-xs font-bold text-[#101C35] block font-serif">
                {formatDate(currentUser.joining_date, "MMMM dd, yyyy")}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1 font-serif tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-[#C5A46D]" /> Corporate Department
              </span>
              <span className="text-xs font-bold text-[#101C35] block">
                {userDept?.name || "Engineering & Technology"} ({userDept?.code || "ENG"})
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1 font-serif tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A46D]" /> Bound Reporting Manager
              </span>
              <span className="text-xs font-bold text-[#101C35] block">
                {reportingManager ? `${reportingManager.full_name} (${reportingManager.designation})` : "Director of Engineering"}
              </span>
            </div>
          </div>

          {/* Editable Details Form with Validations */}
          <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-[#E9DFD0]">
            <h4 className="text-xs font-bold text-[#101C35] uppercase font-serif tracking-wider">
              Editable Personal &amp; Contact Records
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Employee"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Official name displayed on leave applications, notifications, and reports.
                </span>
              </div>

              {/* Contact Phone Number Input */}
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Contact Phone Number *</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98450 12345"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  10-15 digit phone with optional country code (+91).
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101C35] hover:bg-[#1A2C54] text-[#DCC49B] text-xs font-bold shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#DCC49B]" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalShell>
  );
}
