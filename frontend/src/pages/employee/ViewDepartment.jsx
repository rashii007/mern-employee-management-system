import { Building2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import DepartmentList from "../../components/DepartmentList";

const ViewDepartment = () => {
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
              <Building2 className="w-7 h-7 text-accent" />
              Departments
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Browse all departments and view their details
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
              <Building2
                size={16}
                className="text-slate-600 dark:text-slate-400"
              />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                View Only
              </span>
            </div>
          </div>
        </div>

        {/* Department List */}
        <DepartmentList isAdmin={false} />
      </div>
    </div>
  );
};

export default ViewDepartment;
