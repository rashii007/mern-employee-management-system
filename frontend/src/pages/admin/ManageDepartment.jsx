import { Building2, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import DepartmentList from "../../components/DepartmentList";

const ManageDepartment = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Link
          to="/admin/creat-department"
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
              Manage Departments
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View, update and remove departments across your organization
            </p>
          </div>

          <Link
            to="/admin/create-department"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={18} />
            Create Department
          </Link>
        </div>

        {/* Department List */}
        <DepartmentList isAdmin={true} />
      </div>
    </div>
  );
};

export default ManageDepartment;
