-- ====================================================================
-- LEAVEPULSE — Premium Employee Leave Management System
-- Database Schema for Supabase PostgreSQL
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing if re-running
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS leave_approvals CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS leave_balances CASCADE;
DROP TABLE IF EXISTS approval_assignments CASCADE;
DROP TABLE IF EXISTS holidays CASCADE;
DROP TABLE IF EXISTS leave_types CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- 2. Departments Table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    hod_id UUID, -- Foreign key added after profiles table created
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Profiles Table (linked with auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    designation VARCHAR(120) NOT NULL,
    phone VARCHAR(25),
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reporting_manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Complete circular foreign key for Department HOD
ALTER TABLE departments
    ADD CONSTRAINT fk_department_hod
    FOREIGN KEY (hod_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- 4. Leave Types Table
CREATE TABLE leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    annual_quota NUMERIC(5, 1) NOT NULL DEFAULT 12.0,
    is_paid BOOLEAN NOT NULL DEFAULT true,
    requires_document BOOLEAN NOT NULL DEFAULT false,
    max_consecutive_days INTEGER NOT NULL DEFAULT 7,
    carry_forward_eligible BOOLEAN NOT NULL DEFAULT false,
    color VARCHAR(20) NOT NULL DEFAULT '#3448A5',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Leave Balances Table
CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    allocated NUMERIC(5, 1) NOT NULL DEFAULT 0.0,
    used NUMERIC(5, 1) NOT NULL DEFAULT 0.0,
    pending NUMERIC(5, 1) NOT NULL DEFAULT 0.0,
    available NUMERIC(5, 1) NOT NULL DEFAULT 0.0,
    carry_forward NUMERIC(5, 1) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_leave_year UNIQUE (user_id, leave_type_id, year),
    CONSTRAINT chk_balances_positive CHECK (allocated >= 0 AND used >= 0 AND pending >= 0 AND available >= 0)
);

-- 6. Leave Requests Table
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number VARCHAR(30) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_half_day BOOLEAN NOT NULL DEFAULT false,
    half_day_period VARCHAR(20) CHECK (half_day_period IN ('first_half', 'second_half')),
    duration_days NUMERIC(4, 1) NOT NULL,
    reason TEXT NOT NULL,
    contact_phone VARCHAR(25),
    supporting_document_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'cancelled')),
    current_approver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_dates_valid CHECK (end_date >= start_date),
    CONSTRAINT chk_duration_positive CHECK (duration_days > 0)
);

-- 7. Leave Approvals Audit Table
CREATE TABLE leave_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leave_request_id UUID NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    action VARCHAR(20) NOT NULL CHECK (action IN ('approved', 'rejected', 'escalated')),
    remarks TEXT,
    action_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Holidays Table
CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    date DATE NOT NULL UNIQUE,
    type VARCHAR(30) NOT NULL DEFAULT 'mandatory' CHECK (type IN ('mandatory', 'restricted', 'college_break')),
    description TEXT,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Approval Assignments Table
CREATE TABLE approval_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    manager_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    approval_level INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_dept_manager UNIQUE (department_id, manager_id, approval_level)
);

-- 10. Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'leave_status' CHECK (type IN ('leave_status', 'approval_needed', 'policy_update', 'system')),
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. System Settings Table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name VARCHAR(150) NOT NULL DEFAULT 'Apex Institute of Technology',
    academic_year VARCHAR(20) NOT NULL DEFAULT '2025-2026',
    weekend_days JSONB NOT NULL DEFAULT '["Saturday", "Sunday"]'::jsonb,
    auto_approve_days INTEGER NOT NULL DEFAULT 5,
    carry_forward_limit INTEGER NOT NULL DEFAULT 10,
    working_hours_per_day NUMERIC(3, 1) NOT NULL DEFAULT 8.0,
    contact_email VARCHAR(150) NOT NULL DEFAULT 'hr@leavepulse.edu',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_dept ON profiles(department_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_manager ON profiles(reporting_manager_id);
CREATE INDEX idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_balances_user ON leave_balances(user_id, year);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_holidays_date ON holidays(date);
CREATE INDEX idx_leave_approvals_req ON leave_approvals(leave_request_id);

-- ====================================================================
-- BUSINESS LOGIC FUNCTIONS & PROCEDURES
-- ====================================================================

-- Function: Calculate working days excluding configured weekends and holidays
CREATE OR REPLACE FUNCTION calculate_working_days(
    p_start_date DATE,
    p_end_date DATE,
    p_exclude_weekends BOOLEAN DEFAULT TRUE,
    p_exclude_holidays BOOLEAN DEFAULT TRUE
)
RETURNS NUMERIC AS $$
DECLARE
    curr_date DATE := p_start_date;
    count_days NUMERIC := 0;
    day_dow INT;
    is_holiday BOOLEAN;
BEGIN
    IF p_start_date > p_end_date THEN
        RETURN 0;
    END IF;

    WHILE curr_date <= p_end_date LOOP
        day_dow := EXTRACT(DOW FROM curr_date);
        
        -- Check weekend (0=Sunday, 6=Saturday)
        IF p_exclude_weekends AND (day_dow = 0 OR day_dow = 6) THEN
            curr_date := curr_date + INTERVAL '1 day';
            CONTINUE;
        END IF;

        -- Check holiday
        IF p_exclude_holidays THEN
            SELECT EXISTS (SELECT 1 FROM holidays WHERE date = curr_date) INTO is_holiday;
            IF is_holiday THEN
                curr_date := curr_date + INTERVAL '1 day';
                CONTINUE;
            END IF;
        END IF;

        count_days := count_days + 1;
        curr_date := curr_date + INTERVAL '1 day';
    END LOOP;

    RETURN count_days;
END;
$$ LANGUAGE plpgsql;

-- Function: Submit leave request (creates pending request, updates pending balance)
CREATE OR REPLACE FUNCTION submit_leave_request(
    p_user_id UUID,
    p_leave_type_id UUID,
    p_start_date DATE,
    p_end_date DATE,
    p_is_half_day BOOLEAN,
    p_half_day_period VARCHAR,
    p_reason TEXT,
    p_contact_phone VARCHAR,
    p_supporting_document_url TEXT
)
RETURNS UUID AS $$
DECLARE
    v_req_id UUID;
    v_req_number VARCHAR;
    v_calc_duration NUMERIC;
    v_available NUMERIC;
    v_manager_id UUID;
    v_user_name VARCHAR;
    v_leave_name VARCHAR;
BEGIN
    -- Check overlapping leaves
    IF EXISTS (
        SELECT 1 FROM leave_requests
        WHERE user_id = p_user_id
          AND status IN ('pending', 'approved')
          AND NOT (end_date < p_start_date OR start_date > p_end_date)
    ) THEN
        RAISE EXCEPTION 'You already have a pending or approved leave request overlapping with the selected dates.';
    END IF;

    -- Calculate duration
    IF p_is_half_day THEN
        v_calc_duration := 0.5;
    ELSE
        v_calc_duration := calculate_working_days(p_start_date, p_end_date);
        IF v_calc_duration <= 0 THEN
            RAISE EXCEPTION 'The selected date range contains no working days (all weekends or public holidays).';
        END IF;
    END IF;

    -- Check balance
    SELECT available INTO v_available
    FROM leave_balances
    WHERE user_id = p_user_id
      AND leave_type_id = p_leave_type_id
      AND year = EXTRACT(YEAR FROM p_start_date);

    IF v_available IS NULL OR v_available < v_calc_duration THEN
        RAISE EXCEPTION 'Insufficient leave balance. Available: %, Requested: %', COALESCE(v_available, 0), v_calc_duration;
    END IF;

    -- Determine manager
    SELECT reporting_manager_id, full_name INTO v_manager_id, v_user_name
    FROM profiles WHERE id = p_user_id;

    SELECT name INTO v_leave_name
    FROM leave_types WHERE id = p_leave_type_id;

    -- Generate request number (e.g. LP-2025-0012)
    v_req_number := 'LP-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');

    -- Insert leave request
    INSERT INTO leave_requests (
        request_number,
        user_id,
        leave_type_id,
        start_date,
        end_date,
        is_half_day,
        half_day_period,
        duration_days,
        reason,
        contact_phone,
        supporting_document_url,
        status,
        current_approver_id
    ) VALUES (
        v_req_number,
        p_user_id,
        p_leave_type_id,
        p_start_date,
        p_end_date,
        p_is_half_day,
        p_half_day_period,
        v_calc_duration,
        p_reason,
        p_contact_phone,
        p_supporting_document_url,
        'pending',
        v_manager_id
    ) RETURNING id INTO v_req_id;

    -- Move amount from available to pending
    UPDATE leave_balances
    SET pending = pending + v_calc_duration,
        available = available - v_calc_duration,
        updated_at = now()
    WHERE user_id = p_user_id
      AND leave_type_id = p_leave_type_id
      AND year = EXTRACT(YEAR FROM p_start_date);

    -- Notify manager if assigned
    IF v_manager_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (
            v_manager_id,
            'New Leave Request: ' || v_req_number,
            v_user_name || ' submitted ' || v_calc_duration || ' day(s) ' || v_leave_name || ' request for approval.',
            'approval_needed',
            '/manager/approvals'
        );
    END IF;

    -- Record audit log
    INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, new_values)
    VALUES (p_user_id, 'LEAVE_SUBMITTED', 'leave_requests', v_req_id::text, jsonb_build_object(
        'request_number', v_req_number,
        'duration', v_calc_duration,
        'start_date', p_start_date,
        'end_date', p_end_date
    ));

    RETURN v_req_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Transactional Leave Approval or Rejection
CREATE OR REPLACE FUNCTION process_leave_approval(
    p_request_id UUID,
    p_approver_id UUID,
    p_decision VARCHAR, -- 'approved' or 'rejected'
    p_remarks TEXT
)
RETURNS VOID AS $$
DECLARE
    v_req RECORD;
    v_applicant_name VARCHAR;
BEGIN
    SELECT * INTO v_req FROM leave_requests WHERE id = p_request_id FOR UPDATE;

    IF v_req IS NULL THEN
        RAISE EXCEPTION 'Leave request not found.';
    END IF;

    IF v_req.status != 'pending' THEN
        RAISE EXCEPTION 'This leave request has already been processed (Current status: %).', v_req.status;
    END IF;

    IF p_decision = 'approved' THEN
        -- Deduct from pending, increment used
        UPDATE leave_balances
        SET pending = pending - v_req.duration_days,
            used = used + v_req.duration_days,
            updated_at = now()
        WHERE user_id = v_req.user_id
          AND leave_type_id = v_req.leave_type_id
          AND year = EXTRACT(YEAR FROM v_req.start_date);

        -- Update request status
        UPDATE leave_requests
        SET status = 'approved',
            updated_at = now()
        WHERE id = p_request_id;

        -- Record approval
        INSERT INTO leave_approvals (leave_request_id, approver_id, action, remarks)
        VALUES (p_request_id, p_approver_id, 'approved', p_remarks);

        -- Notify employee
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (
            v_req.user_id,
            'Leave Request Approved (' || v_req.request_number || ')',
            'Your leave application for ' || v_req.duration_days || ' day(s) from ' || v_req.start_date || ' has been approved. Remarks: ' || COALESCE(p_remarks, 'None'),
            'leave_status',
            '/employee/requests'
        );

    ELSIF p_decision = 'rejected' THEN
        -- Restore pending to available
        UPDATE leave_balances
        SET pending = pending - v_req.duration_days,
            available = available + v_req.duration_days,
            updated_at = now()
        WHERE user_id = v_req.user_id
          AND leave_type_id = v_req.leave_type_id
          AND year = EXTRACT(YEAR FROM v_req.start_date);

        -- Update request status
        UPDATE leave_requests
        SET status = 'rejected',
            updated_at = now()
        WHERE id = p_request_id;

        -- Record approval rejection
        INSERT INTO leave_approvals (leave_request_id, approver_id, action, remarks)
        VALUES (p_request_id, p_approver_id, 'rejected', p_remarks);

        -- Notify employee
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (
            v_req.user_id,
            'Leave Request Rejected (' || v_req.request_number || ')',
            'Your leave application for ' || v_req.duration_days || ' day(s) was rejected. Reason: ' || COALESCE(p_remarks, 'Not specified'),
            'leave_status',
            '/employee/requests'
        );

    ELSE
        RAISE EXCEPTION 'Invalid decision type: %', p_decision;
    END IF;

    -- Audit log
    INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, new_values)
    VALUES (p_approver_id, 'LEAVE_' || UPPER(p_decision), 'leave_requests', p_request_id::text, jsonb_build_object(
        'request_number', v_req.request_number,
        'remarks', p_remarks
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Cancel Leave Request (restores balances)
CREATE OR REPLACE FUNCTION cancel_leave_request(
    p_request_id UUID,
    p_user_id UUID,
    p_reason TEXT
)
RETURNS VOID AS $$
DECLARE
    v_req RECORD;
BEGIN
    SELECT * INTO v_req FROM leave_requests WHERE id = p_request_id FOR UPDATE;

    IF v_req IS NULL THEN
        RAISE EXCEPTION 'Leave request not found.';
    END IF;

    IF v_req.user_id != p_user_id THEN
        RAISE EXCEPTION 'You are not authorized to cancel this request.';
    END IF;

    IF v_req.status = 'cancelled' THEN
        RAISE EXCEPTION 'This request is already cancelled.';
    END IF;

    IF v_req.status = 'rejected' THEN
        RAISE EXCEPTION 'Rejected requests cannot be cancelled.';
    END IF;

    IF v_req.status = 'pending' THEN
        -- Balance was in pending; restore to available
        UPDATE leave_balances
        SET pending = pending - v_req.duration_days,
            available = available + v_req.duration_days,
            updated_at = now()
        WHERE user_id = v_req.user_id
          AND leave_type_id = v_req.leave_type_id
          AND year = EXTRACT(YEAR FROM v_req.start_date);
    ELSIF v_req.status = 'approved' THEN
        -- Balance was in used; restore from used to available
        IF v_req.start_date < CURRENT_DATE THEN
            RAISE EXCEPTION 'Cannot cancel past approved leave without administrative approval.';
        END IF;

        UPDATE leave_balances
        SET used = used - v_req.duration_days,
            available = available + v_req.duration_days,
            updated_at = now()
        WHERE user_id = v_req.user_id
          AND leave_type_id = v_req.leave_type_id
          AND year = EXTRACT(YEAR FROM v_req.start_date);
    END IF;

    -- Update request status
    UPDATE leave_requests
    SET status = 'cancelled',
        cancellation_reason = p_reason,
        updated_at = now()
    WHERE id = p_request_id;

    -- Record audit log
    INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, new_values)
    VALUES (p_user_id, 'LEAVE_CANCELLED', 'leave_requests', p_request_id::text, jsonb_build_object(
        'request_number', v_req.request_number,
        'reason', p_reason
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Profiles:
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full control profiles" ON profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Departments:
CREATE POLICY "Anyone can read departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Admins manage departments" ON departments FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Leave Types:
CREATE POLICY "Anyone can read leave types" ON leave_types FOR SELECT USING (true);
CREATE POLICY "Admins manage leave types" ON leave_types FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Holidays:
CREATE POLICY "Anyone can read holidays" ON holidays FOR SELECT USING (true);
CREATE POLICY "Admins manage holidays" ON holidays FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Leave Balances:
CREATE POLICY "Users view own balances" ON leave_balances FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Admins manage balances" ON leave_balances FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Leave Requests:
CREATE POLICY "Employees can view own requests" ON leave_requests FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
          AND (p.role = 'admin' OR (p.role = 'manager' AND p.department_id = (SELECT department_id FROM profiles WHERE id = leave_requests.user_id)))
    )
);
CREATE POLICY "Employees can create leave requests" ON leave_requests FOR INSERT WITH CHECK (
    auth.uid() = user_id
);
CREATE POLICY "Authorized can update leave requests" ON leave_requests FOR UPDATE USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Notifications:
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- System Settings:
CREATE POLICY "Anyone can read system settings" ON system_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update system settings" ON system_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Audit Logs:
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
