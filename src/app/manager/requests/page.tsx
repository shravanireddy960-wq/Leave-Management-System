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

export default function ManagerRequestsPage() {
  const { currentUser, profiles, leaveRequests, leaveTypes } = useAppStore();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Department members
  const deptMembers = profiles.filter(
    (p) => p.department_id === currentUser.department_id || p.reporting_manager_id === currentUser.id
  );
  const deptMemberIds = new Set(deptMembers.map((m) => m.id));

  // Department requests
  const deptRequests = leaveRequests
    .filter((r) => deptMemberIds.has(r.user_id))
    .map((r) => ({
      ...r,
      user: deptMembers.find((m) => m.id === r.user_id),
    }));

  return (
    <PortalShell portal="manager">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Department Leave Applications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historical and active leave requests for Computer Science & Engineering employee.
            </p>
          </div>

          <ExportButtons data={deptRequests} leaveTypes={leaveTypes} filenamePrefix="cse-department-leaves" />
        </div>

        <LeaveTable
          requests={deptRequests}
          leaveTypes={leaveTypes}
          showEmployeeColumn={true}
          onView={(r) => setSelectedRequest(r)}
        />
      </div>

      {selectedRequest && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={`Leave Request: ${selectedRequest.request_number}`}
          description={`Applicant: ${selectedRequest.user?.full_name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Status</span>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatDuration(selectedRequest.duration_days)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Start Date</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {formatDate(selectedRequest.start_date, "MMM dd, yyyy")}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">End Date</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {formatDate(selectedRequest.end_date, "MMM dd, yyyy")}
                </span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason:</span>
              <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                {selectedRequest.reason}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </PortalShell>
  );
}
