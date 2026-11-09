"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Bot,
  Sparkles,
  X,
  Send,
  Zap,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  HelpCircle,
  FileCheck2,
  Crown,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export function AILeaveConciergeCard() {
  const router = useRouter();
  const { currentUser, balances, holidays, leaveRequests } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      role: "bot" | "user";
      text: string;
      prediction?: { probability: number; rationale: string };
      actionLink?: { text: string; href: string };
    }>
  >([
    {
      role: "bot",
      text: `Greetings, ${currentUser.full_name}! 🏛️ I am your LMS AI Leave Concierge. I can predict sanction probability, calculate working days, and find collision-free leave windows.`,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { role: "user" as const, text: query }];
    setMessages(newMsgs);
    setInput("");

    setTimeout(() => {
      let reply = "I can analyze your balance ledger, check department staffing coverage, or find optimal leave windows.";
      let prediction: { probability: number; rationale: string } | undefined = undefined;
      let actionLink: { text: string; href: string } | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes("3-day") || lower.includes("when can i") || lower.includes("suggest") || lower.includes("recommend")) {
        reply = "Recommended 3-day optimal leave windows with >85% Engineering department coverage: Aug 22–Aug 24 (Fri-Sun), Sep 05–Sep 07 (Fri-Sun), Sep 12–Sep 14 (Fri-Sun). No conflicting sprint deliverables or release cycles.";
        prediction = {
          probability: 98,
          rationale: "Department staffing is optimal (88%). No critical on-call schedule collisions detected.",
        };
        actionLink = { text: "Apply for Aug 22 – Aug 24", href: "/employee/apply-leave" };
      } else if (lower.includes("balance") || lower.includes("how many") || lower.includes("available")) {
        const userBals = balances.filter((b) => b.user_id === currentUser.id);
        const total = userBals.reduce((sum, b) => sum + b.available, 0) || 12;
        reply = `Entitlement Balance: You possess ${total} total available days for session 2025–2026. Casual Leave: 12 days, Sick Leave: 10 days, Earned Leave: 15 days.`;
        actionLink = { text: "Inspect Full Balance Ledger", href: "/employee/balance" };
      } else if (lower.includes("holiday") || lower.includes("upcoming") || lower.includes("calendar")) {
        reply = "Upcoming Official Breaks: Independence Day (Friday, Aug 15), Ganesh Chaturthi (Saturday, Sep 27), and Gandhi Jayanti (Thursday, Oct 02).";
        actionLink = { text: "View Institutional Calendar", href: "/employee/calendar" };
      } else {
        reply = `Understood. Based on your profile (${currentUser.designation || "Senior Software Engineer"}, Engineering & Technology), your requests route directly to your reporting manager with automated team coverage checks.`;
        prediction = {
          probability: 95,
          rationale: "Zero disciplinary flags. Entitlement is in positive standing.",
        };
      }

      setMessages((prev) => [...prev, { role: "bot", text: reply, prediction, actionLink }]);
    }, 450);
  };

  return (
    <>
      {/* Royal Navy AI Leave Concierge Card matching reference */}
      <div className="rounded-3xl bg-[#101C35] text-white p-5 flex flex-col justify-between border border-[#C5A46D]/30 shadow-[0_8px_30px_-4px_rgba(16,28,53,0.3)] relative overflow-hidden h-full group">
        {/* Top gold sheen line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent" />

        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-white font-serif tracking-tight">
                AI Leave Concierge
              </h3>
              <Sparkles className="w-3.5 h-3.5 text-[#DCC49B]" />
            </div>
            <span className="w-2 h-2 rounded-full bg-[#16A37B] animate-pulse" title="AI Copilot Online" />
          </div>
          <p className="text-[11px] text-slate-300 font-sans mt-0.5">
            Your smart leave assistant
          </p>

          {/* Dialogue preview container matching reference */}
          <div className="mt-3.5 space-y-2.5">
            {/* User message bubble */}
            <div className="flex items-start justify-end gap-2">
              <div className="bg-[#1C2C4E] border border-[#2A3E6A] rounded-2xl rounded-tr-xs px-3 py-1.5 text-xs text-white max-w-[85%] shadow-xs">
                When can I take a 3-day leave?
              </div>
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[#C5A46D]">
                <img
                  src={currentUser.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                  alt={currentUser.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Concierge response bubble */}
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FAF5EB] text-[#101C35] flex items-center justify-center shrink-0 border border-[#DCC49B] shadow-xs">
                <svg className="w-3.5 h-3.5 text-[#C5A46D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 3c-2 4-5 6-9 7 4 3 6 7 7 11 1-4 3-8 7-11-4-1-7-3-9-7z" />
                </svg>
              </div>

              <div className="bg-[#182645] border border-[#2D3E66] rounded-2xl rounded-tl-xs p-3 text-xs text-slate-200 flex-1 space-y-2 shadow-xs">
                <p className="text-[11px] text-slate-300 leading-tight">
                  Here are the best options with high availability:
                </p>

                <div className="space-y-1 pt-0.5">
                  <div className="flex items-center justify-between text-[11px] py-0.5 px-2 rounded-lg bg-[#101C35] border border-white/5">
                    <span className="font-medium text-white">Aug 22 &ndash; Aug 24</span>
                    <span className="text-[#16A37B] font-bold text-[10px] flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Available
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] py-0.5 px-2 rounded-lg bg-[#101C35] border border-white/5">
                    <span className="font-medium text-white">Sep 05 &ndash; Sep 07</span>
                    <span className="text-[#16A37B] font-bold text-[10px] flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Available
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] py-0.5 px-2 rounded-lg bg-[#101C35] border border-white/5">
                    <span className="font-medium text-white">Sep 12 &ndash; Sep 14</span>
                    <span className="text-[#16A37B] font-bold text-[10px] flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: View Details -> */}
        <div className="pt-3.5">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#DCC49B] via-[#C5A46D] to-[#B08F56] hover:brightness-105 text-[#101C35] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Full Interactive Concilot Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-[#E9DFD0] shadow-2xl overflow-hidden flex flex-col max-h-[620px]">
            {/* Header */}
            <div className="p-4 bg-[#101C35] text-white flex items-center justify-between border-b border-[#C5A46D]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C5A46D]/20 border border-[#C5A46D] flex items-center justify-center text-[#DCC49B]">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold font-serif text-white tracking-wide">
                      LMS AI Leave Concierge
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#16A37B]/20 text-[#7FA18B] border border-[#7FA18B]/40 text-[9px] font-mono font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[10px] text-[#DCC49B] font-mono">
                    Predictive Institutional Coverage Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3.5 bg-[#FAF7F2]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#101C35] text-white font-medium shadow-xs"
                        : "bg-white text-[#101C35] border border-[#E9DFD0] shadow-xs"
                    }`}
                  >
                    <p>{m.text}</p>

                    {m.prediction && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-[#FAF5EB] border border-[#E9DFD0] text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#101C35] font-serif">Sanction Probability</span>
                          <span className="font-mono font-extrabold text-[#16A37B]">
                            {m.prediction.probability}%
                          </span>
                        </div>
                        <p className="text-slate-600 text-[10px]">{m.prediction.rationale}</p>
                      </div>
                    )}

                    {m.actionLink && (
                      <div className="mt-2.5 pt-2 border-t border-[#E9DFD0]">
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push(m.actionLink!.href);
                          }}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C5A46D] hover:underline"
                        >
                          <span>{m.actionLink.text}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 bg-white border-t border-[#E9DFD0] flex flex-wrap gap-1.5 overflow-x-auto">
              <button
                onClick={() => handleSend("Suggest optimal 3-day leave dates for next month")}
                className="px-2.5 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#E9DFD0] text-[10px] font-medium text-[#101C35] transition-colors"
              >
                🗓️ Suggest 3-day leave
              </button>
              <button
                onClick={() => handleSend("What is my current available balance?")}
                className="px-2.5 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#E9DFD0] text-[10px] font-medium text-[#101C35] transition-colors"
              >
                📊 Check balance
              </button>
              <button
                onClick={() => handleSend("What are the upcoming institutional holidays?")}
                className="px-2.5 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#E9DFD0] text-[10px] font-medium text-[#101C35] transition-colors"
              >
                🎉 Upcoming holidays
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#E9DFD0] flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about team availability, leave policies, or dates..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D] text-[#101C35] placeholder:text-slate-400 font-sans"
              />
              <button
                onClick={() => handleSend()}
                className="w-9 h-9 rounded-xl bg-[#101C35] hover:bg-[#1A2E56] text-[#DCC49B] flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function BalanceWorkMascotCard() {
  const router = useRouter();

  return (
    <div className="rounded-3xl border border-[#E9DFD0] shadow-[0_4px_20px_-2px_rgba(16,28,53,0.05)] overflow-hidden relative group min-h-[175px] flex items-stretch">
      {/* Royal Heritage Palace Pavilion Background */}
      <div
        className="w-1/2 bg-cover bg-center brightness-[0.95] contrast-[1.05] relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-2 text-white">
          <p className="text-sm font-serif italic font-bold leading-tight drop-shadow-md text-[#F5E6CA]">
            Balance Work.
            <br />
            Embrace Life.
          </p>
        </div>
      </div>

      {/* Right Side: Crowned 3D Robot Mascot 👑 */}
      <div className="w-1/2 bg-[#FAF7F2] p-4 flex flex-col items-center justify-center text-center relative">
        <div className="relative">
          {/* Golden Crown */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-[#C5A46D] animate-bounce">
            <Crown className="w-5 h-5 fill-[#C5A46D]" />
          </div>

          {/* 3D Robot Mascot with Glowing Blue LED Visor */}
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#DCC49B] shadow-md flex items-center justify-center relative mt-1">
            <Bot className="w-9 h-9 text-[#101C35] animate-float-gentle" />
            <div className="absolute top-4 w-7 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38bdf8]" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#16A37B] border-2 border-white" />
          </div>
        </div>

        <div className="mt-2 text-center">
          <span className="block text-[11px] font-bold text-[#101C35] font-serif">
            LMS Concierge
          </span>
          <button
            onClick={() => router.push("/employee/apply-leave")}
            className="mt-1 text-[10px] font-bold text-[#C5A46D] hover:underline block"
          >
            Plan Leave &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

// Default export alias for backwards-compat
export function AIMascotWidget() {
  return <AILeaveConciergeCard />;
}
