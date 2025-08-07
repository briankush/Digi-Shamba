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
  const [debugInfo, setDebugInfo] = useState({});

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
      setDebugInfo({});
      
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";
        
        const debugData = {
          baseUrl,
          token: token ? "Present" : "Missing",
          userRole: user.role,
          timestamp: new Date().toISOString()
        };
        setDebugInfo(debugData);
        
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        console.log("Admin Dashboard: Starting data fetch...");
        console.log("API Base URL:", baseUrl);
        console.log("User role:", user.role);

        // Fetch users
        console.log("Fetching users...");
        const usersRes = await axios.get(`${baseUrl}/admin/users`, { headers });
        console.log("Users response status:", usersRes.status);
        console.log("Users data type:", typeof usersRes.data);
        console.log("Users data length:", Array.isArray(usersRes.data) ? usersRes.data.length : "Not an array");
        
        if (!Array.isArray(usersRes.data)) {
          console.error("Users response is not an array:", usersRes.data);
          throw new Error("Invalid response format for users");
        }
        setUsers(usersRes.data);

        // Fetch animals
        console.log("Fetching animals...");
        const animalsRes = await axios.get(`${baseUrl}/admin/animals`, { headers });
        console.log("Animals response status:", animalsRes.status);
        console.log("Animals data type:", typeof animalsRes.data);
        console.log("Animals data length:", Array.isArray(animalsRes.data) ? animalsRes.data.length : "Not an array");
        
        if (!Array.isArray(animalsRes.data)) {
          console.error("Animals response is not an array:", animalsRes.data);
          throw new Error("Invalid response format for animals");
        }
        setAnimals(animalsRes.data);

        setLoading(false);
        console.log("Admin Dashboard: Data fetch completed successfully");
      } catch (err) {
        console.error("Admin Dashboard: Fetch error:", err);
        
        const errorDetails = {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url
        };
        
        console.error("Error details:", errorDetails);
        
        setError(
          `Error: ${err.message}\n` +
          `Status: ${err.response?.status || "Network Error"}\n` +
          `Details: ${err.response?.data?.message || "Check console for more info"}`
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-lg font-semibold text-red-600 mb-3">Error Loading Data</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{error}</pre>
          <div className="text-xs text-gray-500">
            <h4 className="font-semibold mb-1">Debug Info:</h4>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-green-800">Admin Dashboard</h1>
      
      {/* Debug Info Panel */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">All Users ({users.length})</h2>
          {users.length === 0 ? (
            <div className="text-gray-600 bg-yellow-50 p-4 rounded">
              <p>No users found. This could indicate:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>No users in database</li>
                <li>Database connection issue</li>
                <li>Authentication problem</li>
              </ul>
            </div>
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
          <h2 className="text-2xl font-semibold mb-4">All Animals ({animals.length})</h2>
          {animals.length === 0 ? (
            <div className="text-gray-600 bg-yellow-50 p-4 rounded">
              <p>No animals found. This could indicate:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>No animals in database</li>
                <li>Database connection issue</li>
                <li>Authentication problem</li>
              </ul>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.map((a) => (
                <div key={a._id} className="bg-gray-100 p-4 rounded shadow">
                  <h3 className="text-xl font-bold text-green-700">{a.name}</h3>
                  <p><span className="font-medium">Type:</span> {a.type}</p>
                  <p><span className="font-medium">Breed:</span> {a.breed}</p>
                  <p><span className="font-medium">Owner:</span> {a.owner?.name || "Unknown"}</p>
                  <p><span className="font-medium">Weight:</span> {a.weight} kg</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
