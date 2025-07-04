import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import Username from "./components/Username"; // ✅ Imported your component

function App() {
  return (
    <div className="relative min-h-screen max-w-screen overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[var(--color-tertiary)] bg-[radial-gradient(ellipse_80%_80%_at_50%_-15%,rgba(0,173,181,0.3),rgba(255,255,255,0))]" />

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        {/* Default route: redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login & Signup Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔑 Google OAuth fallback: ask for username */}
        <Route path="/choose-username" element={<Username />} />

        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Manager />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Footer */}
      <Footer />

      {/* Toasts */}
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}

export default App;
