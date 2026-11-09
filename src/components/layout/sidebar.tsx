"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/components/theme-provider";
import {
  LayoutDashboard,
  CalendarPlus,
  FileText,
  PieChart,
  CalendarDays,
  CalendarCheck2,
  Bell,
  User,
  Settings,
  CheckCircle2,
  Users,
  Building2,
  Briefcase,
  History,
  TrendingUp,
  FileSpreadsheet,
  ShieldAlert,
  Sliders,
  Compass,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  portal: "employee" | "manager" | "admin";
  isMobileDrawer?: boolean;
  onClose?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: number;
  highlight?: boolean;
}

export function Sidebar({ portal, isMobileDrawer = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { leaveRequests, notifications, currentUser } = useAppStore();
  const { theme, setTheme, isDark } = useTheme();

  const pendingApprovalsCount = leaveRequests.filter((r) => r.status === "pending").length;
  const unreadNotifsCount = notifications.filter((n) => !n.is_read && n.user_id === currentUser.id).length;

  const employeeNav: NavItem[] = [
    { title: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
    { title: "Apply for Leave", href: "/employee/apply-leave", icon: CalendarPlus },
    { title: "My Requests", href: "/employee/requests", icon: FileText },
    { title: "Leave Balance", href: "/employee/balance", icon: PieChart },
    { title: "Calendar", href: "/employee/calendar", icon: CalendarDays },
    { title: "Team Overview", href: "/employee/team", icon: Users },
    { title: "Analytics", href: "/employee/analytics", icon: TrendingUp },
    { title: "Notifications", href: "/employee/notifications", icon: Bell, badge: unreadNotifsCount > 0 ? unreadNotifsCount : 3 },
    { title: "Settings", href: "/employee/settings", icon: Settings },
    { title: "Help & Support", href: "/employee/holidays", icon: Compass },
  ];

  const managerNav: NavItem[] = [
    { title: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
    {
      title: "Pending Approvals",
      href: "/manager/approvals",
      icon: CheckCircle2,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      highlight: true,
    },
    { title: "Department Requests", href: "/manager/requests", icon: FileText },
    { title: "Approval History", href: "/manager/history", icon: History },
    { title: "Team Members", href: "/manager/team", icon: Users },
    { title: "Team Calendar", href: "/manager/calendar", icon: CalendarDays },
    { title: "Leave Analytics", href: "/manager/analytics", icon: TrendingUp },
    { title: "Notifications", href: "/manager/notifications", icon: Bell, badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined },
    { title: "Profile", href: "/manager/profile", icon: User },
    { title: "Settings", href: "/manager/settings", icon: Settings },
  ];

  const adminNav: NavItem[] = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Employees", href: "/admin/employees", icon: Users },
    { title: "Departments", href: "/admin/departments", icon: Building2 },
    { title: "Department Managers", href: "/admin/managers", icon: Briefcase },
    { title: "All Leave Records", href: "/admin/leaves", icon: FileText },
    { title: "Leave Types", href: "/admin/leave-types", icon: Compass },
    { title: "Leave Policies", href: "/admin/policies", icon: Sliders },
    { title: "Leave Allocations", href: "/admin/allocations", icon: PieChart },
    { title: "Holiday Master", href: "/admin/holidays", icon: CalendarCheck2 },
    { title: "Master Calendar", href: "/admin/calendar", icon: CalendarDays },
    { title: "Reports & Exports", href: "/admin/reports", icon: FileSpreadsheet },
    { title: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
    { title: "Notifications", href: "/admin/notifications", icon: Bell },
    { title: "Administrator Profile", href: "/admin/profile", icon: User },
    { title: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  const navItems = portal === "employee" ? employeeNav : portal === "manager" ? managerNav : adminNav;

  return (
    <aside
      className={cn(
        "bg-[#101C35] text-slate-300 border-r border-[#E9DFD0]/20 flex flex-col justify-between select-none shadow-2xl overflow-y-auto",
        isMobileDrawer
          ? "w-72 sm:w-80 h-full z-50 fixed inset-y-0 left-0"
          : "w-64 shrink-0 h-screen sticky top-0 z-30"
      )}
    >
      {/* Top Brand Header */}
      <div>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link
            href={`/${portal}/dashboard`}
            onClick={onClose}
            className="flex items-center gap-3"
          >
            {/* Stylized Golden Lotus Emblem */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C5A46D] via-[#DCC49B] to-[#F5E6CA] p-[1.5px] shadow-[0_0_15px_rgba(197,164,109,0.35)] shrink-0">
              <div className="w-full h-full bg-[#101C35] rounded-[14px] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#DCC49B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3c-2 4-5 6-9 7 4 3 6 7 7 11 1-4 3-8 7-11-4-1-7-3-9-7z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-white tracking-widest text-sm font-serif">
                LMS
              </span>
              <span className="text-[10px] text-[#DCC49B] font-serif leading-none mt-0.5">
                Leave Management System
              </span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          {isMobileDrawer && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5 text-[#DCC49B]" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-21rem)] scrollbar-thin">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group relative active:scale-[0.98]",
                  isActive
                    ? "bg-[#DCC49B] text-[#101C35] font-bold shadow-[0_4px_15px_rgba(197,164,109,0.3)]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-[#101C35]" : "text-slate-400 group-hover:text-[#DCC49B]"
                  )}
                />

                <span className="truncate flex-1 tracking-wide font-sans">{item.title}</span>

                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 shadow-xs",
                      isActive
                        ? "bg-[#101C35] text-[#DCC49B]"
                        : "bg-[#C98787] text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Mountain Artwork + Theme Toggle */}
      <div className="p-3 space-y-3 border-t border-white/5 bg-[#080C17]/60">
        <div className="relative overflow-hidden rounded-2xl border border-amber-400/20 shadow-md group">
          {/* Misty Alpine Mountain Landscape Artwork */}
          <div
            className="h-20 bg-cover bg-center brightness-75 group-hover:scale-105 transition-transform duration-500"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-[#0A0F1D]/40 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 text-center">
            <p className="text-[11px] font-serif italic text-[#DCC49B] leading-tight drop-shadow-md">
              Work Smart,
              <br />
              Take the Leave You Deserve.
            </p>
          </div>
        </div>

        {/* Sun / Moon Switcher Slider */}
        <div className="flex items-center justify-between px-2 py-1.5 bg-black/40 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sun className={cn("w-3.5 h-3.5", !isDark ? "text-amber-400" : "text-slate-600")} />
            <span className="text-[11px] font-medium">Appearance</span>
          </div>

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-12 h-6 bg-slate-800 rounded-full p-0.5 border border-amber-400/30 transition-colors cursor-pointer"
            title="Toggle Light / Dark mode"
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-md transform transition-transform flex items-center justify-center",
                isDark ? "translate-x-6" : "translate-x-0"
              )}
            >
              {isDark ? (
                <Moon className="w-3 h-3 text-slate-950" />
              ) : (
                <Sun className="w-3 h-3 text-slate-950" />
              )}
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
