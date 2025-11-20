import axios from 'axios';
const api = import.meta.env.VITE_API_URL;

export const getUsers= () => {
   return axios.get(`${api}/api/users`); 
};