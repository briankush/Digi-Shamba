import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (!user.role || user.role.toLowerCase() !== "admin") {
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

        // Debug: log endpoints and token
        console.log("Fetching users from:", `${baseUrl}/admin/users`);
        console.log("Fetching animals from:", `${baseUrl}/admin/animals`);
        console.log("Token:", token);

        // Fetch users
        const usersRes = await axios.get(`${baseUrl}/admin/users`, { headers });
        console.log("Users response:", usersRes.data);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

        // Fetch animals
        const animalsRes = await axios.get(`${baseUrl}/admin/animals`, { headers });
        console.log("Animals response:", animalsRes.data);
        setAnimals(Array.isArray(animalsRes.data) ? animalsRes.data : []);

        setLoading(false);
      } catch (err) {
        // Log error for debugging
        console.error("Admin fetch error:", err);
        setError(
          err.response?.data?.message ||
          err.response?.data?.details ||
          err.message ||
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
    <div className="min-h-screen bg-white text-black p-8 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-green-800">Admin Dashboard</h1>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>
          {users.length === 0 ? (
            <div className="text-gray-600">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="py-2 px-4 border-b">{u.name}</td>
                      <td className="py-2 px-4 border-b">{u.email}</td>
                      <td className="py-2 px-4 border-b">{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Animals</h2>
          {animals.length === 0 ? (
            <div className="text-gray-600">No animals found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.map((a) => (
                <div key={a._id} className="bg-gray-100 p-4 rounded shadow">
                  <h3 className="text-xl font-bold text-green-700">{a.name}</h3>
                  <p>
                    <span className="font-medium">Type:</span> {a.type}
                  </p>
                  <p>
                    <span className="font-medium">Breed:</span> {a.breed}
                  </p>
                  <p>
                    <span className="font-medium">Owner:</span> {a.owner?.name || a.owner}
                  </p>
                  <p>
                    <span className="font-medium">Weight:</span> {a.weight} kg
                  </p>
                  {a.notes && (
                    <p className="mt-2 text-gray-600">
                      <span className="font-medium">Notes:</span> {a.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}