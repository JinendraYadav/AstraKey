import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api/axios"; // This is your Axios instance

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null); // null = loading, false = not logged in

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/verify"); // Updated endpoint
        if (res.data.success) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (auth === null)
    return (
      <div className="text-center mt-20 text-[var(--color-text)]">
        Checking login...
      </div>
    );

  if (auth === false) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
