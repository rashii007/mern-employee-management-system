import { useEffect, useState } from "react";
import { getAllLeaves, approveLeave, rejectLeave } from "../../utils/Leave";
import {
  CheckCircle,
  XCircle,
  CalendarDays,
  User,
  FileText,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await getAllLeaves();
      setLeaves(res.leaves || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveLeave(id);
      fetchLeaves();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectLeave(id);
      fetchLeaves();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      Approved: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: CheckCircle,
      },
      Rejected: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: XCircle,
      },
      Pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: Clock,
      },
    };
    const config = statusMap[status] || statusMap.Pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon size={12} />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 font-medium tracking-wide">
            LOADING LEAVES...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200 mb-4 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-7 h-7 text-accent" />
              Leave Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review employee leave requests and take action
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
              <FileText
                size={16}
                className="text-slate-600 dark:text-slate-400"
              />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {leaves.length} Requests
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {leaves.length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pending
            </p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
              {leaves.filter((l) => l.status === "Pending").length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Approved
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
              {leaves.filter((l) => l.status === "Approved").length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rejected
            </p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
              {leaves.filter((l) => l.status === "Rejected").length}
            </p>
          </div>
        </div>

        {/* Leaves Grid */}
        {leaves.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <FileText className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No leave requests found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {leaves.map((leave) => (
              <div
                key={leave._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-4 sm:p-5">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="min-w-0">
                      <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                          <User
                            size={16}
                            className="text-slate-600 dark:text-slate-400"
                          />
                        </div>
                        <span className="truncate">
                          {leave.employee?.name || "Employee"}
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-10">
                        Employee Leave Request
                      </p>
                    </div>

                    {getStatusBadge(leave.status)}
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <p className="flex items-center gap-2">
                      <FileText
                        size={16}
                        className="text-slate-400 dark:text-slate-500 flex-shrink-0"
                      />
                      <span className="font-medium">Type:</span>
                      <span>{leave.leaveType}</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays
                        size={16}
                        className="text-slate-400 dark:text-slate-500 flex-shrink-0"
                      />
                      <span className="font-medium">From:</span>
                      <span>
                        {new Date(leave.fromDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays
                        size={16}
                        className="text-slate-400 dark:text-slate-500 flex-shrink-0"
                      />
                      <span className="font-medium">To:</span>
                      <span>
                        {new Date(leave.toDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </p>

                    <p className="flex items-start gap-2">
                      <FileText
                        size={16}
                        className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5"
                      />
                      <span className="font-medium">Reason:</span>
                      <span className="break-words">{leave.reason}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  {leave.status === "Pending" && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => handleApprove(leave._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                      >
                        <CheckCircle size={17} />
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(leave._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-semibold transition-all duration-300 active:scale-95"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {leaves.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <p>
              Showing <span className="font-medium">{leaves.length}</span> leave
              requests
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                {leaves.filter((l) => l.status === "Pending").length} pending
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                {leaves.filter((l) => l.status === "Approved").length} approved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                {leaves.filter((l) => l.status === "Rejected").length} rejected
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;
