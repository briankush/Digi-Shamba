import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (token) {
      setUser({ token, name, role, email });
    } else {
      setLoading(false);
    }
  }, []);

  // Debug what's happening
  console.log("AuthContext state:", { user, loading });

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
