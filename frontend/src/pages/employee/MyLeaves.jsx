import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyLeaves } from "../../utils/Leave";
import {
  CalendarDays,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await getMyLeaves();
      setLeaves(res.leaves || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
          to="/employee/dashboard"
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
              My Leaves
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track your leave applications and approval status
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
              <CalendarDays
                size={16}
                className="text-slate-600 dark:text-slate-400"
              />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                Total: {leaves.length}
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

        {/* Leaves Table */}
        {leaves.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <FileText className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No leave applications found
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Apply for leave from your dashboard
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-slate-200 dark:divide-slate-800">
              {leaves.map((leave) => (
                <div
                  key={leave._id}
                  className="px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {leave.leaveType}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          {new Date(leave.fromDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                        <span>→</span>
                        <span>
                          {new Date(leave.toDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {leave.reason}
                      </p>
                    </div>
                    <div className="ml-2">{getStatusBadge(leave.status)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="px-6 py-3.5 font-medium">Type</th>
                    <th className="px-6 py-3.5 font-medium">From</th>
                    <th className="px-6 py-3.5 font-medium">To</th>
                    <th className="px-6 py-3.5 font-medium">Reason</th>
                    <th className="px-6 py-3.5 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr
                      key={leave._id}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {leave.leaveType}
                        </p>
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                        {new Date(leave.fromDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                        {new Date(leave.toDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                        {leave.reason}
                      </td>

                      <td className="px-6 py-3.5">
                        {getStatusBadge(leave.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {leaves.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <p>
              Showing <span className="font-medium">{leaves.length}</span> leave
              applications
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

export default MyLeaves;
