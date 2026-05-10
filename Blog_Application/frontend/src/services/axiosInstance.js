import axios from "axios";

// ==========================================
// 1. VARIABLE FOR IN-MEMORY TOKEN STORAGE
// ==========================================
// This variable disappears when the user refreshes the page, which is highly secure!
let accessToken = null;

export const setAccessToken = (newToken) => {
  accessToken = newToken;
};

export const getAccessToken = () => {
  return accessToken;
};

// ==========================================
// 2. CREATE AXIOS INSTANCE
// ==========================================
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// 3. REQUEST INTERCEPTOR (Runs BEFORE every API request)
// ==========================================
axiosInstance.interceptors.request.use((config) => {
  // Check our memory to see if we have an access token
  const token = getAccessToken();
  
  if (token) {
    // If yes, automatically attach it to the request header
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// ==========================================
// 4. RESPONSE INTERCEPTOR (Runs AFTER every API response)
// ==========================================
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If we get an error, check the original failed request
    const originalRequest = error.config;
    
    // Check if the error is "401 Unauthorized" (meaning our Access Token expired)
    // AND make sure we haven't already tried to refresh it (_retry prevents infinite loops)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      
      try {
        // Step A: Ask the backend for a brand new Access Token. 
        // Note: The browser will automatically send the Refresh Token Cookie under the hood.
        // We use standard axios here to avoid infinite loops with our axiosInstance interceptors.
        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true } 
        );

        // Step B: Save the new access token into our memory variable
        const newAccessToken = response.data.token;
        setAccessToken(newAccessToken);

        // Step C: Update the original failed request with the new token and try again!
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
        
      } catch {
        // If the refresh token is ALSO expired, the user must log in again.
        console.error("Refresh token expired. User must login again.");
      }
    }
    
    // If it's a different error (like 500 Server Error), just reject it normally
    return Promise.reject(error);
  }
);

export default axiosInstance;