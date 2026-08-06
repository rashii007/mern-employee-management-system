import axios from "axios";

// Central axios instance — withCredentials sends/receives the httpOnly cookie
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me", { withCredentials: true });

  return res.data;
};

export default api;
