import { useEffect, useState } from "react";
import {
  CalendarDays,
  Filter,
  ArrowLeft,
  Search,
  User,
  Clock,
} from "lucide-react";
import {
  getAllAttendanceApi,
  updateAttendanceStatusApi,
} from "../utils/Attendanceapi";
import { Link, useNavigate } from "react-router-dom";

const statusOptions = ["present", "absent", "leave", "half-day"];

const statusStyles = {
  present:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  absent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  leave:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "half-day":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchRecords = async (date) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getAllAttendanceApi(date);
      setRecords(data.records || data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchRecords(dateFilter);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateAttendanceStatusApi(id, status);

      setRecords((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  // Filter records by search
  const filteredRecords = records.filter((r) => {
    const search = searchTerm.toLowerCase();
    return (
      r.employee?.name?.toLowerCase().includes(search) ||
      r.employee?.email?.toLowerCase().includes(search) ||
      r.date?.includes(search)
    );
  });

  // Get stats
  const stats = {
    total: records.length,
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    leave: records.filter((r) => r.status === "leave").length,
    halfDay: records.filter((r) => r.status === "half-day").length,
  };

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
              <CalendarDays className="w-7 h-7 text-accent" />
              Attendance Records
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage and monitor employee attendance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
              <User size={16} className="text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {records.length} Records
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Present
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
              {stats.present}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">Absent</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
              {stats.absent}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">Leave</p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
              {stats.leave}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Half Day
            </p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400 mt-1">
              {stats.halfDay}
            </p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleFilter} className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-xs">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="
                  w-full pl-9 pr-3 py-2.5 
                  border border-slate-200 dark:border-slate-700
                  rounded-xl 
                  bg-white dark:bg-slate-900
                  text-slate-900 dark:text-white
                  outline-none
                  focus:ring-2 focus:ring-accent focus:border-transparent
                  transition-all duration-200
                  text-sm
                "
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              <Filter size={16} />
              Filter
            </button>

            {dateFilter && (
              <button
                type="button"
                onClick={() => {
                  setDateFilter("");
                  fetchRecords();
                }}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                Clear
              </button>
            )}
          </form>

          <div className="relative flex-1 max-w-xs sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full pl-9 pr-3 py-2.5 
                border border-slate-200 dark:border-slate-700
                rounded-xl 
                bg-white dark:bg-slate-900
                text-slate-900 dark:text-white
                placeholder-slate-400 dark:placeholder-slate-500
                outline-none
                focus:ring-2 focus:ring-accent focus:border-transparent
                transition-all duration-200
                text-sm
              "
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-slate-200 dark:divide-slate-800">
            {filteredRecords.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <CalendarDays className="w-14 h-14 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  No attendance records found
                </p>
              </div>
            ) : (
              filteredRecords.map((r) => (
                <div
                  key={r._id}
                  className="px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {r.employee?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {r.employee?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>{r.date}</span>
                        <span>•</span>
                        <span>
                          {r.checkIn
                            ? new Date(r.checkIn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </span>
                        <span>→</span>
                        <span>
                          {r.checkOut
                            ? new Date(r.checkOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleStatusChange(r._id, e.target.value)
                        }
                        className={`
                          px-2.5 py-1
                          rounded-full
                          text-[10px]
                          font-semibold
                          capitalize
                          outline-none
                          cursor-pointer
                          border-none
                          ${statusStyles[r.status]}
                        `}
                      >
                        {statusOptions.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="text-slate-800 dark:text-white"
                          >
                            {s.replace("-", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-3.5 font-medium">Employee</th>
                  <th className="px-6 py-3.5 font-medium">Date</th>
                  <th className="px-6 py-3.5 font-medium">Check In</th>
                  <th className="px-6 py-3.5 font-medium">Check Out</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      <CalendarDays className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-medium">No attendance records found</p>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {r.employee?.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {r.employee?.email}
                        </p>
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                        {new Date(r.date).toLocaleDateString("en-US", {
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
                        <select
                          value={r.status}
                          onChange={(e) =>
                            handleStatusChange(r._id, e.target.value)
                          }
                          className={`
                            px-3 py-1
                            rounded-full
                            text-xs
                            font-semibold
                            capitalize
                            outline-none
                            cursor-pointer
                            border-none
                            ${statusStyles[r.status]}
                            focus:ring-2 focus:ring-accent
                          `}
                        >
                          {statusOptions.map((s) => (
                            <option
                              key={s}
                              value={s}
                              className="text-slate-800 dark:text-white"
                            >
                              {s.replace("-", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        {filteredRecords.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <p>
              Showing{" "}
              <span className="font-medium">{filteredRecords.length}</span> of{" "}
              <span className="font-medium">{records.length}</span> records
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                {stats.present} present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                {stats.absent} absent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                {stats.leave} leave
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                {stats.halfDay} half day
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
