"use client";

import React, { useState, useEffect } from "react";
import { Quote, Building2, Briefcase, Calendar, ShieldCheck, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getISTGreeting, formatDate } from "@/lib/utils";

export function CorporateHeroBanner() {
  const { currentUser, departments } = useAppStore();
  const [greeting, setGreeting] = useState("Good Day");
  const [istDateStr, setIstDateStr] = useState("");

  useEffect(() => {
    setGreeting(getISTGreeting());
    setIstDateStr(formatDate(new Date(), "EEE, MMM dd, yyyy"));
    const interval = setInterval(() => {
      setGreeting(getISTGreeting());
      setIstDateStr(formatDate(new Date(), "EEE, MMM dd, yyyy"));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const dept = departments.find((d) => d.id === currentUser.department_id);
  const deptName = dept?.name || "Engineering & Technology";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#E9DFD0] shadow-[0_8px_30px_-6px_rgba(16,28,53,0.08)] min-h-[200px] sm:min-h-[220px] bg-[#FAF7F2]">
      {/* Background panoramic royal corporate headquarters architecture */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[1.02] contrast-[1.02] transform transition-transform duration-700 hover:scale-[1.01]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />

      {/* Atmospheric warm pearl ivory gradient overlay matching reference */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5EF]/98 via-[#F8F5EF]/85 to-transparent backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-[#FAF5EB]/40 pointer-events-none" />

      {/* Sweeping Soft Champagne Aura Wave */}
      <svg
        className="absolute -top-10 -left-10 w-[550px] h-[340px] opacity-40 pointer-events-none"
        viewBox="0 0 550 340"
        fill="none"
      >
        <path
          d="M-50,0 C150,50 250,220 500,120 C350,280 100,320 -50,340 Z"
          fill="url(#goldSwooshGrad)"
        />
        <defs>
          <linearGradient id="goldSwooshGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C5A46D" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#DCC49B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E9DFD0" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Content wrapper */}
      <div className="relative z-10 p-4 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        {/* Left Section: Avatar + Greeting + Badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          {/* Avatar with luxury champagne gold ring & soft ambient glow */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-[2.5px] sm:p-[3px] bg-gradient-to-tr from-[#C5A46D] via-[#DCC49B] to-[#F5E6CA] shadow-[0_0_20px_rgba(197,164,109,0.35)]">
              <img
                src={
                  currentUser.avatar_url ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"
                }
                alt={currentUser.full_name}
                className="w-full h-full rounded-full object-cover ring-2 ring-white"
              />
            </div>
            <div className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#16A37B] rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
            </div>
          </div>

          {/* Greeting Typography */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#C5A46D] font-serif">
                WELCOME BACK! 👋
              </span>
            </div>

            <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#101C35] font-serif leading-tight">
              {greeting},{" "}
              <span className="block sm:inline text-[#101C35]">{currentUser.full_name}!</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md pt-0.5">
              May your workday be productive, collaborative, and fulfilling.
            </p>

            {/* Badges Pill: [ Department • Designation • Joined ] */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E9DFD0] text-[10px] sm:text-[11px] font-semibold text-[#101C35] shadow-2xs backdrop-blur-xs">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>{deptName}</span>
                </span>
                <span className="text-[#C5A46D]">&bull;</span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>{currentUser.designation || "Senior Software Engineer"}</span>
                </span>
                <span className="text-[#C5A46D] hidden sm:inline">&bull;</span>
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined: {currentUser.joining_date ? formatDate(currentUser.joining_date, "MMM yyyy") : "Jan 2022"}</span>
                </span>
                {istDateStr && (
                  <>
                    <span className="text-[#C5A46D] hidden md:inline">&bull;</span>
                    <span className="inline-flex items-center gap-1 text-[#101C35] font-mono hidden md:inline">
                      <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
                      <span>{istDateStr} (IST)</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Luxury Frosted Quote Card */}
        <div className="relative w-full md:max-w-xs self-stretch md:self-center">
          <div className="relative rounded-2xl bg-white/90 backdrop-blur-md border border-[#E9DFD0] p-3.5 sm:p-4 shadow-sm">
            <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5A46D]/90 mb-1" />
            <p className="text-xs italic font-serif text-[#101C35] leading-relaxed font-medium">
              &ldquo;Great things happen when you take time for yourself.&rdquo;
            </p>
            <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[10px] text-[#C5A46D] font-sans font-semibold">
              <span className="font-serif tracking-wider uppercase">LMS CORPORATE WELLNESS</span>
              <span>✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const CampusHeroBanner = CorporateHeroBanner;
export const OfficeHeroBanner = CorporateHeroBanner;
