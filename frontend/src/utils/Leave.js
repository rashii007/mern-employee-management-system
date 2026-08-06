import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ================= Employee =================

// Apply Leave
export const applyLeave = async (leaveData) => {
  const res = await api.post("/leave/apply", leaveData);
  return res.data;
};

// Get My Leaves
export const getMyLeaves = async () => {
  const res = await api.get("/leave/myleave");
  return res.data;
};

// Delete Leave
export const deleteLeave = async (id) => {
  const res = await api.delete(`/leave/${id}`);
  return res.data;
};

// ================= Admin =================

// Get All Leaves
export const getAllLeaves = async () => {
  const res = await api.get("/leave/");
  return res.data;
};

// Approve Leave
export const approveLeave = async (id) => {
  const res = await api.put(`/leave/${id}/approve`);
  return res.data;
};

// Reject Leave
export const rejectLeave = async (id) => {
  const res = await api.put(`/leave/${id}/reject`);
  return res.data;
};