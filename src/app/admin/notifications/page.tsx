"use client";

import React, { useState } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import { Bell, Send, CheckCircle2, Megaphone, AlertCircle } from "lucide-react";

export default function AdminNotificationsPage() {
  const { notifications, profiles } = useAppStore();
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title || !title.trim() || title.trim().length < 3) {
      setFormError("Announcement title must be at least 3 characters long.");
      return;
    }

    if (!message || !message.trim() || message.trim().length < 5) {
      setFormError("Broadcast message body must contain at least 5 characters.");
      return;
    }

    setBroadcastSent(true);
    setIsBroadcastOpen(false);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <PortalShell portal="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Announcement & Notification Center
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Broadcast corporate policy updates, project timelines, and holiday directives to all staff.
            </p>
          </div>

          <button
            onClick={() => {
              setFormError("");
              setTitle("");
              setMessage("");
              setIsBroadcastOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3448A5] hover:bg-[#2B3C8C] text-white text-xs font-semibold shadow-xs"
          >
            <Megaphone className="w-4 h-4" />
            <span>Broadcast Announcement</span>
          </button>
        </div>

        {broadcastSent && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Office announcement broadcasted to all active employee!</span>
          </div>
        )}

        {/* Notifications Feed */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl border border-slate-200/80 dark:border-[#232F46] divide-y divide-slate-100 dark:divide-slate-800/80 shadow-xs overflow-hidden">
          {notifications.map((n) => {
            const recipient = profiles.find((p) => p.id === n.user_id);

            return (
              <div key={n.id} className="p-4 flex items-start gap-3.5 hover:bg-slate-50/50 transition-colors">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {formatDate(n.created_at, "MMM dd, yyyy h:mm a")} IST
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Delivered to: <strong>{recipient?.full_name || "Corporate Employee"}</strong> ({recipient?.email})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Broadcast Modal */}
      <Modal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        title="Broadcast Office-Wide Announcement"
        description="Notify all employee and administrative staff across departments."
      >
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1">Announcement Title *</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Year-End Financial Close Leave Notice"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Broadcast Message Body *</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="State the administrative order, effective dates, and contact directives..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsBroadcastOpen(false)}
              className="px-3.5 py-1.5 border rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#3448A5] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Broadcast</span>
            </button>
          </div>
        </form>
      </Modal>
    </PortalShell>
  );
}
