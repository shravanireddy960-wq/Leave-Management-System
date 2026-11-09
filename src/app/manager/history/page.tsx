"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { LeaveTable } from "@/components/ui/leave-table";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDuration } from "@/lib/utils";
import type { LeaveRequest } from "@/types/database";

export default function ManagerHistoryPage() {
  const { currentUser, profiles, leaveRequests, leaveTypes } = useAppStore();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Department members
  const deptMembers = profiles.filter(
    (p) => p.department_id === currentUser.department_id || p.reporting_manager_id === currentUser.id
  );
  const deptMemberIds = new Set(deptMembers.map((m) => m.id));

  // Resolved requests (approved or rejected)
  const resolvedRequests = leaveRequests
    .filter((r) => deptMemberIds.has(r.user_id) && (r.status === "approved" || r.status === "rejected"))
    .map((r) => ({
      ...r,
      user: deptMembers.find((m) => m.id === r.user_id),
    }));

  return (
    <PortalShell portal="manager">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Approval History & Sanction Archive
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log of previously adjudicated leave applications, decision timestamps, and official Manager remarks.
          </p>
        </div>

        <LeaveTable
          requests={resolvedRequests}
          leaveTypes={leaveTypes}
          showEmployeeColumn={true}
          onView={(r) => setSelectedRequest(r)}
        />
      </div>

      {selectedRequest && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={`Adjudication Archive: ${selectedRequest.request_number}`}
          description={`Applicant: ${selectedRequest.user?.full_name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Sanction Status</span>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Time Off</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatDuration(selectedRequest.duration_days)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Applicant Reason:</span>
              <p className="text-slate-600 dark:text-slate-400">{selectedRequest.reason}</p>
            </div>

            {selectedRequest.approvals && selectedRequest.approvals.length > 0 && (
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#3448A5] dark:text-[#7485D8] capitalize">
                    Decision: {selectedRequest.approvals[0].action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatDate(selectedRequest.approvals[0].action_date, "MMM dd, yyyy h:mm a")} IST
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedRequest.approvals[0].remarks || "No additional remarks entered."}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </PortalShell>
  );
}
