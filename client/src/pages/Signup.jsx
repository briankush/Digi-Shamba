import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, UserPlus } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({ level: "", color: "" });
  const navigate = useNavigate();

  // Check password strength
  const checkPasswordStrength = (pwd) => {
    let strength = { level: "Weak", color: "text-red-500" };
    const mediumRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (strongRegex.test(pwd)) {
      strength = { level: "Strong", color: "text-green-600" };
    } else if (mediumRegex.test(pwd)) {
      strength = { level: "Medium", color: "text-yellow-500" };
    }
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    checkPasswordStrength(pwd);
    setPasswordMatch(pwd === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(password === e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!passwordMatch) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const API = import.meta.env.VITE_API_BASE_URL;
      const apiUrl = API.startsWith("http") ? API : `https://${API}`;

      const response = await axios.post(`${apiUrl}/auth/signup`, {
        name,
        email,
        password,
      });

      // Save user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userEmail", response.data.email || "");
      localStorage.setItem("userRole", response.data.role);

      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Signup failed. Please try again.");
      } else if (err.request) {
        setError("Could not connect to the server. Please try again later.");
      } else {
        setError(`An error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        {error && (
          <div className="rounded-md bg-red-100 p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            className="block w-full border px-3 py-2 rounded-t-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            className="block w-full border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div>
            <input
              type="password"
              placeholder="Password"
              className="block w-full border px-3 py-2"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {password && (
              <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                Password Strength: {passwordStrength.level}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className={`block w-full border px-3 py-2 rounded-b-md ${
                confirmPassword && !passwordMatch ? "border-red-500" : ""
              }`}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {!passwordMatch && confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:text-green-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
