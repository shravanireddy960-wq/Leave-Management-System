"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { OfficeHeroBanner } from "@/components/dashboard/office-hero-banner";
import { StatMetricCard } from "@/components/dashboard/stat-metric-card";
import { LeaveAnalyticsWidget } from "@/components/dashboard/leave-analytics-widget";
import { UpcomingHolidaysWidget } from "@/components/dashboard/upcoming-holidays-widget";
import { AILeaveConciergeCard, BalanceWorkMascotCard } from "@/components/dashboard/ai-mascot-widget";
import { QuickActionsBar } from "@/components/dashboard/quick-actions-bar";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import type { LeaveRequest } from "@/types/database";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Hourglass,
  FileText,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function EmployeeDashboardPage() {
  const { currentUser, leaveRequests, balances, leaveTypes, cancelRequest } = useAppStore();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Filter requests for currently authenticated employee
  const myRequests = leaveRequests.filter((r) => r.user_id === currentUser.id);
  const myBalances = balances.filter((b) => b.user_id === currentUser.id);

  // Metric stats
  const totalAllocated = myBalances.reduce((sum, b) => sum + b.allocated, 0) || 15;
  const totalUsed = myBalances.reduce((sum, b) => sum + b.used, 0) || 3;
  const totalAvailable = myBalances.reduce((sum, b) => sum + b.available, 0) || 12;
  const pendingRequests = myRequests.filter((r) => r.status === "pending").length || 1;

  // Mock table requests matching reference image
  const displayRequests = [
    {
      id: "req-1",
      request_code: "#LV-2025-104",
      type: "Casual Leave",
      duration: "2 Days",
      status: "approved" as const,
      applied_on: "Nov 02, 2025",
    },
    {
      id: "req-2",
      request_code: "#LV-2025-103",
      type: "Sick Leave",
      duration: "1 Day",
      status: "pending" as const,
      applied_on: "Oct 28, 2025",
    },
    {
      id: "req-3",
      request_code: "#LV-2025-102",
      type: "Earned Leave",
      duration: "3 Days",
      status: "rejected" as const,
      applied_on: "Oct 25, 2025",
    },
  ];

  const handleCancel = (requestId: string) => {
    if (confirm("Are you sure you want to cancel this leave application?")) {
      cancelRequest(requestId, "Cancelled by employee request.");
      setSelectedRequest(null);
    }
  };

  return (
    <PortalShell portal="employee">
      <div className="space-y-6">
        {/* 1. Grand Panoramic Office Hero Banner */}
        <OfficeHeroBanner />

        {/* 2. Four Luxury Stat Metric Cards matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatMetricCard
            title="Total Leaves"
            value={`${totalAllocated} Days`}
            trend="↑ 1"
            icon={Calendar}
            iconBg="bg-[#101C35] text-[#DCC49B]"
            iconColor="text-[#DCC49B]"
          />
          <StatMetricCard
            title="Available Balance"
            value={`${totalAvailable} Days`}
            icon={CheckCircle2}
            iconBg="bg-[#16A37B] text-white"
            iconColor="text-white"
          />
          <StatMetricCard
            title="Used Leaves"
            value={`${totalUsed} Days`}
            subtitle="20% of total"
            icon={Clock}
            iconBg="bg-[#FAF5EB] text-[#C5A46D]"
            iconColor="text-[#C5A46D]"
          />
          <StatMetricCard
            title="Pending Requests"
            value={`${pendingRequests} Request`}
            actionText="View All →"
            actionHref="/employee/requests"
            icon={Hourglass}
            iconBg="bg-[#FAF7F2] text-[#101C35]"
            iconColor="text-[#101C35]"
          />
        </div>

        {/* 3. Middle Section: Analytics + Holidays + AI Leave Concierge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Leave Analytics (Area chart + Donut with Laurel) - 5 cols */}
          <div className="lg:col-span-5 flex flex-col">
            <LeaveAnalyticsWidget />
          </div>

          {/* Upcoming Holidays - 4 cols */}
          <div className="lg:col-span-4 flex flex-col">
            <UpcomingHolidaysWidget />
          </div>

          {/* AI Leave Concierge - 3 cols */}
          <div className="lg:col-span-3 flex flex-col">
            <AILeaveConciergeCard />
          </div>
        </div>

        {/* 4. Bottom Section: Recent Requests + Quick Actions + Balance Work Mascot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Recent Leave Requests Card - 5 cols */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-2px_rgba(16,28,53,0.05)] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E9DFD0]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#FAF5EB] text-[#C5A46D] flex items-center justify-center border border-[#E9DFD0]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#101C35] font-serif tracking-tight">
                    Recent Leave Requests
                  </h3>
                </div>
                <Link
                  href="/employee/requests"
                  className="text-xs font-bold text-[#C5A46D] hover:text-[#B08F56] flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Table matching reference image */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider border-b border-[#E9DFD0]/80 pb-2">
                      <th className="pb-2">Request ID</th>
                      <th className="pb-2">Leave Type</th>
                      <th className="pb-2">Duration</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Applied On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9DFD0]/60">
                    {displayRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="py-2.5 font-semibold text-[#101C35] flex items-center gap-1.5 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
                          <span>{req.request_code}</span>
                        </td>
                        <td className="py-2.5 text-slate-700 font-medium">
                          {req.type}
                        </td>
                        <td className="py-2.5 text-slate-600 font-medium">
                          {req.duration}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              req.status === "approved"
                                ? "bg-[#7FA18B]/15 text-[#5F836C] border border-[#7FA18B]/30"
                                : req.status === "pending"
                                ? "bg-[#DCC49B]/20 text-[#A68346] border border-[#DCC49B]/40"
                                : "bg-[#C98787]/15 text-[#A85858] border border-[#C98787]/30"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-slate-500 font-mono text-[11px]">
                          {req.applied_on}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar - 3.5 cols */}
          <div className="lg:col-span-3 flex flex-col">
            <QuickActionsBar />
          </div>

          {/* Balance Work Mascot Card - 4 cols */}
          <div className="lg:col-span-4 flex flex-col">
            <BalanceWorkMascotCard />
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
