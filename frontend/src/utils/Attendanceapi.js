import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/attendance",
  withCredentials: true, // if using HTTP-only JWT cookies
});

// Employee
export const checkInApi = () => API.post("/checkin");

export const checkOutApi = () => API.post("/checkout");

export const getMyAttendanceApi = () => API.get("/me");

// Admin
export const getAllAttendanceApi = (date) =>
  API.get("/", {
    params: date ? { date } : {},
  });

export const getAttendanceByEmployeeApi = (employeeId) =>
  API.get(`/${employeeId}`);

export const updateAttendanceStatusApi = (id, status) =>
  API.put(`/status/${id}`, { status });

export default API;
