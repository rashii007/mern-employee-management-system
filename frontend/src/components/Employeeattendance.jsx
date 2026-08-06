import { useEffect, useState } from "react";
import {
  Clock,
  LogIn,
  LogOut,
  CheckCircle2,
  CalendarDays,
  History,
  ArrowLeft,
  User,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
  checkInApi,
  checkOutApi,
  getMyAttendanceApi,
} from "../utils/Attendanceapi";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
  present:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  absent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  leave:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "half-day":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function EmployeeAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const todayRecord = records.find((r) => r.date === today);

  const fetchRecords = async () => {
    try {
      const { data } = await getMyAttendanceApi();
      setRecords(data.records || data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setMessage("");
    setSuccessMessage("");

    try {
      await checkInApi();
      setSuccessMessage("✅ Check-in successful!");
      await fetchRecords();
    } catch (err) {
      setMessage(err.response?.data?.message || "Check In Failed");
    } finally {
      setActionLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setMessage("");
    setSuccessMessage("");

    try {
      await checkOutApi();
      setSuccessMessage("✅ Check-out successful!");
      await fetchRecords();
    } catch (err) {
      setMessage(err.response?.data?.message || "Check Out Failed");
    } finally {
      setActionLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // Get today's status
  const getTodayStatus = () => {
    if (!todayRecord)
      return { status: "Not Checked In", color: "text-slate-400" };
    if (todayRecord.checkIn && !todayRecord.checkOut)
      return { status: "Checked In", color: "text-yellow-500" };
    if (todayRecord.checkIn && todayRecord.checkOut)
      return { status: "Completed", color: "text-green-500" };
    return { status: "Not Checked In", color: "text-slate-400" };
  };

  const todayStatus = getTodayStatus();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 font-medium tracking-wide">
            LOADING ATTENDANCE...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
              <Clock className="w-7 h-7 text-accent" />
              My Attendance
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Check in, check out and view your attendance history
            </p>
          </div>
        </div>

        {/* Today's Status Card */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md">
                <CalendarDays size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Today's Status
                </p>
                <p className={`text-lg font-bold ${todayStatus.color}`}>
                  {todayStatus.status}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleCheckIn}
            disabled={actionLoading || todayRecord?.checkIn}
            className={`
              flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl
              font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95
              ${
                todayRecord?.checkIn
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <LogIn size={18} />
            {todayRecord?.checkIn ? "Checked In ✓" : "Check In"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={
              actionLoading || !todayRecord?.checkIn || todayRecord?.checkOut
            }
            className={`
              flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl
              font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95
              ${
                !todayRecord?.checkIn || todayRecord?.checkOut
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <LogOut size={18} />
            {todayRecord?.checkOut ? "Checked Out ✓" : "Check Out"}
          </button>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-4 p-3 sm:p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 text-sm flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <CheckCircle2 size={18} />
            {successMessage}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            {message}
          </div>
        )}

        {/* Today's Check-in/out Summary */}
        {todayRecord?.checkIn && todayRecord?.checkOut && (
          <div className="mb-4 p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 flex flex-col sm:flex-row sm:items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>Attendance completed for today.</span>
            </div>
            <span className="sm:ml-auto text-xs opacity-70">
              In:{" "}
              {new Date(todayRecord.checkIn).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {todayRecord.checkOut &&
                ` | Out: ${new Date(todayRecord.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
            </span>
          </div>
        )}

        {/* History Title */}
        <div className="flex items-center gap-2 mb-4">
          <History size={18} className="text-accent" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Attendance History
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
            {records.length} records
          </span>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <div className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Loading records...
                  </span>
                </div>
              </div>
            ) : records.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <Clock className="w-14 h-14 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  No attendance records found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Start by checking in today
                </p>
              </div>
            ) : (
              records.map((r) => (
                <div
                  key={r._id}
                  className="px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white text-sm">
                        {new Date(r.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          In:{" "}
                          {r.checkIn
                            ? new Date(r.checkIn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </span>
                        <span>
                          Out:{" "}
                          {r.checkOut
                            ? new Date(r.checkOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium capitalize whitespace-nowrap ${statusStyles[r.status]}`}
                    >
                      {r.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-3.5 font-medium">Date</th>
                  <th className="px-6 py-3.5 font-medium">Check In</th>
                  <th className="px-6 py-3.5 font-medium">Check Out</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading records...</span>
                      </div>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      <Clock className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-medium">No attendance records found</p>
                      <p className="text-xs mt-1">Start by checking in today</p>
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-slate-700 dark:text-slate-200 font-medium">
                        {new Date(r.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                        {r.checkIn
                          ? new Date(r.checkIn).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                        {r.checkOut
                          ? new Date(r.checkOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[r.status]}`}
                        >
                          {r.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>
            Showing <span className="font-medium">{records.length}</span>{" "}
            records
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              {records.filter((r) => r.status === "present").length} present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
              {records.filter((r) => r.status === "absent").length} absent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
              {records.filter((r) => r.status === "leave").length} leave
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
              {records.filter((r) => r.status === "half-day").length} half day
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
