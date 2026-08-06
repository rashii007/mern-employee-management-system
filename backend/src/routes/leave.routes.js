const express = require("express");
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  deleteLeave,
} = require("../controllers/leave.controller.js");

const { protect, adminOnly } = require("../middleware/authMiddleware.js");

const leaveRouter = express.Router();

// ================= Employee =================

// Apply Leave
leaveRouter.post("/apply", protect, applyLeave);

// Get My Leaves
leaveRouter.get("/myleave", protect, getMyLeaves);

// Delete Pending Leave (Optional)
leaveRouter.delete("/:id", protect, deleteLeave);

// ================= Admin =================

// Get All Leave Requests
leaveRouter.get(
  "/",
  protect,
  adminOnly,

  getAllLeaves,
);

// Approve Leave
leaveRouter.put(
  "/:id/approve",
  protect,
  adminOnly,

  approveLeave,
);

// Reject Leave
leaveRouter.put("/:id/reject", protect, adminOnly, rejectLeave);

module.exports = leaveRouter;
