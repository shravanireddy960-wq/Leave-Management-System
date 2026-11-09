import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('report/figures', exist_ok=True)

def create_browser_ui_mockup(title, url, content_type, filename, width=1200, height=750):
    fig, ax = plt.subplots(figsize=(width/100, height/100), dpi=100)
    fig.patch.set_facecolor('#F8F5EF')
    ax.set_facecolor('#F8F5EF')
    ax.axis('off')

    # Browser Outer Frame
    browser_rect = patches.FancyBboxPatch((0.02, 0.03), 0.96, 0.94, boxstyle="round,pad=0.01",
                                          fc='#FFFFFF', ec='#E9DFD0', lw=2, transform=ax.transAxes)
    ax.add_patch(browser_rect)

    # Browser Header
    top_bar = patches.FancyBboxPatch((0.02, 0.89), 0.96, 0.08, boxstyle="square,pad=0.0",
                                     fc='#101C35', ec='#101C35', lw=1, transform=ax.transAxes)
    ax.add_patch(top_bar)

    # Window dots
    ax.scatter([0.05, 0.07, 0.09], [0.93, 0.93, 0.93], c=['#FF5F56', '#FFBD2E', '#27C93F'], s=80, transform=ax.transAxes)

    # URL Bar
    url_bar = patches.FancyBboxPatch((0.15, 0.905), 0.70, 0.05, boxstyle="round,pad=0.008",
                                     fc='#1E293B', ec='#334155', lw=1, transform=ax.transAxes)
    ax.add_patch(url_bar)
    ax.text(0.18, 0.93, f"🔒 {url}", color='#94A3B8', fontsize=10, fontfamily='sans-serif', va='center', transform=ax.transAxes)

    # Title & Badge
    ax.text(0.96, 0.93, "LMS Enterprise", color='#C5A46D', fontsize=11, fontweight='bold', fontfamily='serif', ha='right', va='center', transform=ax.transAxes)

    if content_type == 'landing':
        # Header banner inside
        banner = patches.FancyBboxPatch((0.06, 0.72), 0.88, 0.14, boxstyle="round,pad=0.01",
                                        fc='#101C35', ec='#C5A46D', lw=1.5, transform=ax.transAxes)
        ax.add_patch(banner)
        ax.text(0.5, 0.81, "Leave Management System (LMS)", color='#FFFFFF', fontsize=18, fontweight='bold', ha='center', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.5, 0.75, "Corporate Role Portals • Executive Leave Administration • Real-Time IST Engine", color='#C5A46D', fontsize=11, ha='center', fontfamily='sans-serif', transform=ax.transAxes)

        # 3 Portal Cards
        portals = [
            ("Employee Portal", "employee@lms.in", "Apply Leave, View Balances, Team Directory, Quota Utilization", 0.06, '#3B82F6'),
            ("Manager Portal", "manager@lms.in", "Multi-Tier Approvals, Leave Calendar, Department Requests", 0.36, '#10B981'),
            ("Admin Portal", "admin@lms.in", "Employee CRUD, Leave Policy, Indian Mobile Validation, Audit Logs", 0.66, '#F59E0B')
        ]
        for name, email, desc, x, color in portals:
            card = patches.FancyBboxPatch((x, 0.28), 0.28, 0.40, boxstyle="round,pad=0.015",
                                          fc='#FAF7F2', ec='#E9DFD0', lw=1.5, transform=ax.transAxes)
            ax.add_patch(card)
            tag = patches.FancyBboxPatch((x+0.02, 0.61), 0.24, 0.05, boxstyle="round,pad=0.005",
                                         fc=color, ec=color, transform=ax.transAxes)
            ax.add_patch(tag)
            ax.text(x+0.14, 0.635, name, color='#FFFFFF', fontsize=12, fontweight='bold', ha='center', va='center', fontfamily='sans-serif', transform=ax.transAxes)
            ax.text(x+0.14, 0.54, f"Login: {email}", color='#101C35', fontsize=10, fontweight='bold', ha='center', fontfamily='monospace', transform=ax.transAxes)
            ax.text(x+0.14, 0.45, desc, color='#475569', fontsize=9, ha='center', va='top', wrap=True, fontfamily='sans-serif', transform=ax.transAxes)
            btn = patches.FancyBboxPatch((x+0.04, 0.31), 0.20, 0.06, boxstyle="round,pad=0.008",
                                         fc='#101C35', ec='#C5A46D', lw=1, transform=ax.transAxes)
            ax.add_patch(btn)
            ax.text(x+0.14, 0.34, "Launch Portal →", color='#C5A46D', fontsize=10, fontweight='bold', ha='center', va='center', fontfamily='sans-serif', transform=ax.transAxes)

        # Footer info
        ax.text(0.5, 0.12, "Architecture: Next.js 14 App Router • Tailwind CSS • Supabase PostgreSQL • Times New Roman Typography", color='#64748B', fontsize=10, ha='center', fontfamily='sans-serif', transform=ax.transAxes)

    elif content_type == 'employee_dash':
        # Top banner with dynamic greeting & IST Clock
        banner = patches.FancyBboxPatch((0.05, 0.70), 0.90, 0.16, boxstyle="round,pad=0.01",
                                        fc='#101C35', ec='#C5A46D', lw=1.5, transform=ax.transAxes)
        ax.add_patch(banner)
        ax.text(0.08, 0.81, "Good Evening, Employee", color='#FFFFFF', fontsize=18, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.08, 0.74, "Senior SDE • Engineering & Technology • Reporting to Engineering Director", color='#94A3B8', fontsize=10, fontfamily='sans-serif', transform=ax.transAxes)

        # IST Clock Badge
        badge = patches.FancyBboxPatch((0.68, 0.73), 0.24, 0.10, boxstyle="round,pad=0.01",
                                       fc='#1E293B', ec='#C5A46D', lw=1.5, transform=ax.transAxes)
        ax.add_patch(badge)
        ax.text(0.80, 0.80, "🇮🇳 IST (UTC+05:30)", color='#C5A46D', fontsize=9, fontweight='bold', ha='center', fontfamily='sans-serif', transform=ax.transAxes)
        ax.text(0.80, 0.75, "18:45:30 IST • 09 Nov 2026", color='#FFFFFF', fontsize=10, fontweight='bold', ha='center', fontfamily='monospace', transform=ax.transAxes)

        # 4 Balance Cards
        cards = [
            ("Casual Leave (CL)", "10.0 / 12", "Available: 10 Days", '#C5A46D', 0.05),
            ("Sick Leave (SL)", "9.0 / 10", "Available: 9 Days", '#3B82F6', 0.28),
            ("Earned Leave (EL)", "15.0 / 15", "Available: 15 Days", '#10B981', 0.51),
            ("Paid / Parental (PL)", "0.0 / 180", "Available: 0 Days", '#8B5CF6', 0.74)
        ]
        for title_c, ratio, avail, color, x in cards:
            c_patch = patches.FancyBboxPatch((x, 0.44), 0.21, 0.22, boxstyle="round,pad=0.01",
                                             fc='#FAF7F2', ec='#E9DFD0', lw=1.5, transform=ax.transAxes)
            ax.add_patch(c_patch)
            ax.text(x+0.105, 0.60, title_c, color='#101C35', fontsize=10, fontweight='bold', ha='center', fontfamily='sans-serif', transform=ax.transAxes)
            ax.text(x+0.105, 0.52, ratio, color=color, fontsize=16, fontweight='bold', ha='center', fontfamily='monospace', transform=ax.transAxes)
            ax.text(x+0.105, 0.47, avail, color='#64748B', fontsize=9, ha='center', fontfamily='sans-serif', transform=ax.transAxes)

        # Recent Requests Mini-table
        tbl_box = patches.FancyBboxPatch((0.05, 0.08), 0.90, 0.32, boxstyle="round,pad=0.01",
                                         fc='#FAF7F2', ec='#E9DFD0', lw=1.5, transform=ax.transAxes)
        ax.add_patch(tbl_box)
        ax.text(0.08, 0.35, "Recent Leave Requests & Applications", color='#101C35', fontsize=12, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        rows = [
            ("req-008", "Casual Leave", "2026-11-16 to 2026-11-18 (3 Days)", "APPROVED", '#10B981'),
            ("req-007", "Sick Leave", "2026-10-12 to 2026-10-13 (2 Days)", "APPROVED", '#10B981'),
            ("req-006", "Casual Leave (Half Day)", "2026-09-04 (0.5 Day - Morning)", "REJECTED", '#EF4444'),
        ]
        y_r = 0.29
        for rid, ltype, span, st, st_col in rows:
            ax.text(0.08, y_r, rid, color='#64748B', fontsize=9, fontfamily='monospace', transform=ax.transAxes)
            ax.text(0.20, y_r, ltype, color='#101C35', fontsize=9, fontweight='bold', fontfamily='sans-serif', transform=ax.transAxes)
            ax.text(0.45, y_r, span, color='#475569', fontsize=9, fontfamily='sans-serif', transform=ax.transAxes)
            st_badge = patches.FancyBboxPatch((0.75, y_r-0.015), 0.12, 0.035, boxstyle="round,pad=0.005", fc=st_col, ec=st_col, transform=ax.transAxes)
            ax.add_patch(st_badge)
            ax.text(0.81, y_r, st, color='#FFFFFF', fontsize=8, fontweight='bold', ha='center', va='center', fontfamily='sans-serif', transform=ax.transAxes)
            y_r -= 0.07

    elif content_type == 'apply_leave':
        # Title
        ax.text(0.06, 0.83, "Apply for Corporate Leave", color='#101C35', fontsize=16, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.06, 0.79, "Previous days prior to today (2026-11-09) are strictly locked & blacked out.", color='#64748B', fontsize=10, fontfamily='sans-serif', transform=ax.transAxes)

        # Form Left Column
        form_box = patches.FancyBboxPatch((0.05, 0.08), 0.42, 0.68, boxstyle="round,pad=0.01",
                                          fc='#FAF7F2', ec='#E9DFD0', lw=1.5, transform=ax.transAxes)
        ax.add_patch(form_box)
        ax.text(0.08, 0.70, "Leave Type *", color='#101C35', fontsize=10, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        inp1 = patches.FancyBboxPatch((0.08, 0.63), 0.36, 0.05, boxstyle="round,pad=0.005", fc='#FFFFFF', ec='#CBD5E1', transform=ax.transAxes)
        ax.add_patch(inp1)
        ax.text(0.10, 0.655, "Casual Leave (CL) • Quota: 12 days • Paid", color='#101C35', fontsize=9, va='center', fontfamily='sans-serif', transform=ax.transAxes)

        ax.text(0.08, 0.58, "Start Date (min: 2026-11-09)", color='#101C35', fontsize=10, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        inp2 = patches.FancyBboxPatch((0.08, 0.51), 0.36, 0.05, boxstyle="round,pad=0.005", fc='#FFFFFF', ec='#CBD5E1', transform=ax.transAxes)
        ax.add_patch(inp2)
        ax.text(0.10, 0.535, "2026-11-16 (Monday)", color='#101C35', fontsize=9, va='center', fontfamily='monospace', transform=ax.transAxes)

        ax.text(0.08, 0.46, "End Date", color='#101C35', fontsize=10, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        inp3 = patches.FancyBboxPatch((0.08, 0.39), 0.36, 0.05, boxstyle="round,pad=0.005", fc='#FFFFFF', ec='#CBD5E1', transform=ax.transAxes)
        ax.add_patch(inp3)
        ax.text(0.10, 0.415, "2026-11-18 (Wednesday)", color='#101C35', fontsize=9, va='center', fontfamily='monospace', transform=ax.transAxes)

        ax.text(0.08, 0.34, "Reason for Leave *", color='#101C35', fontsize=10, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        inp4 = patches.FancyBboxPatch((0.08, 0.20), 0.36, 0.12, boxstyle="round,pad=0.005", fc='#FFFFFF', ec='#CBD5E1', transform=ax.transAxes)
        ax.add_patch(inp4)
        ax.text(0.10, 0.29, "Family function and personal travel commitments.", color='#475569', fontsize=9, fontfamily='sans-serif', transform=ax.transAxes)

        sub_btn = patches.FancyBboxPatch((0.08, 0.11), 0.36, 0.06, boxstyle="round,pad=0.008", fc='#101C35', ec='#C5A46D', lw=1.5, transform=ax.transAxes)
        ax.add_patch(sub_btn)
        ax.text(0.26, 0.14, "Submit Leave Request (3.0 Days) →", color='#C5A46D', fontsize=10, fontweight='bold', ha='center', va='center', fontfamily='sans-serif', transform=ax.transAxes)

        # Calendar Right Column
        cal_box = patches.FancyBboxPatch((0.50, 0.08), 0.45, 0.68, boxstyle="round,pad=0.01",
                                         fc='#FAF7F2', ec='#E9DFD0', lw=1.5, transform=ax.transAxes)
        ax.add_patch(cal_box)
        ax.text(0.53, 0.70, "Interactive Month Calendar (November 2026)", color='#101C35', fontsize=11, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.53, 0.66, "◼ Blacked-Out = Locked Past Days  |  🟨 Gold = Selected Range", color='#64748B', fontsize=8, fontfamily='sans-serif', transform=ax.transAxes)

        # Calendar Matrix
        days_header = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        for col_idx, dh in enumerate(days_header):
            ax.text(0.53 + col_idx*0.058, 0.61, dh, color='#94A3B8', fontsize=8, fontweight='bold', ha='center', fontfamily='sans-serif', transform=ax.transAxes)

        # 4 weeks of November
        # Today is Nov 9. 1-8 are blacked out!
        day_num = 1
        for row in range(4):
            for col in range(7):
                if day_num > 28: break
                cx = 0.505 + col*0.058
                cy = 0.53 - row*0.08
                is_past = day_num < 9
                is_today = day_num == 9
                is_sel = 16 <= day_num <= 18

                if is_past:
                    c_patch = patches.FancyBboxPatch((cx, cy), 0.052, 0.065, boxstyle="round,pad=0.002",
                                                     fc='#E2E8F0', ec='#CBD5E1', ls='--', lw=1, transform=ax.transAxes)
                    ax.add_patch(c_patch)
                    ax.text(cx+0.026, cy+0.038, str(day_num), color='#94A3B8', fontsize=8, fontweight='bold', ha='center', va='center', fontfamily='monospace', transform=ax.transAxes)
                    ax.text(cx+0.026, cy+0.016, "Locked", color='#94A3B8', fontsize=6, ha='center', va='center', fontfamily='sans-serif', transform=ax.transAxes)
                elif is_sel:
                    c_patch = patches.FancyBboxPatch((cx, cy), 0.052, 0.065, boxstyle="round,pad=0.002",
                                                     fc='#C5A46D', ec='#B38D4F', lw=1.5, transform=ax.transAxes)
                    ax.add_patch(c_patch)
                    ax.text(cx+0.026, cy+0.032, str(day_num), color='#101C35', fontsize=9, fontweight='bold', ha='center', va='center', fontfamily='monospace', transform=ax.transAxes)
                elif is_today:
                    c_patch = patches.FancyBboxPatch((cx, cy), 0.052, 0.065, boxstyle="round,pad=0.002",
                                                     fc='#FFFFFF', ec='#C5A46D', lw=2, transform=ax.transAxes)
                    ax.add_patch(c_patch)
                    ax.text(cx+0.026, cy+0.038, str(day_num), color='#101C35', fontsize=8, fontweight='bold', ha='center', va='center', fontfamily='monospace', transform=ax.transAxes)
                    ax.text(cx+0.026, cy+0.016, "Today", color='#C5A46D', fontsize=6, fontweight='bold', ha='center', va='center', fontfamily='sans-serif', transform=ax.transAxes)
                else:
                    c_patch = patches.FancyBboxPatch((cx, cy), 0.052, 0.065, boxstyle="round,pad=0.002",
                                                     fc='#FFFFFF', ec='#E2E8F0', lw=1, transform=ax.transAxes)
                    ax.add_patch(c_patch)
                    ax.text(cx+0.026, cy+0.032, str(day_num), color='#334155', fontsize=8, ha='center', va='center', fontfamily='monospace', transform=ax.transAxes)
                day_num += 1

    elif content_type == 'team_dir':
        ax.text(0.06, 0.83, "Department Team Overview — Engineering & Technology", color='#101C35', fontsize=16, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.06, 0.79, "Real-time presence tracking, colleague contact directory, and bound reporting manager card.", color='#64748B', fontsize=10, fontfamily='sans-serif', transform=ax.transAxes)

        # Manager Card
        mgr_box = patches.FancyBboxPatch((0.05, 0.58), 0.90, 0.18, boxstyle="round,pad=0.01",
                                         fc='#101C35', ec='#C5A46D', lw=1.5, transform=ax.transAxes)
        ax.add_patch(mgr_box)
        ax.text(0.08, 0.70, "Reporting Manager: Manager", color='#FFFFFF', fontsize=14, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.08, 0.64, "Engineering Director • manager@lms.in • +91 98450 11223 • Location: Bangalore HQ", color='#94A3B8', fontsize=10, fontfamily='sans-serif', transform=ax.transAxes)

        # Team Roster Cards
        colleagues = [
            ("Employee (You)", "Senior SDE", "In Office", '#10B981', 0.05),
            ("Priya Sharma", "Lead Frontend SDE", "In Office", '#10B981', 0.36),
            ("Vikram Malhotra", "Cloud Architect", "On Leave (CL)", '#F59E0B', 0.67),
        ]
        for name, desig, status, col, x in colleagues:
            card = patches.FancyBboxPatch((x, 0.22), 0.28, 0.30, boxstyle="round,pad=0.01",
                                          fc='#FAF7F2', ec='#E9DFD0', lw=1.5, transform=ax.transAxes)
            ax.add_patch(card)
            ax.text(x+0.14, 0.44, name, color='#101C35', fontsize=12, fontweight='bold', ha='center', fontfamily='serif', transform=ax.transAxes)
            ax.text(x+0.14, 0.38, desig, color='#64748B', fontsize=10, ha='center', fontfamily='sans-serif', transform=ax.transAxes)
            st_b = patches.FancyBboxPatch((x+0.04, 0.27), 0.20, 0.06, boxstyle="round,pad=0.005", fc=col, ec=col, transform=ax.transAxes)
            ax.add_patch(st_b)
            ax.text(x+0.14, 0.30, status, color='#FFFFFF', fontsize=9, fontweight='bold', ha='center', va='center', fontfamily='sans-serif', transform=ax.transAxes)

    elif content_type == 'manager_approvals':
        ax.text(0.06, 0.83, "Manager Portal — Leave Request Approvals & Workflows", color='#101C35', fontsize=16, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.06, 0.79, "Review pending subordinate leave applications, evaluate quota impact, and approve or reject.", color='#64748B', fontsize=10, fontfamily='sans-serif', transform=ax.transAxes)

        tbl = patches.FancyBboxPatch((0.05, 0.12), 0.90, 0.62, boxstyle="round,pad=0.01",
                                     fc='#FAF7F2', ec='#E9DFD0', lw=1.5, transform=ax.transAxes)
        ax.add_patch(tbl)
        # Header
        hdr = patches.FancyBboxPatch((0.05, 0.66), 0.90, 0.08, boxstyle="square,pad=0.0",
                                     fc='#101C35', ec='#101C35', transform=ax.transAxes)
        ax.add_patch(hdr)
        ax.text(0.08, 0.70, "REQUEST ID", color='#C5A46D', fontsize=9, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.24, 0.70, "EMPLOYEE", color='#C5A46D', fontsize=9, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.44, 0.70, "LEAVE TYPE & DATES", color='#C5A46D', fontsize=9, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.70, 0.70, "DAYS", color='#C5A46D', fontsize=9, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.82, 0.70, "ACTIONS", color='#C5A46D', fontsize=9, fontweight='bold', fontfamily='serif', transform=ax.transAxes)

        # Requests
        reqs = [
            ("req-2026-101", "Employee", "Casual Leave (16 Nov - 18 Nov)", "3.0 Days"),
            ("req-2026-102", "Priya Sharma", "Sick Leave (20 Nov)", "1.0 Day"),
            ("req-2026-103", "Vikram Malhotra", "Earned Leave (01 Dec - 05 Dec)", "5.0 Days")
        ]
        y_pos = 0.56
        for rid, emp, lspan, d_cnt in reqs:
            ax.text(0.08, y_pos, rid, color='#101C35', fontsize=9, fontfamily='monospace', transform=ax.transAxes)
            ax.text(0.24, y_pos, emp, color='#101C35', fontsize=9, fontweight='bold', fontfamily='sans-serif', transform=ax.transAxes)
            ax.text(0.44, y_pos, lspan, color='#475569', fontsize=9, fontfamily='sans-serif', transform=ax.transAxes)
            ax.text(0.70, y_pos, d_cnt, color='#101C35', fontsize=9, fontweight='bold', fontfamily='monospace', transform=ax.transAxes)

            b_app = patches.FancyBboxPatch((0.80, y_pos-0.015), 0.06, 0.035, boxstyle="round,pad=0.003", fc='#10B981', ec='#10B981', transform=ax.transAxes)
            ax.add_patch(b_app)
            ax.text(0.83, y_pos, "Approve", color='#FFFFFF', fontsize=7, fontweight='bold', ha='center', va='center', fontfamily='sans-serif', transform=ax.transAxes)

            b_rej = patches.FancyBboxPatch((0.87, y_pos-0.015), 0.06, 0.035, boxstyle="round,pad=0.003", fc='#EF4444', ec='#EF4444', transform=ax.transAxes)
            ax.add_patch(b_rej)
            ax.text(0.90, y_pos, "Reject", color='#FFFFFF', fontsize=7, fontweight='bold', ha='center', va='center', fontfamily='sans-serif', transform=ax.transAxes)

            y_pos -= 0.12

    elif content_type == 'admin_crud':
        ax.text(0.06, 0.83, "Admin Portal — Corporate Employee CRUD & Validation", color='#101C35', fontsize=16, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
        ax.text(0.06, 0.79, "Create, read, update, and manage corporate staff accounts with strict Indian phone (+91) checks.", color='#64748B', fontsize=10, fontfamily='sans-serif', transform=ax.transAxes)

        # Modal Edit Card
        modal_box = patches.FancyBboxPatch((0.15, 0.10), 0.70, 0.65, boxstyle="round,pad=0.01",
                                           fc='#FFFFFF', ec='#C5A46D', lw=2, transform=ax.transAxes)
        ax.add_patch(modal_box)
        ax.text(0.18, 0.69, "Edit Employee Profile: Employee (usr-emp-001)", color='#101C35', fontsize=13, fontweight='bold', fontfamily='serif', transform=ax.transAxes)

        fields = [
            ("Full Name *", "Employee", 0.61),
            ("Corporate Email *", "employee@lms.in", 0.51),
            ("Phone Number (+91 standard) *", "+91 98765 43210  ✓ Valid Indian Mobile", 0.41),
            ("Department", "Engineering & Technology", 0.31),
            ("Designation & Role", "Senior SDE • Role: employee", 0.21)
        ]
        for lbl, val, yf in fields:
            ax.text(0.18, yf+0.04, lbl, color='#101C35', fontsize=9, fontweight='bold', fontfamily='serif', transform=ax.transAxes)
            bx = patches.FancyBboxPatch((0.18, yf-0.01), 0.64, 0.04, boxstyle="round,pad=0.005", fc='#FAF7F2', ec='#CBD5E1', transform=ax.transAxes)
            ax.add_patch(bx)
            ax.text(0.20, yf+0.01, val, color='#101C35', fontsize=9, va='center', fontfamily='sans-serif', transform=ax.transAxes)

        save_btn = patches.FancyBboxPatch((0.55, 0.12), 0.27, 0.055, boxstyle="round,pad=0.008", fc='#101C35', ec='#C5A46D', lw=1.5, transform=ax.transAxes)
        ax.add_patch(save_btn)
        ax.text(0.685, 0.147, "Save Changes (Audit Logged) →", color='#C5A46D', fontsize=9, fontweight='bold', ha='center', va='center', fontfamily='sans-serif', transform=ax.transAxes)

    plt.tight_layout()
    plt.savefig(os.path.join('report/figures', filename), dpi=200, bbox_inches='tight', facecolor='#F8F5EF')
    plt.close()
    print(f"Generated UI mockup: {filename}")

# Generate Figures 16 to 21
create_browser_ui_mockup("LMS Role Landing Portal", "http://localhost:3000", "landing", "fig16_ui_landing_portal.png")
create_browser_ui_mockup("Employee Portal Dashboard", "http://localhost:3000/employee/dashboard", "employee_dash", "fig17_ui_employee_dashboard.png")
create_browser_ui_mockup("Employee Apply Leave & Calendar", "http://localhost:3000/employee/apply-leave", "apply_leave", "fig18_ui_apply_leave.png")
create_browser_ui_mockup("Department Team Overview", "http://localhost:3000/employee/team", "team_dir", "fig19_ui_team_directory.png")
create_browser_ui_mockup("Manager Leave Approvals", "http://localhost:3000/manager/approvals", "manager_approvals", "fig20_ui_manager_approvals.png")
create_browser_ui_mockup("Admin Employee CRUD", "http://localhost:3000/admin/employees", "admin_crud", "fig21_ui_admin_employees.png")

print("Generated UI figures 16-21 successfully!")
