import os
import shutil
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Copy existing ERD, DB tables, and lifecycle diagrams
if os.path.exists('report/figures/er-diagram.png'):
    shutil.copy('report/figures/er-diagram.png', 'report/figures/fig22_db_erd.png')
    print("Copied er-diagram.png to fig22_db_erd.png")

if os.path.exists('report/figures/db-tables.png'):
    shutil.copy('report/figures/db-tables.png', 'report/figures/fig23_db_tables.png')
    print("Copied db-tables.png to fig23_db_tables.png")

if os.path.exists('report/figures/lifecycle.png'):
    shutil.copy('report/figures/lifecycle.png', 'report/figures/fig25_lifecycle_flow.png')
    print("Copied lifecycle.png to fig25_lifecycle_flow.png")

# Generate fig24_db_rpc_function.png: Stored procedure calculate_working_days
fig, ax = plt.subplots(figsize=(12, 6.5), dpi=100)
fig.patch.set_facecolor('#0D1117')
ax.set_facecolor('#0D1117')
ax.axis('off')

# Title bar
header_rect = patches.FancyBboxPatch((0.02, 0.91), 0.96, 0.07, boxstyle="round,pad=0.01",
                                     fc='#161B22', ec='#30363D', lw=1.5, transform=ax.transAxes)
ax.add_patch(header_rect)
ax.scatter([0.05, 0.075, 0.10], [0.945, 0.945, 0.945], c=['#FF5F56', '#FFBD2E', '#27C93F'], s=90, transform=ax.transAxes)
ax.text(0.5, 0.945, "Supabase PostgreSQL Stored Procedure: calculate_working_days()", color='#8B949E', fontsize=11, fontweight='bold', ha='center', va='center', fontfamily='monospace', transform=ax.transAxes)

# Code box
body_rect = patches.FancyBboxPatch((0.02, 0.04), 0.96, 0.85, boxstyle="round,pad=0.01",
                                   fc='#090D13', ec='#30363D', lw=1.5, transform=ax.transAxes)
ax.add_patch(body_rect)

sql_lines = [
    "-- PL/pgSQL Stored Procedure from supabase/schema.sql",
    "CREATE OR REPLACE FUNCTION public.calculate_working_days(",
    "    p_start_date DATE,",
    "    p_end_date DATE,",
    "    p_exclude_weekends BOOLEAN DEFAULT TRUE,",
    "    p_exclude_holidays BOOLEAN DEFAULT TRUE",
    ") RETURNS NUMERIC LANGUAGE plpgsql SECURITY DEFINER AS $BODY$",
    "DECLARE",
    "    v_curr DATE := p_start_date;",
    "    v_count NUMERIC := 0;",
    "BEGIN",
    "    WHILE v_curr <= p_end_date LOOP",
    "        -- Check Weekend (Sunday=0, Saturday=6 in PostgreSQL extract DOW)",
    "        IF p_exclude_weekends AND EXTRACT(DOW FROM v_curr) IN (0, 6) THEN",
    "            v_curr := v_curr + 1;",
    "            CONTINUE;",
    "        END IF;",
    "        -- Check Company Public Holidays table",
    "        IF p_exclude_holidays AND EXISTS (SELECT 1 FROM public.company_holidays WHERE date = v_curr) THEN",
    "            v_curr := v_curr + 1;",
    "            CONTINUE;",
    "        END IF;",
    "        v_count := v_count + 1;",
    "        v_curr := v_curr + 1;",
    "    END LOOP;",
    "    RETURN v_count;",
    "END; $BODY$;"
]

y = 0.84
line_step = 0.78 / len(sql_lines)
for line in sql_lines:
    color = '#C9D1D9'
    weight = 'normal'
    if line.startswith('--'):
        color = '#8B949E'
    elif 'CREATE' in line or 'FUNCTION' in line or 'RETURNS' in line or 'LANGUAGE' in line or 'SECURITY' in line:
        color = '#FF7B72'
        weight = 'bold'
    elif 'DECLARE' in line or 'BEGIN' in line or 'END' in line or 'WHILE' in line or 'LOOP' in line:
        color = '#D2A8FF'
        weight = 'bold'
    elif 'IF' in line or 'THEN' in line or 'CONTINUE' in line or 'RETURN' in line or 'EXISTS' in line:
        color = '#79C0FF'
    elif 'v_curr' in line or 'v_count' in line or 'p_' in line:
        color = '#FFA657'

    # Escape $ for matplotlib text
    escaped_line = line.replace('$', '\\$')
    ax.text(0.05, y, escaped_line, color=color, fontsize=10, fontweight=weight, fontfamily='monospace', transform=ax.transAxes)
    y -= line_step

plt.tight_layout()
plt.savefig('report/figures/fig24_db_rpc_function.png', dpi=200, bbox_inches='tight', facecolor='#0D1117')
plt.close()
print("Generated fig24_db_rpc_function.png successfully!")
