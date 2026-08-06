const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const employeeRouter = require("./routes/employee.routes");
const attendanceRouter = require("./routes/attendance.routes");
const leaveRouter = require("./routes/leave.routes");
const departmentRouter = require("./routes/department.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-employee-management-system-zeta.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/department", departmentRouter);

module.exports = app;
