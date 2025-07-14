import React from "react";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-gray-100 rounded-xl shadow-lg p-8 w-96 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
