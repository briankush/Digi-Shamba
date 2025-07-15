import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", res.data.name);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-gray-100 rounded-xl shadow-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Email:</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 px-2 py-1 border rounded placeholder:text-gray-400"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Password:</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 px-2 py-1 border rounded placeholder:text-gray-400"
            />
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
