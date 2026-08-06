import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/employee", // ✅ Fixed: employees (plural)
  withCredentials: true,
});

// ============================================
// EMPLOYEE APIs
// ============================================

// ✅ Get all employees (admin only)
export const getEmployees = async () => {
  try {
    const res = await api.get("/get-emp");
    return res.data;
  } catch (error) {
    console.error("Get Employees Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Get employee by ID (admin only)
export const getEmployeeById = async (id) => {
  try {
    const res = await api.get(`/get/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get Employee By ID Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Get my profile (employee only)
export const getMyProfile = async () => {
  try {
    const res = await api.get("/profile");
    return res.data.data;
  } catch (error) {
    console.error("Get My Profile Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Create employee (admin only)
export const createEmployee = async (data) => {
  try {
    const res = await api.post("/create-emp", data);
    return res.data;
  } catch (error) {
    console.error("Create Employee Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Update employee (admin only)
export const updateEmployee = async (id, data) => {
  try {
    const res = await api.put(`/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Update Employee Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Update employee status (admin only)
export const updateEmployeeStatus = async (id, status) => {
  try {
    const res = await api.patch(`/status/${id}`, { status });
    return res.data;
  } catch (error) {
    console.error("Update Employee Status Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Delete employee (admin only)
export const deleteEmployee = async (id) => {
  try {
    const res = await api.delete(`/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete Employee Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Get employee stats (admin only)
export const getEmployeeStats = async () => {
  try {
    const res = await api.get("/stats");
    return res.data;
  } catch (error) {
    console.error("Get Employee Stats Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Get employees by department (admin only)
export const getEmployeesByDepartment = async (deptId) => {
  try {
    const res = await api.get(`/department/${deptId}`);
    return res.data;
  } catch (error) {
    console.error("Get Employees By Department Error:", error);
    throw error.response?.data || error.message;
  }
};

// ============================================
// DEPARTMENT APIs
// ============================================

// ✅ Get all departments (admin only)
export const getDepartments = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/departments/get", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Get Departments Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Get department by ID (admin only)
export const getDepartmentById = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/departments/get/${id}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.error("Get Department By ID Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Create department (admin only)
export const createDepartment = async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/departments/create",
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.error("Create Department Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Update department (admin only)
export const updateDepartment = async (id, data) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/departments/update/${id}`,
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.error("Update Department Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Delete department (admin only)
export const deleteDepartment = async (id) => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/api/departments/delete/${id}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.error("Delete Department Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Get department stats (admin only)
export const getDepartmentStats = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/departments/stats", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Get Department Stats Error:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Get department employees (admin only)
export const getDepartmentEmployees = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/departments/${id}/employees`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.error("Get Department Employees Error:", error);
    throw error.response?.data || error.message;
  }
};

// ============================================
// EXPORT ALL
// ============================================
export default {
  // Employee APIs
  getEmployees,
  getEmployeeById,
  getMyProfile,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  getEmployeeStats,
  getEmployeesByDepartment,
  // Department APIs
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
  getDepartmentEmployees,
};
