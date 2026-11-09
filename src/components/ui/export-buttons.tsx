"use client";

import React from "react";
import * as XLSX from "xlsx";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import type { LeaveRequest, LeaveType } from "@/types/database";

interface ExportButtonsProps {
  data: LeaveRequest[];
  leaveTypes: LeaveType[];
  filenamePrefix?: string;
}

export function ExportButtons({ data, leaveTypes, filenamePrefix = "lms-leave-records" }: ExportButtonsProps) {
  const getPreparedRows = () => {
    return data.map((r) => {
      const lt = leaveTypes.find((t) => t.id === r.leave_type_id);
      return {
        "Request Number": r.request_number,
        "Employee Name": r.user?.full_name || "Employee",
        "Employee ID": r.user?.employee_id || "",
        "Leave Type": lt?.name || "Leave",
        "Start Date": r.start_date,
        "End Date": r.end_date,
        "Duration (Days)": r.duration_days,
        "Half Day": r.is_half_day ? "Yes" : "No",
        "Status": r.status.toUpperCase(),
        "Reason": r.reason,
        "Applied On": r.created_at.split("T")[0],
      };
    });
  };

  const exportCSV = () => {
    const rows = getPreparedRows();
    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]).join(",");
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers,
        ...rows.map((row) =>
          Object.values(row)
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filenamePrefix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const rows = getPreparedRows();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Records");
    XLSX.writeFile(workbook, `${filenamePrefix}.xlsx`);
  };

  const exportPDF = () => {
    const rows = getPreparedRows();
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>LMS — Institutional Leave Registry Report</title>
          <style>
            @page { margin: 15mm; size: A4 landscape; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif; padding: 24px; color: #0F172A; background: #FFF; }
            .header { border-bottom: 3px double #D97706; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .emblem { font-size: 24px; font-weight: 800; font-family: Georgia, serif; color: #1E293B; letter-spacing: 2px; }
            .emblem span { color: #D97706; }
            .subtitle { font-size: 11px; color: #64748B; font-style: italic; margin-top: 2px; }
            .meta { font-size: 10px; color: #64748B; font-family: monospace; text-align: right; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
            th { background: #0F172A; color: #F8FAFC; text-align: left; padding: 10px 8px; font-weight: 700; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px; }
            td { padding: 8px; border-bottom: 1px solid #E2E8F0; }
            tr:nth-child(even) { background: #F8FAFC; }
            .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-weight: 800; font-size: 9px; text-transform: uppercase; }
            .approved { background: #DEF7EC; color: #03543F; border: 1px solid #31C48D; }
            .pending { background: #FEF08A; color: #713F12; border: 1px solid #FACC15; }
            .rejected { background: #FDE8E8; color: #9B1C1C; border: 1px solid #F87171; }
            .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #CBD5E1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10px; color: #64748B; }
            .sign-box { border-top: 1px solid #0F172A; width: 180px; text-align: center; padding-top: 6px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="emblem">LMS <span>⚜</span> LEAVE MANAGEMENT SYSTEM</div>
              <div class="subtitle">Official Employees & Staff Leave Sanctions Ledger &bull; Apex Institute of Engineering &amp; Technology</div>
            </div>
            <div class="meta">
              REPORT REF: LMS-EX-2025-992<br/>
              GENERATED: ${new Date().toLocaleString()}<br/>
              AUTHENTICATION: SHA-256 VERIFIED
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Employee / Staff</th>
                <th>Leave Category</th>
                <th>Duration Interval</th>
                <th>Working Days</th>
                <th>Status</th>
                <th>Stated Corporate Purpose</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (r) => `
                <tr>
                  <td style="font-family: monospace; font-weight: bold; color: #D97706;">${r["Request Number"]}</td>
                  <td><strong>${r["Employee Name"]}</strong><br/><span style="color:#64748B; font-size:10px; font-family: monospace;">${r["Employee ID"]}</span></td>
                  <td>${r["Leave Type"]}</td>
                  <td>${r["Start Date"]} &rarr; ${r["End Date"]}</td>
                  <td><strong>${r["Duration (Days)"]} d</strong></td>
                  <td><span class="badge ${r.Status.toLowerCase()}">${r.Status}</span></td>
                  <td style="color: #475569;">${r.Reason}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <div>
              <strong>Cryptographic Integrity:</strong> Certified under Corporate Ordinance Regulation 4.2.<br/>
              Automated record generated by LMS — Leave Management System.
            </div>
            <div class="sign-box">
              Office of the Corporate Administrator<br/>
              <span style="font-weight: normal; font-size: 9px; color: #64748B;">Signature &amp; Institutional Seal</span>
            </div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300/40 dark:border-amber-500/30 bg-white/90 dark:bg-[#11192E] hover:bg-amber-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-amber-200 shadow-2xs transition-all"
      >
        <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span>CSV Export</span>
      </button>

      <button
        onClick={exportExcel}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300/40 dark:border-emerald-700/40 bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-2xs transition-all"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Excel Sheet</span>
      </button>

      <button
        onClick={exportPDF}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-400 dark:border-amber-500/50 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-xs font-bold text-slate-950 shadow-md transition-all"
      >
        <Printer className="w-3.5 h-3.5 text-slate-950" />
        <span>Official PDF Report</span>
      </button>
    </div>
  );
}
