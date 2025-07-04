import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import API from "../api/axios";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Logged in via Google!");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    const { username, password } = form;

    if (!username || !password) {
      toast.error("Please fill out both fields.");
      return;
    }

    try {
      const res = await API.post("/auth/login", { username, password });

      const token = res?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("No token received from server.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="flex w-full min-h-[85vh] justify-center items-center">
      <div className="flex flex-col items-center gap-5 p-12 w-[28rem] border rounded-2xl bg-[var(--color-tertiary)] shadow-2xl">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
          Login to Your Account
        </h2>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-3 w-full text-lg rounded-md"
        />

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

        <button
          onClick={handleLogin}
          className="bg-[var(--color-primary)] text-white px-8 py-3 text-lg rounded-full w-full hover:brightness-110 transition-all duration-200"
        >
          Login
        </button>
        <button
          onClick={handleGoogleLogin}
          className=" px-8 py-3 text-lg rounded-full w-full border border-[var(--color-primary)] hover:bg-[#e9e9e9] transition-all duration-200"
        >
          <div className="flex gap-3 justify-center items-center">
            <img
              src="/Google-Logo.webp=s48-fcrop64=1,00000000ffffffff-rw"
              alt="google-logo"
              className="w-6"
            />
            <span>Sign in with Google</span>
          </div>
        </button>

        <p className="text-base text-gray-600 mt-3">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-[var(--color-primary)] underline hover:text-[var(--color-secondary)] transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
