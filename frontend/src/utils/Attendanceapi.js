import axios from "axios";


const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/attendance`,
  withCredentials: true,
});

// Employee
export const checkInApi = () => API.post("/checkin");

export const checkOutApi = () => API.post("/checkout");

export const getMyAttendanceApi = () => API.get("/me");

// Admin
export const getAllAttendanceApi = (date) =>
  API.get("", {
    params: date ? { date } : {},
  });

export const getAttendanceByEmployeeApi = (employeeId) =>
  API.get(`/${employeeId}`);

export const updateAttendanceStatusApi = (id, status) =>
  API.put(`/status/${id}`, { status });

export default API;
