"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { validateEmail } from "@/lib/validations";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CalendarDays,
  TrendingUp,
  ShieldCheck,
  Users,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function LandingLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, currentUser } = useAppStore();

  const [email, setEmail] = useState("employee@lms.in");
  const [password, setPassword] = useState("employee@123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showDemoDirectory, setShowDemoDirectory] = useState(true);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setAuthError(emailVal.error || "Please enter a valid official corporate email.");
      return;
    }

    if (!password || !password.trim()) {
      setAuthError("Please enter your account password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      if (res.success && res.user) {
        router.push(`/${res.user.role}/dashboard`);
      } else {
        setIsLoading(false);
        setAuthError(res.error || "Invalid corporate credentials. Please try again.");
      }
    }, 450);
  };

  const handleQuickRoleFill = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setIsLoading(true);
    setAuthError("");
    setTimeout(() => {
      const res = login(userEmail, userPass);
      if (res.success && res.user) {
        router.push(`/${res.user.role}/dashboard`);
      } else {
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full relative flex items-stretch overflow-x-hidden bg-[#F8F5EF] text-[#101C35] selection:bg-[#C5A46D]/30 selection:text-[#101C35]">
      {/* Background panoramic palace image across full screen */}
      <div
        className="absolute inset-0 bg-cover bg-left md:bg-center brightness-[1.02] contrast-[1.02]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2600&q=85')`,
        }}
      />

      {/* Atmospheric Golden Morning Sunrise & Ivory Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5EF]/95 via-[#FAF6F0]/85 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-amber-50/30 pointer-events-none" />

      {/* Sweeping Soft Champagne Aura Ribbon on Right (Desktop only) */}
      <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[48%] pointer-events-none z-0 overflow-hidden hidden lg:block">
        <svg
          className="w-full h-full object-cover opacity-90"
          viewBox="0 0 800 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M250,0 C120,300 380,700 160,1000 L800,1000 L800,0 Z"
            fill="#101C35"
            fillOpacity="0.88"
          />
          <path
            d="M250,0 C120,300 380,700 160,1000"
            stroke="url(#goldRibbonGrad1)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M275,0 C145,310 405,710 185,1000"
            stroke="url(#goldRibbonGrad2)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <defs>
            <linearGradient id="goldRibbonGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DCC49B" />
              <stop offset="50%" stopColor="#C5A46D" />
              <stop offset="100%" stopColor="#F5E6CA" />
            </linearGradient>
            <linearGradient id="goldRibbonGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAF5EB" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#C5A46D" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between min-h-screen p-4 sm:p-8 lg:p-16 max-w-[1580px] mx-auto">
        {/* LEFT COLUMN: Grand Royal Heritage Identity matching reference */}
        <div className="flex-1 max-w-2xl w-full flex flex-col justify-between py-4 sm:py-6 lg:py-10">
          {/* Top Brand Logo */}
          <div className="flex items-center gap-3">
            {/* 3-petal Golden Lotus emblem */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#C5A46D] via-[#DCC49B] to-[#F5E6CA] p-[1.5px] shadow-[0_0_20px_rgba(197,164,109,0.35)] shrink-0">
              <div className="w-full h-full bg-[#101C35] rounded-[14px] flex items-center justify-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCC49B]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 3c-2 4-5 6-9 7 4 3 6 7 7 11 1-4 3-8 7-11-4-1-7-3-9-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-[#101C35] tracking-widest text-base sm:text-lg font-serif">
                LMS
              </span>
              <span className="text-[11px] sm:text-xs text-[#C5A46D] italic font-serif tracking-wider font-semibold">
                — Leave Management System —
              </span>
            </div>
          </div>

          {/* Hero Typography */}
          <div className="my-6 sm:my-10 lg:my-16 space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight leading-[1.15]">
              <span className="text-[#101C35] block">Work Smart,</span>
              <span className="text-[#C5A46D] italic block font-serif">
                Take the Leave You Deserve.
              </span>
            </h1>

            <p className="text-xs sm:text-base text-slate-600 max-w-xl font-sans leading-relaxed">
              A modern enterprise leave management solution engineered for institutional governance, corporate scheduling, and team well-being.
            </p>

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-4 sm:pt-6 max-w-xl">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#E9DFD0] shadow-2xs flex flex-col items-center text-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF5EB] border border-[#E9DFD0] flex items-center justify-center text-[#101C35] mb-1.5 sm:mb-2">
                  <CalendarDays className="w-4 h-4 text-[#C5A46D]" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#101C35] leading-tight">
                  Smart Planning
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#E9DFD0] shadow-2xs flex flex-col items-center text-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF5EB] border border-[#E9DFD0] flex items-center justify-center text-[#101C35] mb-1.5 sm:mb-2">
                  <TrendingUp className="w-4 h-4 text-[#C5A46D]" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#101C35] leading-tight">
                  Real-Time Insights
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#E9DFD0] shadow-2xs flex flex-col items-center text-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF5EB] border border-[#E9DFD0] flex items-center justify-center text-[#101C35] mb-1.5 sm:mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A46D]" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#101C35] leading-tight">
                  Secure Clearance
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#E9DFD0] shadow-2xs flex flex-col items-center text-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF5EB] border border-[#E9DFD0] flex items-center justify-center text-[#101C35] mb-1.5 sm:mb-2">
                  <Users className="w-4 h-4 text-[#C5A46D]" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#101C35] leading-tight">
                  Work-Life Balance
                </span>
              </div>
            </div>
          </div>

          {/* Subtitle / Footer Note */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#16A37B]" />
            <span>Institutional Multi-Tier Leave Governance &bull; Enterprise 2025</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Floating Pearl Ivory Luxury Card */}
        <div className="w-full lg:w-[480px] shrink-0 mt-6 lg:mt-0">
          <div className="relative rounded-[28px] sm:rounded-[36px] bg-white/95 backdrop-blur-xl border border-[#E9DFD0] shadow-[0_20px_50px_rgba(16,28,53,0.18)] p-5 sm:p-8 md:p-10 transition-all">
            {/* Top Emblem & Header */}
            <div className="text-center flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#C5A46D] via-[#DCC49B] to-[#F5E6CA] p-[1.5px] shadow-[0_0_15px_rgba(197,164,109,0.35)]">
                <div className="w-full h-full bg-[#101C35] rounded-[14px] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCC49B]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M12 3c-2 4-5 6-9 7 4 3 6 7 7 11 1-4 3-8 7-11-4-1-7-3-9-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <span className="font-extrabold text-[#101C35] tracking-widest text-sm sm:text-base font-serif mt-2.5">
                LMS
              </span>

              {/* Decorative separator with gold center dot */}
              <div className="w-20 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent my-2.5 sm:my-3 relative flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#101C35] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-sans mt-0.5">
                Sign in to continue to your account
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mt-4 p-3 rounded-2xl bg-[#FDF0F0] border border-[#F2C5C5] text-xs text-[#9E3E3E] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
              {/* Email Input */}
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] placeholder:text-slate-400 shadow-2xs font-sans transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-3 sm:py-3.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] placeholder:text-slate-400 shadow-2xs font-sans transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#101C35] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-[11px] sm:text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-[#E9DFD0] text-[#101C35] focus:ring-[#C5A46D] accent-[#101C35]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert("Please contact institutional IT administrator to reset access credentials.")}
                  className="text-slate-600 hover:text-[#101C35] transition-colors font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Royal Navy Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#101C35] hover:bg-[#1A2C54] text-white font-bold text-xs shadow-[0_8px_20px_-4px_rgba(16,28,53,0.35)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 text-[#DCC49B]" />
                  </>
                )}
              </button>

              {/* Or continue with */}
              <div className="relative my-3.5 sm:my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E9DFD0]" />
                </div>
                <span className="relative px-3 bg-white text-[10px] sm:text-[11px] text-slate-400 font-sans">
                  or continue with
                </span>
              </div>

              {/* 3 Social / SSO Pills */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {/* Google Workspace -> Employee */}
                <button
                  type="button"
                  onClick={() => handleQuickRoleFill("employee@lms.in", "employee@123")}
                  title="Sign in as Employee (employee@lms.in)"
                  className="h-10 sm:h-11 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E9DFD0] hover:border-[#C5A46D] flex items-center justify-center transition-all shadow-2xs group cursor-pointer"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
                    />
                  </svg>
                </button>

                {/* Microsoft 365 -> Manager */}
                <button
                  type="button"
                  onClick={() => handleQuickRoleFill("manager@lms.in", "manager@123")}
                  title="Sign in as Manager (manager@lms.in)"
                  className="h-10 sm:h-11 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E9DFD0] hover:border-[#C5A46D] flex items-center justify-center transition-all shadow-2xs group cursor-pointer"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                  </svg>
                </button>

                {/* GitHub Enterprise -> Admin */}
                <button
                  type="button"
                  onClick={() => handleQuickRoleFill("admin@lms.in", "admin@123")}
                  title="Sign in as Administrator (admin@lms.in)"
                  className="h-10 sm:h-11 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E9DFD0] hover:border-[#C5A46D] flex items-center justify-center transition-all shadow-2xs group cursor-pointer"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-[#101C35]" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </button>
              </div>

              {/* 3 Explicit Corporate Logins Directory */}
              <div className="pt-2">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD0] space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-[#E9DFD0] pb-1.5">
                    <p className="text-[10px] text-[#101C35] uppercase font-serif font-bold tracking-wider">
                      Designated Credentials
                    </p>
                    <span className="text-[10px] font-mono text-[#C5A46D] font-bold">1-Click Sign In</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {/* Employee */}
                    <button
                      type="button"
                      onClick={() => handleQuickRoleFill("employee@lms.in", "employee@123")}
                      className="w-full text-left p-2 sm:p-2.5 rounded-xl bg-white border border-[#E9DFD0] hover:border-[#C5A46D] flex items-center justify-between transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-[#101C35] text-[11px] sm:text-xs">Employee</p>
                          <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">(employee@lms.in)</span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono">Pass: <span className="font-bold text-slate-700">employee@123</span></p>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-full bg-[#EAF3ED] text-[#2C6244] group-hover:bg-[#2C6244] group-hover:text-white transition-colors shrink-0">
                        Sign In &rarr;
                      </span>
                    </button>

                    {/* Manager */}
                    <button
                      type="button"
                      onClick={() => handleQuickRoleFill("manager@lms.in", "manager@123")}
                      className="w-full text-left p-2 sm:p-2.5 rounded-xl bg-white border border-[#E9DFD0] hover:border-[#C5A46D] flex items-center justify-between transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-[#101C35] text-[11px] sm:text-xs">Manager</p>
                          <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">(manager@lms.in)</span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono">Pass: <span className="font-bold text-slate-700">manager@123</span></p>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-full bg-[#FDF7E8] text-[#8C6B28] group-hover:bg-[#8C6B28] group-hover:text-white transition-colors shrink-0">
                        Sign In &rarr;
                      </span>
                    </button>

                    {/* Admin */}
                    <button
                      type="button"
                      onClick={() => handleQuickRoleFill("admin@lms.in", "admin@123")}
                      className="w-full text-left p-2 sm:p-2.5 rounded-xl bg-white border border-[#E9DFD0] hover:border-[#C5A46D] flex items-center justify-between transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-[#101C35] text-[11px] sm:text-xs">Administrator</p>
                          <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">(admin@lms.in)</span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono">Pass: <span className="font-bold text-slate-700">admin@123</span></p>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-full bg-[#FAF5EB] text-[#101C35] group-hover:bg-[#101C35] group-hover:text-white transition-colors shrink-0">
                        Sign In &rarr;
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
