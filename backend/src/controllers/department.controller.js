const Department = require("../models/department.model");
const Employee = require("../models/employee.model");
const User = require("../models/user.model");

// ============================================
// @route  GET /api/departments/get
// @desc   Get All Departments
// ============================================
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });

    // Get employee count for each department (by department name)
    const departmentsWithCount = await Promise.all(
      departments.map(async (dept) => {
        const count = await Employee.countDocuments({
          department: dept._id, // ✅ String comparison
          status: "active",
        });
        return {
          ...dept.toObject(),
          employeeCount: count,
        };
      }),
    );

    res.status(200).json({
      success: true,
      count: departmentsWithCount.length,
      departments: departmentsWithCount,
    });
  } catch (error) {
    console.error("Get Departments Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// @route  GET /api/departments/get/:id
// @desc   Get Single Department
// ============================================
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Get employees in this department (by department name)
    const employees = await Employee.find({
      department: department.name, // ✅ String comparison
    })
      .populate("user", "name email")
      .select("employeeId position status");

    res.status(200).json({
      success: true,
      department: {
        ...department.toObject(),
        employees,
        employeeCount: employees.length,
      },
    });
  } catch (error) {
    console.error("Get Department Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// @route  POST /api/departments/create
// @desc   Create Department
// ============================================
const createDepartment = async (req, res) => {
  try {
    const { name, code, description, manager, status } = req.body;

    // Validate
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Name and code are required",
      });
    }

    // Check if department exists
    const exists = await Department.findOne({
      $or: [{ name }, { code }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Department with this name or code already exists",
      });
    }

    // Create department
    const department = await Department.create({
      name,
      code,
      description: description || "",
      manager: manager || "", // ✅ String
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    console.error("Create Department Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// @route  PUT /api/departments/update/:id
// @desc   Update Department
// ============================================
const updateDepartment = async (req, res) => {
  try {
    const { name, code, description, manager, status } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Check if name or code already exists (excluding current)
    if (name || code) {
      const existingDept = await Department.findOne({
        _id: { $ne: req.params.id },
        $or: [...(name ? [{ name }] : []), ...(code ? [{ code }] : [])],
      });

      if (existingDept) {
        return res.status(400).json({
          success: false,
          message: "Department with this name or code already exists",
        });
      }
    }

    // Update department
    if (name) {
      department.name = name;
    }
    if (code) department.code = code;
    if (description !== undefined) department.description = description;
    if (manager !== undefined) department.manager = manager; // ✅ String
    if (status) department.status = status;

    await department.save();

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    console.error("Update Department Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// @route  DELETE /api/departments/delete/:id
// @desc   Delete Department
// ============================================
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Remove department from all employees
    await Employee.updateMany(
      { department: department._id }, // ✅ String comparison
      { $unset: { department: "" } },
    );

    await department.deleteOne();

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// @route  GET /api/departments/stats
// @desc   Get Department Statistics
// ============================================
const getDepartmentStats = async (req, res) => {
  try {
    const departments = await Department.find();
    const stats = await Promise.all(
      departments.map(async (dept) => {
        const count = await Employee.countDocuments({
          department: dept._id, // ✅ String comparison
        });
        return {
          id: dept._id,
          name: dept.name,
          code: dept.code,
          count,
        };
      }),
    );

    res.status(200).json({
      success: true,
      totalDepartments: departments.length,
      stats,
    });
  } catch (error) {
    console.error("Get Department Stats Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// @route  GET /api/departments/:id/employees
// @desc   Get Employees by Department ID
// ============================================
const getDepartmentEmployees = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const employees = await Employee.find({
      department: department.name, // ✅ String comparison
    })
      .populate("user", "name email")
      .select("employeeId position status salary joiningDate");

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get Department Employees Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
  getDepartmentEmployees,
};
