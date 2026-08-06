import React from "react";
import {
  CalendarDays,
  FileText,
  Clock,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
} from "lucide-react";

const LeaveCard = ({ leave }) => {
  const statusStyle = {
    Approved: {
      badge:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      dot: "bg-green-500",
      icon: CheckCircle,
    },
    Rejected: {
      badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      dot: "bg-red-500",
      icon: XCircle,
    },
    Pending: {
      badge:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      dot: "bg-yellow-500",
      icon: ClockIcon,
    },
  };

  const status = statusStyle[leave.status] || statusStyle.Pending;
  const StatusIcon = status.icon;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
      {/* Top Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 dark:from-slate-600 dark:via-slate-400 dark:to-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-400" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {leave.leaveType} Leave
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Leave Request
              </p>
            </div>
          </div>

          <span
            className={`
              inline-flex items-center gap-1.5
              px-2.5 sm:px-3 py-1
              rounded-full
              text-[10px] sm:text-xs
              font-semibold
              whitespace-nowrap
              flex-shrink-0
              ${status.badge}
            `}
          >
            <StatusIcon size={12} />
            {leave.status}
          </span>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarDays
                size={14}
                className="text-slate-500 dark:text-slate-400"
              />
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                From
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              {new Date(leave.fromDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarDays
                size={14}
                className="text-slate-500 dark:text-slate-400"
              />
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                To
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              {new Date(leave.toDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Reason */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/50 dark:border-slate-700/50 mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <FileText
              size={14}
              className="text-slate-500 dark:text-slate-400"
            />
            <span className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Reason
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {leave.reason}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
          <Clock size={14} className="flex-shrink-0" />
          <span>
            Applied on{" "}
            {new Date(leave.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaveCard;
