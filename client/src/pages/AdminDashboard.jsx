import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Users, AlertCircle } from "lucide-react";
import { FaCow } from "react-icons/fa6";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Greeting message logic
  const adminName = user ? user.name : "Admin";
  const fullMessage = `Welcome back, ${adminName}!`;
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
    if (authLoading) return; // Wait for AuthContext to finish loading
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role.toLowerCase() !== "admin") {
      navigate("/dashboard");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch users
        const usersRes = await axios.get(`${baseUrl}/admin/users`, { headers });
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

        // Fetch animals
        const animalsRes = await axios.get(`${baseUrl}/admin/animals`, { headers });
        setAnimals(Array.isArray(animalsRes.data) ? animalsRes.data : []);

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.details ||
          "Failed to fetch admin data."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-10 pt-20">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        {/* Greeting */}
        <div className="mb-6 mt-10">
          <h2 className="text-2xl font-medium text-green-700">
            {typedMsg}
            {typedMsg.length <= fullMessage.length && (
              <span className="blinking-cursor">|</span>
            )}
          </h2>
          <h1 className="text-4xl font-bold text-center mt-4 text-green-800">
            Admin Dashboard
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Farmers</h3>
              <p className="text-2xl font-bold text-green-700">
                {users.length}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
            <div className="bg-green-100 p-3 rounded-full">
              <FaCow className="text-green-600 w-6 h-6" /> {/* Changed from Cow to FaCow */}
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Animals</h3>
              <p className="text-2xl font-bold text-green-700">
                {animals.length}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
            <div className="bg-green-100 p-3 rounded-full">
              <AlertCircle className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Active Admin</h3>
              <p className="text-2xl font-bold text-green-700">1</p>
            </div>
          </div>
        </div>

        {/* Farmers Section */}
        <section className="mb-12 bg-white shadow-lg rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-green-700 mb-2 sm:mb-0">
              All Farmers
            </h2>
            <span className="text-lg text-gray-600">
              Total Farmers:{" "}
              <span className="font-bold">{users.length}</span>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 text-left text-green-800">Name</th>
                  <th className="px-4 py-2 text-left text-green-800">Email</th>
                  <th className="px-4 py-2 text-left text-green-800">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr
                    key={u._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-green-50 transition-colors`}
                  >
                    <td className="px-4 py-2 border-b">{u.name}</td>
                    <td className="px-4 py-2 border-b">{u.email}</td>
                    <td className="px-4 py-2 border-b">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Animals Section */}
        <section className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-green-700 mb-2 sm:mb-0">
              All Animals
            </h2>
            <span className="text-lg text-gray-600">
              Total Animals:{" "}
              <span className="font-bold">{animals.length}</span>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 text-left text-green-800">
                    Name / Tag Number
                  </th>
                  <th className="px-4 py-2 text-left text-green-800">Type</th>
                  <th className="px-4 py-2 text-left text-green-800">Breed</th>
                  <th className="px-4 py-2 text-left text-green-800">Owner</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((a, index) => (
                  <tr
                    key={a._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-green-50 transition-colors`}
                  >
                    <td className="px-4 py-2 border-b">{a.name}</td>
                    <td className="px-4 py-2 border-b">{a.type}</td>
                    <td className="px-4 py-2 border-b">{a.breed}</td>
                    <td className="px-4 py-2 border-b">
                      {a.owner?.name || a.owner?.email || "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}