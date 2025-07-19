import React, { useState } from "react";
import axios from "axios";

export default function Profile() {
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/auth/update-password",
        { email, password, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Password updated successfully.");
      setPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-24">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={name}
            disabled
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={email}
            disabled
            readOnly
          />
        </div>
        <form onSubmit={handlePasswordUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Current Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">New Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          {success && <div className="text-green-600 mb-2">{success}</div>}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
