import { useState, useEffect } from "react";
import {
  LogOut,
  Briefcase,
  Building2,
  Phone,
  Calendar,
  DollarSign,
  CalendarDays,
  Home,
  FileCheck,
  ArrowRight,
  User,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  UserCog,
  Bell,
  Clock,
  Mail,
  MapPin,
  Hash,
  FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProfile } from "../../utils/Employeeapi";
import { useAuth } from "../../context/AuthContext";

const statusStyles = {
  active:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  on_leave:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  terminated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Properly extract display values with fallbacks
  const displayName =
    profile?.user?.name || profile?.name || user?.name || "Employee";
  const displayEmail = profile?.user?.email || user?.email || "—";
  const displayStatus = profile?.status
    ? profile.status.replace(/_/g, " ")
    : "active";
  const displayJoiningDate = profile?.joiningDate
    ? new Date(profile.joiningDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";
  const displaySalary =
    typeof profile?.salary === "number"
      ? `$${profile.salary.toLocaleString()}`
      : "—";
  const displayDepartment =
    profile?.department?.name || profile?.department || "—";
  const displayPosition = profile?.position || "—";
  const displayPhone = profile?.phone || "—";
  const displayEmployeeId = profile?.employeeId || "—";

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      console.log("Profile:", data);
      setProfile(data);
    } catch (err) {
      console.log("Profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Navigation items
  const navItems = [
    { to: "/employee/attendance", icon: Clock, label: "Attendance" },
    { to: "/employee/departments", icon: Building2, label: "Departments" },
    { to: "/employee/apply-leave", icon: FileText, label: "Leave Management" },
    { to: "/employee/myleave", icon: FileCheck, label: "My Leaves" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 font-medium tracking-wide">
            LOADING PROFILE...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 backdrop-blur-lg shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/employee/dashboard"
              className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                E
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                EMS<span className="text-accent">.</span>
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
                  Employee
                </span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      window.location.pathname === item.to
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }
                  `}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
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
                    {displayName?.charAt(0).toUpperCase() || "E"}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {displayName}
                    </p>
                    <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                      {user?.role || "Employee"}
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
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {displayEmail}
                      </p>
                    </div>
                    <Link
                      to="/employee/profile"
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
                {displayName?.charAt(0).toUpperCase() || "E"}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {displayEmail}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      window.location.pathname === item.to
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }
                  `}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1">
              <Link
                to="/employee/profile"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-7 h-7 text-accent" />
              My Profile
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View your personal and employment details
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        {/* Profile Card */}
        {!profile ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <User className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No profile found
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
            {/* Profile Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-2xl"></div>

              <div className="relative px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md">
                    {displayName?.charAt(0).toUpperCase() || "E"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {displayName}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {displayEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium capitalize
                      ${statusStyles[profile.status] || statusStyles.active}
                    `}
                  >
                    {displayStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              {[
                {
                  icon: Hash,
                  label: "Employee ID",
                  value: displayEmployeeId,
                  color: "text-purple-500 dark:text-purple-400",
                },
                {
                  icon: Briefcase,
                  label: "Position",
                  value: displayPosition,
                  color: "text-blue-500 dark:text-blue-400",
                },
                {
                  icon: Building2,
                  label: "Department",
                  value: displayDepartment,
                  color: "text-indigo-500 dark:text-indigo-400",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: displayPhone,
                  color: "text-emerald-500 dark:text-emerald-400",
                },
                {
                  icon: Calendar,
                  label: "Joined Date",
                  value: displayJoiningDate,
                  color: "text-orange-500 dark:text-orange-400",
                },
                {
                  icon: DollarSign,
                  label: "Salary",
                  value: displaySalary,
                  color: "text-green-500 dark:text-green-400",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all duration-200 group"
                  >
                    <div
                      className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm group-hover:shadow-md transition-all duration-200 ${item.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.value || "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>
            Employee ID:{" "}
            <span className="font-medium">{displayEmployeeId}</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  profile?.status === "active"
                    ? "bg-green-500"
                    : profile?.status === "on_leave"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              ></span>
              Status:{" "}
              <span className="font-medium capitalize">{displayStatus}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
