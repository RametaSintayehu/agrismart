import axios from 'axios';
const api = import.meta.env.VITE_API_URL;

export const getUsers= () => {
   return axios.get(`${api}/api/users`); 
};

    //Attach token automatically if present
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('agrismart_token');
        // ensure headers object exists and set Authorization correctly
        config.headers = config.headers || {};
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
export default api;
