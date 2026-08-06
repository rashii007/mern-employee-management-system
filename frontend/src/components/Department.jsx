import { useState } from "react";
import { Building2, Plus, Users, Layers, Sparkles } from "lucide-react";
import DepartmentForm from "../components/DepartmentForm";
import DepartmentList from "../components/DepartmentList";
import { useAuth } from "../context/AuthContext";

const Department = () => {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
    setShowForm(false);
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden transition-colors duration-300">
          {/* Header Section with Gradient */}
          <div className="relative overflow-hidden">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-2xl"></div>

            <div className="relative px-4 sm:px-6 py-6 sm:py-8 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-600/20">
                      <Building2
                        size={22}
                        className="sm:w-[26px] sm:h-[26px]"
                      />
                    </div>

                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-white tracking-tight">
                        Department Management
                      </h1>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                        Manage company departments efficiently
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Role Badge */}
                  <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/30">
                    <div
                      className={`w-2 h-2 rounded-full ${isAdmin ? "bg-green-500" : "bg-blue-500"} animate-pulse`}
                    ></div>
                    <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400">
                      {isAdmin ? "Admin Access" : "View Only"}
                    </span>
                  </div>

                  {/* Mobile Role Badge */}
                  <div className="sm:hidden px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <span
                      className={`text-xs font-semibold ${isAdmin ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}
                    >
                      {isAdmin ? "Admin" : "View Only"}
                    </span>
                  </div>

                  {/* Add Department Button - Mobile */}
                  {isAdmin && (
                    <button
                      onClick={() => setShowForm(!showForm)}
                      className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-gray-100 text-white dark:text-slate-900 hover:shadow-lg transition-all duration-300 text-sm font-semibold active:scale-95"
                    >
                      <Plus size={18} />
                      <span>{showForm ? "Close" : "Add"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Total
                  </p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
                    12
                  </p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Active
                  </p>
                  <p className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400">
                    8
                  </p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Employees
                  </p>
                  <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
                    45
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Form Section */}
              {isAdmin && (
                <div className="lg:col-span-1">
                  {/* Desktop Form - Always visible on large screens */}
                  <div className="hidden lg:block">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          <Plus size={16} />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                          Add Department
                        </h2>
                      </div>
                      <DepartmentForm onSuccess={handleRefresh} />
                    </div>
                  </div>

                  {/* Mobile/Tablet Form - Toggleable */}
                  <div className="lg:hidden">
                    {showForm && (
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm animate-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                              <Plus size={16} />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                              Add Department
                            </h2>
                          </div>
                          <button
                            onClick={() => setShowForm(false)}
                            className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition"
                          >
                            ✕
                          </button>
                        </div>
                        <DepartmentForm onSuccess={handleRefresh} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* List Section */}
              <div
                className={`${isAdmin ? "lg:col-span-2" : "lg:col-span-3"} space-y-4`}
              >
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <Layers size={16} />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                        Departments
                      </h2>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {refresh ? "Updated" : "Live"}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Sparkles
                          size={14}
                          className="text-blue-500 dark:text-blue-400"
                        />
                        <span>Manage departments below</span>
                      </div>
                    )}
                  </div>

                  <DepartmentList refresh={refresh} isAdmin={isAdmin} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
