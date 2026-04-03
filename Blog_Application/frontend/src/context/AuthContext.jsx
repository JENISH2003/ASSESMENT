import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Axios base config
  axios.defaults.baseURL = "http://localhost:5000/api";
  axios.defaults.withCredentials = true; // VERY IMPORTANT for cookies

  // 🔹 Check auth status on app load
  const checkAuth = async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser(res.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 🔹 Login
  const login = async (formData) => {
    const res = await axios.post("/auth/login", formData);
    if (res.data.data.refreshToken) {
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
    }
    setUser(res.data.data);
    return res;
  };

  // 🔹 Register
  const register = async (formData) => {
    const res = await axios.post("/auth/register", formData);
    if (res.data.data.refreshToken) {
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
    }
    setUser(res.data.data);
    return res;
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axios.post("/auth/logout", { refreshToken });
      } else {
        // Fallback for case where we don't have it locally
        await axios.post("/auth/logout", { refreshToken: "dummy_token" });
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);