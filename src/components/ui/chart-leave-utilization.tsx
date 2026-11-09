"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { LeaveBalance, LeaveType } from "@/types/database";

interface ChartLeaveUtilizationProps {
  balances: LeaveBalance[];
  leaveTypes: LeaveType[];
}

export function ChartLeaveUtilization({ balances, leaveTypes }: ChartLeaveUtilizationProps) {
  const data = leaveTypes
    .filter((lt) => lt.annual_quota > 0)
    .map((lt) => {
      const bal = balances.find((b) => b.leave_type_id === lt.id);
      return {
        name: lt.code,
        fullName: lt.name,
        Allocated: bal ? bal.allocated : lt.annual_quota,
        Used: bal ? bal.used : 0,
        Available: bal ? bal.available : lt.annual_quota,
      };
    });

  return (
    <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Leave Quota & Utilization
          </h3>
          <p className="text-xs text-slate-400">
            Allocation vs. Used vs. Available balances
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-lg space-y-1">
                      <p className="font-bold text-slate-200">{d.fullName} ({d.name})</p>
                      <p className="text-blue-300">Allocated: {d.Allocated} days</p>
                      <p className="text-rose-300">Used: {d.Used} days</p>
                      <p className="text-emerald-300">Available: {d.Available} days</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Allocated" fill="#3448A5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Used" fill="#DC5353" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Available" fill="#16A37B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
