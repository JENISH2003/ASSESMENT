import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor (for future refresh token handling)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - maybe token expired");
      // Later we will implement automatic refresh logic here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;