"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { format, getCurrentISTParts } from "@/lib/date-utils";

interface ISTClockBadgeProps {
  showDate?: boolean;
  variant?: "pill" | "banner" | "compact";
  className?: string;
}

export function ISTClockBadge({
  showDate = true,
  variant = "pill",
  className = "",
}: ISTClockBadgeProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000); // 1-second pulse for real-time accuracy
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E9DFD0] text-[#101C35] text-[11px] font-mono animate-pulse ${className}`}>
        <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
        <span>Loading IST...</span>
      </div>
    );
  }

  const timeStr = format(now, "hh:mm:ss a");
  const dateStr = format(now, "EEE, MMM dd, yyyy");

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-[#E9DFD0] text-[#101C35] text-[11px] font-mono shadow-2xs backdrop-blur-xs ${className}`}
        title={`Indian Standard Time (IST - UTC+05:30) • ${dateStr}`}
      >
        <span className="w-2 h-2 rounded-full bg-[#16A37B] animate-ping" />
        <span className="font-bold text-[#101C35]">{timeStr}</span>
        <span className="text-[10px] font-bold text-[#C5A46D] px-1 py-0.2 rounded bg-[#FAF5EB]">IST</span>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-2xl bg-white/95 border border-[#E9DFD0] shadow-2xs backdrop-blur-xs text-[#101C35] text-xs font-sans ${className}`}
      >
        <div className="flex items-center gap-1 text-[#C5A46D]">
          <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span className="text-[10px] font-extrabold uppercase font-serif tracking-wider">IST (UTC+05:30)</span>
        </div>
        <span className="text-slate-300">&bull;</span>
        <span className="font-mono font-bold text-[#101C35]">{timeStr}</span>
        {showDate && (
          <>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="text-slate-500 font-medium hidden sm:inline">{dateStr}</span>
          </>
        )}
      </div>
    );
  }

  // Default "pill"
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E9DFD0] text-[#101C35] text-xs shadow-2xs ${className}`}
      title="Accurate Indian Standard Time (IST, UTC+05:30)"
    >
      <div className="flex items-center gap-1 text-[#C5A46D]">
        <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
        <span className="text-[10px] font-bold uppercase font-serif tracking-wider">IST</span>
      </div>
      <span className="text-slate-300">&bull;</span>
      <span className="font-mono font-bold text-[#101C35] text-[11px] sm:text-xs">{timeStr}</span>
      {showDate && (
        <>
          <span className="text-slate-300 hidden md:inline">&bull;</span>
          <span className="text-slate-600 font-medium text-[11px] hidden md:inline">{dateStr}</span>
        </>
      )}
    </div>
  );
}

