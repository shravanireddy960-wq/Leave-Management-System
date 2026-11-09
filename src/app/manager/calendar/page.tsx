"use client";

import React from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { LeaveCalendarView } from "@/components/ui/leave-calendar-view";

export default function ManagerCalendarPage() {
  const { currentUser, profiles, leaveRequests, holidays, leaveTypes } = useAppStore();

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
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Department Team Calendar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visualize employee scheduling, overlapping absences, and holiday closures for Computer Science & Engineering.
          </p>
        </div>

        <LeaveCalendarView requests={deptRequests} holidays={holidays} leaveTypes={leaveTypes} />
      </div>
    </PortalShell>
  );
}
