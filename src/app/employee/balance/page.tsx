"use client";

import React from "react";
import Link from "next/link";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { PieChart, CalendarPlus, CheckCircle2, AlertCircle, FileCheck, ArrowRight } from "lucide-react";

export default function EmployeeBalancePage() {
  const { currentUser, balances, leaveTypes } = useAppStore();

  const myBalances = balances.filter((b) => b.user_id === currentUser.id);

  return (
    <PortalShell portal="employee">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E9DFD0]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#101C35] font-serif">
              Leave Balance &amp; Quota Entitlements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fiscal Year 2025–2026 &bull; Annual Leave Allocation Schedule
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

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {leaveTypes.map((lt) => {
            const bal = myBalances.find((b) => b.leave_type_id === lt.id);
            const allocated = bal ? bal.allocated : lt.annual_quota;
            const used = bal ? bal.used : 0;
            const pending = bal ? bal.pending : 0;
            const available = bal ? bal.available : lt.annual_quota;

            const usedPercent = allocated > 0 ? Math.min(100, Math.round((used / allocated) * 100)) : 0;

            return (
              <div
                key={lt.id}
                className="bg-white rounded-3xl border border-[#E9DFD0] p-6 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full ring-2 ring-white"
                          style={{ backgroundColor: lt.color || "#C5A46D" }}
                        />
                        <h3 className="text-sm font-bold text-[#101C35] font-serif">
                          {lt.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                        Code: {lt.code} &bull; {lt.is_paid ? "Paid Leave" : "Unpaid Leave"}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-[#101C35] font-serif">
                        {available}
                      </span>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold font-serif tracking-wider">
                        Days Left
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-sans">
                      <span>{used} Used</span>
                      <span>{allocated} Total Quota</span>
                    </div>
                    <div className="w-full h-2 bg-[#FAF7F2] border border-[#E9DFD0]/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${usedPercent}%`,
                          backgroundColor: lt.color || "#C5A46D",
                        }}
                      />
                    </div>
                  </div>

                  {/* Breakdown details */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block font-serif">Allocated</span>
                      <span className="font-bold text-[#101C35] font-serif">{allocated} d</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block font-serif">Used</span>
                      <span className="font-bold text-[#9E3E3E] font-serif">{used} d</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block font-serif">In Review</span>
                      <span className="font-bold text-[#8C6B28] font-serif">{pending} d</span>
                    </div>
                  </div>

                  {/* Policy Summary List */}
                  <div className="mt-4 space-y-2 text-[11px] text-slate-600">
                    <p className="line-clamp-2 leading-relaxed">{lt.description}</p>
                    <div className="pt-2 border-t border-[#E9DFD0] flex flex-wrap gap-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF5EB] border border-[#E9DFD0] text-[#101C35] font-medium">
                        Max: {lt.max_consecutive_days} consecutive days
                      </span>
                      {lt.carry_forward_eligible ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#EAF3ED] border border-[#BDDEC8] text-[#2C6244] font-medium">
                          Carry-forward eligible
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E9DFD0] text-slate-500 font-medium">
                          No carry forward
                        </span>
                      )}
                      {lt.requires_document && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF5EB] border border-[#E9DFD0] text-[#8C6B28] font-medium">
                          Document proof required
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E9DFD0]">
                  <Link
                    href={`/employee/apply-leave`}
                    className="w-full py-2 px-3 rounded-xl bg-[#FAF5EB] hover:bg-[#C5A46D] hover:text-[#101C35] text-[#101C35] text-xs font-bold border border-[#E9DFD0] flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>Request {lt.code}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalShell>
  );
}
