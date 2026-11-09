"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function UpcomingHolidaysWidget() {
  const holidayList = [
    {
      month: "Aug",
      dayNumber: "15",
      title: "Independence Day",
      dayOfWeek: "Friday",
      flag: "🇮🇳",
      imageUrl: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=260&q=80",
      alt: "Independence Day Heritage",
    },
    {
      month: "Sep",
      dayNumber: "27",
      title: "Ganesh Chaturthi",
      dayOfWeek: "Saturday",
      flag: "🕉️",
      imageUrl: "https://images.unsplash.com/photo-1567591414240-e2b20f01192e?auto=format&fit=crop&w=260&q=80",
      alt: "Ganesh Chaturthi",
    },
    {
      month: "Oct",
      dayNumber: "02",
      title: "Gandhi Jayanti",
      dayOfWeek: "Thursday",
      flag: "👓",
      imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=260&q=80",
      alt: "Gandhi Jayanti Commemoration",
    },
  ];

  return (
    <div className="rounded-3xl bg-white border border-[#E9DFD0] shadow-[0_4px_20px_-2px_rgba(16,28,53,0.05)] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden h-full">
      {/* Top subtle golden rim accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E9DFD0]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#FAF5EB] text-[#C5A46D] flex items-center justify-center border border-[#E9DFD0]">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#101C35] font-serif tracking-tight">
            Upcoming Holidays
          </h3>
        </div>

        <Link
          href="/employee/holidays"
          className="text-xs font-bold text-[#C5A46D] hover:text-[#B08F56] flex items-center gap-1 transition-colors"
        >
          <span>View Calendar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Holiday Rows */}
      <div className="space-y-3 pt-3">
        {holidayList.map((item, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#E9DFD0] transition-all duration-200 shadow-2xs"
          >
            {/* Date + Title */}
            <div className="flex items-center gap-3 min-w-0 pr-2">
              {/* Date Box */}
              <div className="text-center w-11 shrink-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
                  {item.month}
                </span>
                <span className="block text-xl font-extrabold text-[#101C35] font-serif leading-none mt-0.5">
                  {item.dayNumber}
                </span>
              </div>

              {/* Title & Day */}
              <div className="border-l border-[#E9DFD0] pl-2.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{item.flag}</span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#101C35] truncate">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  ({item.dayOfWeek})
                </p>
              </div>
            </div>

            {/* Scenic Landmark Thumbnail matching reference image */}
            <div className="w-16 h-11 sm:w-20 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-[#E9DFD0] shadow-2xs relative">
              <img
                src={item.imageUrl}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

