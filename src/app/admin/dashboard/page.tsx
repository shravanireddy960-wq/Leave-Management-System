"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { StatsCard } from "@/components/ui/stats-card";
import { LeaveTable } from "@/components/ui/leave-table";
import { ExportButtons } from "@/components/ui/export-buttons";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDuration } from "@/lib/utils";
import type { LeaveRequest } from "@/types/database";
import {
  Users,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  CalendarDays,
  PieChart,
  ArrowRight,
  Sliders,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboardPage() {
  const { currentUser, profiles, departments, leaveRequests, balances, leaveTypes, processApproval } = useAppStore();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Approval / Rejection Decision Modal state
  const [decisionModal, setDecisionModal] = useState<{
    isOpen: boolean;
    requestId: string;
    decision: "approved" | "rejected";
    requestNumber: string;
    applicantName: string;
    remarks: string;
  }>({
    isOpen: false,
    requestId: "",
    decision: "approved",
    requestNumber: "",
    applicantName: "",
    remarks: "",
  });

  const handleOpenDecision = (requestId: string, decision: "approved" | "rejected") => {
    const req = leaveRequests.find((r) => r.id === requestId);
    const applicant = profiles.find((p) => p.id === req?.user_id);
    setDecisionModal({
      isOpen: true,
      requestId,
      decision,
      requestNumber: req?.request_number || "",
      applicantName: applicant?.full_name || "Corporate Employee",
      remarks: decision === "approved" ? "Executive corporate approval granted." : "Declined per corporate workload & business continuity requirements.",
    });
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    processApproval(decisionModal.requestId, decisionModal.decision, decisionModal.remarks);
    setDecisionModal((prev) => ({ ...prev, isOpen: false }));
    if (selectedRequest && selectedRequest.id === decisionModal.requestId) {
      setSelectedRequest(null);
    }
  };

  // Statistics
  const totalEmployees = profiles.length;
  const activeEmployees = profiles.filter((p) => p.is_active).length;
  const totalDepts = departments.length;
  const totalManagers = profiles.filter((p) => p.role === "manager").length;

  const totalRequests = leaveRequests.length;
  const pendingRequests = leaveRequests.filter((r) => r.status === "pending").length;
  const approvedRequests = leaveRequests.filter((r) => r.status === "approved").length;
  const rejectedRequests = leaveRequests.filter((r) => r.status === "rejected").length;

  // Currently on leave today
  const todayStr = "2025-11-08";
  const currentlyOnLeave = leaveRequests.filter(
    (r) => r.status === "approved" && r.start_date <= todayStr && r.end_date >= todayStr
  );

  // Department-wise applications data
  const deptData = departments.map((d) => {
    const dMembers = profiles.filter((p) => p.department_id === d.id);
    const dMemberIds = new Set(dMembers.map((m) => m.id));
    const dRequests = leaveRequests.filter((r) => dMemberIds.has(r.user_id));

    return {
      name: d.code,
      fullName: d.name,
      Requests: dRequests.length,
      Approved: dRequests.filter((r) => r.status === "approved").length,
    };
  });

  // Leave Type Distribution data
  const pieData = leaveTypes.map((lt) => {
    const count = leaveRequests.filter((r) => r.leave_type_id === lt.id).length;
    return {
      name: lt.name,
      code: lt.code,
      value: count || 1,
      color: lt.color,
    };
  });

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        {/* Administrator Header Banner */}
        <div className="bg-gradient-to-r from-[#070B16] via-[#0E1528] to-[#1C284C] rounded-3xl p-6 lg:p-8 text-white border border-amber-400/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive HR &amp; Corporate Governance Terminal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
                Corporate Executive Command Center
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/90 font-medium">
                Administrator &bull; Corporate People &amp; Workforce Command &bull; Fiscal Year 2025–2026
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/allocations"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Manage Allocations</span>
              </Link>
              <Link
                href="/admin/reports"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all group hover:scale-105"
              >
                <TrendingUp className="w-4 h-4 text-slate-950" />
                <span>Executive Reports</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Workforce"
            value={totalEmployees}
            subtitle={`${activeEmployees} actively employed`}
            icon={Users}
            accentColor="purple"
          />
          <StatsCard
            title="Departments & Managers"
            value={`${totalDepts} / ${totalManagers}`}
            subtitle="Business divisions"
            icon={Building2}
            accentColor="indigo"
          />
          <StatsCard
            title="Pending Adjudications"
            value={pendingRequests}
            subtitle="Requires manager action"
            icon={Clock}
            accentColor="amber"
          />
          <StatsCard
            title="Employees On Leave Today"
            value={currentlyOnLeave.length}
            subtitle="Sanctioned on-leave"
            icon={UserCheck}
            accentColor="blue"
          />
        </div>

        {/* Second Row of Metric Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#161F30] border border-slate-200/80 dark:border-[#232F46] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Applications</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{totalRequests}</span>
            </div>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#161F30] border border-slate-200/80 dark:border-[#232F46] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Approved</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{approvedRequests}</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#161F30] border border-slate-200/80 dark:border-[#232F46] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Rejected</span>
              <span className="text-xl font-bold text-rose-600 dark:text-rose-400">{rejectedRequests}</span>
            </div>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#161F30] border border-slate-200/80 dark:border-[#232F46] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Institution Approval Rate</span>
              <span className="text-xl font-bold text-[#3448A5] dark:text-[#7485D8]">89%</span>
            </div>
            <TrendingUp className="w-4 h-4 text-[#3448A5]" />
          </div>
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Department-wise Bar Chart */}
          <div className="lg:col-span-7 bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Department Leave Applications & Approvals
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cross-department comparison across institutional divisions
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Requests" fill="#3448A5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Approved" fill="#16A37B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leave Type Distribution Pie Chart */}
          <div className="lg:col-span-5 bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Leave Category Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Relative utilization of Casual, Duty, Medical & Vacation quota
            </p>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg">
                            <p className="font-bold">{d.name} ({d.code})</p>
                            <p className="text-slate-300">{d.value} applications</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Master Leave Applications Table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Institution-Wide Leave Records
              </h3>
              <p className="text-xs text-slate-400">
                Full registry across all departments with export capabilities.
              </p>
            </div>

            <ExportButtons data={leaveRequests} leaveTypes={leaveTypes} filenamePrefix="all-institutional-leaves" />
          </div>

          <LeaveTable
            requests={leaveRequests}
            leaveTypes={leaveTypes}
            showEmployeeColumn={true}
            onView={(r) => setSelectedRequest(r)}
            onApprove={(id) => handleOpenDecision(id, "approved")}
            onReject={(id) => handleOpenDecision(id, "rejected")}
          />
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={`Corporate Record: ${selectedRequest.request_number}`}
          description={`Applicant: ${selectedRequest.user?.full_name || "Corporate Employee"}`}
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E9DFD0] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Duration:</span>
                <span className="font-bold text-[#101C35]">
                  {formatDuration(selectedRequest.duration_days)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Dates:</span>
                <span className="font-bold text-[#101C35]">
                  {formatDate(selectedRequest.start_date, "MMM dd, yyyy")} to{" "}
                  {formatDate(selectedRequest.end_date, "MMM dd, yyyy")}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E9DFD0]">
              <span className="font-bold text-[#101C35] block mb-1">Reason:</span>
              <p className="text-slate-600">{selectedRequest.reason}</p>
            </div>

            {selectedRequest.status === "pending" && (
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E9DFD0]">
                <button
                  type="button"
                  onClick={() => handleOpenDecision(selectedRequest.id, "rejected")}
                  className="px-4 py-2 rounded-xl bg-[#FDF0F0] border border-[#F2C5C5] text-[#9E3E3E] font-bold text-xs hover:bg-[#F2C5C5] transition-colors cursor-pointer"
                >
                  Reject Leave
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDecision(selectedRequest.id, "approved")}
                  className="px-4 py-2 rounded-xl bg-[#2C6244] text-white font-bold text-xs hover:bg-[#235037] shadow-sm transition-colors cursor-pointer"
                >
                  Approve Leave
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Decision Modal */}
      {decisionModal.isOpen && (
        <Modal
          isOpen={decisionModal.isOpen}
          onClose={() => setDecisionModal((prev) => ({ ...prev, isOpen: false }))}
          title={decisionModal.decision === "approved" ? "Executive Approval Authorization" : "Executive Rejection Confirmation"}
          description={`Record: ${decisionModal.requestNumber} • Applicant: ${decisionModal.applicantName}`}
        >
          <form onSubmit={handleConfirmDecision} className="space-y-4 text-xs font-sans">
            <div className="p-3 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0] text-[#101C35]">
              <p className="text-xs">
                As an <strong>Administrator</strong>, your decision will immediately update leave quotas and notify the employee.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101C35] mb-1.5">
                Executive Remarks &amp; Feedback
              </label>
              <textarea
                rows={3}
                required
                value={decisionModal.remarks}
                onChange={(e) => setDecisionModal((prev) => ({ ...prev, remarks: e.target.value }))}
                placeholder="Enter formal notes or feedback..."
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E9DFD0]">
              <button
                type="button"
                onClick={() => setDecisionModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 border border-[#E9DFD0] rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all cursor-pointer ${
                  decisionModal.decision === "approved"
                    ? "bg-[#2C6244] hover:bg-[#235037]"
                    : "bg-[#9E3E3E] hover:bg-[#853232]"
                }`}
              >
                {decisionModal.decision === "approved" ? "Confirm Approval" : "Confirm Rejection"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </PortalShell>
  );
}
