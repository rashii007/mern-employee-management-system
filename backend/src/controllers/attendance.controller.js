const Attendance = require("../models/attendance.model");

// helper: get today's date as "YYYY-MM-DD"
const getToday = () => new Date().toISOString().split("T")[0];

// @route   POST /api/attendance/checkin
// @access  Employee (logged in)
exports.checkIn = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = getToday();

    let record = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (record && record.checkIn) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    if (!record) {
      record = await Attendance.create({
        employee: employeeId,
        date: today,
        checkIn: new Date(),
        status:"present"
      });
    } else {
      record.checkIn = new Date();
      record.status = "present";
      await record.save();
    }

    res.status(200).json({ message: "Checked in successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/attendance/checkout
// @access  Employee (logged in)
exports.checkOut = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = getToday();

    const record = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (!record || !record.checkIn) {
      return res
        .status(400)
        .json({ message: "You must check in before checking out" });
    }

    if (record.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    record.checkOut = new Date();
    await record.save();

    res.status(200).json({ message: "Checked out successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/attendance/me
// @access  Employee (logged in) — own attendance history
exports.getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const records = await Attendance.find({ employee: employeeId }).sort({
      date: -1,
    });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/attendance
// @access  Admin — all employees' attendance (optional ?date= filter)
exports.getAllAttendance = async (req, res) => {
  try {
    const filter = {};
    if (req.query.date) filter.date = req.query.date;

    const records = await Attendance.find(filter)
      .populate("employee", "name email")
      .sort({ date: -1 });

    res.status(200).json({totalRecord: records.length,records,});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/attendance/:employeeId
// @access  Admin — a specific employee's attendance history
exports.getAttendanceByEmployee = async (req, res) => {
  try {
    const records = await Attendance.find({
      employee: req.params.employeeId,
    }).sort({
      date: -1,
    });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/attendance/:id/status
// @access  Admin — manually mark status (e.g. leave, absent)
exports.updateAttendanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["present", "absent", "leave", "half-day"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const record = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json({ message: "Status updated", record });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
