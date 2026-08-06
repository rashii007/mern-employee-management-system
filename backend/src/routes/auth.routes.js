const express = require("express");
const authRouter = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/auth.controller");
const {protect} = require("../middleware/authMiddleware");

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", protect, getMe);

module.exports = authRouter;