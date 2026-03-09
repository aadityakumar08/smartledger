import axios from 'axios';

const api = axios.create({
    baseURL: 'https://smartledger-tyns.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('smartledger_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('smartledger_token');
            localStorage.removeItem('smartledger_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
