import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  parseISO,
  isValid,
  getISTParts,
  getCurrentISTParts,
  getCurrentISTDateString,
  getCurrentISTTimeString,
  getISTGreeting,
} from "./date-utils";

export {
  format,
  parseISO,
  isValid,
  getISTParts,
  getCurrentISTParts,
  getCurrentISTDateString,
  getCurrentISTTimeString,
  getISTGreeting,
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | Date | number, formatPattern: string = "MMM dd, yyyy"): string {
  try {
    const d = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
    if (!isValid(d)) return String(dateStr);
    return format(d, formatPattern);
  } catch {
    return String(dateStr);
  }
}

export function formatDateTimeIST(dateStr: string | Date | number): string {
  try {
    return formatDate(dateStr, "MMM dd, yyyy h:mm a") + " IST";
  } catch {
    return String(dateStr);
  }
}

export function formatDuration(days: number): string {
  if (days === 0.5) return "Half Day";
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function getStatusBadgeConfig(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return {
        label: "Approved",
        bg: "bg-[#EAF3ED] text-[#2C6244] border-[#BDDEC8]",
        dot: "bg-[#7FA18B]",
      };
    case "pending":
      return {
        label: "Pending",
        bg: "bg-[#FDF7E8] text-[#8C6B28] border-[#ECDAB0]",
        dot: "bg-[#C5A46D]",
      };
    case "rejected":
      return {
        label: "Rejected",
        bg: "bg-[#FDF0F0] text-[#9E3E3E] border-[#F2C5C5]",
        dot: "bg-[#C98787]",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bg: "bg-[#F4F4F6] text-[#555866] border-[#DFDFE4]",
        dot: "bg-[#9CA3AF]",
      };
    case "draft":
      return {
        label: "Draft",
        bg: "bg-[#EEF2F9] text-[#1E3A8A] border-[#CAD5E8]",
        dot: "bg-[#3B82F6]",
      };
    default:
      return {
        label: status,
        bg: "bg-[#F8F5EF] text-[#101C35] border-[#E9DFD0]",
        dot: "bg-[#C5A46D]",
      };
  }
}

export function getInitials(name: string): string {
  if (!name) return "LP";
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
