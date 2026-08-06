import { Building2 } from "lucide-react";
import DepartmentForm from "../../components/DepartmentForm";

const CreateDepartment = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Building2 size={38} className="text-blue-600 dark:text-blue-400" />

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Create Department
            </h1>
          </div>

          <p className="text-slate-600 dark:text-slate-400">
            Add a new department and assign a manager to organize your company
            structure.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-6 transition-colors">
          <DepartmentForm />
        </div>
      </div>
    </div>
  );
};

export default CreateDepartment;
