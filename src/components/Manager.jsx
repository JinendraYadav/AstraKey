import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PasswordsTable from "./PasswordsTable";
import { toast } from "react-toastify";

const Manager = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [currentlyEditing, setCurrentlyEditing] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState("");

  useEffect(() => {
    fetchUserAndPasswords();
  }, []);

  const fetchUserAndPasswords = async (updated = false) => {
    try {
      let username = loggedInUsername;

      if (!username || updated) {
        const userRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!userRes.ok) throw new Error("Failed to get user");
        const user = await userRes.json();
        username = user.username;
        setLoggedInUsername(username);
      }

      const pwRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/passwords`, {
        method: "GET",
        credentials: "include",
      });

      if (!pwRes.ok) throw new Error(`HTTP error ${pwRes.status}`);
      const data = await pwRes.json();

      const filtered = data.filter((item) => username === username);
      setPasswordArray(filtered);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const savePassword = async () => {
    if (!form.site || !form.password || !form.username) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      if (currentlyEditing) {
        await updatePassword({ ...form, id: currentlyEditing });
        setCurrentlyEditing(null);
        toast.success("Password updated successfully!");
      } else {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/passwords`, {
          method: "POST",
          credentials: "include", // Needed for sending cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            site: form.site,
            username: form.username,
            password: form.password,
          }),
        });

        if (res.status === 401) {
          toast.error("You must be logged in to save a password.");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to save password");
        }

        toast.success("Password added successfully!");
      }

      setForm({ site: "", username: "", password: "" });
      await fetchUserAndPasswords(true);
    } catch (err) {
      console.error("Error saving password:", err);
      toast.error("Failed to save password.");
    }
  };

  const updatePassword = async (updated) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/passwords/${updated.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updated),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      // ✅ Refresh after update
      await fetchUserAndPasswords(true);
      toast.success("Password updated successfully!");
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error("Error updating password. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/passwords/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setPasswordArray((prev) => prev.filter((item) => item.id !== id));
      toast.success("Password deleted successfully!");
    } catch (err) {
      console.error("Error deleting password:", err);
      toast.error("Failed to delete password.");
    }
  };

  const onEdit = (passwordObj) => {
    setForm(passwordObj);
    setCurrentlyEditing(passwordObj.id);
  };

  return (
    <div className="my-7 mx-auto p-4 w-full max-w-[70vw] min-h-[85vh]">
      <div className="flex justify-center text-4xl font-bold">
        <span className="text-[var(--color-text)]">Astra </span>
        <span className="text-[var(--color-primary)]"> Key</span>
      </div>

      <div className="tagline flex justify-center py-3 text-[var(--color-text)]">
        <span>
          One
          <span className="text-[var(--color-primary)]"> Key</span>. Infinite
          <span className="text-[var(--color-primary)]"> Security</span>.
        </span>
      </div>

      <div className="input flex flex-col gap-5 items-center">
        <input
          type="text"
          placeholder="URL"
          name="site"
          value={form.site}
          required
          onChange={handleChange}
          className="border-[var(--color-secondary)] border-2 rounded-md w-full bg-white p-2"
        />
        <div className="flex gap-4 w-full">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={form.username}
            required
            onChange={handleChange}
            className="border-[var(--color-secondary)] border-2 rounded-md w-[70%] bg-white p-2"
          />
          <div className="relative w-1/2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={form.password}
              required
              onChange={handleChange}
              className="border-[var(--color-secondary)] border-2 rounded-md w-full bg-white p-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <button
        className="bg-[var(--color-primary)] px-4 py-2 rounded-full mx-auto flex items-center justify-center mt-6 text-[var(--color-text)] font-normal gap-1 border border-[var(--color-secondary)] cursor-pointer"
        onClick={savePassword}
      >
        <lord-icon
          src="https://cdn.lordicon.com/sbnjyzil.json"
          trigger="loop"
          delay="2000"
          stroke="bold"
          colors="primary:#393e46,secondary:#eeeeee"
        ></lord-icon>
        Add Password
      </button>

      <div className="p-4 rounded-xl min-h-[51vh]">
        <h2 className="text-2xl text-[var(--color-text)] font-[600] text-center">
          Your Passwords
        </h2>
        <PasswordsTable
          passwords={passwordArray}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Manager;
