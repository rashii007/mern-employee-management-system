import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDepartment, updateDepartment } from "../utils/DepartmentApi";
import {
  Building2,
  User,
  FileText,
  Hash,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  Layers,
} from "lucide-react";

const DepartmentForm = ({ onSuccess, initialData = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    manager: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Manager Options (Hardcoded)
  const managerOptions = [
    "HR Manager",
    "Senior HR Executive",
    "HR Business Partner",
    "Recruitment Manager",
    "HR Operations Manager",
    "Payroll Manager",
    "Learning & Development Manager",
    "Talent Acquisition Manager",
    "Employee Relations Manager",
    "Compensation & Benefits Manager",
    "Engineering Manager",
    "Senior Software Engineer",
    "Tech Lead",
    "Solution Architect",
    "DevOps Manager",
    "Marketing Manager",
    "Senior Marketing Executive",
    "Digital Marketing Manager",
    "Brand Manager",
    "Content Marketing Manager",
    "Sales Manager",
    "Senior Sales Executive",
    "Regional Sales Manager",
    "Account Manager",
    "Business Development Manager",
    "Finance Manager",
    "Senior Finance Executive",
    "Accounts Manager",
    "Financial Controller",
    "Chief Financial Officer",
    "Operations Manager",
    "Project Manager",
    "Product Manager",
    "IT Manager",
    "Legal Manager",
    "Customer Service Manager",
    "Supply Chain Manager",
    "Logistics Manager",
    "Quality Manager",
    "Facility Manager",
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        description: initialData.description || "",
        manager: initialData.manager || "",
        status: initialData.status || "Active",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (showSuccess) setShowSuccess(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (!formData.code.trim()) newErrors.code = "Department code is required";
    if (formData.code.length < 2)
      newErrors.code = "Code must be at least 2 characters";
    if (!formData.manager) newErrors.manager = "Please select a manager";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const submitData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        manager: formData.manager,
        status: formData.status,
      };

      let result;
      if (initialData) {
        result = await updateDepartment(initialData._id, submitData);
        setSuccessMessage("Department Updated Successfully!");
        setShowSuccess(true);
      } else {
        result = await createDepartment(submitData);
        setSuccessMessage("Department Created Successfully!");
        setShowSuccess(true);
        setFormData({
          name: "",
          code: "",
          description: "",
          manager: "",
          status: "Active",
        });
      }

      onSuccess && onSuccess();

      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to departments list
  const goToDepartments = () => {
    navigate("/admin/departments");
  };

  // Navigate back
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-2xl"></div>

        <div className="relative px-5 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={goBack}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-200 hover:scale-105"
                title="Go Back"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-600/20">
                {initialData ? (
                  <Building2 size={20} className="sm:w-[22px] sm:h-[22px]" />
                ) : (
                  <Sparkles size={20} className="sm:w-[22px] sm:h-[22px]" />
                )}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                  {initialData ? "Update Department" : "Create Department"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {initialData
                    ? "Edit department details"
                    : "Add a new department to your organization"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-5 sm:mx-6 mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/30 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500 text-white">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {successMessage}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400/70">
                  Department has been {initialData ? "updated" : "created"}{" "}
                  successfully
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowSuccess(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition"
              >
                Dismiss
              </button>
              <button
                onClick={goToDepartments}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-md"
              >
                View All Departments
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        {/* Department Name */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <Building2 size={16} className="text-blue-500 dark:text-blue-400" />
            Department Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Engineering, HR, Marketing"
              required
              className={`w-full pl-11 pr-4 py-3 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
                errors.name
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500"
                  : "border-slate-200 dark:border-slate-700 focus:ring-accent"
              }`}
            />
            <Building2
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
              <XCircle size={14} />
              {errors.name}
            </p>
          )}
        </div>

        {/* Department Code */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <Hash size={16} className="text-indigo-500 dark:text-indigo-400" />
            Department Code <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., ENG, HR, MKT"
              required
              className={`w-full pl-11 pr-4 py-3 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 uppercase ${
                errors.code
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500"
                  : "border-slate-200 dark:border-slate-700 focus:ring-accent"
              }`}
            />
            <Hash
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
          </div>
          {errors.code && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
              <XCircle size={14} />
              {errors.code}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <FileText
              size={16}
              className="text-purple-500 dark:text-purple-400"
            />
            Description
          </label>
          <div className="relative">
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter department description..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 resize-none min-h-[80px]"
            />
            <FileText
              size={18}
              className="absolute left-3.5 top-4 text-slate-400 dark:text-slate-500"
            />
          </div>
        </div>

        {/* Manager Selection */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <User
              size={16}
              className="text-emerald-500 dark:text-emerald-400"
            />
            Department Manager <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              required
              className={`w-full pl-11 pr-10 py-3 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 appearance-none cursor-pointer ${
                errors.manager
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500"
                  : "border-slate-200 dark:border-slate-700 focus:ring-accent"
              }`}
            >
              <option value="" className="text-slate-400 dark:text-slate-500">
                Select Manager
              </option>
              {managerOptions.map((manager) => (
                <option
                  key={manager}
                  value={manager}
                  className="text-slate-800 dark:text-white"
                >
                  {manager}
                </option>
              ))}
            </select>
            <User
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-slate-400 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
          {errors.manager && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
              <XCircle size={14} />
              {errors.manager}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <CheckCircle
              size={16}
              className="text-green-500 dark:text-green-400"
            />
            Status
          </label>
          <div className="relative">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
            >
              <option
                value="Active"
                className="text-emerald-600 dark:text-emerald-400"
              >
                Active
              </option>
              <option
                value="Inactive"
                className="text-rose-600 dark:text-rose-400"
              >
                Inactive
              </option>
            </select>
            <CheckCircle
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-slate-400 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            {formData.status === "Active"
              ? "Department is active and visible to all employees"
              : "Department is inactive and hidden from view"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 dark:from-white dark:to-gray-100 dark:hover:from-gray-100 dark:hover:to-gray-200 text-white dark:text-slate-900 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 dark:shadow-white/10 hover:shadow-xl hover:shadow-slate-900/30 dark:hover:shadow-white/20 active:scale-[0.98] overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>

            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>{initialData ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <>
                {initialData ? (
                  <>
                    <Building2 size={18} />
                    <span>Update Department</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Create Department</span>
                  </>
                )}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={goToDepartments}
            className="sm:flex-1 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Layers size={18} />
            View All Departments
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;
