import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  UserPlus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { registerUser } from "../utils/Authapi";
import { useAuth } from "../context/AuthContext";
import { normalizeAuthUser } from "../context/authUtils";
import ThemeButton from "../components/ThemeButton";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Real-time validation for confirm password
  useEffect(() => {
    if (touched.confirmPassword && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }
  }, [formData.password, formData.confirmPassword, touched.confirmPassword]);

  // Real-time validation for email
  useEffect(() => {
    if (touched.email && formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        setFieldErrors((prev) => ({ ...prev, email: emailError }));
      } else {
        setFieldErrors((prev) => ({ ...prev, email: "" }));
      }
    }
  }, [formData.email, touched.email]);

  // Strong email validation function
  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      return "Email is required";
    }

    // Remove leading/trailing spaces
    email = email.trim();

    // Check for spaces in email
    if (email.includes(" ")) {
      return "Email cannot contain spaces";
    }

    // Check for consecutive dots
    if (email.includes("..")) {
      return "Email cannot contain consecutive dots";
    }

    // Check for @ symbol - must have exactly one @
    const atCount = (email.match(/@/g) || []).length;
    if (atCount !== 1) {
      return "Email must contain exactly one @ symbol";
    }

    // Split email into local and domain parts
    const [localPart, domain] = email.split("@");

    // Validate local part (before @)
    if (!localPart || localPart.length === 0) {
      return "Email must have a username before @";
    }

    if (localPart.length > 64) {
      return "Email username is too long (max 64 characters)";
    }

    // Local part cannot start or end with a dot
    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      return "Email username cannot start or end with a dot";
    }

    // Local part can only contain letters, numbers, dots, underscores, hyphens, and plus
    if (!/^[a-zA-Z0-9._%+-]+$/.test(localPart)) {
      return "Email contains invalid characters";
    }

    // Validate domain part (after @)
    if (!domain || domain.length === 0) {
      return "Email must have a domain after @";
    }

    // Check for invalid domain patterns
    if (domain.startsWith(".") || domain.endsWith(".")) {
      return "Domain cannot start or end with a dot";
    }

    // Check for domain parts with no dots (like "gmailcom" without the dot)
    if (!domain.includes(".")) {
      return "Email must have a valid domain extension (e.g., .com, .org)";
    }

    // Check domain parts
    const domainParts = domain.split(".");

    // Each part must have at least 2 characters and only valid characters
    for (const part of domainParts) {
      if (part.length < 2) {
        return "Domain parts must have at least 2 characters";
      }
      if (!/^[a-zA-Z0-9-]+$/.test(part)) {
        return "Domain contains invalid characters";
      }
    }

    // Top-level domain (last part) must be at least 2 characters and only letters
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
      return "Invalid domain extension";
    }

    // Check for common valid TLDs (optional but helpful)
    const validTLDs = [
      "com",
      "org",
      "net",
      "edu",
      "gov",
      "io",
      "co",
      "uk",
      "us",
      "ca",
      "au",
      "in",
      "de",
      "fr",
      "jp",
      "cn",
      "br",
      "ru",
      "za",
      "mx",
      "nl",
      "se",
      "no",
      "fi",
      "dk",
      "ch",
      "at",
      "be",
      "nz",
      "sg",
      "hk",
      "ae",
      "sa",
      "tr",
      "pl",
      "hu",
      "cz",
      "gr",
      "pt",
      "ie",
      "il",
      "my",
      "ph",
      "pk",
      "eg",
      "ng",
      "vn",
      "th",
      "id",
      "ro",
      "bg",
      "hr",
      "sk",
      "si",
      "lt",
      "lv",
      "ee",
      "cy",
      "lu",
      "mt",
      "is",
      "li",
      "mc",
      "sm",
      "va",
      "tv",
      "info",
      "biz",
      "name",
      "pro",
      "asia",
      "cat",
      "jobs",
      "mobi",
      "tel",
      "travel",
      "xxx",
      "post",
      "museum",
      "aero",
      "coop",
      "int",
      "mil",
      "arpa",
    ];

    // Check if TLD is common (this is a warning, not an error)
    // We'll just check if it's a valid format, not if it exists in our list
    // because there are many valid TLDs

    // Check for multiple @ symbols (already handled above)
    // Check for invalid characters in domain
    if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
      return "Domain contains invalid characters";
    }

    return null; // No error - email is valid
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear field error when user starts typing
    if (e.target.name !== "confirmPassword" && fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });

    // Validate on blur
    const { name, value } = e.target;
    if (name === "confirmPassword" && value) {
      if (formData.password !== value) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      }
    }
    if (name === "email" && value) {
      const emailError = validateEmail(value);
      if (emailError) {
        setFieldErrors((prev) => ({ ...prev, email: emailError }));
      }
    }
  };

  const validateForm = () => {
    const errors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    // Validate Name
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
      isValid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name.trim())) {
      errors.name =
        "Name can only contain letters, spaces, apostrophes, and hyphens";
      isValid = false;
    }

    // Validate Email with strong validation
    const emailError = validateEmail(formData.email);
    if (emailError) {
      errors.email = emailError;
      isValid = false;
    }

    // Validate Password
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
      isValid = false;
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFieldErrors(errors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({ name: "", email: "", password: "", confirmPassword: "" });

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser(formData);
      setUser(normalizeAuthUser(user));
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);

      // Set field-specific errors based on API response
      if (errorMessage.toLowerCase().includes("email")) {
        setFieldErrors((prev) => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.toLowerCase().includes("name")) {
        setFieldErrors((prev) => ({ ...prev, name: errorMessage }));
      } else if (errorMessage.toLowerCase().includes("password")) {
        setFieldErrors((prev) => ({ ...prev, password: errorMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Theme Button */}
      <ThemeButton />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200/30 dark:bg-gray-700/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200/30 dark:bg-gray-700/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-200/20 dark:bg-gray-700/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-20 w-4 h-4 bg-gray-400/30 dark:bg-gray-500/20 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-gray-400/20 dark:bg-gray-500/20 rounded-full blur-xl animate-bounce delay-700"></div>
        <div className="absolute top-1/2 right-10 w-3 h-3 bg-gray-400/20 dark:bg-gray-500/20 rounded-full blur-xl animate-bounce delay-300"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-800/50 overflow-hidden">
        {/* Left Side - Brand Section */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gray-900 dark:bg-slate-950 text-white relative overflow-hidden min-h-[550px]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                E
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">EMS</h1>
                <p className="text-xs text-white/70">Enterprise Management</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight">
                Join Our
                <span className="block mt-2">Team Today</span>
              </h2>

              <p className="text-white/80 text-sm leading-relaxed max-w-sm">
                Create your account and start managing employees, attendance,
                and leaves efficiently.
              </p>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-white/70 ml-2">
                  Join 500+ users
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1">🔒 Secure</span>
              <span>•</span>
              <span className="flex items-center gap-1">⚡ Fast</span>
              <span>•</span>
              <span className="flex items-center gap-1">🛡️ Protected</span>
            </div>
          </div>

          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-white/5 rounded-full"></div>
        </div>

        {/* Right Side - Register Form */}
        <div className="p-8 lg:p-10 bg-white dark:bg-slate-900">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gray-900 dark:bg-slate-950 rounded-xl flex items-center justify-center text-white font-bold">
              E
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                EMS
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enterprise Management
              </p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center relative">
                <UserPlus className="w-10 h-10 p-2 bg-white dark:bg-slate-800 rounded-2xl text-gray-900 dark:text-white" />
                <Sparkles className="w-3 h-3 text-yellow-400 dark:text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Account
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get started for free
                </p>
              </div>
            </div>
          </div>

          {/* General Error */}
          {error &&
            !fieldErrors.name &&
            !fieldErrors.email &&
            !fieldErrors.password &&
            !fieldErrors.confirmPassword && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    fieldErrors.name
                      ? "text-red-500"
                      : "text-gray-400 dark:text-gray-500 group-focus-within:text-gray-900 dark:group-focus-within:text-white"
                  }`}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    fieldErrors.name && touched.name
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-300 dark:focus:ring-red-600 focus:border-red-500"
                      : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500"
                  } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none`}
                />
              </div>
              {fieldErrors.name && touched.name && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5">
                  <span className="text-xs">⚠️</span>
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email Field - Enhanced */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (must be valid)
                </span>
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    fieldErrors.email
                      ? "text-red-500"
                      : "text-gray-400 dark:text-gray-500 group-focus-within:text-gray-900 dark:group-focus-within:text-white"
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    fieldErrors.email && touched.email
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-300 dark:focus:ring-red-600 focus:border-red-500"
                      : formData.email && !fieldErrors.email && touched.email
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 focus:ring-green-300 dark:focus:ring-green-600"
                        : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500"
                  } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none`}
                />
              </div>
              {/* Email validation hint - shown when typing */}
              {formData.email && !fieldErrors.email && !touched.email && (
                <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                  Enter a valid email address (e.g., name@domain.com)
                </p>
              )}
              {/* Email error message */}
              {fieldErrors.email && touched.email && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5">
                  <span className="text-xs">⚠️</span>
                  {fieldErrors.email}
                </p>
              )}
              {/* Email success message */}
              {formData.email && !fieldErrors.email && touched.email && (
                <p className="mt-1.5 text-sm text-green-500 dark:text-green-400 flex items-center gap-1.5">
                  <span className="text-xs">✓</span>
                  Valid email address
                </p>
              )}
              {/* Email format examples for guidance */}
              <div className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                <span>Examples: </span>
                <span className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  user@gmail.com
                </span>
                <span className="mx-1">•</span>
                <span className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  name@company.org
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    fieldErrors.password
                      ? "text-red-500"
                      : "text-gray-400 dark:text-gray-500 group-focus-within:text-gray-900 dark:group-focus-within:text-white"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
                    fieldErrors.password && touched.password
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-300 dark:focus:ring-red-600 focus:border-red-500"
                      : formData.password &&
                          !fieldErrors.password &&
                          touched.password
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 focus:ring-green-300 dark:focus:ring-green-600"
                        : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500"
                  } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && touched.password && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5">
                  <span className="text-xs">⚠️</span>
                  {fieldErrors.password}
                </p>
              )}
              {/* Password strength indicator */}
              {formData.password &&
                !fieldErrors.password &&
                touched.password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            formData.password.length >= 8 &&
                            /(?=.*[A-Z])/.test(formData.password) &&
                            /(?=.*[a-z])/.test(formData.password) &&
                            /(?=.*[0-9])/.test(formData.password)
                              ? "bg-green-500 w-full"
                              : formData.password.length >= 6 &&
                                  /(?=.*[A-Z])/.test(formData.password)
                                ? "bg-yellow-500 w-2/3"
                                : "bg-red-500 w-1/3"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formData.password.length >= 8 &&
                        /(?=.*[A-Z])/.test(formData.password) &&
                        /(?=.*[a-z])/.test(formData.password) &&
                        /(?=.*[0-9])/.test(formData.password)
                          ? "Strong"
                          : formData.password.length >= 6 &&
                              /(?=.*[A-Z])/.test(formData.password)
                            ? "Medium"
                            : "Weak"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      <span
                        className={
                          formData.password.length >= 6
                            ? "text-green-500"
                            : "text-gray-400"
                        }
                      >
                        ✓{" "}
                        {formData.password.length >= 6
                          ? "Good length"
                          : "Min 6 characters"}
                      </span>
                      <span className="mx-1">•</span>
                      <span
                        className={
                          /(?=.*[A-Z])/.test(formData.password) &&
                          /(?=.*[a-z])/.test(formData.password)
                            ? "text-green-500"
                            : "text-gray-400"
                        }
                      >
                        ✓{" "}
                        {/(?=.*[A-Z])/.test(formData.password) &&
                        /(?=.*[a-z])/.test(formData.password)
                          ? "Has uppercase & lowercase"
                          : "Uppercase & lowercase"}
                      </span>
                      <span className="mx-1">•</span>
                      <span
                        className={
                          /(?=.*[0-9])/.test(formData.password)
                            ? "text-green-500"
                            : "text-gray-400"
                        }
                      >
                        ✓{" "}
                        {/(?=.*[0-9])/.test(formData.password)
                          ? "Has number"
                          : "Add a number"}
                      </span>
                    </div>
                  </div>
                )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    fieldErrors.confirmPassword
                      ? "text-red-500"
                      : "text-gray-400 dark:text-gray-500 group-focus-within:text-gray-900 dark:group-focus-within:text-white"
                  }`}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
                    fieldErrors.confirmPassword && touched.confirmPassword
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-300 dark:focus:ring-red-600 focus:border-red-500"
                      : formData.confirmPassword &&
                          formData.password === formData.confirmPassword &&
                          touched.confirmPassword
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 focus:ring-green-300 dark:focus:ring-green-600"
                        : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500"
                  } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5">
                  <span className="text-xs">⚠️</span>
                  {fieldErrors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                touched.confirmPassword && (
                  <p className="mt-1.5 text-sm text-green-500 dark:text-green-400 flex items-center gap-1.5">
                    <span className="text-xs">✓</span>
                    Passwords match
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-lg hover:shadow-gray-500/30 dark:hover:shadow-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 dark:via-gray-900/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gray-900 dark:text-white font-semibold hover:underline transition"
            >
              Sign in
            </Link>
          </p>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/50 dark:border-slate-800/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
                Secure Registration
              </span>
            </div>
          </div>

          {/* Security Badges */}
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 text-[10px]">
                ✓
              </span>
              SSL Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 text-[10px]">
                ✓
              </span>
              Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
