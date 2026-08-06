import { useEffect, useState } from "react";
import { getDepartments, deleteDepartment } from "../utils/DepartmentApi";
import DepartmentCard from "../components/DepartmentCard";
import DepartmentForm from "../components/DepartmentForm";
import {
  Layers,
  Plus,
  Search,
  X,
  Building2,
  AlertCircle,
  Filter,
} from "lucide-react";

const DepartmentList = ({ isAdmin = false, refresh = false }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, [refresh]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await getDepartments();
      setDepartments(res.departments || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      setDepartments((prev) => prev.filter((item) => item._id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingDepartment(null);
  };

  // Filter departments
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || dept.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status counts
  const statusCounts = {
    All: departments.length,
    Active: departments.filter((d) => d.status === "Active").length,
    Inactive: departments.filter((d) => d.status === "Inactive").length,
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            LOADING DEPARTMENTS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              All Departments
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {departments.length} departments found
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setEditingDepartment(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden xs:inline">Add Department</span>
            <span className="xs:inline sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            placeholder="Search departments by name, code, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Active", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                filterStatus === status
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {status}
              {statusCounts[status] > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filterStatus === status
                      ? "bg-white/20 dark:bg-slate-900/20"
                      : "bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  {statusCounts[status]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Departments Grid */}
      {filteredDepartments.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Building2
                size={40}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                {searchTerm || filterStatus !== "All"
                  ? "No matching departments found"
                  : "No Departments Yet"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {searchTerm || filterStatus !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : isAdmin
                    ? "Start by creating your first department"
                    : "No departments available"}
              </p>
            </div>
            {(searchTerm || filterStatus !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("All");
                }}
                className="mt-2 text-accent hover:underline text-sm font-medium"
              >
                Clear filters
              </button>
            )}
            {!searchTerm && filterStatus === "All" && isAdmin && (
              <button
                onClick={() => {
                  setEditingDepartment(null);
                  setShowForm(true);
                }}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Plus size={16} />
                Create Department
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDepartments.map((department) => (
            <DepartmentCard
              key={department._id}
              department={department}
              isAdmin={isAdmin}
              onEdit={isAdmin ? handleEdit : null}
              onDelete={isAdmin ? (id) => setDeleteConfirm(id) : null}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteConfirm(null);
            }
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200/50 dark:border-slate-800/50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <AlertCircle
                  size={32}
                  className="text-red-600 dark:text-red-400"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Delete Department
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete this department? This action
                cannot be undone and will remove all associated data.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                  Delete Department
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isAdmin && showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="relative w-full max-w-2xl my-4 animate-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={closeModal}
              className="absolute -top-2 -right-2 sm:top-3 sm:right-3 z-20 w-9 h-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-110 transition-transform duration-200 flex items-center justify-center shadow-lg"
            >
              <X size={18} />
            </button>

            <DepartmentForm
              initialData={editingDepartment}
              onSuccess={() => {
                fetchDepartments();
                closeModal();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
