"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { LeaveTable } from "@/components/ui/leave-table";
import { ExportButtons } from "@/components/ui/export-buttons";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDuration } from "@/lib/utils";
import type { LeaveRequest } from "@/types/database";
import { CalendarPlus, FileText, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

export default function EmployeeRequestsPage() {
  const { currentUser, leaveRequests, leaveTypes, cancelRequest } = useAppStore();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [cancelModalReq, setCancelModalReq] = useState<LeaveRequest | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const myRequests = leaveRequests.filter((r) => r.user_id === currentUser.id);

  const pendingCount = myRequests.filter((r) => r.status === "pending").length;
  const approvedCount = myRequests.filter((r) => r.status === "approved").length;
  const rejectedCount = myRequests.filter((r) => r.status === "rejected").length;

  const handleConfirmCancel = () => {
    if (!cancelModalReq) return;
    cancelRequest(cancelModalReq.id, cancelReason || "Cancelled by employee.");
    setCancelModalReq(null);
    setCancelReason("");
  };

  return (
    <PortalShell portal="employee">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E9DFD0]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#101C35] font-serif">
              My Leave Requests
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive log of all submitted, approved, and archived applications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ExportButtons data={myRequests} leaveTypes={leaveTypes} filenamePrefix="my-leave-applications" />
            <Link
              href="/employee/apply-leave"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#C5A46D] via-[#DCC49B] to-[#C5A46D] hover:brightness-105 text-[#101C35] text-xs font-extrabold shadow-sm transition-all hover:scale-105"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Apply for Leave</span>
            </Link>
          </div>
        </div>

        {/* Status mini summary pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-white border border-[#E9DFD0] flex items-center gap-3 shadow-[0_4px_15px_-3px_rgba(16,28,53,0.05)]">
            <div className="p-2.5 rounded-xl bg-[#FAF5EB] text-[#101C35] border border-[#E9DFD0]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-serif">Total Requests</span>
              <span className="text-xl font-extrabold text-[#101C35] font-serif">{myRequests.length}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E9DFD0] flex items-center gap-3 shadow-[0_4px_15px_-3px_rgba(16,28,53,0.05)]">
            <div className="p-2.5 rounded-xl bg-[#FDF7E8] text-[#8C6B28] border border-[#ECDAB0]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-serif">In Review</span>
              <span className="text-xl font-extrabold text-[#8C6B28] font-serif">{pendingCount}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E9DFD0] flex items-center gap-3 shadow-[0_4px_15px_-3px_rgba(16,28,53,0.05)]">
            <div className="p-2.5 rounded-xl bg-[#EAF3ED] text-[#2C6244] border border-[#BDDEC8]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-serif">Approved</span>
              <span className="text-xl font-extrabold text-[#2C6244] font-serif">{approvedCount}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E9DFD0] flex items-center gap-3 shadow-[0_4px_15px_-3px_rgba(16,28,53,0.05)]">
            <div className="p-2.5 rounded-xl bg-[#FDF0F0] text-[#9E3E3E] border border-[#F2C5C5]">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-serif">Rejected</span>
              <span className="text-xl font-extrabold text-[#9E3E3E] font-serif">{rejectedCount}</span>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <LeaveTable
          requests={myRequests}
          leaveTypes={leaveTypes}
          onView={(r) => setSelectedRequest(r)}
          onCancel={(id) => {
            const req = myRequests.find((r) => r.id === id);
            if (req) setCancelModalReq(req);
          }}
        />
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={`Leave Application: ${selectedRequest.request_number}`}
          description={`Applied on ${formatDate(selectedRequest.created_at, "MMMM dd, yyyy")}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0]">
              <div>
                <span className="text-[11px] text-slate-400 block font-serif uppercase tracking-wider">Status</span>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-serif uppercase tracking-wider">Duration</span>
                <span className="text-sm font-bold text-[#101C35] font-serif">
                  {formatDuration(selectedRequest.duration_days)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl border border-[#E9DFD0] bg-white">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block font-serif">Start Date</span>
                <span className="text-xs font-bold text-[#101C35] mt-0.5 block">
                  {formatDate(selectedRequest.start_date, "EEEE, MMM dd, yyyy")}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl border border-[#E9DFD0] bg-white">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block font-serif">End Date</span>
                <span className="text-xs font-bold text-[#101C35] mt-0.5 block">
                  {formatDate(selectedRequest.end_date, "EEEE, MMM dd, yyyy")}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#101C35] block mb-1 font-serif">
                Reason &amp; Work Arrangements
              </span>
              <p className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] text-xs text-[#101C35] leading-relaxed">
                {selectedRequest.reason}
              </p>
            </div>

            {selectedRequest.cancellation_reason && (
              <div className="p-3.5 rounded-2xl bg-[#FDF0F0] border border-[#F2C5C5] text-xs text-[#9E3E3E]">
                <span className="font-bold block font-serif">Cancellation Note:</span>
                <p className="mt-0.5">{selectedRequest.cancellation_reason}</p>
              </div>
            )}

            {selectedRequest.approvals && selectedRequest.approvals.length > 0 && (
              <div>
                <span className="text-xs font-bold text-[#101C35] block mb-1 font-serif">
                  Manager Review Remarks
                </span>
                {selectedRequest.approvals.map((appr) => (
                  <div
                    key={appr.id}
                    className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0] text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#101C35] capitalize font-serif">
                        Decision: {appr.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatDate(appr.action_date, "MMM dd, yyyy h:mm a")} IST
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{appr.remarks || "No remarks entered."}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Cancellation Modal */}
      {cancelModalReq && (
        <Modal
          isOpen={Boolean(cancelModalReq)}
          onClose={() => setCancelModalReq(null)}
          title={`Cancel Application: ${cancelModalReq.request_number}`}
          description="Are you sure you want to withdraw this leave application? Quota will be automatically restored."
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#101C35] mb-1.5 font-serif">
                Reason for Cancellation
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule change, project deadline shifted..."
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalReq(null)}
                className="px-4 py-2 rounded-xl border border-[#E9DFD0] text-xs font-semibold text-slate-700 hover:bg-[#FAF5EB] transition-colors"
              >
                Keep Application
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-[#FDF0F0] text-[#9E3E3E] border border-[#F2C5C5] hover:bg-[#F2C5C5] text-xs font-bold transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </PortalShell>
  );
}
