"use client";

import React from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Bell, CheckCheck, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function EmployeeNotificationsPage() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();

  const myNotifications = notifications.filter((n) => n.user_id === currentUser.id);

  return (
    <PortalShell portal="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#E9DFD0]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#101C35] font-serif">
              Notification Center
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time updates on your leave requests, institutional alerts, and approval decisions.
            </p>
          </div>

          {myNotifications.length > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#E9DFD0] bg-white text-xs font-semibold text-[#101C35] hover:bg-[#FAF5EB] transition-colors shadow-2xs font-sans"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#E9DFD0] divide-y divide-[#E9DFD0]/60 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.05)] overflow-hidden">
          {myNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5EB] text-[#C5A46D] flex items-center justify-center mx-auto mb-3 border border-[#E9DFD0]">
                <Bell className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-[#101C35] font-serif">
                No notifications right now
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-sans">
                When your requests are processed or announcements occur, you'll see them here.
              </p>
            </div>
          ) : (
            myNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 sm:p-5 transition-colors cursor-pointer flex items-start gap-4 ${
                  !n.is_read
                    ? "bg-[#FAF5EB]/50"
                    : "hover:bg-[#FAF7F2]/60"
                }`}
              >
                <div
                  className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                    !n.is_read
                      ? "bg-[#DCC49B]/30 text-[#101C35] border border-[#C5A46D]/40"
                      : "bg-[#FAF7F2] text-slate-400 border border-[#E9DFD0]"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#101C35] font-serif">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {formatDate(n.created_at, "MMM dd, yyyy h:mm a")} IST
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PortalShell>
  );
}
