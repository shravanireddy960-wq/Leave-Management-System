"use client";

import React, { useState, useMemo } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { formatDate, getCurrentISTDateString } from "@/lib/utils";
import {
  Users,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  Briefcase,
} from "lucide-react";

export default function EmployeeTeamPage() {
  const { currentUser, profiles, departments, leaveRequests } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "in_office" | "on_leave">("all");

  const todayStr = useMemo(() => getCurrentISTDateString(), []);

  const userDept = useMemo(() => {
    return (
      departments.find((d) => d.id === currentUser.department_id) ||
      departments[0]
    );
  }, [departments, currentUser.department_id]);

  const reportingManager = useMemo(() => {
    return profiles.find((p) => p.id === currentUser.reporting_manager_id) ||
      profiles.find((p) => p.role === "manager");
  }, [profiles, currentUser.reporting_manager_id]);

  // Teammates in the same department or sharing the same reporting manager
  const teamMembers = useMemo(() => {
    return profiles.filter(
      (p) =>
        p.department_id === currentUser.department_id ||
        (currentUser.reporting_manager_id && p.reporting_manager_id === currentUser.reporting_manager_id)
    );
  }, [profiles, currentUser.department_id, currentUser.reporting_manager_id]);

  // Map each member's live availability status
  const enrichedMembers = useMemo(() => {
    return teamMembers.map((member) => {
      const activeLeave = leaveRequests.find(
        (r) =>
          r.user_id === member.id &&
          r.status === "approved" &&
          r.start_date <= todayStr &&
          r.end_date >= todayStr
      );

      return {
        ...member,
        isOnLeave: Boolean(activeLeave),
        currentLeave: activeLeave,
      };
    });
  }, [teamMembers, leaveRequests, todayStr]);

  const inOfficeCount = enrichedMembers.filter((m) => !m.isOnLeave).length;
  const onLeaveCount = enrichedMembers.filter((m) => m.isOnLeave).length;

  // Filtered list based on search and status filter
  const filtered = useMemo(() => {
    return enrichedMembers.filter((m) => {
      const matchesSearch =
        m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "in_office") return !m.isOnLeave;
      if (activeFilter === "on_leave") return m.isOnLeave;
      return true;
    });
  }, [enrichedMembers, searchTerm, activeFilter]);

  return (
    <PortalShell portal="employee">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E9DFD0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E9DFD0] text-[#C5A46D] text-[10px] font-bold uppercase tracking-wider mb-2 font-serif">
              <Building2 className="w-3.5 h-3.5" />
              <span>{userDept?.name || "Engineering & Technology"} Division</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#101C35]">
              Department Colleagues &amp; Team Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Colleague contact roster, operational availability, reporting hierarchy, and live leave schedules.
            </p>
          </div>

          {/* Reporting Manager Pill */}
          {reportingManager && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E9DFD0] shadow-sm shrink-0">
              <img
                src={reportingManager.avatar_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"}
                alt={reportingManager.full_name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#C5A46D]/30"
              />
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase text-[#C5A46D] tracking-wider block font-serif">
                  Reporting Manager
                </span>
                <p className="text-xs font-bold text-[#101C35]">{reportingManager.full_name}</p>
                <p className="text-[10px] text-slate-500">{reportingManager.designation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-serif">Team Roster</span>
              <Users className="w-4 h-4 text-[#C5A46D]" />
            </div>
            <p className="text-2xl font-bold font-serif text-[#101C35]">{enrichedMembers.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Colleagues in department</p>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-serif">In Office Today</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold font-serif text-emerald-600">{inOfficeCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Available for collaboration</p>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-serif">On Leave Today</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold font-serif text-amber-600">{onLeaveCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Scheduled absence</p>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-serif">Coverage Rate</span>
              <ShieldCheck className="w-4 h-4 text-[#101C35]" />
            </div>
            <p className="text-2xl font-bold font-serif text-[#101C35]">
              {enrichedMembers.length > 0
                ? Math.round((inOfficeCount / enrichedMembers.length) * 100)
                : 100}%
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Operational capacity</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#E9DFD0] shadow-sm">
          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-[#101C35] text-[#DCC49B] shadow-xs"
                  : "bg-[#FAF7F2] text-slate-600 hover:bg-[#FAF5EB]"
              }`}
            >
              All Colleagues ({enrichedMembers.length})
            </button>
            <button
              onClick={() => setActiveFilter("in_office")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "in_office"
                  ? "bg-[#2C6244] text-white shadow-xs"
                  : "bg-[#FAF7F2] text-slate-600 hover:bg-[#FAF5EB]"
              }`}
            >
              In Office ({inOfficeCount})
            </button>
            <button
              onClick={() => setActiveFilter("on_leave")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "on_leave"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-[#FAF7F2] text-slate-600 hover:bg-[#FAF5EB]"
              }`}
            >
              On Leave ({onLeaveCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
            />
          </div>
        </div>

        {/* Colleagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((member) => {
            const isSelf = member.id === currentUser.id;
            const isManager = member.role === "manager";

            return (
              <div
                key={member.id}
                className={`bg-white rounded-3xl border p-5 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.06)] flex flex-col justify-between transition-all hover:scale-[1.01] ${
                  isSelf
                    ? "border-[#C5A46D] ring-2 ring-[#C5A46D]/20"
                    : "border-[#E9DFD0] hover:border-[#C5A46D]/60"
                }`}
              >
                <div>
                  {/* Member Top Bar */}
                  <div className="flex items-start gap-3.5 pb-4 border-b border-[#E9DFD0]">
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                        alt={member.full_name}
                        className="w-13 h-13 rounded-2xl object-cover border border-[#E9DFD0] ring-2 ring-[#C5A46D]/30"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          member.isOnLeave ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        title={member.isOnLeave ? "Currently On Leave" : "Available in Office"}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold font-serif text-[#101C35] truncate flex items-center gap-1.5">
                          <span>{member.full_name}</span>
                          {isSelf && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FAF5EB] text-[#C5A46D] border border-[#E9DFD0]">
                              You
                            </span>
                          )}
                        </h3>
                        {isManager && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#FAF5EB] text-[#C5A46D] border border-[#E9DFD0] shrink-0 font-serif">
                            Manager
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {member.designation}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-slate-400">
                          {member.employee_id}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        {member.isOnLeave ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
                            <Clock className="w-3 h-3" /> On Leave
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" /> In Office
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact & Availability Details */}
                  <div className="space-y-2 py-3.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-[#C5A46D] shrink-0" />
                      <a
                        href={`mailto:${member.email}`}
                        className="truncate hover:text-[#101C35] hover:underline"
                      >
                        {member.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-[#C5A46D] shrink-0" />
                      <span className="font-mono">{member.phone || "Not listed"}</span>
                    </div>

                    {member.isOnLeave && member.currentLeave && (
                      <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 space-y-0.5">
                        <div className="flex items-center justify-between font-bold">
                          <span>Leave Schedule</span>
                          <span>{member.currentLeave.duration_days} Day(s)</span>
                        </div>
                        <p className="text-[10px] text-amber-700">
                          {formatDate(member.currentLeave.start_date, "MMM dd")} &ndash;{" "}
                          {formatDate(member.currentLeave.end_date, "MMM dd, yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E9DFD0] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Joined {formatDate(member.joining_date, "MMM yyyy")}</span>
                  <span className="font-medium text-[#101C35]">{userDept?.code || "ENG"} Dept</span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E9DFD0] space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#101C35] font-serif">No Colleagues Found</h3>
            <p className="text-xs text-slate-500">
              No team members match your current search query or filter selection.
            </p>
          </div>
        )}
      </div>
    </PortalShell>
  );
}

