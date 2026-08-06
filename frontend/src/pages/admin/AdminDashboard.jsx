import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  LogOut,
  CalendarDays,
  Home,
  Building2,
  Users,
  Menu,
  X,
  FileText,
  LayoutDashboard,
  UserCog,
  Settings,
  Bell,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
} from "lucide-react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../utils/Employeeapi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EmployeeFormModal from "../../components/EmployeeFormModal";

const statusStyles = {
  active:
    "bg-[#E8F0E5] text-[#2F5233] dark:bg-green-900/30 dark:text-green-300",
  on_leave:
    "bg-[#FBF1DE] text-[#8A5A1E] dark:bg-yellow-900/30 dark:text-yellow-300",
  terminated:
    "bg-[#F7E9E5] text-[#9A3B2E] dark:bg-red-900/30 dark:text-red-300",
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);

    try {
      const data = await getEmployees();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error("Failed to load employees", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this employee? This cannot be undone.")) return;

    await deleteEmployee(id);
    fetchEmployees();
  };

  const handleSubmit = async (formData, id) => {
    if (id) {
      await updateEmployee(id, formData);
    } else {
      await createEmployee(formData);
    }

    fetchEmployees();
  };

  const filtered = employees.filter((emp) => {
    const q = search.toLowerCase();

    return (
      emp.user?.name?.toLowerCase().includes(q) ||
      emp.employeeId?.toLowerCase().includes(q) ||
      emp.department?.name?.toLowerCase().includes(q)
    );
  });

  // Navigation items with navigate
  const navItems = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      id: "attendance",
      icon: CalendarDays,
      label: "Attendance",
      onClick: () => navigate("/admin/attendance"),
    },
    {
      id: "departments",
      icon: Building2,
      label: "Departments",
      onClick: () => navigate("/admin/departments"),
    },
    {
      id: "leaves",
      icon: FileText,
      label: "Leaves",
      onClick: () => navigate("/admin/leaves"),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 backdrop-blur-lg shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                E
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                EMS<span className="text-accent">.</span>
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
                  Admin
                </span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 cursor-pointer
                    ${
                      window.location.pathname === item.id ||
                      (item.id === "employees" &&
                        window.location.pathname === "/admin/dashboard")
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }
                  `}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="hidden sm:flex p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu - Desktop */}
              <div className="hidden sm:flex items-center gap-3 relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                      {user?.role || "Admin"}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl py-1 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user?.email || "admin@example.com"}
                      </p>
                    </div>
                    <Link
                      to="/admin/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <UserCog size={16} />
                      Profile Settings
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <Home size={16} />
                      Visit Site
                    </Link>
                    <div className="border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button - Mobile Quick */}
              <button
                onClick={logout}
                className="hidden xs:flex sm:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <LogOut size={20} />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm px-4 py-4 space-y-3 transition-all duration-300">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {user?.name || "Admin"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      window.location.pathname === item.id ||
                      (item.id === "employees" &&
                        window.location.pathname === "/admin/dashboard")
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }
                  `}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1">
              <Link
                to="/admin/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
              >
                <UserCog size={20} />
                Profile Settings
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
              >
                <Home size={20} />
                Visit Site
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Employee Management
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage all employees in your organization
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Users
                  size={18}
                  className="text-slate-600 dark:text-slate-400"
                />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {employees.length}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Total
                </span>
              </div>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg active:scale-95"
              >
                <Plus size={18} />
                <span className="hidden xs:inline">Add Employee</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search employees by name, ID, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-9 pr-3 py-2.5 
              border border-slate-200 dark:border-slate-700
              rounded-xl 
              bg-white dark:bg-slate-900
              text-slate-900 dark:text-white
              placeholder-slate-400 dark:placeholder-slate-500
              outline-none
              focus:border-slate-400 dark:focus:border-slate-500
              focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700
              transition-all duration-200
              text-sm
            "
          />
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <div className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Loading employees...
                  </span>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <Users className="w-14 h-14 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  No employees found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {search
                    ? "Try adjusting your search"
                    : "Add your first employee"}
                </p>
              </div>
            ) : (
              filtered.map((emp) => (
                <div
                  key={emp._id}
                  className="px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                        {emp.user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {emp.user?.email}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          ID: {emp.employeeId}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {emp.department?.name || "N/A"}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {emp.position}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-2">
                      <span
                        className={`
                          px-2.5 py-1 
                          rounded-full 
                          text-[10px] 
                          font-medium
                          whitespace-nowrap
                          ${statusStyles[emp.status]}
                        `}
                      >
                        {emp.status.replace("_", " ")}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-3.5 font-medium">Employee</th>
                  <th className="px-6 py-3.5 font-medium">ID</th>
                  <th className="px-6 py-3.5 font-medium">Department</th>
                  <th className="px-6 py-3.5 font-medium">Position</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                  <th className="px-6 py-3.5 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading employees...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      <Users className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-medium">No employees found</p>
                      <p className="text-xs mt-1">
                        {search
                          ? "Try adjusting your search"
                          : "Add your first employee"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr
                      key={emp._id}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {emp.user?.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {emp.user?.email}
                        </p>
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        {emp.employeeId}
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">
                        {emp.department?.name || "N/A"}
                      </td>

                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">
                        {emp.position}
                      </td>

                      <td className="px-6 py-3.5">
                        <span
                          className={`
                            inline-block px-2.5 py-1 
                            rounded-full 
                            text-xs 
                            font-medium
                            ${statusStyles[emp.status]}
                          `}
                        >
                          {emp.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>
            Showing <span className="font-medium">{filtered.length}</span> of{" "}
            <span className="font-medium">{employees.length}</span> employees
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              {employees.filter((e) => e.status === "active").length} active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
              {employees.filter((e) => e.status === "on_leave").length} on leave
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
              {employees.filter((e) => e.status === "terminated").length}{" "}
              terminated
            </span>
          </div>
        </div>
      </main>

      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingEmployee}
      />
    </div>
  );
};

export default AdminDashboard;
