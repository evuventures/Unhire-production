import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, // Important for cookies
});

// Response interceptor to handle 401s (optional auto-logout logic)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Logic to redirect to login or clear local state could go here, 
            // but usually handled by AuthContext
        }
        return Promise.reject(error);
    }
);

export default apiClient;
