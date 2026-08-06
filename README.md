# 🚀 MERN Employee Management System (EMS)

A modern and secure **Employee Management System (EMS)** built with the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. This application streamlines employee administration through **role-based access control**, enabling administrators to efficiently manage employees, departments, attendance, and leave requests while providing employees with a personalized dashboard to manage their daily activities.

Designed with a responsive interface, secure authentication, and a clean user experience, this project demonstrates full-stack development best practices.

---

## ✨ Features

### 👑 Administrator

* Secure Admin Dashboard
* Employee Management (Create, Read, Update & Delete)
* Department Management
* Attendance Management
* Leave Request Approval & Rejection
* View Employee Statistics
* Manage User Accounts
* Protected Admin Routes
* Search, Filter & Pagination
* Responsive Dashboard

---

### 👨‍💼 Employee

* Secure Login
* Personalized Dashboard
* View Personal Profile
* Check In / Check Out Attendance
* Apply for Leave
* View Leave Status
* Browse Departments
* Attendance History

---

### 🎨 User Interface

* Fully Responsive Design
* Dark & Light Theme
* Modern Dashboard Layout
* Mobile Friendly
* Loading States
* Clean Navigation
* Reusable Components
* Professional UI using Tailwind CSS

---

# 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Tailwind CSS
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt.js
* Cookie Parser
* CORS

---

# 🔐 Authentication & Authorization

The application uses **JWT Authentication** with **Role-Based Access Control (RBAC)**.

### Admin Permissions

* Manage Employees
* Manage Departments
* View Attendance
* Approve & Reject Leave Requests
* Access Admin Dashboard

### Employee Permissions

* View Dashboard
* Manage Personal Attendance
* Apply for Leave
* View Department Information
* Access Personal Profile

---

# 📂 Project Structure

```text
mern-employee-management-system/

├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/rashii007/mern-employee-management-system.git
cd mern-employee-management-system
```

---

## Install Backend

```bash
cd server
npm install
```

---

## Install Frontend

```bash
cd ../client
npm install
```

---

# 🌍 Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

---

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# ▶️ Running the Project

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

# 📌 Core Modules

* Authentication
* Employee Management
* Department Management
* Attendance Management
* Leave Management
* Admin Dashboard
* Employee Dashboard

---

# 🌐 REST API

## Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |
| GET    | `/api/auth/me`       |

---

## Employees

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | `/api/employee`     |
| GET    | `/api/employee/:id` |
| POST   | `/api/employee`     |
| PUT    | `/api/employee/:id` |
| DELETE | `/api/employee/:id` |

---

## Departments

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | `/api/department`     |
| POST   | `/api/department`     |
| PUT    | `/api/department/:id` |
| DELETE | `/api/department/:id` |

---

## Attendance

| Method | Endpoint                    |
| ------ | --------------------------- |
| GET    | `/api/attendance`           |
| POST   | `/api/attendance/check-in`  |
| POST   | `/api/attendance/check-out` |

---

## Leave

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | `/api/leave`     |
| POST   | `/api/leave`     |
| PUT    | `/api/leave/:id` |

---

# 🔒 Security

* JWT Authentication
* Password Hashing with bcrypt
* Protected Routes
* Role-Based Authorization
* Input Validation
* Secure API Architecture
* CORS Configuration

---

# 🚀 Future Improvements

* Payroll Management
* Salary Records
* Performance Reviews
* Email Notifications
* Report Generation
* PDF & Excel Export
* Calendar Integration
* Employee Analytics
* Notification System

---

# 📦 Deployment

**Current Status:** Not deployed.

The project can be deployed using:

* Frontend: Vercel or Netlify
* Backend: Render or Railway
* Database: MongoDB Atlas

---

# 🤝 Contributing

Contributions are welcome.

1. Fork this repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

**Muhammad Rashid Khan**

**GitHub:** https://github.com/rashii007

---

## ⭐ Support

If you found this project helpful, consider giving it a **Star ⭐** on GitHub.

Your support is greatly appreciated.
