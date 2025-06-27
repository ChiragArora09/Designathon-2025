// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // Send cookies with every request
axios.defaults.baseURL = "http://localhost:3000/api"; // Backend base URL

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    username: null,
    role: null,
    loading: true, // true initially
  });

  // Auto-login on app load (cookie-based)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/me", {
          withCredentials: true
        });
        const { username, role } = res.data;

        localStorage.setItem("username", username);
        localStorage.setItem("role", role);

        setAuth({ isLoggedIn: true, username, role, loading: false });
      } catch (error) {
        console.log("Auto-login failed:", error.response?.data?.message || error.message);
        setAuth({ isLoggedIn: false, username: null, role: null, loading: false });
      }
    };

    fetchUser();
  }, []);

  // Call this on manual login
  const login = ({ username, role }) => {
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    setAuth({ isLoggedIn: true, username, role, loading: false });
  };

  // Call this on logout
  const logout = async () => {
    try {
      await axios.post("/logout");
    } catch (err) {
      console.warn("Logout error:", err.message);
    }

    localStorage.clear();
    setAuth({ isLoggedIn: false, username: null, role: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);