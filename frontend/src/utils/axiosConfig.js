import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL =
  import.meta.env.VITE_APP_URL || "https://dream-girl-foundation.onrender.com";

export const setupAxiosInterceptors = () => {
  // Request interceptor: Add JWT token to all requests
  axios.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor: Handle 401 errors and refresh token
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            // No refresh token, need to re-login
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.reload();
            return Promise.reject(error);
          }

          // Attempt to refresh the access token
          const refreshResponse = await axios.post("/api/auth/refresh-token", {
            refreshToken,
          });

          const { accessToken: newAccessToken } = refreshResponse.data;

          // Store new access token
          localStorage.setItem("accessToken", newAccessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          console.error("Token refresh failed:", refreshError);
          window.location.reload();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
};

/**
 * Initialize JWT token from localStorage on app load
 */
export const initializeJWTToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
};

/**
 * Clear JWT tokens and authorization header
 */
export const clearJWTToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenExpiry");
  delete axios.defaults.headers.common["Authorization"];
};

export default axios;
