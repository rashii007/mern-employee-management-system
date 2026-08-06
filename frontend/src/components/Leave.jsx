import LeaveForm from "./LeaveForm";
import LeaveList from "./LeaveList";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

const Leave = () => {
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
              Leave Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Apply for leave and track your applications
            </p>
          </div>
        </div>

        {/* Leave Form Section */}
        <div className="mb-8">
          <LeaveForm />
        </div>

        {/* Leave List Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              My Leave Applications
            </h2>
          </div>
          <LeaveList />
        </div>
      </div>
    </div>
  );
};

export default Leave;
