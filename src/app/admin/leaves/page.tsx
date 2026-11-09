"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { LeaveTable } from "@/components/ui/leave-table";
import { ExportButtons } from "@/components/ui/export-buttons";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDuration } from "@/lib/utils";
import type { LeaveRequest } from "@/types/database";
import { CheckCircle2, XCircle, AlertCircle, ShieldCheck } from "lucide-react";

export default function AdminLeavesPage() {
  const { profiles, leaveRequests, leaveTypes, processApproval, currentUser } = useAppStore();
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

  const enrichedRequests = leaveRequests.map((r) => ({
    ...r,
    user: profiles.find((p) => p.id === r.user_id),
  }));

  const handleOpenDecision = (requestId: string, decision: "approved" | "rejected") => {
    const req = leaveRequests.find((r) => r.id === requestId);
    const applicant = profiles.find((p) => p.id === req?.user_id);
    setDecisionModal({
      isOpen: true,
      requestId,
      decision,
      requestNumber: req?.request_number || "",
      applicantName: applicant?.full_name || "Corporate Employee",
      remarks: decision === "approved" ? "Executive administrative approval granted." : "Declined per institutional workload & corporate scheduling requirements.",
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

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-serif tracking-tight text-[#101C35]">
              Institutional Leave Registry &amp; Approvals
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive log of all applications across all corporate divisions with direct administrator approval authority.
            </p>
          </div>

          <ExportButtons data={enrichedRequests} leaveTypes={leaveTypes} filenamePrefix="master-institutional-leaves" />
        </div>

        <LeaveTable
          requests={enrichedRequests}
          leaveTypes={leaveTypes}
          showEmployeeColumn={true}
          onView={(r) => setSelectedRequest(r)}
          onApprove={(id) => handleOpenDecision(id, "approved")}
          onReject={(id) => handleOpenDecision(id, "rejected")}
        />
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={`Institution Record: ${selectedRequest.request_number}`}
          description={`Applicant: ${selectedRequest.user?.full_name || "Corporate Employee"}`}
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E9DFD0]">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
                <span className="font-bold text-[#101C35]">
                  {formatDuration(selectedRequest.duration_days)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E9DFD0] space-y-1">
              <span className="font-bold text-[#101C35] block">Leave Dates:</span>
              <p className="text-slate-600 font-medium">
                {formatDate(selectedRequest.start_date, "MMM dd, yyyy")} to {formatDate(selectedRequest.end_date, "MMM dd, yyyy")}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E9DFD0] space-y-1">
              <span className="font-bold text-[#101C35] block">Application Reason:</span>
              <p className="text-slate-600 leading-relaxed">{selectedRequest.reason}</p>
            </div>

            {selectedRequest.approvals && selectedRequest.approvals.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#FAF5EB] border border-[#E9DFD0] space-y-1">
                <span className="font-bold text-[#101C35] block">
                  Adjudication History &amp; Remarks:
                </span>
                <p className="text-slate-700">{selectedRequest.approvals[0].remarks}</p>
              </div>
            )}

            {/* Direct Admin Action Buttons if Pending */}
            {selectedRequest.status === "pending" && (
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E9DFD0]">
                <button
                  type="button"
                  onClick={() => handleOpenDecision(selectedRequest.id, "rejected")}
                  className="px-4 py-2 rounded-xl bg-[#FDF0F0] border border-[#F2C5C5] text-[#9E3E3E] font-bold text-xs hover:bg-[#F2C5C5] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Leave</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDecision(selectedRequest.id, "approved")}
                  className="px-4 py-2 rounded-xl bg-[#2C6244] text-white font-bold text-xs hover:bg-[#235037] shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Leave</span>
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Admin Adjudication Decision Modal */}
      {decisionModal.isOpen && (
        <Modal
          isOpen={decisionModal.isOpen}
          onClose={() => setDecisionModal((prev) => ({ ...prev, isOpen: false }))}
          title={decisionModal.decision === "approved" ? "Executive Approval Authorization" : "Executive Rejection Confirmation"}
          description={`Record: ${decisionModal.requestNumber} • Applicant: ${decisionModal.applicantName}`}
        >
          <form onSubmit={handleConfirmDecision} className="space-y-4 text-xs font-sans">
            <div className="p-3 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0] text-[#101C35] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#C5A46D] shrink-0" />
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
                placeholder="Enter formal reason or notes..."
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
                {decisionModal.decision === "approved" ? "Confirm Administrative Approval" : "Confirm Rejection"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </PortalShell>
  );
}
