"use client";

import React from "react";
import Link from "next/link";
import { Zap, Send, CalendarDays, User, Bell, ChevronRight } from "lucide-react";

export function QuickActionsBar() {
  const actions = [
    {
      title: "Apply for Leave",
      href: "/employee/apply-leave",
      icon: Send,
    },
    {
      title: "My Calendar",
      href: "/employee/calendar",
      icon: CalendarDays,
    },
    {
      title: "My Profile",
      href: "/employee/profile",
      icon: User,
    },
    {
      title: "Notifications",
      href: "/employee/notifications",
      icon: Bell,
    },
  ];

  return (
    <div className="rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-2px_rgba(16,28,53,0.05)] p-5 text-[#101C35] h-full flex flex-col justify-between">
      {/* Title & View All */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E9DFD0]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#C5A46D] fill-[#C5A46D]" />
          <h3 className="text-sm font-bold tracking-tight text-[#101C35] font-serif">
            Quick Actions
          </h3>
        </div>

        <Link
          href="/employee/apply-leave"
          className="text-xs font-bold text-[#C5A46D] hover:text-[#B08F56] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Warm Ivory Action Tiles matching reference image */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link
              key={idx}
              href={act.href}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#E9DFD0] hover:border-[#C5A46D] transition-all duration-200 group text-center shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-[#C5A46D] border border-[#E9DFD0] flex items-center justify-center mb-2 transition-transform group-hover:scale-110 shadow-2xs">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-[#101C35] group-hover:text-[#C5A46D] leading-tight">
                {act.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

