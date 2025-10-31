import axios from 'axios';
const api = axios.create({ 
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

    //Attach token automatically if present
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('agrismart_token');
        // ensure headers object exists and set Authorization correctly
        config.headers = config.headers || {};
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
export default api;
