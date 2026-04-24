import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
// Import our custom axios instance instead of standard axios
import axiosInstance, { setAccessToken } from "../services/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CHECK AUTH STATUS (Runs when app loads)
  // ==========================================
  const checkAuth = useCallback(async () => {
    try {
      // Step 1: Because React memory is wiped when the page reloads, 
      // we must instantly ask the backend for a new Access Token using our Refresh Cookie.
      const refreshRes = await axiosInstance.post("/auth/refresh-token");
      
      // Step 2: Store the new token securely in our variable memory
      const newToken = refreshRes.data.token;
      setAccessToken(newToken);

      // Step 3: Now that we have an active token, we can securely get our user details
      const userRes = await axiosInstance.get("/auth/me");
      setUser(userRes.data.data);
      
    } catch (error) {
      // If refresh fails (because there's no cookie, or their session expired), 
      // it means the user is officially logged out. Let's clear their data.
      setUser(null);
      setAccessToken(null);
    } finally {
      // Stop the loading spinner regardless of success or failure
      setLoading(false); 
    }
  }, []);

  // Run checkAuth once immediately when the app starts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ==========================================
  // LOGIN USER
  // ==========================================
  const login = useCallback(async (formData) => {
    const res = await axiosInstance.post("/auth/login", formData);
    
    // Update our React context with the user info
    setUser(res.data.data);
    
    // Save the new Access Token to memory
    setAccessToken(res.data.token);
    
    return res;
  }, []);

  // ==========================================
  // REGISTER USER
  // ==========================================
  const register = useCallback(async (formData) => {
    const res = await axiosInstance.post("/auth/register", formData);
    
    // Update our React context with the user info
    setUser(res.data.data);
    
    // Save the new Access Token to memory
    setAccessToken(res.data.token);
    
    return res;
  }, []);

  // ==========================================
  // LOGOUT USER
  // ==========================================
  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      // Instantly clear all frontend data to make sure they can't access secure pages
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    setUser,
  }), [user, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so any component can easily use our auth functions
export const useAuth = () => useContext(AuthContext);