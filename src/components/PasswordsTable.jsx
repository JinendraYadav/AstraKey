import React, { useState } from "react";
import { Eye, EyeOff, Copy, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const PasswordsTable = ({ passwords, onEdit, onDelete }) => {
  const [visiblePasswords, setVisiblePasswords] = useState([]);

  const toggleVisibility = (index) => {
    setVisiblePasswords((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCopy = (label, text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} link copied!`);
    });
  };

  return (
    <div className="PasswordsTable flex justify-center m-1 py-2">
      {passwords.length === 0 ? (
        <div className="text-[var(--color-text)] flex justify-center items-center w-screen text-center text-5xl opacity-20 h-[40vh]">
          No Passwords to show
        </div>
      ) : (
        <table className="table-auto text-[var(--color-text)] w-screen">
          <thead>
            <tr>
              <th className="py-2 w-[30%]">Website</th>
              <th className="py-2 w-[30%]">Username</th>
              <th className="py-2 w-[30%]">Password</th>
              <th className="py-2 w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {passwords.map((item, index) => (
              <tr key={item.id || item._id}>
                {/* Website with Copy */}
                <td className="py-1 px-3 flex justify-between gap-2 overflow-clip">
                  <a href={item.site} target="_blank">
                    {item.site}
                  </a>
                  <button
                    onClick={() => handleCopy("Website", item.site)}
                    className="cursor-pointer"
                  >
                    <Copy size={18} />
                  </button>
                </td>

                {/* Username with Copy */}
                <td className="py-1 px-3 relative pr-10">
                  <span>{item.username}</span>
                  <button
                    onClick={() => handleCopy("Username", item.username)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                  >
                    <Copy size={18} />
                  </button>
                </td>

                {/* Password with visibility & Copy */}
                <td className="py-1 px-3 relative pr-16">
                  <span>
                    {visiblePasswords.includes(index)
                      ? item.password || "N/A"
                      : "•".repeat(item.password?.length || 8)}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleVisibility(index)}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                  >
                    {visiblePasswords.includes(index) ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopy("Password", item.password)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                  >
                    <Copy size={18} />
                  </button>
                </td>

                {/* Edit/Delete Buttons */}
                <td className="py-1 px-3 h-full">
                  <div className="flex justify-center items-center gap-3 h-full">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PasswordsTable;
