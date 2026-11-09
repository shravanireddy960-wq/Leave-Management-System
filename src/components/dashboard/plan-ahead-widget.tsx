"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Hourglass } from "lucide-react";

export function PlanAheadWidget() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0A1020] via-[#101A33] to-[#1A264D] border border-amber-400/30 shadow-xl p-6 text-white flex flex-col justify-between relative overflow-hidden group">
      {/* Background ambient gold nebula glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Decorative Golden Hourglass graphic */}
      <div className="absolute -right-3 -bottom-3 opacity-20 group-hover:opacity-30 transition-opacity">
        <Hourglass className="w-36 h-36 text-amber-300 transform rotate-12" />
      </div>

      <div className="relative z-10 space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
          <Hourglass className="w-5 h-5 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold font-serif tracking-tight text-white">
          Plan Ahead,
          <br />
          Stay Productive
        </h3>

        <p className="text-xs text-slate-300/90 leading-relaxed max-w-[200px]">
          Check team availability before applying for leave.
        </p>
      </div>

      <div className="relative z-10 pt-6">
        <Link
          href="/employee/calendar"
          className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
        >
          <span>View Team Calendar</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

