const express = require("express");
const attendanceRouter = express.Router();

const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
  updateAttendanceStatus,
} = require("../controllers/attendance.controller");

const { protect, adminOnly } = require("../middleware/authMiddleware");
//   (protect = verifies JWT, adminOnly = checks req.user.role === "admin")

// Employee routes
attendanceRouter.post("/checkin", protect, checkIn);
attendanceRouter.post("/checkout", protect, checkOut);
attendanceRouter.get("/me", protect, getMyAttendance);

// Admin routes
attendanceRouter.get("/", protect, adminOnly, getAllAttendance);
attendanceRouter.get("/:employeeId", protect, adminOnly, getAttendanceByEmployee);
attendanceRouter.put("/status/:id", protect, adminOnly, updateAttendanceStatus);

module.exports = attendanceRouter;
