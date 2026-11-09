"use client";

import React from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { LeaveCalendarView } from "@/components/ui/leave-calendar-view";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";

export default function EmployeeCalendarPage() {
  const { leaveRequests, holidays, leaveTypes, currentUser } = useAppStore();

  // Show both user leaves and institutional events
  const myRequests = leaveRequests.filter((r) => r.user_id === currentUser.id);

  return (
    <PortalShell portal="employee">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E9DFD0]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#101C35] font-serif">
              Personal &amp; Company Calendar
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly overview of scheduled time off, pending reviews, and public holidays.
            </p>
          </div>

          <Link
            href="/employee/apply-leave"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#C5A46D] via-[#DCC49B] to-[#C5A46D] hover:brightness-105 text-[#101C35] text-xs font-extrabold shadow-sm transition-all hover:scale-105"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </Link>
        </div>

        <LeaveCalendarView requests={myRequests} holidays={holidays} leaveTypes={leaveTypes} />
      </div>
    </PortalShell>
  );
}
