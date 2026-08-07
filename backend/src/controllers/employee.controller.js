const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const Department = require("../models/department.model");
const mongoose = require("mongoose");

// ============================================
// @route  POST /api/employees (admin only)
// @desc   Create employee (User + Employee profile)
// ============================================
// const createEmployee = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       employeeId,
//       department,
//       position,
//       phone,
//       salary,
//       joiningDate,
//     } = req.body;

//     console.log("📥 Received Data:", req.body); // ✅ Debug log

//     // ✅ Validate required fields
//     if (
//       !name ||
//       !email ||
//       !password ||
//       !employeeId ||
//       !department ||
//       !position ||
//       salary === undefined
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//         required: [
//           "name",
//           "email",
//           "password",
//           "employeeId",
//           "department",
//           "position",
//           "salary",
//         ],
//         received: req.body,
//       });
//     }

//     // ✅ Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     // ✅ Check if employee ID already exists
//     const existingEmployeeId = await Employee.findOne({ employeeId });
//     if (existingEmployeeId) {
//       return res.status(409).json({
//         success: false,
//         message: "Employee ID already exists",
//       });
//     }

//     // ✅ FIX: Find department by name and get ObjectId
//     let departmentId = department;
//     console.log("Department ID:", req.body.department);
//     console.log("Department:", department);

//     // Agar ObjectId bheja gaya hai
//     if (mongoose.Types.ObjectId.isValid(department)) {
//       const dept = await Department.findById(department);

//       if (!dept) {
//         return res.status(404).json({
//           success: false,
//           message: "Department not found",
//         });
//       }

//       departmentId = dept._id;
//     }
//     // Agar department ka name bheja gaya hai
//     else {
//       const dept = await Department.findOne({ name: department });

//       if (!dept) {
//         return res.status(404).json({
//           success: false,
//           message: `Department "${department}" not found.`,
//         });
//       }

//       departmentId = dept._id;
//     }

//     // ✅ Create User
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: "employee",
//     });

//     // ✅ Create Employee profile with ObjectId
//     const employee = await Employee.create({
//       user: user._id,
//       employeeId,
//       department: departmentId, // ✅ Now it's ObjectId
//       position,
//       phone: phone || "",
//       salary: Number(salary),
//       joiningDate: joiningDate || new Date(),
//       status: "active",
//     });
//     console.log("Department:", department);

//     // ✅ Populate department name
//     const populatedEmployee = await Employee.findById(employee._id)
//       .populate("user", "name email role")
//       .populate("department", "name description");

//     res.status(201).json({
//       success: true,
//       message: "Employee created successfully",
//       data: populatedEmployee,
//     });
//   } catch (error) {
//     console.error("❌ Create Employee Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create employee",
//       error: error.message,
//     });
//   }
// };

const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      department,
      position,
      phone,
      salary,
      joiningDate,
    } = req.body;

    console.log("📥 Received Data:", req.body);

    // ✅ Validate required fields
    if (
      !name ||
      !email ||
      !employeeId ||
      !department ||
      !position ||
      salary === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Check Employee ID
    const existingEmployeeId = await Employee.findOne({ employeeId });

    if (existingEmployeeId) {
      return res.status(409).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    // ==========================
    // Department Validation
    // ==========================

    let departmentId = department;

    if (mongoose.Types.ObjectId.isValid(department)) {
      const dept = await Department.findById(department);

      if (!dept) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
        });
      }

      departmentId = dept._id;
    } else {
      const dept = await Department.findOne({ name: department });

      if (!dept) {
        return res.status(404).json({
          success: false,
          message: `Department "${department}" not found.`,
        });
      }

      departmentId = dept._id;
    }

    // ==========================
    // Check User
    // ==========================

    let user = await User.findOne({ email });

    if (user) {
      // Check if already employee
      const existingEmployee = await Employee.findOne({
        user: user._id,
      });

      if (existingEmployee) {
        return res.status(409).json({
          success: false,
          message: "This user is already an employee.",
        });
      }

      // Update role if not admin
      if (user.role !== "admin") {
        user.role = "employee";
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        password,
        role: "employee",
      });
    }

    // ==========================
    // Create Employee
    // ==========================

    const employee = await Employee.create({
      user: user._id,
      employeeId,
      department: departmentId,
      position,
      phone: phone || "",
      salary: Number(salary),
      joiningDate: joiningDate || new Date(),
      status: "active",
    });

    // Populate
    const populatedEmployee = await Employee.findById(employee._id)
      .populate("user", "name email role")
      .populate("department", "name description");

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: populatedEmployee,
    });
  } catch (error) {
    console.error("❌ Create Employee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: error.message,
    });
  }
};

// ============================================
// @route  GET /api/employees (admin only)
// @desc   Get all employees
// ============================================
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("user", "name email role")
      .populate("department", "name description")
      .sort({ createdAt: -1 });

    const total = employees.length;
    const active = employees.filter((emp) => emp.status === "active").length;
    const onLeave = employees.filter((emp) => emp.status === "onLeave").length;
    const inactive = employees.filter(
      (emp) => emp.status === "inactive",
    ).length;

    res.status(200).json({
      success: true,
      totalEmployees: total,
      stats: {
        total,
        active,
        onLeave,
        inactive,
      },
      employees,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

// ============================================
// @route  GET /api/employees/:id (admin only)
// @desc   Get employee by ID
// ============================================
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("user", "name email role")
      .populate("department", "name description manager");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Get Employee By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

// ============================================
// @route  GET /api/employees/me (employee only)
// @desc   Get logged-in employee's profile
// ============================================
const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      user: req.user._id,
    })
      .populate("user", "name email role")
      .populate("department", "name description");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Get My Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// ============================================
// @route  PUT /api/employees/:id (admin only)
// @desc   Update employee
// ============================================
const updateEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      position,
      phone,
      salary,
      status,
      joiningDate,
    } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // ✅ Update User
    if (name || email) {
      const user = await User.findById(employee.user);
      if (user) {
        if (name) user.name = name;
        if (email) {
          const existingUser = await User.findOne({
            email,
            _id: { $ne: user._id },
          });
          if (existingUser) {
            return res.status(409).json({
              success: false,
              message: "Email already in use",
            });
          }
          user.email = email;
        }
        await user.save();
      }
    }

    const dept = await Department.findById(department);

    if (!dept) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    employee.department = dept._id;
    if (position !== undefined) employee.position = position;
    if (phone !== undefined) employee.phone = phone;
    if (salary !== undefined) employee.salary = Number(salary);
    if (status !== undefined) employee.status = status;
    if (joiningDate !== undefined) employee.joiningDate = joiningDate;

    const updated = await employee.save();

    // ✅ Populate and return
    const populatedEmployee = await Employee.findById(updated._id)
      .populate("user", "name email role")
      .populate("department", "name description");

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: populatedEmployee,
    });
  } catch (error) {
    console.error("Update Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

// ============================================
// @route  DELETE /api/employees/:id (admin only)
// @desc   Delete employee (User + Employee profile)
// ============================================
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // ✅ Delete User
    await User.findByIdAndDelete(employee.user);

    // ✅ Delete Employee
    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};

// ============================================
// @route  GET /api/employees/stats (admin only)
// @desc   Get employee statistics
// ============================================
const getEmployeeStats = async (req, res) => {
  try {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: "active" });
    const onLeave = await Employee.countDocuments({ status: "onLeave" });
    const inactive = await Employee.countDocuments({ status: "inactive" });

    res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        onLeave,
        inactive,
      },
    });
  } catch (error) {
    console.error("Get Employee Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee stats",
      error: error.message,
    });
  }
};

// ============================================
// @route  GET /api/employees/department/:deptId (admin only)
// @desc   Get employees by department
// ============================================
const getEmployeesByDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;

    const employees = await Employee.find({ department: deptId })
      .populate("user", "name email role")
      .populate("department", "name description");

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get Employees By Department Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees by department",
      error: error.message,
    });
  }
};

// ============================================
// @route  PUT /api/employees/:id/status (admin only)
// @desc   Update employee status only
// ============================================
const updateEmployeeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (!["active", "onLeave", "inactive", "terminated"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status value. Allowed: active, onLeave, inactive, terminated",
      });
    }

    employee.status = status;
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee status updated",
      data: employee,
    });
  } catch (error) {
    console.error("Update Employee Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update employee status",
      error: error.message,
    });
  }
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getMyProfile,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  getEmployeesByDepartment,
  updateEmployeeStatus,
};
