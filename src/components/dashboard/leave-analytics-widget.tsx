"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, TrendingUp } from "lucide-react";

const monthlyData = [
  { month: "Jan", leaves: 6 },
  { month: "Feb", leaves: 7 },
  { month: "Mar", leaves: 10 },
  { month: "Apr", leaves: 8 },
  { month: "May", leaves: 7 },
  { month: "Jun", leaves: 9 },
  { month: "Jul", leaves: 12 },
  { month: "Aug", leaves: 10 },
  { month: "Sep", leaves: 8 },
  { month: "Oct", leaves: 7 },
  { month: "Nov", leaves: 9 },
  { month: "Dec", leaves: 5 },
];

export function LeaveAnalyticsWidget() {
  const [filter, setFilter] = useState<"6M" | "1Y" | "Custom">("1Y");

  return (
    <div className="rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-2px_rgba(16,28,53,0.05)] p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E9DFD0]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#FAF5EB] text-[#C5A46D] flex items-center justify-center border border-[#E9DFD0]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-[#101C35] font-serif tracking-tight">
            Leave Analytics
          </h3>
        </div>

        {/* Filter Pills matching reference: [ 6M | 1Y (active dark) | Custom ▾ ] */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F8F5EF] border border-[#E9DFD0]">
          <button
            onClick={() => setFilter("6M")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filter === "6M"
                ? "bg-[#101C35] text-white shadow-xs"
                : "text-slate-500 hover:text-[#101C35]"
            }`}
          >
            6M
          </button>
          <button
            onClick={() => setFilter("1Y")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filter === "1Y"
                ? "bg-[#101C35] text-white shadow-xs"
                : "text-slate-500 hover:text-[#101C35]"
            }`}
          >
            1Y
          </button>
          <button
            onClick={() => setFilter("Custom")}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filter === "Custom"
                ? "bg-[#101C35] text-white shadow-xs"
                : "text-slate-500 hover:text-[#101C35]"
            }`}
          >
            <span>Custom</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Body: Spline Area Chart + Donut Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center pt-4">
        {/* Left 2 Cols: Area Chart */}
        <div className="lg:col-span-2 h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="leaveAmberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A46D" stopOpacity="0.35" />
                  <stop offset="95%" stopColor="#C5A46D" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                ticks={[0, 5, 10, 15]}
              />
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#101C35] text-white text-[11px] px-3 py-1.5 rounded-xl shadow-lg border border-[#C5A46D]">
                        <span className="font-semibold text-[#DCC49B]">
                          {payload[0].payload.month} 2025:
                        </span>{" "}
                        {payload[0].value} Leaves
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="leaves"
                stroke="#C5A46D"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#leaveAmberGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right 1 Col: Donut Gauge with laurel branches matching reference */}
        <div className="flex flex-col items-center justify-center p-3 text-center border-t lg:border-t-0 lg:border-l border-[#E9DFD0]">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Circular Progress Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#F0EBE1"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#101C35"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset="50.24"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-[#101C35] font-serif">80%</span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="block text-xs font-bold text-[#101C35]">
              Leave Utilization
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-[#16A37B] mt-0.5">
              &uarr; 5%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
