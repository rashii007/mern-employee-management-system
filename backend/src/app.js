const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
const employeeRouter = require("./routes/employee.routes");
const attendanceRouter = require("./routes/attendance.routes");
const leaveRouter = require("./routes/leave.routes");
const departmentRouter = require("./routes/department.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/department", departmentRouter);
module.exports = app;
