"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { CalendarCheck2, Search, Filter, Sparkles, Building2 } from "lucide-react";

export default function EmployeeHolidaysPage() {
  const { holidays, settings } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredHolidays = holidays.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || h.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <PortalShell portal="employee">
      <div className="space-y-6">
        <div className="pb-2 border-b border-[#E9DFD0]">
          <h2 className="text-2xl font-bold tracking-tight text-[#101C35] font-serif">
            Official Holiday Calendar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {settings.org_name} &bull; Corporate Holiday Schedule {settings.fiscal_year || "FY 2025–2026"}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl border border-[#E9DFD0] p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] flex flex-wrap items-center justify-between gap-3 bg-[#FAF7F2]/50">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search holiday name or occasion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#E9DFD0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] placeholder:text-slate-400 shadow-2xs font-sans"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3.5 py-2 text-xs bg-white border border-[#E9DFD0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] shadow-2xs cursor-pointer font-sans"
            >
              <option value="all">All Holiday Types</option>
              <option value="mandatory">Mandatory Holidays</option>
              <option value="restricted">Restricted / Discretionary</option>
              <option value="corporate_holiday">Company Observance</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium font-sans">
            <span className="font-bold text-[#101C35]">{filteredHolidays.length}</span> Holidays Scheduled
          </span>
        </div>

        {/* Holiday Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHolidays.map((h) => {
            const isMandatory = h.type === "mandatory";
            const isRecess = h.type === "corporate_holiday";

            return (
              <div
                key={h.id}
                className="bg-white rounded-3xl border border-[#E9DFD0] p-5 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] flex items-start gap-4 hover:shadow-md transition-all group"
              >
                {/* Date Badge */}
                <div className="p-3 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0] text-[#101C35] text-center shrink-0 min-w-[65px] group-hover:border-[#C5A46D] transition-colors">
                  <span className="text-[10px] block font-extrabold uppercase font-serif tracking-wider text-[#C5A46D]">
                    {formatDate(h.date, "MMM")}
                  </span>
                  <span className="text-2xl font-black block leading-none my-1 font-serif text-[#101C35]">
                    {formatDate(h.date, "dd")}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium font-mono">
                    {formatDate(h.date, "EEE")}
                  </span>
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-serif ${
                        isMandatory
                          ? "bg-[#EAF3ED] text-[#2C6244] border border-[#BDDEC8]"
                          : isRecess
                          ? "bg-[#FAF5EB] text-[#101C35] border border-[#E9DFD0]"
                          : "bg-[#FDF7E8] text-[#8C6B28] border border-[#ECDAB0]"
                      }`}
                    >
                      {h.type.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#101C35] leading-snug font-serif">
                    {h.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {h.description || "General institutional holiday observed across all departments."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalShell>
  );
}
