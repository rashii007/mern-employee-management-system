const express = require("express");
const employeeRouter = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getMyProfile,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  getEmployeesByDepartment,
  updateEmployeeStatus,
} = require("../controllers/employee.controller");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ============================================
// PUBLIC / EMPLOYEE ROUTES
// ============================================

// ✅ Get logged-in employee profile
employeeRouter.get("/profile", protect, getMyProfile);

// ============================================
// ADMIN ONLY ROUTES
// ============================================

// ✅ Create Employee
employeeRouter.post("/create-emp", protect, adminOnly, createEmployee);

// ✅ Get all employees
employeeRouter.get("/get-emp", protect, adminOnly, getEmployees);

// ✅ Get employee stats
employeeRouter.get("/stats", protect, adminOnly, getEmployeeStats);

// ✅ Get employees by department
employeeRouter.get(
  "/department/:deptId",
  protect,
  adminOnly,
  getEmployeesByDepartment,
);

// ✅ Get employee by ID
employeeRouter.get("/get/:id", protect, adminOnly, getEmployeeById);

// ✅ Update employee
employeeRouter.put("/update/:id", protect, adminOnly, updateEmployee);

// ✅ Update employee status only
employeeRouter.patch("/status/:id", protect, adminOnly, updateEmployeeStatus);

// ✅ Delete employee
employeeRouter.delete("/delete/:id", protect, adminOnly, deleteEmployee);

module.exports = employeeRouter;
