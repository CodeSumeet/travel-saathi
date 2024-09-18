import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.0.107:8000/api", // Update to your base URL
});

// Request Interceptor to attach the token automatically
apiClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      "accessToken"
    )}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Trigger a token refresh by calling your backend endpoint
        const response = await axios.post(
          "/api/auth/refresh-token",
          {
            username: "john_doe",
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        // Update the token in the local storage
        localStorage.setItem("accessToken", response.data.accessToken);

        console.log(response);
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        // Optionally handle user logout or redirect to login page
        // e.g., window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
