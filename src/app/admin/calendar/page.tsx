"use client";

import React from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { LeaveCalendarView } from "@/components/ui/leave-calendar-view";

export default function AdminCalendarPage() {
  const { profiles, leaveRequests, holidays, leaveTypes } = useAppStore();

  const allRequests = leaveRequests.map((r) => ({
    ...r,
    user: profiles.find((p) => p.id === r.user_id),
  }));

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Institution Master Leave Calendar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full-institution visual timeline of sanctioned leaves, pending requests, and corporate closures.
          </p>
        </div>

        <LeaveCalendarView requests={allRequests} holidays={holidays} leaveTypes={leaveTypes} />
      </div>
    </PortalShell>
  );
}
