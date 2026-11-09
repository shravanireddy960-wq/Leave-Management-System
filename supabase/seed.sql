-- ====================================================================
-- LEAVEPULSE — Realistic Seed Data for College Environment
-- ====================================================================

-- 1. System Settings
INSERT INTO system_settings (
    id, org_name, academic_year, weekend_days, auto_approve_days, carry_forward_limit, working_hours_per_day, contact_email
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Apex Institute of Engineering & Technology',
    '2025-2026',
    '["Saturday", "Sunday"]'::jsonb,
    5,
    10,
    8.0,
    'dean.hr@apex-tech.edu'
) ON CONFLICT (id) DO UPDATE SET org_name = EXCLUDED.org_name;

-- 2. Leave Types
INSERT INTO leave_types (id, code, name, description, annual_quota, is_paid, requires_document, max_consecutive_days, carry_forward_eligible, color) VALUES
('11111111-1111-1111-1111-111111110001', 'CL', 'Casual Leave', 'Short-term personal time off and urgent personal affairs.', 12.0, true, false, 3, false, '#3448A5'),
('11111111-1111-1111-1111-111111110002', 'SL', 'Sick / Medical Leave', 'Absence due to illness, injury, or medical appointments.', 10.0, true, true, 5, true, '#E9A23B'),
('11111111-1111-1111-1111-111111110003', 'EL', 'Earned / Privilege Leave', 'Earned vacation and planned extended leave for faculty & staff.', 15.0, true, false, 14, true, '#16A37B'),
('11111111-1111-1111-1111-111111110004', 'DL', 'Duty / Academic Leave', 'On-duty attendance at conferences, seminars, university exam duties, or research symposiums.', 15.0, true, true, 10, false, '#7485D8'),
('11111111-1111-1111-1111-111111110005', 'ML', 'Maternity / Paternity Leave', 'Statutory parental care leave for eligible employees.', 90.0, true, true, 90, false, '#9333EA'),
('11111111-1111-1111-1111-111111110006', 'COMP', 'Compensatory Off', 'Compensatory leave credited for working on institutional holidays or weekend duty.', 5.0, true, false, 2, false, '#0284C7'),
('11111111-1111-1111-1111-111111110007', 'LOP', 'Loss of Pay (Unpaid)', 'Leave without pay taken when all entitled balances are exhausted.', 0.0, false, false, 30, false, '#DC5353')
ON CONFLICT (code) DO NOTHING;

-- 3. Departments
INSERT INTO departments (id, code, name, description, is_active) VALUES
('22222222-2222-2222-2222-222222220001', 'CSE', 'Computer Science & Engineering', 'Undergraduate, Postgraduate, and AI Research laboratories.', true),
('22222222-2222-2222-2222-222222220002', 'ECE', 'Electronics & Communication', 'VLSI, Embedded Systems, and Signal Processing divisions.', true),
('22222222-2222-2222-2222-222222220003', 'ME', 'Mechanical Engineering', 'Thermal Engineering, CAD/CAM, and Robotics workshops.', true),
('22222222-2222-2222-2222-222222220004', 'ASH', 'Applied Sciences & Humanities', 'Physics, Chemistry, Mathematics, and Professional Communication.', true),
('22222222-2222-2222-2222-222222220005', 'ADM', 'Administration & Registrar Office', 'Academic registry, HR operations, and financial administration.', true)
ON CONFLICT (code) DO NOTHING;

-- 4. Demo Profiles
-- Note: UUIDs correspond to demo accounts
-- Admin: admin@leavepulse.demo (Marcus Vance)
-- Manager: hod@leavepulse.demo (Prof. Sarah Jenkins)
-- Employee: employee@leavepulse.demo (Dr. Rajesh Kumar)
-- Additional members for CSE department to test real team view & approvals

INSERT INTO profiles (id, employee_id, full_name, email, avatar_url, role, department_id, designation, phone, joining_date, is_active) VALUES
('33333333-3333-3333-3333-333333330001', 'ADM-DIR-001', 'Dr. Marcus Vance', 'admin@leavepulse.demo', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'admin', '22222222-2222-2222-2222-222222220005', 'Dean of Academic Affairs', '+1 (555) 234-5678', '2018-06-15', true),
('33333333-3333-3333-3333-333333330002', 'HOD-CSE-001', 'Prof. Sarah Jenkins', 'hod@leavepulse.demo', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'manager', '22222222-2222-2222-2222-222222220001', 'Professor & Head of Department', '+1 (555) 345-6789', '2020-01-10', true),
('33333333-3333-3333-3333-333333330003', 'EMP-CSE-104', 'Sai Praneeth L.', 'employee@leavepulse.demo', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'employee', '22222222-2222-2222-2222-222222220001', 'Assistant Professor (CSE)', '+91 98450 12345', '2022-01-15', true),
('33333333-3333-3333-3333-333333330004', 'EMP-CSE-105', 'Dr. Elena Rostova', 'elena.rostova@leavepulse.demo', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'employee', '22222222-2222-2222-2222-222222220001', 'Associate Professor (Data Science)', '+1 (555) 567-8901', '2021-03-15', true),
('33333333-3333-3333-3333-333333330005', 'EMP-CSE-106', 'David Chen', 'david.chen@leavepulse.demo', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'employee', '22222222-2222-2222-2222-222222220001', 'Senior Lab Technical Instructor', '+1 (555) 678-9012', '2023-01-15', true),
('33333333-3333-3333-3333-333333330006', 'HOD-ECE-002', 'Prof. Robert Miller', 'robert.miller@leavepulse.demo', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'manager', '22222222-2222-2222-2222-222222220002', 'Professor & HOD (ECE)', '+1 (555) 789-0123', '2019-11-01', true)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- Link Reporting Managers & HODs
UPDATE departments SET hod_id = '33333333-3333-3333-3333-333333330002' WHERE code = 'CSE';
UPDATE departments SET hod_id = '33333333-3333-3333-3333-333333330006' WHERE code = 'ECE';

UPDATE profiles SET reporting_manager_id = '33333333-3333-3333-3333-333333330002' WHERE id IN (
    '33333333-3333-3333-3333-333333330003',
    '33333333-3333-3333-3333-333333330004',
    '33333333-3333-3333-3333-333333330005'
);
UPDATE profiles SET reporting_manager_id = '33333333-3333-3333-3333-333333330001' WHERE id IN (
    '33333333-3333-3333-3333-333333330002',
    '33333333-3333-3333-3333-333333330006'
);

-- 5. Approval Assignments
INSERT INTO approval_assignments (department_id, manager_id, approval_level) VALUES
('22222222-2222-2222-2222-222222220001', '33333333-3333-3333-3333-333333330002', 1),
('22222222-2222-2222-2222-222222220002', '33333333-3333-3333-3333-333333330006', 1)
ON CONFLICT DO NOTHING;

-- 6. Leave Balances for Dr. Rajesh Kumar (employee@leavepulse.demo)
INSERT INTO leave_balances (user_id, leave_type_id, year, allocated, used, pending, available, carry_forward) VALUES
('33333333-3333-3333-3333-333333330003', '11111111-1111-1111-1111-111111110001', 2025, 12.0, 3.0, 1.0, 8.0, 0.0),
('33333333-3333-3333-3333-333333330003', '11111111-1111-1111-1111-111111110002', 2025, 10.0, 2.0, 0.0, 8.0, 0.0),
('33333333-3333-3333-3333-333333330003', '11111111-1111-1111-1111-111111110003', 2025, 15.0, 4.0, 0.0, 11.0, 0.0),
('33333333-3333-3333-3333-333333330003', '11111111-1111-1111-1111-111111110004', 2025, 15.0, 3.0, 0.0, 12.0, 0.0),
('33333333-3333-3333-3333-333333330003', '11111111-1111-1111-1111-111111110006', 2025, 3.0, 1.0, 0.0, 2.0, 0.0)
ON CONFLICT (user_id, leave_type_id, year) DO NOTHING;

-- Balances for other employees
INSERT INTO leave_balances (user_id, leave_type_id, year, allocated, used, pending, available, carry_forward) VALUES
('33333333-3333-3333-3333-333333330004', '11111111-1111-1111-1111-111111110001', 2025, 12.0, 4.0, 2.0, 6.0, 0.0),
('33333333-3333-3333-3333-333333330004', '11111111-1111-1111-1111-111111110002', 2025, 10.0, 1.0, 0.0, 9.0, 0.0),
('33333333-3333-3333-3333-333333330005', '11111111-1111-1111-1111-111111110001', 2025, 12.0, 5.0, 0.0, 7.0, 0.0)
ON CONFLICT (user_id, leave_type_id, year) DO NOTHING;

-- 7. College Holidays (2025/2026 Academic Calendar)
INSERT INTO holidays (id, name, date, type, description, is_recurring, year) VALUES
('44444444-4444-4444-4444-444444440001', 'New Year Holiday', '2025-01-01', 'mandatory', 'Celebration of New Year Day', true, 2025),
('44444444-4444-4444-4444-444444440002', 'Republic Day', '2025-01-26', 'mandatory', 'National Republic Day', true, 2025),
('44444444-4444-4444-4444-444444440003', 'Spring Semester Mid-Term Recess', '2025-03-14', 'college_break', 'Institutional Spring Recess for faculty & students', false, 2025),
('44444444-4444-4444-4444-444444440004', 'Good Friday', '2025-04-18', 'mandatory', 'Good Friday Observance', false, 2025),
('44444444-4444-4444-4444-444444440005', 'Labor / May Day', '2025-05-01', 'mandatory', 'International Workers Day', true, 2025),
('44444444-4444-4444-4444-444444440006', 'Independence Day', '2025-08-15', 'mandatory', 'National Independence Day Celebration', true, 2025),
('44444444-4444-4444-4444-444444440007', 'Gandhi Jayanti', '2025-10-02', 'mandatory', 'National Holiday', true, 2025),
('44444444-4444-4444-4444-444444440008', 'Diwali / Festival of Lights', '2025-10-20', 'mandatory', 'Institutional Holiday', false, 2025),
('44444444-4444-4444-4444-444444440009', 'Christmas Day', '2025-12-25', 'mandatory', 'Christmas Day Observance', true, 2025),
('44444444-4444-4444-4444-444444440010', 'Annual Research & Tech Symposium', '2025-11-14', 'restricted', 'Faculty discretionary attendance', false, 2025)
ON CONFLICT (date) DO NOTHING;

-- 8. Sample Leave Requests
INSERT INTO leave_requests (id, request_number, user_id, leave_type_id, start_date, end_date, is_half_day, duration_days, reason, contact_phone, status, current_approver_id, created_at) VALUES
('55555555-5555-5555-5555-555555550001', 'LP-2025-1021', '33333333-3333-3333-3333-333333330003', '11111111-1111-1111-1111-111111110001', '2025-11-10', '2025-11-10', false, 1.0, 'Family urgent personal obligation and child medical review.', '+1 (555) 456-7890', 'pending', '33333333-3333-3333-3333-333333330002', now() - INTERVAL '1 day'),
('55555555-5555-5555-5555-555555550002', 'LP-2025-0984', '33333333-3333-3333-3333-333333330004', '11111111-1111-1111-1111-111111110001', '2025-11-12', '2025-11-13', false, 2.0, 'Attending IEEE international research workshop on Machine Learning.', '+1 (555) 567-8901', 'pending', '33333333-3333-3333-3333-333333330002', now() - INTERVAL '2 days'),
('55555555-5555-5555-5555-555555550003', 'LP-2025-0842', '33333333-3333-3333-3333-333333330003', '11111111-1111-1111-1111-111111110004', '2025-10-14', '2025-10-16', false, 3.0, 'Invited keynote session speaker at State University Conference.', '+1 (555) 456-7890', 'approved', '33333333-3333-3333-3333-333333330002', now() - INTERVAL '25 days'),
('55555555-5555-5555-5555-555555550004', 'LP-2025-0715', '33333333-3333-3333-3333-333333330003', '11111111-1111-1111-1111-111111110002', '2025-09-08', '2025-09-09', false, 2.0, 'High fever and viral flu rest recommended by physician.', '+1 (555) 456-7890', 'approved', '33333333-3333-3333-3333-333333330002', now() - INTERVAL '60 days')
ON CONFLICT (id) DO NOTHING;

-- 9. Sample Approval Record
INSERT INTO leave_approvals (id, leave_request_id, approver_id, action, remarks, action_date) VALUES
('66666666-6666-6666-6666-666666660001', '55555555-5555-5555-5555-555555550003', '33333333-3333-3333-3333-333333330002', 'approved', 'Approved. Classes were appropriately swapped with Dr. Elena.', now() - INTERVAL '24 days'),
('66666666-6666-6666-6666-666666660002', '55555555-5555-5555-5555-555555550004', '33333333-3333-3333-3333-333333330002', 'approved', 'Get well soon. Medical certificate acknowledged.', now() - INTERVAL '59 days')
ON CONFLICT (id) DO NOTHING;

-- 10. Sample Notifications
INSERT INTO notifications (user_id, title, message, type, link, is_read) VALUES
('33333333-3333-3333-3333-333333330002', 'Pending Approval: LP-2025-1021', 'Dr. Rajesh Kumar submitted a 1.0 day Casual Leave request.', 'approval_needed', '/manager/approvals', false),
('33333333-3333-3333-3333-333333330002', 'Pending Approval: LP-2025-0984', 'Dr. Elena Rostova submitted a 2.0 days Casual Leave request.', 'approval_needed', '/manager/approvals', false),
('33333333-3333-3333-3333-333333330003', 'Leave Request Approved', 'Your Duty Leave LP-2025-0842 for 3 days has been approved.', 'leave_status', '/employee/requests', true),
('33333333-3333-3333-3333-333333330003', 'Upcoming Institutional Holiday', 'Diwali / Festival of Lights holiday is on October 20, 2025.', 'policy_update', '/employee/holidays', true);
