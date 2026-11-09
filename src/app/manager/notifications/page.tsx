"use client";

import React from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Bell, CheckCheck } from "lucide-react";

export default function ManagerNotificationsPage() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const myNotifications = notifications.filter((n) => n.user_id === currentUser.id);

  return (
    <PortalShell portal="manager">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Manager Alerts & Submissions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Urgent pending approvals and institutional memos for Computer Science & Engineering.
            </p>
          </div>

          {myNotifications.length > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161F30] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] divide-y divide-slate-100 dark:divide-slate-800/80 shadow-xs overflow-hidden">
          {myNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">
                No active notifications
              </p>
            </div>
          ) : (
            myNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 transition-colors cursor-pointer flex items-start gap-3.5 ${
                  !n.is_read
                    ? "bg-indigo-50/50 dark:bg-indigo-950/20"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div
                  className={`p-2 rounded-xl mt-0.5 ${
                    !n.is_read
                      ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {formatDate(n.created_at, "MMM dd, yyyy h:mm a")} IST
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
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
