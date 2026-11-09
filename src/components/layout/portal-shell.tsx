"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { useAppStore } from "@/lib/store";
import {
  ShieldAlert,
  ArrowLeft,
  LogOut,
  Lock,
  LayoutDashboard,
  CalendarPlus,
  FileText,
  CalendarDays,
  Menu,
  CheckCircle2,
  Users,
} from "lucide-react";

interface PortalShellProps {
  portal: "employee" | "manager" | "admin";
  children: React.ReactNode;
}

export function PortalShell({ portal, children }: PortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated, logout, leaveRequests } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on route transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Strict route protection: redirect to /login if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const isAuthorized =
    portal === "admin"
      ? currentUser.role === "admin"
      : portal === "manager"
      ? currentUser.role === "manager" || currentUser.role === "admin"
      : true;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] flex items-center justify-center p-6 text-[#101C35] font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF5EB] border border-[#E9DFD0] text-[#C5A46D] flex items-center justify-center mx-auto animate-pulse">
            <Lock className="w-6 h-6" />
          </div>
          <p className="text-sm text-[#101C35] font-serif font-bold">Session authorization required.</p>
          <p className="text-xs text-slate-500">Redirecting to secure login terminal...</p>
        </div>
      </div>
    );
  }

  // Quick action link depending on current role
  const actionLink =
    portal === "employee"
      ? { href: "/employee/apply-leave", icon: CalendarPlus, label: "Apply" }
      : portal === "manager"
      ? { href: "/manager/approvals", icon: CheckCircle2, label: "Approvals" }
      : { href: "/admin/leaves", icon: CheckCircle2, label: "Adjudicate" };

  const secondaryLink =
    portal === "employee"
      ? { href: "/employee/requests", icon: FileText, label: "Requests" }
      : portal === "manager"
      ? { href: "/manager/team", icon: Users, label: "Team" }
      : { href: "/admin/employees", icon: Users, label: "Staff" };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#101C35] flex flex-row font-sans relative selection:bg-[#C5A46D]/25 selection:text-[#101C35]">
      {/* Warm Pearl Ivory Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#FAF5EB] rounded-full blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-[#F2EDE2] rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] bg-[#F6F0E4] rounded-full blur-3xl opacity-60" />
      </div>

      {/* Permanently Static Sidebar for Desktop (lg and wider) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar portal={portal} />
      </div>

      {/* Slide-over Royal Mobile Drawer (Phones & Tablets) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />
          {/* Drawer Panel */}
          <div className="relative z-50 animate-in slide-in-from-left duration-300 h-full">
            <Sidebar
              portal={portal}
              isMobileDrawer={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Workspace Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10 overflow-x-hidden pb-20 lg:pb-0">
        <Navbar portal={portal} onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
          {!isAuthorized ? (
            <div className="bg-white/95 border border-amber-400/30 rounded-3xl p-6 sm:p-10 text-center max-w-lg mx-auto mt-10 sm:mt-16 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                Access Restricted — Elevated Clearance Required
              </h2>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                Your authenticated session for{" "}
                <strong className="text-slate-900">{currentUser.full_name}</strong>{" "}
                is registered under the{" "}
                <span className="font-bold uppercase tracking-wider text-amber-600">
                  {currentUser.role}
                </span>{" "}
                role. You do not hold permissions to access the{" "}
                <span className="font-bold uppercase tracking-wider text-amber-600">
                  {portal}
                </span>{" "}
                portal.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/${currentUser.role}/dashboard`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to My Workspace</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign In With Other Account</span>
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </main>

        {/* Luxury Mobile Bottom Navigation Dock (< lg) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E9DFD0] px-2 py-2 flex items-center justify-around shadow-[0_-8px_30px_rgba(16,28,53,0.08)]">
          {/* Dashboard */}
          <Link
            href={`/${portal}/dashboard`}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
              pathname.endsWith("/dashboard")
                ? "text-[#101C35] font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-colors ${
                pathname.endsWith("/dashboard")
                  ? "bg-[#DCC49B] text-[#101C35]"
                  : "bg-transparent text-slate-400"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-[10px] leading-none">Home</span>
          </Link>

          {/* Quick Action (Apply / Approvals / Leaves) */}
          <Link
            href={actionLink.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
              pathname === actionLink.href
                ? "text-[#101C35] font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-colors ${
                pathname === actionLink.href
                  ? "bg-[#DCC49B] text-[#101C35]"
                  : "bg-transparent text-slate-400"
              }`}
            >
              <actionLink.icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] leading-none">{actionLink.label}</span>
          </Link>

          {/* Secondary Action (Requests / Team / Staff) */}
          <Link
            href={secondaryLink.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
              pathname === secondaryLink.href
                ? "text-[#101C35] font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-colors ${
                pathname === secondaryLink.href
                  ? "bg-[#DCC49B] text-[#101C35]"
                  : "bg-transparent text-slate-400"
              }`}
            >
              <secondaryLink.icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] leading-none">{secondaryLink.label}</span>
          </Link>

          {/* Calendar */}
          <Link
            href={`/${portal}/calendar`}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
              pathname.endsWith("/calendar")
                ? "text-[#101C35] font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-colors ${
                pathname.endsWith("/calendar")
                  ? "bg-[#DCC49B] text-[#101C35]"
                  : "bg-transparent text-slate-400"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="text-[10px] leading-none">Calendar</span>
          </Link>

          {/* More Menu (Triggers Slide-over Drawer) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-slate-400 hover:text-[#101C35] transition-all cursor-pointer"
          >
            <div className="p-1.5 rounded-xl bg-slate-100 text-[#101C35]">
              <Menu className="w-4 h-4" />
            </div>
            <span className="text-[10px] leading-none">Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
