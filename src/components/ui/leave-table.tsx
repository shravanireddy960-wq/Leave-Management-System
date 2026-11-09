"use client";

import React, { useState } from "react";
import type { LeaveRequest, LeaveType } from "@/types/database";
import { StatusBadge } from "./status-badge";
import { formatDate, formatDuration } from "@/lib/utils";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  ArrowUpDown,
  X,
  FileCheck2,
} from "lucide-react";

interface LeaveTableProps {
  requests: LeaveRequest[];
  leaveTypes: LeaveType[];
  showEmployeeColumn?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  onView?: (request: LeaveRequest) => void;
}

export function LeaveTable({
  requests,
  leaveTypes,
  showEmployeeColumn = false,
  onApprove,
  onReject,
  onCancel,
  onView,
}: LeaveTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter requests
  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.request_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (showEmployeeColumn && r.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesType = typeFilter === "all" || r.leave_type_id === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getLeaveType = (typeId: string) => leaveTypes.find((lt) => lt.id === typeId);

  return (
    <div className="bg-white rounded-3xl border border-[#E9DFD0] shadow-[0_4px_20px_-4px_rgba(16,28,53,0.06)] overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E9DFD0] flex flex-wrap gap-3 items-center justify-between bg-[#FAF7F2]/50">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, applicant, or reason..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#E9DFD0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] placeholder:text-slate-400 shadow-2xs font-sans transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 text-xs bg-white border border-[#E9DFD0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] font-sans shadow-2xs transition-all cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 text-xs bg-white border border-[#E9DFD0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C5A46D]/50 text-[#101C35] font-sans shadow-2xs transition-all cursor-pointer"
          >
            <option value="all">All Leave Types</option>
            {leaveTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>
                {lt.name} ({lt.code})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[#101C35]/60 font-medium font-sans">
          Showing <span className="font-bold text-[#101C35]">{filtered.length}</span> {filtered.length === 1 ? "record" : "records"}
        </div>
      </div>

      {/* Table with smooth mobile horizontal scroll */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[680px] text-left text-xs">
          <thead className="bg-[#F8F5EF] text-[#101C35] font-serif font-bold border-b border-[#E9DFD0] uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-5">Request ID</th>
              {showEmployeeColumn && <th className="py-3.5 px-5">Employee</th>}
              <th className="py-3.5 px-5">Leave Type</th>
              <th className="py-3.5 px-5">Duration</th>
              <th className="py-3.5 px-5">Period</th>
              <th className="py-3.5 px-5">Applied On</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DFD0]/60 text-slate-700 font-sans">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={showEmployeeColumn ? 8 : 7} className="py-14 text-center text-slate-400 bg-white">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF5EB] text-[#C5A46D] flex items-center justify-center mx-auto mb-3 border border-[#E9DFD0]">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-sm text-[#101C35] font-serif">
                    No leave requests found
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try adjusting your filters or search keywords above.
                  </p>
                </td>
              </tr>
            ) : (
              paginated.map((req) => {
                const lt = getLeaveType(req.leave_type_id);

                return (
                  <tr
                    key={req.id}
                    className="hover:bg-[#FAF7F2]/70 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-5 font-mono font-bold text-[#101C35]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
                        <span>{req.request_number}</span>
                      </div>
                    </td>

                    {/* Employee (if manager/admin view) */}
                    {showEmployeeColumn && (
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#101C35] text-[#DCC49B] flex items-center justify-center text-xs font-bold ring-2 ring-[#E9DFD0]">
                            {req.user?.full_name ? req.user.full_name[0] : "E"}
                          </div>
                          <div>
                            <p className="font-bold text-[#101C35] leading-tight font-serif">
                              {req.user?.full_name || "Corporate Employee"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {req.user?.employee_id || "EMP"}
                            </p>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Leave Type */}
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-2 font-medium text-[#101C35]">
                        <span
                          className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-2xs"
                          style={{ backgroundColor: lt?.color || "#C5A46D" }}
                        />
                        {lt?.name || "Leave"}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-5 font-bold text-[#101C35]">
                      {formatDuration(req.duration_days)}
                    </td>

                    {/* Period */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col text-[#101C35]">
                        <span className="font-medium">{formatDate(req.start_date, "MMM dd, yyyy")}</span>
                        {req.start_date !== req.end_date && (
                          <span className="text-slate-400 text-[11px]">
                            to {formatDate(req.end_date, "MMM dd, yyyy")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">
                      {formatDate(req.created_at, "MMM dd, yyyy")}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5">
                      <StatusBadge status={req.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onView && (
                          <button
                            onClick={() => onView(req)}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-[#101C35] hover:bg-[#FAF5EB] border border-transparent hover:border-[#E9DFD0] transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {onApprove && req.status === "pending" && (
                          <button
                            onClick={() => onApprove(req.id)}
                            className="p-1.5 rounded-xl text-[#2C6244] bg-[#EAF3ED] border border-[#BDDEC8] hover:bg-[#BDDEC8] transition-all"
                            title="Approve Request"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {onReject && req.status === "pending" && (
                          <button
                            onClick={() => onReject(req.id)}
                            className="p-1.5 rounded-xl text-[#9E3E3E] bg-[#FDF0F0] border border-[#F2C5C5] hover:bg-[#F2C5C5] transition-all"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        {onCancel && (req.status === "pending" || req.status === "approved") && (
                          <button
                            onClick={() => onCancel(req.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3.5 sm:p-4 border-t border-[#E9DFD0] flex items-center justify-between text-xs text-slate-600 bg-[#FAF7F2]/50 font-sans">
          <span>
            Page <span className="font-bold text-[#101C35]">{currentPage}</span> of <span className="font-bold text-[#101C35]">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-[#E9DFD0] bg-white text-[#101C35] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF5EB] transition-colors shadow-2xs font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-[#E9DFD0] bg-white text-[#101C35] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF5EB] transition-colors shadow-2xs font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
