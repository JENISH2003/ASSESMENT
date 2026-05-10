import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import axiosInstance, { setAccessToken } from "../services/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // CHECK AUTH STATUS (Runs when app loads)
  const checkAuth = useCallback(async () => {
    try {
      const refreshRes = await axiosInstance.post("/auth/refresh-token");

      const newToken = refreshRes.data.token;
      setAccessToken(newToken);

      const userRes = await axiosInstance.get("/auth/me");
      setUser(userRes.data.data);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // LOGIN USER

  const login = useCallback(async (formData) => {
    const res = await axiosInstance.post("/auth/login", formData);

    setUser(res.data.data);

    setAccessToken(res.data.token);

    return res;
  }, []);

  // REGISTER USER

  const register = useCallback(async (formData) => {
    const res = await axiosInstance.post("/auth/register", formData);

    setUser(res.data.data);

    setAccessToken(res.data.token);

    return res;
  }, []);

  // LOGOUT USER

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      setUser,
    }),
    [user, loading, login, register, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
