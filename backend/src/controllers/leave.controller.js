const Leave = require("../models/leave.model");

// =======================
// Apply Leave
// =======================
const applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Leave applied successfully.",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get My Leaves
// =======================
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employee: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get All Leaves (Admin)
// =======================
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name email")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Approve Leave
// =======================
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found.",
      });
    }

    leave.status = "Approved";
    leave.approvedBy = req.user._id;

    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave approved successfully.",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Reject Leave
// =======================
const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found.",
      });
    }

    leave.status = "Rejected";
    leave.approvedBy = req.user._id;

    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave rejected successfully.",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Delete Leave (Only Pending)
// =======================
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found.",
      });
    }

    if (leave.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending leave can be deleted.",
      });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Leave deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  deleteLeave,
};
