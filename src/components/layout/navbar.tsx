"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Bell,
  Search,
  Check,
  ExternalLink,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Command,
  Maximize2,
  Menu,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ISTClockBadge } from "@/components/ui/ist-clock-badge";

interface NavbarProps {
  portal: "employee" | "manager" | "admin";
  onToggleMobileMenu?: () => void;
}

export function Navbar({ portal, onToggleMobileMenu }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, logout } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userNotifications = notifications.filter((n) => n.user_id === currentUser.id);
  const unreadCount = userNotifications.filter((n) => !n.is_read).length;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-[#F8F5EF]/85 border-b border-[#E9DFD0]">
      {/* Left: Mobile Hamburger & Brand Emblem on Small Screens */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open Navigation Menu"
          className="lg:hidden w-10 h-10 rounded-2xl bg-white border border-[#E9DFD0] flex items-center justify-center text-[#101C35] hover:text-[#C5A46D] hover:border-[#C5A46D] shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <Menu className="w-5 h-5 text-[#101C35]" />
        </button>

        {/* Mobile Brand Title */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C5A46D] via-[#DCC49B] to-[#F5E6CA] p-[1.5px] shadow-sm shrink-0">
            <div className="w-full h-full bg-[#101C35] rounded-[10px] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#DCC49B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3c-2 4-5 6-9 7 4 3 6 7 7 11 1-4 3-8 7-11-4-1-7-3-9-7z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>
          <span className="font-extrabold text-[#101C35] font-serif text-sm tracking-wide">
            LMS
          </span>
        </div>

        {/* Desktop Quick Search Bar */}
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything... (Ctrl + K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-12 py-2.5 text-xs bg-white/90 border border-[#E9DFD0] rounded-full shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 transition-all text-[#101C35] placeholder:text-slate-400 font-sans"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#F8F5EF] border border-[#E9DFD0] text-[10px] text-slate-500 font-mono">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls: IST Live Clock + Search Icon (Mobile) + Notification Bell + Fullscreen + User Profile Badge */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Live Indian Standard Time (IST) Clock Badge */}
        <div className="hidden sm:block">
          <ISTClockBadge variant="pill" showDate={true} />
        </div>
        <div className="sm:hidden">
          <ISTClockBadge variant="compact" showDate={false} />
        </div>

        {/* Mobile Search Icon Toggle */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden w-9 h-9 rounded-full bg-white border border-[#E9DFD0] flex items-center justify-center text-[#101C35] hover:text-[#C5A46D] shadow-2xs transition-all"
          title="Search"
          aria-label="Toggle search"
        >
          {showMobileSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>

        {/* Notification Bell with red counter badge */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E9DFD0] flex items-center justify-center text-[#101C35] hover:text-[#C5A46D] hover:border-[#C5A46D] shadow-2xs transition-all hover:scale-105 relative cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#DC5353] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center ring-2 ring-[#F8F5EF]">
              {unreadCount > 0 ? unreadCount : 3}
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-[#E9DFD0] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-[#E9DFD0] flex items-center justify-between">
                <span className="text-xs font-bold font-serif text-[#101C35]">
                  Notifications
                </span>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] text-[#C5A46D] font-semibold hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {userNotifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  userNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3 text-xs cursor-pointer hover:bg-[#FAF7F2] transition-colors ${
                        !notif.is_read ? "bg-[#FAF5EB] font-medium" : ""
                      }`}
                    >
                      <p className="text-[#101C35]">{notif.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {formatDate(notif.created_at)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Option Icon (Hidden on small mobile) */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-[#E9DFD0] items-center justify-center text-[#101C35] hover:text-[#C5A46D] hover:border-[#C5A46D] shadow-2xs transition-all hover:scale-105 cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* User Profile Badge */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 sm:pr-3.5 rounded-full bg-white border border-[#E9DFD0] hover:border-[#C5A46D] shadow-2xs transition-all cursor-pointer"
          >
            <div className="relative">
              <img
                src={
                  currentUser.avatar_url ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                }
                alt={currentUser.full_name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#C5A46D]"
              />
              <span className="absolute bottom-0 right-0 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#16A37B] ring-2 ring-white" />
            </div>

            <div className="text-left hidden md:block">
              <span className="block text-xs font-bold text-[#101C35] leading-tight font-sans">
                {currentUser.full_name}
              </span>
              <span className="block text-[10px] font-semibold text-[#C5A46D] capitalize leading-tight">
                {portal} ▾
              </span>
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-[#E9DFD0] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="px-3 py-2 border-b border-[#E9DFD0]">
                <span className="font-bold text-[#101C35] block truncate">
                  {currentUser.full_name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">{currentUser.email}</span>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push(`/${portal}/profile`);
                }}
                className="w-full text-left px-3 py-2 text-[#101C35] hover:bg-[#FAF7F2] flex items-center gap-2 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push(`/${portal}/settings`);
                }}
                className="w-full text-left px-3 py-2 text-[#101C35] hover:bg-[#FAF7F2] flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>Settings</span>
              </button>
              <div className="border-t border-[#E9DFD0] my-1" />
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  router.push("/login");
                }}
                className="w-full text-left px-3 py-2 text-[#C98787] hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Mobile Search Dropdown */}
      {showMobileSearch && (
        <div className="absolute top-full left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-b border-[#E9DFD0] md:hidden shadow-lg animate-in slide-in-from-top-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search anything across LMS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-[#E9DFD0] rounded-xl text-[#101C35] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50"
            />
          </div>
        </div>
      )}
    </header>
  );
}
