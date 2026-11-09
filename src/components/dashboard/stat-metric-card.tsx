"use client";

import React from "react";
import { Info, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatMetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: string;
  actionText?: string;
  actionHref?: string;
  hasInfoTooltip?: boolean;
}

export function StatMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  actionText,
  actionHref,
  hasInfoTooltip = true,
}: StatMetricCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-2px_rgba(16,28,53,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(16,28,53,0.1)] hover:border-[#C5A46D] transition-all duration-300 p-4 sm:p-5 flex items-center justify-between">
      {/* Subtle top gold sheen line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A46D]/40 to-transparent group-hover:via-[#C5A46D] transition-all" />

      {/* Left: Icon Badge */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div
          className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border border-[#E9DFD0]/60 transition-transform group-hover:scale-105 shadow-2xs",
            iconBg
          )}
        >
          <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", iconColor)} />
        </div>

        {/* Middle: Content */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 truncate">
            <span className="truncate">{title}</span>
            {hasInfoTooltip && (
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer" />
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5 sm:mt-1">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#101C35] font-serif truncate">
              {value}
            </span>
            {trend && (
              <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-[#16A37B] bg-[#16A37B]/10 px-1.5 py-0.5 rounded-full border border-[#16A37B]/20 shrink-0">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Link (e.g. View All ->) */}
      {actionText && (
        <a
          href={actionHref || "#"}
          className="text-[11px] sm:text-xs font-bold text-slate-600 hover:text-[#C5A46D] flex items-center gap-1 transition-colors self-center shrink-0 pr-1 ml-2"
        >
          <span>{actionText}</span>
        </a>
      )}
    </div>
  );
}

