import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";

import ThemeButton from "./components/ThemeButton";
import ProtectedRoute from "./components/ProtectedRoute";

import Adminattendance from "./components/Adminattendance";
import Employeeattendance from "./components/Employeeattendance";
import ApplyLeave from "./pages/employee/ApplyLeave";
import LeaveManagement from "./pages/admin/LeaveManagement";
import MyLeaves from "./pages/employee/MyLeaves";
import CreateDepartment from "./pages/admin/CreateDepartment";
import ManageDepartment from "./pages/admin/ManageDepartment";
import ViewDepartment from "./pages/employee/ViewDepartment";

// ✅ Admin pages
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminDepartments from "./pages/admin/AdminDepartments";

function App() {
  return (
    <AuthProvider>
      <div>
        <div className="flex justify-end">
          <ThemeButton />
        </div>

        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />

          {/* ===== ADMIN ROUTES ===== */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminEmployees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDepartments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Adminattendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <LeaveManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-department"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateDepartment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-departments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageDepartment />
              </ProtectedRoute>
            }
          />

          {/* ===== EMPLOYEE ROUTES ===== */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={["employee", "admin"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute allowedRoles={["employee", "admin"]}>
                <Employeeattendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/apply-leave"
            element={
              <ProtectedRoute allowedRoles={["employee", "admin"]}>
                <ApplyLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/myleave"
            element={
              <ProtectedRoute allowedRoles={["employee", "admin"]}>
                <MyLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/departments"
            element={
              <ProtectedRoute allowedRoles={["employee", "admin"]}>
                <ViewDepartment />
              </ProtectedRoute>
            }
          />

          {/* ===== 404 ===== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Page Not Found</p>
      <a href="/" className="text-accent hover:underline mt-4 inline-block">
        Go Home
      </a>
    </div>
  </div>
);

export default App;
