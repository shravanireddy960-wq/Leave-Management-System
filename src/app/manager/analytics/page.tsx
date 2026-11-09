"use client";

import React from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { ChartLeaveUtilization } from "@/components/ui/chart-leave-utilization";
import { StatsCard } from "@/components/ui/stats-card";
import { Users, CheckCircle2, AlertCircle, PieChart, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function ManagerAnalyticsPage() {
  const { currentUser, profiles, leaveRequests, balances, leaveTypes } = useAppStore();

  const deptMembers = profiles.filter(
    (p) => p.department_id === currentUser.department_id || p.reporting_manager_id === currentUser.id
  );
  const deptMemberIds = new Set(deptMembers.map((m) => m.id));

  const deptRequests = leaveRequests.filter((r) => deptMemberIds.has(r.user_id));
  const deptBalances = balances.filter((b) => deptMemberIds.has(b.user_id));

  // Category distribution data
  const pieData = leaveTypes.map((lt) => {
    const totalUsed = deptRequests
      .filter((r) => r.leave_type_id === lt.id && r.status === "approved")
      .reduce((sum, r) => sum + r.duration_days, 0);

    return {
      name: lt.name,
      value: totalUsed || 1,
      color: lt.color,
    };
  });

  // Monthly trend mock data
  const monthlyTrendData = [
    { month: "Aug", Requests: 3, Approved: 3 },
    { month: "Sep", Requests: 6, Approved: 5 },
    { month: "Oct", Requests: 8, Approved: 7 },
    { month: "Nov", Requests: 4, Approved: 3 },
    { month: "Dec", Requests: 1, Approved: 1 },
  ];

  return (
    <PortalShell portal="manager">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Department Leave Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Utilization metrics, category distributions, and seasonal absence trends for CSE.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Applications"
            value={deptRequests.length}
            subtitle="Current fiscal year"
            icon={TrendingUp}
            accentColor="indigo"
          />
          <StatsCard
            title="Sanction Rate"
            value="92%"
            subtitle="Applications approved"
            icon={CheckCircle2}
            accentColor="emerald"
          />
          <StatsCard
            title="Peak Leave Month"
            value="October"
            subtitle="Conference & festival season"
            icon={PieChart}
            accentColor="blue"
          />
          <StatsCard
            title="Active Employee"
            value={deptMembers.length}
            subtitle="Covered under quota"
            icon={Users}
            accentColor="purple"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ChartLeaveUtilization balances={deptBalances} leaveTypes={leaveTypes} />
          </div>

          {/* Monthly Trend Chart */}
          <div className="lg:col-span-5 bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Monthly Submission Trends
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Submitted applications vs. Approved sanctions
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="Requests" stroke="#3448A5" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Approved" stroke="#16A37B" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
