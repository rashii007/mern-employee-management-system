const express = require("express");
const departmentRouter = express.Router();

const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
  getDepartmentEmployees,
} = require("../controllers/department.controller");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// ===== ADMIN ONLY =====
departmentRouter.route("/create").post(protect, adminOnly, createDepartment);
departmentRouter.route("/update/:id").put(protect, adminOnly, updateDepartment);
departmentRouter
  .route("/delete/:id")
  .delete(protect, adminOnly, deleteDepartment);

// ===== PROTECTED (All logged-in users) =====
departmentRouter.route("/get-all").get(protect, getDepartments);
departmentRouter.route("/get/:id").get(protect, getDepartment);
departmentRouter.route("/stats").get(protect, adminOnly, getDepartmentStats);
departmentRouter
  .route("/:id/employees")
  .get(protect, adminOnly, getDepartmentEmployees);

module.exports = departmentRouter;
