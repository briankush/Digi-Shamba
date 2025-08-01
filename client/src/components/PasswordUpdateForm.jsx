import React, { useState } from 'react';
import axios from 'axios';

export default function PasswordUpdateForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError('');
    setSuccess('');

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("New passwords don't match");
    }

    if (formData.newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // For debugging only - create a simple success message without making an actual API call
      // This allows you to test the UI flow while the backend is being updated
      console.log("Password update feature is being implemented on the server");
      console.log("Current password:", formData.currentPassword);
      console.log("New password:", formData.newPassword);

      // Show success message even though we didn't actually update the password
      setSuccess('Password update simulation successful! The real feature will be available after server redeployment.');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Note: Remove this simulation code and uncomment the actual API call when the server is ready
      /*
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
      console.log("Making password update request to:", `${baseUrl}/auth/password`);

      const response = await axios.put(
        `${baseUrl}/auth/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Password update response:", response.data);

      setSuccess('Password updated successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      */
    } catch (err) {
      console.error("Password update error:", err);
      setError(
        err.response?.data?.message ||
        'Failed to update password. The server needs to be redeployed with the new route.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Update Password</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
