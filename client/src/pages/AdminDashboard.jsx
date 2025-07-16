import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Admin";

  // Typing animation
  const fullMessage = `Welcome back, ${userName}!`;
  const [typedMsg, setTypedMsg] = useState("");
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setTypedMsg(fullMessage.slice(0, idx + 1));
      idx++;
      if (idx > fullMessage.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [fullMessage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || localStorage.getItem("userRole") !== "Admin") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [uRes, aRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", { headers }),
          axios.get("http://localhost:5000/api/admin/animals", { headers })
        ]);
        setUsers(uRes.data);
        setAnimals(aRes.data);
      } catch (err) {
        setError("Failed to load admin data");
      }
    };
    fetchData();
  }, [navigate]);

  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white text-black p-8 pt-20">
      {/* Animated greeting — left-aligned */}
      <h2 className="text-2xl font-semibold mb-4 text-left">
        {typedMsg}
        {typedMsg.length <= fullMessage.length && (
          <span className="blinking-cursor">|</span>
        )}
      </h2>
      {/* Dashboard title can remain centered or be left-aligned as needed */}
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Farmers Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">All Farmers</h2>
          <span className="text-lg">Total Farmers: {users.length}</span>
        </div>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td className="border px-4 py-2">{u.name}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Animals Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">All Animals</h2>
          <span className="text-lg">Total Animals: {animals.length}</span>
        </div>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name / Tag Number</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Breed</th>
              <th className="border px-4 py-2">Owner</th>
            </tr>
          </thead>
          <tbody>
            {animals.map(a => (
              <tr key={a._id}>
                <td className="border px-4 py-2">{a.name}</td>
                <td className="border px-4 py-2">{a.type}</td>
                <td className="border px-4 py-2">{a.breed}</td>
                <td className="border px-4 py-2">
                  {a.owner?.name || a.owner?.email || "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
