import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai"; // add icon

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);

      // Save all auth data consistently
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userEmail", form.email);
      localStorage.setItem("userRole", res.data.role); // <— store role

      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Signup failed. Try a different email.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-gray-100 rounded-xl shadow-lg p-8 w-96 flex flex-col items-center border border-gray-300">
        {/* centered heading with icon */}
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <AiOutlineUser size={24} /> Sign Up
        </h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Brian Mwangi"
              className="px-2 py-1 border rounded-md placeholder:text-gray-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="briankush05@gmail.com"
              className="px-2 py-1 border rounded-md placeholder:text-gray-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="StrongPass"
              className="px-2 py-1 border rounded-md placeholder:text-gray-400"
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
