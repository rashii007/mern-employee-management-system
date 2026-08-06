import { useState } from "react";
import { applyLeave } from "../utils/Leave";
import {
  Calendar,
  FileText,
  Send,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const res = await applyLeave(formData);

      setMessage(res.message || "Leave applied successfully");
      setMessageType("success");

      setFormData({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-2xl"></div>

        <div className="relative px-5 sm:px-6 pt-5 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md">
              <FileText size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Apply Leave
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Submit your leave request
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        {/* Message */}
        {message && (
          <div
            className={`
              p-3 sm:p-4 rounded-xl text-sm flex items-center gap-2
              animate-in slide-in-from-top-2 duration-300
              ${
                messageType === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400"
              }
            `}
          >
            {messageType === "success" ? (
              <CheckCircle size={18} className="flex-shrink-0" />
            ) : (
              <XCircle size={18} className="flex-shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Leave Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <FileText
              size={16}
              className="text-slate-500 dark:text-slate-400"
            />
            Leave Type <span className="text-red-500">*</span>
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="
              w-full px-4 py-3 rounded-xl
              border border-slate-200 dark:border-slate-700
              bg-slate-50 dark:bg-slate-800/60
              text-slate-800 dark:text-white
              focus:ring-2 focus:ring-accent focus:border-transparent
              outline-none transition-all duration-200
              appearance-none cursor-pointer
            "
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Sick">Sick Leave</option>
            <option value="Casual">Casual Leave</option>
            <option value="Annual">Annual Leave</option>
            <option value="Maternity">Maternity Leave</option>
            <option value="Paternity">Paternity Leave</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <Calendar
                size={16}
                className="text-slate-500 dark:text-slate-400"
              />
              From Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-xl
                border border-slate-200 dark:border-slate-700
                bg-slate-50 dark:bg-slate-800/60
                text-slate-800 dark:text-white
                focus:ring-2 focus:ring-accent focus:border-transparent
                outline-none transition-all duration-200
              "
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <Calendar
                size={16}
                className="text-slate-500 dark:text-slate-400"
              />
              To Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-xl
                border border-slate-200 dark:border-slate-700
                bg-slate-50 dark:bg-slate-800/60
                text-slate-800 dark:text-white
                focus:ring-2 focus:ring-accent focus:border-transparent
                outline-none transition-all duration-200
              "
              required
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <FileText
              size={16}
              className="text-slate-500 dark:text-slate-400"
            />
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            rows="4"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Explain your reason for leave..."
            className="
              w-full px-4 py-3 rounded-xl
              border border-slate-200 dark:border-slate-700
              bg-slate-50 dark:bg-slate-800/60
              text-slate-800 dark:text-white
              placeholder-slate-400 dark:placeholder-slate-500
              focus:ring-2 focus:ring-accent focus:border-transparent
              outline-none transition-all duration-200
              resize-none min-h-[100px]
            "
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            flex items-center justify-center gap-2
            bg-slate-900 hover:bg-slate-800
            dark:bg-white dark:hover:bg-gray-200
            text-white dark:text-slate-900
            py-3.5 rounded-xl
            font-semibold
            transition-all duration-300
            shadow-md hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-[0.98]
            relative overflow-hidden
            group
          "
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>

          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Submit Leave Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LeaveForm;
