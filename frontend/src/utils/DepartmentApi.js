// DepartmentApi.js
import axios from "axios";

const departmentApi = axios.create({
  baseURL: "http://localhost:5000/api/department",
  withCredentials: true,
});

// ✅ Add token interceptor
departmentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("📤 Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Add response interceptor
departmentApi.interceptors.response.use(
  (response) => {
    console.log("📥 Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.status);
    console.error("❌ Data:", error.response?.data);
    return Promise.reject(error);
  },
);

// ============================================
// DEPARTMENT APIS
// ============================================

export const getDepartments = async () => {
  try {
    console.log("🔄 Fetching departments...");
    const res = await departmentApi.get("/get-all");
    console.log(res.data);
    console.log("✅ Departments fetched:", res.data?.departments?.length || 0);
    return res.data;
  } catch (error) {
    console.error("❌ Get Departments Error:", error);
    throw error;
  }
};

export const getDepartment = async (id) => {
  try {
    const res = await departmentApi.get(`/get/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Get Department Error:", error);
    throw error;
  }
};

export const createDepartment = async (data) => {
  try {
    console.log("📤 Creating department:", data);
    const res = await departmentApi.post("/create", data);
    console.log("✅ Department created:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Create Department Error:", error);
    console.error("❌ Response:", error.response?.data);
    throw error;
  }
};

export const updateDepartment = async (id, data) => {
  try {
    const res = await departmentApi.put(`/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("❌ Update Department Error:", error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const res = await departmentApi.delete(`/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Delete Department Error:", error);
    throw error;
  }
};

export const getDepartmentStats = async () => {
  try {
    const res = await departmentApi.get("/stats");
    return res.data;
  } catch (error) {
    console.error("❌ Get Department Stats Error:", error);
    throw error;
  }
};

export const getDepartmentEmployees = async (id) => {
  try {
    const res = await departmentApi.get(`/${id}/employees`);
    return res.data;
  } catch (error) {
    console.error("❌ Get Department Employees Error:", error);
    throw error;
  }
};

export default {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
  getDepartmentEmployees,
};
