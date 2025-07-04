import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Username = () => {
  const [username, setUsername] = useState("");
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      setError("Missing email from Google Login.");
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password: Math.random().toString(36).slice(-8), // Dummy password
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ Signup successful, redirect to home/dashboard
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Choose a Username</h1>
      <p className="mb-4 text-center">
        Your email is already linked. Pick a unique username to continue.
      </p>
      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter a unique username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-400 rounded-md p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Username;
