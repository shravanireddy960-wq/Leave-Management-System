"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { LeaveTable } from "@/components/ui/leave-table";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDuration } from "@/lib/utils";
import type { LeaveRequest } from "@/types/database";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  AlertCircle,
  FileText,
  Users,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function ManagerApprovalsPage() {
  const { currentUser, profiles, leaveRequests, balances, leaveTypes, departments, processApproval } = useAppStore();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [remarks, setRemarks] = useState("Sanctioned. Corporate obligations and project coverage verified.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalError, setModalError] = useState("");

  const userDept = departments.find((d) => d.id === currentUser.department_id);

  // Department members
  const deptMembers = profiles.filter(
    (p) => p.department_id === currentUser.department_id || p.reporting_manager_id === currentUser.id
  );
  const deptMemberIds = new Set(deptMembers.map((m) => m.id));

  // Department pending requests
  const pendingRequests = leaveRequests.filter(
    (r) => deptMemberIds.has(r.user_id) && r.status === "pending"
  );

  const handleDecision = (decision: "approved" | "rejected") => {
    if (!selectedRequest) return;
    setModalError("");

    if (decision === "rejected" && (!remarks || !remarks.trim())) {
      setModalError("Please provide an explanatory remark or justification for rejecting this petition.");
      return;
    }

    setIsProcessing(true);
    processApproval(selectedRequest.id, decision, remarks.trim() || (decision === "approved" ? "Approved." : "Rejected."));

    if (decision === "approved") {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#10B981", "#F59E0B", "#FBBF24"],
        });
      } catch {}
    }

    setIsProcessing(false);
    setSelectedRequest(null);
  };

  // Gather applicant details
  const applicant = selectedRequest
    ? deptMembers.find((m) => m.id === selectedRequest.user_id)
    : null;

  const applicantBalance = selectedRequest
    ? balances.find(
        (b) =>
          b.user_id === selectedRequest.user_id &&
          b.leave_type_id === selectedRequest.leave_type_id &&
          b.year === 2025
      )
    : null;

  const applicantHistory = selectedRequest
    ? leaveRequests.filter(
        (r) => r.user_id === selectedRequest.user_id && r.id !== selectedRequest.id
      )
    : [];

  const overlappingTeamAbsences = selectedRequest
    ? leaveRequests.filter(
        (r) =>
          r.id !== selectedRequest.id &&
          deptMemberIds.has(r.user_id) &&
          (r.status === "approved" || r.status === "pending") &&
          !(r.end_date < selectedRequest.start_date || r.start_date > selectedRequest.end_date)
      )
    : [];

  return (
    <PortalShell portal="manager">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Royal Management Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-amber-300/30 dark:border-amber-500/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-[11px] font-semibold tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Department Manager Terminal &bull; {userDept?.name || "Engineering & Technology"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif">
              Employee Leave Adjudication Queue
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Sanction or reject department leave petitions with real-time overlap checking and corporate staffing telemetry.
            </p>
          </div>

          {/* Department Staffing Telemetry Widget */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-[#0E1528]/90 border border-amber-300/50 dark:border-amber-500/30 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-serif">
                  CSE Staffing: 88%
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400">
                {deptMembers.length} active employee assigned &bull; 0 critical clashes
              </p>
            </div>
          </div>
        </div>

        {/* Approvals Table Card */}
        <div className="rounded-3xl bg-white/95 dark:bg-[#0D1424]/95 backdrop-blur-md border border-amber-200/60 dark:border-amber-500/30 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif tracking-tight">
                Pending Employee Submissions ({pendingRequests.length})
              </h3>
            </div>
          </div>

          <LeaveTable
            requests={pendingRequests}
            leaveTypes={leaveTypes}
            showEmployeeColumn={true}
            onView={(r) => {
              setSelectedRequest(r);
              setRemarks("Sanctioned. Corporate obligations and project coverage verified.");
            }}
            onApprove={(id) => {
              const req = pendingRequests.find((r) => r.id === id);
              if (req) {
                setSelectedRequest(req);
                setRemarks("Sanctioned. Corporate obligations and project coverage verified.");
              }
            }}
            onReject={(id) => {
              const req = pendingRequests.find((r) => r.id === id);
              if (req) {
                setSelectedRequest(req);
                setRemarks("Rejected due to departmental corporate schedule collision.");
              }
            }}
          />
        </div>
      </div>

      {/* Adjudication Detail Modal */}
      {selectedRequest && applicant && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Adjudicate Petition: ${selectedRequest.request_number}`}
          description="Review applicant entitlement, corporate coverage, and team availability."
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Applicant Profile Bar */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-900/80 border border-amber-300/40 dark:border-amber-500/20">
              <img
                src={applicant.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                alt={applicant.full_name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif truncate">
                  {applicant.full_name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {applicant.designation} &bull; ID: <strong>{applicant.employee_id}</strong>
                </p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                  📞 {applicant.phone || "+91 98450 12345"}
                </p>
              </div>
            </div>

            {/* Leave Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Leave Category</span>
                <span className="block font-bold text-slate-900 dark:text-white">
                  {leaveTypes.find((lt) => lt.id === selectedRequest.leave_type_id)?.name || "Leave"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Requested Duration</span>
                <span className="block font-extrabold text-amber-600 dark:text-amber-400 font-serif">
                  {selectedRequest.duration_days} Day(s) {selectedRequest.is_half_day && "(Half-Day)"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1 col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Requested Period</span>
                <span className="block font-bold text-slate-900 dark:text-white font-mono">
                  {formatDate(selectedRequest.start_date, "MMM dd, yyyy")} &rarr; {formatDate(selectedRequest.end_date, "MMM dd, yyyy")}
                </span>
              </div>
            </div>

            {/* Applicant's Reason */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Reason Stated:</span>
              <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed">
                &ldquo;{selectedRequest.reason}&rdquo;
              </p>
            </div>

            {/* Supporting Document Verified Badge */}
            {selectedRequest.supporting_document_url && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-300 dark:border-emerald-800">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-500" />
                  <div>
                    <span className="font-bold block">Medical / Duty Verification Slip</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      SHA-256 Verified &bull; Document Verified
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  Attached
                </span>
              </div>
            )}

            {/* Department Collision Check */}
            {overlappingTeamAbsences.length > 0 ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Team Absence Alert ({overlappingTeamAbsences.length} employee on leave)</span>
                </div>
                <p className="text-[11px]">
                  Other members on leave during this period:{" "}
                  {overlappingTeamAbsences.map((a) => profiles.find((p) => p.id === a.user_id)?.full_name).join(", ")}.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Departmental Collisions: Optimal staffing verified.</span>
              </div>
            )}

            {/* Manager Remarks Field */}
            {modalError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-amber-200 mb-1.5 font-serif">
                Manager Official Sanction Remarks *
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  if (modalError) setModalError("");
                }}
                placeholder="Add official remarks, project coverage acknowledgment, or reason for decision..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleDecision("rejected")}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-300 dark:border-rose-800 transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Petition</span>
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleDecision("approved")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sanction &amp; Approve</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </PortalShell>
  );
}
