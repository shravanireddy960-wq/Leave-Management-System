export type UserRole = 'employee' | 'manager' | 'admin';

export type LeaveStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';

export type HalfDayPeriod = 'first_half' | 'second_half';

export type HolidayType = 'mandatory' | 'restricted' | 'corporate_holiday' | 'optional_holiday';

export type NotificationType = 'leave_status' | 'approval_needed' | 'policy_update' | 'system';

export interface Profile {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  department_id?: string;
  department?: Department;
  designation: string;
  phone?: string;
  joining_date: string;
  reporting_manager_id?: string;
  reporting_manager?: Profile;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  manager_id?: string;
  manager?: Profile;
  is_active: boolean;
  employee_count?: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveType {
  id: string;
  code: string;
  name: string;
  description: string;
  annual_quota: number;
  is_paid: boolean;
  requires_document: boolean;
  max_consecutive_days: number;
  carry_forward_eligible: boolean;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface LeaveBalance {
  id: string;
  user_id: string;
  leave_type_id: string;
  leave_type?: LeaveType;
  year: number;
  allocated: number;
  used: number;
  pending: number;
  available: number;
  carry_forward: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  request_number: string;
  user_id: string;
  user?: Profile;
  leave_type_id: string;
  leave_type?: LeaveType;
  start_date: string;
  end_date: string;
  is_half_day: boolean;
  half_day_period?: HalfDayPeriod;
  duration_days: number;
  reason: string;
  contact_phone?: string;
  supporting_document_url?: string;
  status: LeaveStatus;
  current_approver_id?: string;
  current_approver?: Profile;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  approvals?: LeaveApproval[];
}

export interface LeaveApproval {
  id: string;
  leave_request_id: string;
  approver_id: string;
  approver?: Profile;
  action: 'approved' | 'rejected' | 'escalated';
  remarks?: string;
  action_date: string;
  created_at: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: HolidayType;
  description?: string;
  is_recurring: boolean;
  year: number;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ApprovalAssignment {
  id: string;
  department_id: string;
  manager_id: string;
  approval_level: number;
  is_active: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor?: Profile;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface SystemSettings {
  id: string;
  org_name: string;
  fiscal_year: string;
  weekend_days: string[];
  auto_approve_days: number;
  carry_forward_limit: number;
  working_hours_per_day: number;
  contact_email: string;
  updated_at: string;
}
