import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  Users,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  LayoutList,
  X,
  Calendar,
  User,
  FileText,
  Clock,
  Save,
  Eye,
  Hash,
} from "lucide-react";
import {
  getDepartments,
  deleteDepartment,
  getDepartmentStats,
  updateDepartment,
} from "../../utils/DepartmentApi";

const AdminDepartments = ({ isAdmin = true }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ totalDepartments: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    code: "",
    description: "",
    manager: "",
    status: "Active",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  // Manager Options
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

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDepartments();
      console.log("✅ Departments fetched:", response);
      setDepartments(response.departments || []);
    } catch (error) {
      console.error("❌ Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getDepartmentStats();
      console.log("✅ Stats fetched:", response);
      setStats(response || { totalDepartments: 0 });
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchStats();
  }, [fetchDepartments, fetchStats]);

  const refreshData = () => {
    fetchDepartments();
    fetchStats();
  };

  const filteredDepartments = departments.filter((dept) => {
    const searchTerm = search.toLowerCase();
    return (
      dept.name?.toLowerCase().includes(searchTerm) ||
      dept.description?.toLowerCase().includes(searchTerm) ||
      dept.manager?.toLowerCase().includes(searchTerm) ||
      String(dept.code).toLowerCase().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDepartments = filteredDepartments.slice(startIndex, endIndex);

  const handleDelete = async () => {
    try {
      await deleteDepartment(selectedDepartment._id);
      setShowDeleteModal(false);
      setSelectedDepartment(null);
      refreshData();
    } catch (error) {
      console.error("❌ Error deleting department:", error);
    }
  };

  const handleViewDetails = (dept) => {
    setSelectedDepartment(dept);
    setShowViewModal(true);
  };

  const handleEditClick = (dept) => {
    if (!isAdmin) return;
    setSelectedDepartment(dept);
    setEditFormData({
      name: dept.name || "",
      code: dept.code || "",
      description: dept.description || "",
      manager: dept.manager || "",
      status: dept.status || "Active",
    });
    setEditErrors({});
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
    if (editErrors[name]) setEditErrors({ ...editErrors, [name]: "" });
  };

  const validateEdit = () => {
    const newErrors = {};
    if (!editFormData.name.trim())
      newErrors.name = "Department name is required";
    if (!editFormData.code) newErrors.code = "Department code is required";
    if (isNaN(Number(editFormData.code)))
      newErrors.code = "Code must be a number";
    if (editFormData.code.length < 2)
      newErrors.code = "Code must be at least 2 digits";
    if (!editFormData.manager) newErrors.manager = "Please select a manager";
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEdit()) return;

    try {
      setEditLoading(true);
      const submitData = {
        name: editFormData.name.trim(),
        code: Number(editFormData.code),
        description: editFormData.description.trim(),
        manager: editFormData.manager,
        status: editFormData.status,
      };

      await updateDepartment(selectedDepartment._id, submitData);
      setShowEditModal(false);
      setSelectedDepartment(null);
      refreshData();
      alert("Department Updated Successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Active:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      Inactive:
        "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400",
      active:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      inactive:
        "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400",
    };
    const color = statusMap[status] || statusMap.Active;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
        {status || "Active"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 font-medium tracking-wide">
            LOADING DEPARTMENTS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-3 sm:p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <Link
              to={isAdmin ? "/admin/dashboard" : "/employee/dashboard"}
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 mb-2 group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              Back to Dashboard
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
              Department Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isAdmin
                ? "Manage all departments in your organization"
                : "View all departments"}
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/admin/create-department"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden xs:inline">Add Department</span>
              <span className="xs:hidden">Add</span>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-md">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Total Departments
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.totalDepartments || departments.length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-md">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Active
            </p>
            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {
                departments.filter(
                  (d) => d.status === "Active" || d.status === "active",
                ).length
              }
            </p>
          </div>
          <div className="col-span-1 xs:col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-md">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Total Employees
            </p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {departments.reduce(
                (acc, dept) => acc + (dept.employeeCount || 0),
                0,
              )}
            </p>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search departments by name, code, description, manager..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-gray-200/50 dark:border-slate-800/50 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <LayoutList size={18} />
            </button>
          </div>
        </div>

        {/* View-only Banner for non-admin */}
        {!isAdmin && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Eye size={16} />
            <span>You are viewing departments in read-only mode.</span>
          </div>
        )}

        {/* Departments Grid/List */}
        {currentDepartments.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentDepartments.map((dept) => (
                <div
                  key={dept._id}
                  className="group bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 flex-shrink-0">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {dept.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Code: {dept.code} • {dept.employeeCount || 0}{" "}
                          employees
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => handleEditClick(dept)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDepartment(dept);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleViewDetails(dept)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {dept.description || "No description"}
                  </p>

                  <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(dept.status)}
                      {dept.manager && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px] sm:max-w-[150px]">
                          Manager: {dept.manager}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewDetails(dept)}
                      className="text-xs text-accent hover:underline font-medium whitespace-nowrap"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-3">
              {currentDepartments.map((dept) => (
                <div
                  key={dept._id}
                  className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 flex-shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {dept.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          Code: {dept.code} •{" "}
                          {dept.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-3">
                        {getStatusBadge(dept.status)}
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {dept.employeeCount || 0} employees
                        </span>
                        {dept.manager && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                            Manager: {dept.manager}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => handleEditClick(dept)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDepartment(dept);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleViewDetails(dept)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-gray-200/50 dark:border-slate-800/50">
            <Building2 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {search
                ? "No departments found matching your search"
                : "No departments yet"}
            </p>
            {!search && isAdmin && (
              <Link
                to="/admin/create-department"
                className="text-accent hover:underline text-sm mt-2 inline-block"
              >
                Create your first department
              </Link>
            )}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-accent hover:underline text-sm mt-2 inline-block"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200/50 dark:border-slate-800/50">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredDepartments.length)} of{" "}
              {filteredDepartments.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                      currentPage === i + 1
                        ? "bg-accent text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showViewModal && selectedDepartment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowViewModal(false);
                setSelectedDepartment(null);
              }
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200/50 dark:border-slate-800/50 animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="relative p-6 border-b border-gray-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedDepartment(null);
                  }}
                  className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedDepartment.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Code: {selectedDepartment.code || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status:
                  </span>
                  {getStatusBadge(selectedDepartment.status)}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <FileText
                      size={16}
                      className="text-blue-500 dark:text-blue-400"
                    />
                    Description
                  </h3>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedDepartment.description ||
                        "No description available"}
                    </p>
                  </div>
                </div>

                {/* Manager */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <User
                      size={16}
                      className="text-indigo-500 dark:text-indigo-400"
                    />
                    Department Manager
                  </h3>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedDepartment.manager || "Not Assigned"}
                    </p>
                  </div>
                </div>

                {/* Employee Count */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <Users
                      size={16}
                      className="text-emerald-500 dark:text-emerald-400"
                    />
                    Employee Count
                  </h3>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedDepartment.employeeCount || 0} employees
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar size={14} />
                      <span>Created</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {selectedDepartment.createdAt
                        ? new Date(
                            selectedDepartment.createdAt,
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={14} />
                      <span>Last Updated</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {selectedDepartment.updatedAt
                        ? new Date(
                            selectedDepartment.updatedAt,
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer - Only Close Button */}
              <div className="p-6 border-t border-gray-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedDepartment(null);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal - Only for Admin */}
        {isAdmin && showEditModal && selectedDepartment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowEditModal(false);
                setSelectedDepartment(null);
              }
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200/50 dark:border-slate-800/50 animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="relative p-6 border-b border-gray-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDepartment(null);
                  }}
                  className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                    <Edit size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Edit Department
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Update department details
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body - Form */}
              <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                {/* Department Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    <Building2
                      size={16}
                      className="text-blue-500 dark:text-blue-400"
                    />
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    placeholder="e.g., Engineering, HR, Marketing"
                    required
                    className={`w-full px-4 py-3 rounded-xl border dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
                      editErrors.name
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-200 dark:border-slate-700"
                    }`}
                  />
                  {editErrors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {editErrors.name}
                    </p>
                  )}
                </div>

                {/* Department Code - Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    <Hash
                      size={16}
                      className="text-indigo-500 dark:text-indigo-400"
                    />
                    Department Code (Number){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="code"
                    value={editFormData.code}
                    onChange={handleEditChange}
                    placeholder="e.g., 101, 102, 103"
                    required
                    className={`w-full px-4 py-3 rounded-xl border dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
                      editErrors.code
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-200 dark:border-slate-700"
                    }`}
                  />
                  {editErrors.code && (
                    <p className="mt-1 text-sm text-red-500">
                      {editErrors.code}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Enter a numeric code for the department
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    <FileText
                      size={16}
                      className="text-purple-500 dark:text-purple-400"
                    />
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    placeholder="Enter department description..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 resize-none min-h-[80px]"
                  />
                </div>

                {/* Manager Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    <User
                      size={16}
                      className="text-emerald-500 dark:text-emerald-400"
                    />
                    Department Manager <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="manager"
                    value={editFormData.manager}
                    onChange={handleEditChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 appearance-none cursor-pointer ${
                      editErrors.manager
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-200 dark:border-slate-700"
                    }`}
                  >
                    <option value="">Select Manager</option>
                    {managerOptions.map((manager) => (
                      <option key={manager} value={manager}>
                        {manager}
                      </option>
                    ))}
                  </select>
                  {editErrors.manager && (
                    <p className="mt-1 text-sm text-red-500">
                      {editErrors.manager}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    <span className="text-green-500 dark:text-green-400">
                      ●
                    </span>
                    Status
                  </label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-xl active:scale-[0.98]"
                  >
                    {editLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Update Department
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedDepartment(null);
                    }}
                    className="sm:flex-1 py-3.5 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal - Only for Admin */}
        {isAdmin && showDeleteModal && selectedDepartment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDeleteModal(false);
                setSelectedDepartment(null);
              }
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200/50 dark:border-slate-800/50 animate-in slide-in-from-bottom-4 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Delete Department
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedDepartment.name}
                </span>
                ? This will remove this department from all employees and cannot
                be undone.
              </p>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDepartment(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow-md hover:shadow-lg active:scale-95"
                >
                  Delete Department
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDepartments;
