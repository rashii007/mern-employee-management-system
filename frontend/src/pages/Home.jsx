import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  CalendarCheck,
  Clock3,
  LayoutDashboard,
  LogOut,
  FileCheck,
  Building2,
  UserRound,
  ArrowRight,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const Home = () => {
  const { user, loading, logout } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 font-medium tracking-wide">
            LOADING...
          </p>
        </div>
      </div>
    );
  }

  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/employee/dashboard";

  const features = [
    {
      icon: <Users size={22} />,
      title: "Employee Management",
      desc: "Create, update and manage employee records easily.",
    },
    {
      icon: <Clock3 size={22} />,
      title: "Attendance Tracking",
      desc: "Monitor employee attendance and working hours.",
    },
    {
      icon: <CalendarCheck size={22} />,
      title: "Leave Management",
      desc: "Apply, review and manage employee leaves.",
    },
  ];

  const quickLinks =
    user?.role === "admin"
      ? [
          {
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: <LayoutDashboard size={20} />,
          },
          {
            title: "Employees",
            path: "/admin/employees",
            icon: <Users size={20} />,
          },
          {
            title: "Departments",
            path: "/admin/departments",
            icon: <Building2 size={20} />,
          },
          {
            title: "Attendance",
            path: "/admin/attendance",
            icon: <Clock3 size={20} />,
          },
          {
            title: "Leaves",
            path: "/admin/leaves",
            icon: <CalendarCheck size={20} />,
          },
        ]
      : [
          {
            title: "Dashboard",
            path: "/employee/dashboard",
            icon: <LayoutDashboard size={20} />,
          },
          {
            title: "My Attendance",
            path: "/employee/attendance",
            icon: <Clock3 size={20} />,
          },
          {
            title: "Apply Leave",
            path: "/employee/apply-leave",
            icon: <FileCheck size={20} />,
          },
          {
            title: "My Leaves",
            path: "/employee/myleave",
            icon: <CalendarCheck size={20} />,
          },
          {
            title: "Profile",
            path: "/employee/profile",
            icon: <UserRound size={20} />,
          },
        ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 font-sans">
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 backdrop-blur-lg shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                E
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                EMS<span className="text-accent">.</span>
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  {/* User Card */}
                  <div className="flex items-center gap-3 px-4 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 transition">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user.name}
                      </p>

                      <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login */}
                  <Link
                    to="/login"
                    className="px-5 py-2 rounded-full font-medium border border-slate-900 bg-white text-slate-900 hover:bg-slate-100 transition-all duration-300 dark:border-white dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
                  >
                    Login
                  </Link>

                  {/* Register */}
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-full font-medium shadow-md transition-all duration-300 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm px-4 py-5 space-y-4 transition-all duration-300">
            {user ? (
              <>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </p>

                    <p className="text-sm capitalize text-slate-500 dark:text-slate-400">
                      {user.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full text-center py-3 rounded-xl border border-slate-900 bg-white text-slate-900 hover:bg-slate-100 transition-all duration-300 dark:border-white dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full text-center py-3 rounded-xl font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left */}
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide">
            <ShieldCheck size={14} />
            SMART EMPLOYEE MANAGEMENT
          </span>

          <h1 className="mt-4 sm:mt-5 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white">
            Manage your
            <span className="text-accent block">workforce smarter</span>
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 max-w-lg leading-relaxed">
            A complete employee management solution for attendance, departments,
            employees and leaves.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              to={user ? dashboardPath : "/register"}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 transition-all duration-300 text-sm font-semibold shadow-md"
            >
              {user ? "Dashboard" : "Get Started"}
              <ArrowRight size={16} />
            </Link>

            {!user && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800 transition-all duration-300 text-sm font-semibold shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="mt-8 sm:mt-10 flex gap-6 sm:gap-8">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                50+
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Employees
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                12
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Departments
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                98%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Attendance
              </p>
            </div>
          </div>
        </div>

        {/* Right - Sporty Card */}
        <div className="order-1 lg:order-2">
          <div className="relative">
            {/* Decorative circle */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/5 rounded-full blur-2xl"></div>

            <div className="relative bg-white dark:bg-slate-900/80 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 p-5 sm:p-6 lg:p-8 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border border-gray-300 dark:border-gray-700 shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || "E"}
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {user?.name || "Guest"}
                  </h3>

                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {user?.role || "Employee"}
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-2.5 sm:p-3 text-center">
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                    Status
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">
                    ● Active
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-2.5 sm:p-3 text-center">
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                    Security
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                    🔒 Protected
                  </p>
                </div>
                <div className="col-span-2 bg-gray-50 dark:bg-slate-800/50 rounded-xl p-2.5 sm:p-3 text-center">
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                    Access Level
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white capitalize">
                    {user?.role || "Role Based"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold tracking-wider">
            FEATURES
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 text-gray-900 dark:text-white">
            Everything you need
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white dark:bg-slate-900/50 p-5 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-slate-800/50 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl group-hover:bg-gray-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== QUICK LINKS ===== */}
      {user && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Quick Access
            </h2>
            <Link
              to={dashboardPath}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline font-medium transition-colors duration-200"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="group bg-white dark:bg-slate-900/50 p-3 sm:p-4 rounded-xl border border-gray-200/50 dark:border-slate-800/50 text-center hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md dark:hover:shadow-slate-800/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white group-hover:scale-110 transition-all duration-200 inline-block">
                  {item.icon}
                </div>
                <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-5 sm:py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Employee Management System. All rights
            reserved.
          </p>

          <p className="mt-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-500">
            Designed & Developed by{" "}
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              Muhammad Rashid Khan
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
