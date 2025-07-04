import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import API from "../api/axios";

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    try {
      const { email, username, password } = form;
      const res = await API.post("/auth/signup", { email, username, password });

      // ✅ Expect the backend to return { success: true, message: "..." }
      if (res.data.success) {
        toast.success("🎉 Signup successful! Redirecting to login...");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Signup failed. Please try again.";
      toast.error(`❌ ${errorMsg}`);
    }
  };

  return (
    <div className="flex w-full min-h-[85vh] justify-center items-center">
      <div className="flex flex-col items-center gap-6 p-12 w-[28rem] border rounded-2xl bg-[var(--color-tertiary)] shadow-2xl">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
          Create Your Account
        </h2>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-3 w-full text-lg rounded-md"
        />

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-3 w-full text-lg rounded-md"
        />

        {/* Password Field */}
        <div className="relative w-full">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-3 w-full text-lg rounded-md pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative w-full">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="border p-3 w-full text-lg rounded-md pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleSignup}
          className="bg-[var(--color-primary)] text-white px-8 py-3 text-lg rounded-full w-full hover:brightness-110 transition-all duration-200"
        >
          Sign Up
        </button>

        <p className="text-base text-gray-600 mt-3">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--color-primary)] underline hover:text-[var(--color-secondary)] transition"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
