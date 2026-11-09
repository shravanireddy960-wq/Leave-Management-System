"use client";

import React, { useMemo } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { StatsCard } from "@/components/ui/stats-card";
import {
  TrendingUp,
  PieChart as PieChartIcon,
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function EmployeeAnalyticsPage() {
  const { currentUser, leaveRequests, balances, leaveTypes } = useAppStore();

  const userRequests = useMemo(() => {
    return leaveRequests.filter((r) => r.user_id === currentUser.id);
  }, [leaveRequests, currentUser.id]);

  const userBalances = useMemo(() => {
    return balances.filter((b) => b.user_id === currentUser.id && b.year === 2025);
  }, [balances, currentUser.id]);

  const totalQuota = userBalances.reduce((sum, b) => sum + b.allocated, 0);
  const totalUsed = userBalances.reduce((sum, b) => sum + b.used, 0);
  const totalAvailable = userBalances.reduce((sum, b) => sum + b.available, 0);

  const approvedCount = userRequests.filter((r) => r.status === "approved").length;
  const pendingCount = userRequests.filter((r) => r.status === "pending").length;
  const rejectedCount = userRequests.filter((r) => r.status === "rejected").length;

  // Category distribution data
  const pieData = useMemo(() => {
    return leaveTypes.map((lt) => {
      const bal = userBalances.find((b) => b.leave_type_id === lt.id);
      return {
        name: lt.name,
        used: bal?.used || 0,
        available: bal?.available || 0,
        allocated: bal?.allocated || lt.annual_quota,
        color: lt.color || "#C5A46D",
      };
    });
  }, [leaveTypes, userBalances]);

  // Status breakdown
  const statusData = [
    { name: "Approved", value: approvedCount, color: "#16A37B" },
    { name: "Pending", value: pendingCount, color: "#D97706" },
    { name: "Rejected", value: rejectedCount, color: "#DC2626" },
  ];

  return (
    <PortalShell portal="employee">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="pb-2 border-b border-[#E9DFD0]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E9DFD0] text-[#C5A46D] text-[10px] font-bold uppercase tracking-wider mb-2 font-serif">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Personal Ledger &amp; Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#101C35]">
            My Leave Utilization &amp; Annual Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personal attendance metrics, leave quota consumption, and request approval analytics for fiscal year 2025–2026.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)]">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-serif tracking-wider block">
              Annual Entitlement
            </span>
            <p className="text-2xl font-bold font-serif text-[#101C35] mt-1">{totalQuota} Days</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Total statutory quota</p>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)]">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-serif tracking-wider block">
              Leaves Consumed
            </span>
            <p className="text-2xl font-bold font-serif text-amber-600 mt-1">{totalUsed} Days</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Sanctioned &amp; taken</p>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)]">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-serif tracking-wider block">
              Available Balance
            </span>
            <p className="text-2xl font-bold font-serif text-emerald-600 mt-1">{totalAvailable} Days</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Ready for booking</p>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)]">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-serif tracking-wider block">
              Approval Rate
            </span>
            <p className="text-2xl font-bold font-serif text-[#101C35] mt-1">
              {userRequests.length > 0
                ? `${Math.round((approvedCount / userRequests.length) * 100)}%`
                : "100%"}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">{approvedCount} of {userRequests.length} approved</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Quota vs Used */}
          <div className="bg-white rounded-3xl border border-[#E9DFD0] p-6 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFD0]">
              <h3 className="text-sm font-bold text-[#101C35] font-serif flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-[#C5A46D]" />
                <span>Quota vs Consumed by Category</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Days</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pieData} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9DFD0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#101C35",
                      border: "none",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="available" name="Available" fill="#16A37B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="used" name="Consumed" fill="#C5A46D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Request Status Breakdown */}
          <div className="bg-white rounded-3xl border border-[#E9DFD0] p-6 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DFD0]">
              <h3 className="text-sm font-bold text-[#101C35] font-serif flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" />
                <span>Petition Lifecycle Distribution</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Total: {userRequests.length}</span>
            </div>

            <div className="h-64 flex items-center justify-center">
              {userRequests.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#101C35",
                        border: "none",
                        borderRadius: "12px",
                        color: "#FFFFFF",
                        fontSize: "11px",
                      }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-slate-400 text-xs py-10">
                  No leave requests submitted yet this session.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
