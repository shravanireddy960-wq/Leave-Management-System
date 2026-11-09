"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { StatsCard } from "@/components/ui/stats-card";
import { LeaveTable } from "@/components/ui/leave-table";
import { ChartLeaveUtilization } from "@/components/ui/chart-leave-utilization";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDuration } from "@/lib/utils";
import type { LeaveRequest } from "@/types/database";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle,
} from "lucide-react";

export default function ManagerDashboardPage() {
  const { currentUser, profiles, leaveRequests, balances, leaveTypes, processApproval } = useAppStore();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [approvalModalReq, setApprovalModalReq] = useState<LeaveRequest | null>(null);
  const [approvalDecision, setApprovalDecision] = useState<"approved" | "rejected">("approved");
  const [remarks, setRemarks] = useState("");

  // Department members
  const deptMembers = profiles.filter(
    (p) => p.department_id === currentUser.department_id || p.reporting_manager_id === currentUser.id
  );
  const deptMemberIds = new Set(deptMembers.map((m) => m.id));

  // Department requests
  const deptRequests = leaveRequests.filter((r) => deptMemberIds.has(r.user_id));

  const pendingApprovals = deptRequests.filter((r) => r.status === "pending");
  const approvedTotal = deptRequests.filter((r) => r.status === "approved").length;
  const rejectedTotal = deptRequests.filter((r) => r.status === "rejected").length;

  // Employees currently on leave today
  const todayStr = "2025-11-08";
  const currentlyOnLeave = deptRequests.filter(
    (r) => r.status === "approved" && r.start_date <= todayStr && r.end_date >= todayStr
  );

  const handleOpenApprovalDialog = (req: LeaveRequest, decision: "approved" | "rejected") => {
    setApprovalModalReq(req);
    setApprovalDecision(decision);
    setRemarks(decision === "approved" ? "Approved. Corporate coverage acknowledged." : "Rejected.");
  };

  const handleConfirmDecision = () => {
    if (!approvalModalReq) return;
    processApproval(approvalModalReq.id, approvalDecision, remarks);
    setApprovalModalReq(null);
  };

  return (
    <PortalShell portal="manager">
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#070B16] via-[#0E1528] to-[#1C284C] rounded-3xl p-6 lg:p-8 text-white border border-amber-400/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Department Head Management Workspace</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
                Department Overview &bull; {currentUser.full_name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/90 font-medium">
                Head of Department &bull; Computer Science &amp; Engineering (CSE) &bull; {deptMembers.length} Active Employee
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/manager/approvals"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all group hover:scale-105"
              >
                <Clock className="w-4 h-4 text-slate-950" />
                <span>Pending Approvals ({pendingApprovals.length})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Department Employee"
            value={deptMembers.length}
            subtitle="Teaching & Lab Staff"
            icon={Users}
            accentColor="indigo"
          />
          <StatsCard
            title="Pending Approvals"
            value={pendingApprovals.length}
            subtitle={pendingApprovals.length > 0 ? "Requires urgent review" : "Approval queue clear"}
            icon={Clock}
            accentColor="amber"
          />
          <StatsCard
            title="Approved Total"
            value={approvedTotal}
            subtitle="Quarter leaves sanctioned"
            icon={CheckCircle2}
            accentColor="emerald"
          />
          <StatsCard
            title="Currently on Leave"
            value={currentlyOnLeave.length}
            subtitle="Employee absent today"
            icon={UserCheck}
            accentColor="blue"
          />
        </div>

        {/* Charts & Absences Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ChartLeaveUtilization balances={balances} leaveTypes={leaveTypes} />
          </div>

          {/* Department Absences Widget */}
          <div className="lg:col-span-4 bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  <span>Upcoming Team Absences</span>
                </h3>
                <Link
                  href="/manager/calendar"
                  className="text-xs font-semibold text-[#3448A5] dark:text-[#7485D8] hover:underline"
                >
                  Calendar
                </Link>
              </div>

              <div className="space-y-3 mt-4">
                {deptRequests.slice(0, 3).map((r) => {
                  const applicant = deptMembers.find((m) => m.id === r.user_id);
                  const lt = leaveTypes.find((t) => t.id === r.leave_type_id);

                  return (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
                    >
                      <img
                        src={applicant?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                        alt={applicant?.full_name || "Applicant"}
                        className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {applicant?.full_name || "Corporate Employee"}
                          </p>
                          <StatusBadge status={r.status} size="sm" />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {lt?.name} &bull; {formatDate(r.start_date, "MMM dd")} &rarr;{" "}
                          {formatDate(r.end_date, "MMM dd")} ({r.duration_days}d)
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">
                Department of Computer Science & Engineering
              </span>
            </div>
          </div>
        </div>

        {/* Pending Approvals Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pending Approvals Requiring Action
              </h3>
              <p className="text-xs text-slate-400">
                Review leave applications submitted by department employee.
              </p>
            </div>
            <Link
              href="/manager/approvals"
              className="text-xs font-bold text-[#3448A5] dark:text-[#7485D8] hover:underline flex items-center gap-1"
            >
              <span>View All Approvals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <LeaveTable
            requests={pendingApprovals}
            leaveTypes={leaveTypes}
            showEmployeeColumn={true}
            onView={(r) => setSelectedRequest(r)}
            onApprove={(id) => {
              const req = pendingApprovals.find((r) => r.id === id);
              if (req) handleOpenApprovalDialog(req, "approved");
            }}
            onReject={(id) => {
              const req = pendingApprovals.find((r) => r.id === id);
              if (req) handleOpenApprovalDialog(req, "rejected");
            }}
          />
        </div>
      </div>

      {/* Decision Modal */}
      {approvalModalReq && (
        <Modal
          isOpen={Boolean(approvalModalReq)}
          onClose={() => setApprovalModalReq(null)}
          title={
            approvalDecision === "approved"
              ? `Approve Leave Application: ${approvalModalReq.request_number}`
              : `Reject Leave Application: ${approvalModalReq.request_number}`
          }
          description="Enter decision remarks for institutional record and employee notification."
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1 text-xs">
              <p>
                <strong>Applicant:</strong>{" "}
                {deptMembers.find((m) => m.id === approvalModalReq.user_id)?.full_name}
              </p>
              <p>
                <strong>Leave Duration:</strong> {approvalModalReq.duration_days} day(s) from{" "}
                {formatDate(approvalModalReq.start_date, "MMM dd, yyyy")} to{" "}
                {formatDate(approvalModalReq.end_date, "MMM dd, yyyy")}
              </p>
              <p>
                <strong>Reason:</strong> {approvalModalReq.reason}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Official Remarks & Instructions
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Approved. Corporate duties and project coverage reassigned."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setApprovalModalReq(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className={`px-4 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs ${
                  approvalDecision === "approved"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Confirm {approvalDecision === "approved" ? "Approval" : "Rejection"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={`Application Details: ${selectedRequest.request_number}`}
          description={`Submitted by ${
            deptMembers.find((m) => m.id === selectedRequest.user_id)?.full_name
          }`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatDuration(selectedRequest.duration_days)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dates:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatDate(selectedRequest.start_date, "MMM dd, yyyy")} to{" "}
                  {formatDate(selectedRequest.end_date, "MMM dd, yyyy")}
                </span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Reason Stated:
              </span>
              <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                {selectedRequest.reason}
              </p>
            </div>

            {selectedRequest.status === "pending" && (
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const req = selectedRequest;
                    setSelectedRequest(null);
                    handleOpenApprovalDialog(req, "rejected");
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const req = selectedRequest;
                    setSelectedRequest(null);
                    handleOpenApprovalDialog(req, "approved");
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Approve Application
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </PortalShell>
  );
}
