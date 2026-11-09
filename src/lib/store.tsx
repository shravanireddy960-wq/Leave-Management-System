"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  Profile,
  Department,
  LeaveType,
  LeaveBalance,
  LeaveRequest,
  LeaveApproval,
  Holiday,
  NotificationItem,
  SystemSettings,
  AuditLog,
  UserRole,
} from "@/types/database";
import {
  INITIAL_DEPARTMENTS,
  INITIAL_LEAVE_TYPES,
  INITIAL_PROFILES,
  INITIAL_BALANCES,
  INITIAL_HOLIDAYS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_AUDIT_LOGS,
} from "./mock-data";
import { calculateLeaveDays, hasOverlappingLeave } from "./leave-calculator";
import { createClient, isSupabaseConfigured } from "./supabase/client";

interface AppContextType {
  currentUser: Profile;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string; user?: Profile };
  logout: () => void;
  switchUser: (role: UserRole) => void;
  profiles: Profile[];
  departments: Department[];
  leaveTypes: LeaveType[];
  balances: LeaveBalance[];
  leaveRequests: LeaveRequest[];
  holidays: Holiday[];
  notifications: NotificationItem[];
  settings: SystemSettings;
  auditLogs: AuditLog[];
  
  // Actions
  submitLeaveRequest: (data: {
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    halfDayPeriod?: "first_half" | "second_half";
    reason: string;
    contactPhone?: string;
    supportingDocumentUrl?: string;
  }) => { success: boolean; error?: string; requestId?: string };

  processApproval: (
    requestId: string,
    decision: "approved" | "rejected",
    remarks?: string
  ) => { success: boolean; error?: string };

  cancelRequest: (requestId: string, reason: string) => { success: boolean; error?: string };

  // Admin actions
  addEmployee: (emp: Partial<Profile>) => void;
  updateEmployee: (id: string, emp: Partial<Profile>) => void;
  deleteEmployee: (id: string) => void;
  toggleEmployeeStatus: (id: string) => void;

  addDepartment: (dept: Partial<Department>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;

  addLeaveType: (lt: Partial<LeaveType>) => void;
  updateLeaveType: (id: string, lt: Partial<LeaveType>) => void;

  adjustBalance: (userId: string, leaveTypeId: string, newAllocated: number, reason: string) => void;

  addHoliday: (holiday: Partial<Holiday>) => void;
  updateHoliday: (id: string, holiday: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;

  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Try loading from localStorage or fallback
  const [currentUser, setCurrentUser] = useState<Profile>(INITIAL_PROFILES[2]); // Default: Employee
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(INITIAL_LEAVE_TYPES);
  const [balances, setBalances] = useState<LeaveBalance[]>(INITIAL_BALANCES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [holidays, setHolidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Load state on mount: pull from Supabase if configured, with local fallback
  useEffect(() => {
    try {
      const authStatus = localStorage.getItem("lms_is_authenticated");
      if (authStatus === "true") {
        setIsAuthenticated(true);
        const savedEmail = localStorage.getItem("lms_active_user");
        if (savedEmail) {
          const user = profiles.find((p) => p.email.toLowerCase() === savedEmail.toLowerCase());
          if (user) setCurrentUser(user);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {}

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("departments").select("*"),
        supabase.from("leave_types").select("*"),
        supabase.from("leave_balances").select("*"),
        supabase.from("leave_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("holidays").select("*").order("date", { ascending: true }),
        supabase.from("notifications").select("*").order("created_at", { ascending: false }),
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }),
      ])
        .then(([pRes, dRes, ltRes, bRes, rRes, hRes, nRes, aRes]) => {
          if (pRes.data && pRes.data.length > 0) {
            setProfiles(pRes.data);
            const savedUser = localStorage.getItem("lms_active_user");
            const active =
              pRes.data.find((p) => p.email === savedUser) ||
              pRes.data.find((p) => p.email === "employee@lms.in") ||
              pRes.data[0];
            if (active) setCurrentUser(active);
          }
          if (dRes.data && dRes.data.length > 0) setDepartments(dRes.data);
          if (ltRes.data && ltRes.data.length > 0) setLeaveTypes(ltRes.data);
          if (bRes.data && bRes.data.length > 0) setBalances(bRes.data);
          if (rRes.data && rRes.data.length > 0) setLeaveRequests(rRes.data);
          if (hRes.data && hRes.data.length > 0) setHolidays(hRes.data);
          if (nRes.data && nRes.data.length > 0) setNotifications(nRes.data);
          if (aRes.data && aRes.data.length > 0) setAuditLogs(aRes.data);
        })
        .catch((err) => {
          console.warn("Could not sync with Supabase, using local store:", err);
        });
    }

    try {
      const savedUser = localStorage.getItem("lms_active_user");
      if (savedUser) {
        const found = profiles.find((p) => p.email === savedUser);
        if (found) setCurrentUser(found);
      }
      const savedProfiles = localStorage.getItem("lms_profiles");
      if (savedProfiles) {
        const parsed = JSON.parse(savedProfiles);
        setProfiles(parsed);
        if (savedUser) {
          const matched = parsed.find((p: Profile) => p.email.toLowerCase() === savedUser.toLowerCase());
          if (matched) setCurrentUser(matched);
        }
      }
      const savedDepartments = localStorage.getItem("lms_departments");
      if (savedDepartments) setDepartments(JSON.parse(savedDepartments));
      const savedRequests = localStorage.getItem("lms_requests");
      if (savedRequests) setLeaveRequests(JSON.parse(savedRequests));
      const savedBalances = localStorage.getItem("lms_balances");
      if (savedBalances) setBalances(JSON.parse(savedBalances));
      const savedHolidays = localStorage.getItem("lms_holidays");
      if (savedHolidays) setHolidays(JSON.parse(savedHolidays));
    } catch {
      // ignore
    }
  }, []);

  const saveProfiles = (profs: Profile[]) => {
    setProfiles(profs);
    try {
      localStorage.setItem("lms_profiles", JSON.stringify(profs));
    } catch {}
  };

  const saveDepartments = (depts: Department[]) => {
    setDepartments(depts);
    try {
      localStorage.setItem("lms_departments", JSON.stringify(depts));
    } catch {}
  };

  const saveRequests = (reqs: LeaveRequest[]) => {
    setLeaveRequests(reqs);
    try {
      localStorage.setItem("lms_requests", JSON.stringify(reqs));
    } catch {}
  };

  const saveBalances = (bals: LeaveBalance[]) => {
    setBalances(bals);
    try {
      localStorage.setItem("lms_balances", JSON.stringify(bals));
    } catch {}
  };

  const login = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Exact requested password validation
    const AUTH_PASSWORDS: Record<string, string> = {
      "employee@lms.in": "employee@123",
      "manager@lms.in": "manager@123",
      "admin@lms.in": "admin@123",
    };

    if (password && AUTH_PASSWORDS[cleanEmail] && password !== AUTH_PASSWORDS[cleanEmail]) {
      return {
        success: false,
        error: `Incorrect password for ${cleanEmail}. (Expected: ${AUTH_PASSWORDS[cleanEmail]})`,
      };
    }

    let found = profiles.find((p) => p.email.toLowerCase() === cleanEmail);
    if (!found) {
      if (cleanEmail === "admin@lms.in" || cleanEmail.includes("admin")) {
        found = profiles.find((p) => p.role === "admin") || INITIAL_PROFILES[0];
      } else if (cleanEmail === "manager@lms.in" || cleanEmail.includes("manager")) {
        found = profiles.find((p) => p.role === "manager") || INITIAL_PROFILES[1];
      } else if (cleanEmail === "employee@lms.in" || cleanEmail.includes("employee")) {
        found = profiles.find((p) => p.role === "employee") || INITIAL_PROFILES[2];
      }
    }

    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("lms_active_user", found.email);
        localStorage.setItem("lms_is_authenticated", "true");
      } catch {}
      return { success: true, user: found };
    }
    return { success: false, error: "Invalid corporate credentials. Please use employee@lms.in, manager@lms.in, or admin@lms.in." };
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("lms_active_user");
      localStorage.setItem("lms_is_authenticated", "false");
    } catch {}
  };

  const switchUser = (role: UserRole) => {
    let target = profiles.find((p) => p.role === role);
    if (!target) {
      if (role === "admin") target = INITIAL_PROFILES[0];
      else if (role === "manager") target = INITIAL_PROFILES[1];
      else target = INITIAL_PROFILES[2];
    }
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("lms_active_user", target.email);
        localStorage.setItem("lms_is_authenticated", "true");
      } catch {}
    }
  };

  // Submit Leave Request
  const submitLeaveRequest = (data: {
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    halfDayPeriod?: "first_half" | "second_half";
    reason: string;
    contactPhone?: string;
    supportingDocumentUrl?: string;
  }) => {
    // 1. Check overlaps
    const userReqs = leaveRequests.filter((r) => r.user_id === currentUser.id);
    if (hasOverlappingLeave(data.startDate, data.endDate, userReqs)) {
      return {
        success: false,
        error: "You already have a pending or approved leave request overlapping these dates.",
      };
    }

    // 2. Calculate duration
    const calc = calculateLeaveDays(data.startDate, data.endDate, holidays, data.isHalfDay, true);
    if (calc.workingDays <= 0) {
      return {
        success: false,
        error: "The chosen date range has 0 working days (all fall on weekends or institutional holidays).",
      };
    }

    // 3. Balance verification
    const currentYear = new Date(data.startDate).getFullYear() || 2025;
    const balance =
      balances.find(
        (b) =>
          b.user_id === currentUser.id &&
          b.leave_type_id === data.leaveTypeId &&
          b.year === currentYear
      ) ||
      balances.find(
        (b) =>
          b.user_id === currentUser.id &&
          b.leave_type_id === data.leaveTypeId
      );

    const lt = leaveTypes.find((t) => t.id === data.leaveTypeId);

    if (lt?.is_paid && (!balance || balance.available < calc.workingDays)) {
      return {
        success: false,
        error: `Insufficient leave balance. You have ${balance?.available ?? 0} days available, but requested ${calc.workingDays} days.`,
      };
    }

    // 4. Create request
    const reqNum = `LP-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReqId = `req-${Date.now()}`;
    const newReq: LeaveRequest = {
      id: newReqId,
      request_number: reqNum,
      user_id: currentUser.id,
      leave_type_id: data.leaveTypeId,
      start_date: data.startDate,
      end_date: data.endDate,
      is_half_day: data.isHalfDay,
      half_day_period: data.halfDayPeriod,
      duration_days: calc.workingDays,
      reason: data.reason,
      contact_phone: data.contactPhone || currentUser.phone,
      supporting_document_url: data.supportingDocumentUrl,
      status: "pending",
      current_approver_id: currentUser.reporting_manager_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextRequests = [newReq, ...leaveRequests];
    saveRequests(nextRequests);

    // 5. Update balance: move from available to pending
    if (balance) {
      const nextBalances = balances.map((b) => {
        if (b.id === balance.id) {
          return {
            ...b,
            pending: b.pending + calc.workingDays,
            available: b.available - calc.workingDays,
            updated_at: new Date().toISOString(),
          };
        }
        return b;
      });
      saveBalances(nextBalances);
    }

    // 6. Notify Manager
    if (currentUser.reporting_manager_id) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        user_id: currentUser.reporting_manager_id,
        title: `Pending Approval: ${reqNum}`,
        message: `${currentUser.full_name} submitted a ${calc.workingDays} day(s) ${lt?.name || "Leave"} application.`,
        type: "approval_needed",
        link: "/manager/approvals",
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    // 7. Audit log
    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      actor_id: currentUser.id,
      action: "LEAVE_SUBMITTED",
      entity_type: "leave_requests",
      entity_id: newReqId,
      new_values: {
        request_number: reqNum,
        duration: calc.workingDays,
        start_date: data.startDate,
        end_date: data.endDate,
      },
      ip_address: "127.0.0.1",
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return { success: true, requestId: newReqId };
  };

  // Process Approval / Rejection
  const processApproval = (
    requestId: string,
    decision: "approved" | "rejected",
    remarks?: string
  ) => {
    const req = leaveRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, error: "Leave request not found." };
    if (req.status !== "pending") return { success: false, error: "Request is not in pending status." };

    const currentYear = new Date(req.start_date).getFullYear() || 2025;
    const balance = balances.find(
      (b) => b.user_id === req.user_id && b.leave_type_id === req.leave_type_id && b.year === currentYear
    );

    const approvalRecord: LeaveApproval = {
      id: `appr-${Date.now()}`,
      leave_request_id: req.id,
      approver_id: currentUser.id,
      action: decision,
      remarks: remarks || "",
      action_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // Update Request
    const updatedReq: LeaveRequest = {
      ...req,
      status: decision,
      updated_at: new Date().toISOString(),
      approvals: [...(req.approvals || []), approvalRecord],
    };

    saveRequests(leaveRequests.map((r) => (r.id === req.id ? updatedReq : r)));

    // Update balances
    if (balance) {
      const nextBalances = balances.map((b) => {
        if (b.id === balance.id) {
          if (decision === "approved") {
            return {
              ...b,
              pending: Math.max(0, b.pending - req.duration_days),
              used: b.used + req.duration_days,
              updated_at: new Date().toISOString(),
            };
          } else {
            return {
              ...b,
              pending: Math.max(0, b.pending - req.duration_days),
              available: b.available + req.duration_days,
              updated_at: new Date().toISOString(),
            };
          }
        }
        return b;
      });
      saveBalances(nextBalances);
    }

    // Notify employee
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: req.user_id,
      title: decision === "approved" ? `Leave Request Approved (${req.request_number})` : `Leave Request Rejected (${req.request_number})`,
      message:
        decision === "approved"
          ? `Your leave request for ${req.duration_days} day(s) starting ${req.start_date} was approved. Remarks: ${remarks || "None"}`
          : `Your leave request for ${req.duration_days} day(s) was rejected. Remarks: ${remarks || "Not specified"}`,
      type: "leave_status",
      link: "/employee/requests",
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      actor_id: currentUser.id,
      action: decision === "approved" ? "LEAVE_APPROVED" : "LEAVE_REJECTED",
      entity_type: "leave_requests",
      entity_id: req.id,
      new_values: { request_number: req.request_number, remarks },
      ip_address: "127.0.0.1",
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return { success: true };
  };

  // Cancel Request
  const cancelRequest = (requestId: string, reason: string) => {
    const req = leaveRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, error: "Request not found" };
    if (req.status === "cancelled" || req.status === "rejected") {
      return { success: false, error: "Cannot cancel this request" };
    }

    const currentYear = new Date(req.start_date).getFullYear() || 2025;
    const balance = balances.find(
      (b) => b.user_id === req.user_id && b.leave_type_id === req.leave_type_id && b.year === currentYear
    );

    if (balance) {
      const nextBalances = balances.map((b) => {
        if (b.id === balance.id) {
          if (req.status === "pending") {
            return {
              ...b,
              pending: Math.max(0, b.pending - req.duration_days),
              available: b.available + req.duration_days,
              updated_at: new Date().toISOString(),
            };
          } else if (req.status === "approved") {
            return {
              ...b,
              used: Math.max(0, b.used - req.duration_days),
              available: b.available + req.duration_days,
              updated_at: new Date().toISOString(),
            };
          }
        }
        return b;
      });
      saveBalances(nextBalances);
    }

    const updated = leaveRequests.map((r) =>
      r.id === req.id
        ? {
            ...r,
            status: "cancelled" as const,
            cancellation_reason: reason,
            updated_at: new Date().toISOString(),
          }
        : r
    );
    saveRequests(updated);

    return { success: true };
  };

  // Admin Actions
  const addEmployee = (emp: Partial<Profile>) => {
    const newEmpId = `emp-${Date.now()}`;
    const newEmp: Profile = {
      id: newEmpId,
      employee_id: emp.employee_id || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      full_name: emp.full_name || "New Employee",
      email: emp.email || `employee-${Date.now()}@lms.in`,
      role: emp.role || "employee",
      department_id: emp.department_id,
      reporting_manager_id: emp.reporting_manager_id,
      designation: emp.designation || "Senior Software Engineer",
      phone: emp.phone || "+91 98450 00000",
      joining_date: emp.joining_date || new Date().toISOString().split("T")[0],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Auto-allocate annual leave balances for the newly created employee
    const newBalances: LeaveBalance[] = leaveTypes.map((lt, idx) => ({
      id: `bal-${Date.now()}-${idx}`,
      user_id: newEmpId,
      leave_type_id: lt.id,
      year: 2025,
      allocated: lt.annual_quota,
      used: 0,
      pending: 0,
      available: lt.annual_quota,
      carry_forward: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const nextProfiles = [...profiles, newEmp];
    saveProfiles(nextProfiles);
    const nextBalances = [...balances, ...newBalances];
    saveBalances(nextBalances);
  };

  const updateEmployee = (id: string, emp: Partial<Profile>) => {
    const updated = profiles.map((p) => {
      if (p.id === id) {
        return { ...p, ...emp, updated_at: new Date().toISOString() };
      }
      return p;
    });
    saveProfiles(updated);

    // Real-time synchronization for active user session if editing self
    setCurrentUser((current) =>
      current.id === id ? { ...current, ...emp, updated_at: new Date().toISOString() } : current
    );
  };

  const deleteEmployee = (id: string) => {
    // Prevent deleting the primary admin account
    const target = profiles.find((p) => p.id === id);
    if (target?.email === "admin@lms.in") {
      return;
    }

    const updated = profiles
      .filter((p) => p.id !== id)
      .map((p) => (p.reporting_manager_id === id ? { ...p, reporting_manager_id: undefined } : p));
    saveProfiles(updated);

    const updatedBalances = balances.filter((b) => b.user_id !== id);
    saveBalances(updatedBalances);

    // If current user is being deleted, fallback to default admin
    if (currentUser.id === id && updated.length > 0) {
      setCurrentUser(updated[0]);
    }
  };

  const toggleEmployeeStatus = (id: string) => {
    const updated = profiles.map((p) =>
      p.id === id ? { ...p, is_active: !p.is_active, updated_at: new Date().toISOString() } : p
    );
    saveProfiles(updated);
  };

  const addDepartment = (dept: Partial<Department>) => {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      code: dept.code || "DEPT",
      name: dept.name || "New Department",
      description: dept.description,
      manager_id: dept.manager_id,
      is_active: true,
      employee_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveDepartments([...departments, newDept]);
  };

  const updateDepartment = (id: string, dept: Partial<Department>) => {
    const updated = departments.map((d) => (d.id === id ? { ...d, ...dept, updated_at: new Date().toISOString() } : d));
    saveDepartments(updated);
  };

  const addLeaveType = (lt: Partial<LeaveType>) => {
    const newLt: LeaveType = {
      id: `lt-${Date.now()}`,
      code: lt.code || "LEAVE",
      name: lt.name || "Custom Leave",
      description: lt.description || "",
      annual_quota: lt.annual_quota || 10,
      is_paid: lt.is_paid !== undefined ? lt.is_paid : true,
      requires_document: lt.requires_document || false,
      max_consecutive_days: lt.max_consecutive_days || 7,
      carry_forward_eligible: lt.carry_forward_eligible || false,
      color: lt.color || "#3448A5",
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setLeaveTypes((prev) => [...prev, newLt]);
  };

  const updateLeaveType = (id: string, lt: Partial<LeaveType>) => {
    setLeaveTypes((prev) => prev.map((t) => (t.id === id ? { ...t, ...lt } : t)));
  };

  const adjustBalance = (userId: string, leaveTypeId: string, newAllocated: number, reason: string) => {
    const year = 2025;
    let found = false;
    const next = balances.map((b) => {
      if (b.user_id === userId && b.leave_type_id === leaveTypeId && b.year === year) {
        found = true;
        const diff = newAllocated - b.allocated;
        return {
          ...b,
          allocated: newAllocated,
          available: Math.max(0, b.available + diff),
          updated_at: new Date().toISOString(),
        };
      }
      return b;
    });

    if (!found) {
      next.push({
        id: `bal-${Date.now()}`,
        user_id: userId,
        leave_type_id: leaveTypeId,
        year,
        allocated: newAllocated,
        used: 0,
        pending: 0,
        available: newAllocated,
        carry_forward: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    saveBalances(next);

    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        actor_id: currentUser.id,
        action: "BALANCE_ADJUSTED",
        entity_type: "leave_balances",
        new_values: { userId, leaveTypeId, newAllocated, reason },
        ip_address: "127.0.0.1",
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const addHoliday = (holiday: Partial<Holiday>) => {
    const h: Holiday = {
      id: `hol-${Date.now()}`,
      name: holiday.name || "Holiday",
      date: holiday.date || "2025-01-01",
      type: holiday.type || "mandatory",
      description: holiday.description,
      is_recurring: holiday.is_recurring || false,
      year: new Date(holiday.date || "2025-01-01").getFullYear(),
      created_at: new Date().toISOString(),
    };
    const next = [...holidays, h];
    setHolidays(next);
    try {
      localStorage.setItem("lms_holidays", JSON.stringify(next));
    } catch {}
  };

  const updateHoliday = (id: string, holiday: Partial<Holiday>) => {
    const next = holidays.map((h) => (h.id === id ? { ...h, ...holiday } : h));
    setHolidays(next);
    try {
      localStorage.setItem("lms_holidays", JSON.stringify(next));
    } catch {}
  };

  const deleteHoliday = (id: string) => {
    const next = holidays.filter((h) => h.id !== id);
    setHolidays(next);
    try {
      localStorage.setItem("lms_holidays", JSON.stringify(next));
    } catch {}
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings, updated_at: new Date().toISOString() }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchUser,
        profiles,
        departments,
        leaveTypes,
        balances,
        leaveRequests,
        holidays,
        notifications,
        settings,
        auditLogs,
        submitLeaveRequest,
        processApproval,
        cancelRequest,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        addDepartment,
        updateDepartment,
        addLeaveType,
        updateLeaveType,
        adjustBalance,
        addHoliday,
        updateHoliday,
        deleteHoliday,
        updateSettings,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
