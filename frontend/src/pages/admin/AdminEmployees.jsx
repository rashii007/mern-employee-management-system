import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  User,
  Mail,
  Building2,
  Briefcase,
  Phone,
  DollarSign,
} from "lucide-react";
import {
  getEmployees,
  deleteEmployee,
  getEmployeeStats,
  updateEmployee,
  createEmployee,
} from "../../utils/Employeeapi";
import EmployeeFormModal from "../../components/EmployeeFormModal";

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, onLeave: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    phone: "",
    salary: "",
    status: "",
  });
  const [updating, setUpdating] = useState(false);

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
    fetchStats();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      setEmployees(response.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getEmployeeStats();
      setStats(response.stats || { total: 0, active: 0, onLeave: 0 });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Search filter
  const filteredEmployees = employees.filter((emp) => {
    const searchTerm = search.toLowerCase();
    return (
      emp.user?.name?.toLowerCase().includes(searchTerm) ||
      emp.user?.email?.toLowerCase().includes(searchTerm) ||
      emp.employeeId?.toLowerCase().includes(searchTerm) ||
      emp.department?.name?.toLowerCase().includes(searchTerm) ||
      emp.position?.toLowerCase().includes(searchTerm)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Delete employee
  const handleDelete = async () => {
    try {
      await deleteEmployee(selectedEmployee._id);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
      fetchStats();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // ✅ Open Edit Modal
  const openEditModal = (emp) => {
    console.log("📝 Opening edit modal for:", emp); // ✅ Debug log
    setSelectedEmployee(emp);
    setEditFormData({
      name: emp.user?.name || "",
      email: emp.user?.email || "",
      department: emp.department || "",
      position: emp.position || "",
      phone: emp.phone || "",
      salary: emp.salary || "",
      status: emp.employeeStatus || emp.status || "active", // ✅ Dono check karo
    });
    setShowEditModal(true);
  };

  // ✅ Handle Edit Form Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // ✅ Update employee - FIXED
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("🔄 Updating employee...");
    console.log("📝 Form Data:", editFormData);

    try {
      setUpdating(true);

      // ✅ Status mapping
      const statusMapping = {
        active: "active",
        onLeave: "on_leave",
        on_leave: "on_leave",
        inactive: "inactive",
        terminated: "terminated",
      };

      const updateData = {
        name: editFormData.name,
        email: editFormData.email,
        department: editFormData.department,
        position: editFormData.position,
        phone: editFormData.phone || "",
        salary: Number(editFormData.salary) || 0,
        status: statusMapping[editFormData.status] || editFormData.status,
      };

      console.log("📤 Sending update data:", updateData);
      await updateEmployee(selectedEmployee._id, updateData);

      setShowEditModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
      fetchStats();
      alert("✅ Employee updated successfully!");
    } catch (error) {
      console.error("❌ Error updating employee:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Handle Create Employee
  const handleCreateEmployee = async (formData) => {
    try {
      await createEmployee(formData);
      fetchEmployees();
      fetchStats();
      alert("✅ Employee created successfully!");
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      active: {
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
        label: "Active",
      },
      onLeave: {
        color:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
        label: "On Leave",
      },
      on_leave: {
        color:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
        label: "On Leave",
      },
      inactive: {
        color:
          "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400",
        label: "Inactive",
      },
      terminated: {
        color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
        label: "Terminated",
      },
    };
    const defaultStatus = {
      color: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400",
      label: status || "Unknown",
    };
    const statusInfo = statusMap[status] || defaultStatus;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Loading employees...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition mb-2"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-7 h-7 text-accent" />
              Employee Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage all employees in your organization
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-all duration-300 text-sm font-semibold shadow-md whitespace-nowrap"
          >
            <Plus size={18} />
            Add Employee
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200/50 dark:border-slate-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Employees
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total || employees.length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200/50 dark:border-slate-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.active || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200/50 dark:border-slate-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">On Leave</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.onLeave || 0}
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email, ID, department..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition whitespace-nowrap">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Employees Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200/50 dark:border-slate-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Employee ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-slate-800/50">
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm">
                            {emp.user?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {emp.user?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] sm:max-w-[200px]">
                              {emp.user?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                        {emp.employeeId || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        {emp.department?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                        {emp.position || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(emp.status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => openEditModal(emp)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <Users className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        {search
                          ? "No employees found matching your search"
                          : "No employees yet"}
                      </p>
                      {!search && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="text-accent hover:underline text-sm mt-2 inline-block"
                        >
                          Add your first employee
                        </button>
                      )}
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="text-accent hover:underline text-sm mt-2 inline-block"
                        >
                          Clear search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200/50 dark:border-slate-800/50">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredEmployees.length)} of{" "}
                {filteredEmployees.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={18} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      currentPage === i + 1
                        ? "bg-accent text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
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
        </div>

        {/* ===== CREATE EMPLOYEE MODAL ===== */}
        <EmployeeFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateEmployee}
          initialData={null}
        />

        {/* ===== EDIT MODAL ===== */}
        {showEditModal && selectedEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50 dark:border-slate-800/50">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Edit className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Edit Employee
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* ✅ FIXED: Form with onSubmit */}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        name="department"
                        value={editFormData.department}
                        onChange={handleEditChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        name="position"
                        value={editFormData.position}
                        onChange={handleEditChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Salary <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="number"
                        name="salary"
                        value={editFormData.salary}
                        onChange={handleEditChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="onLeave">On Leave</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>

                {/* ✅ Buttons - Fixed */}
                <div className="flex gap-3 pt-4 border-t border-gray-200/50 dark:border-slate-800/50">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                  >
                    {updating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit size={18} />
                        Update Employee
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedEmployee(null);
                    }}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== DELETE MODAL ===== */}
        {showDeleteModal && selectedEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200/50 dark:border-slate-800/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Delete Employee
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedEmployee.user?.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmployees;
