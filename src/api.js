import axios from 'axios';

// Si VITE_API_URL es "https://empresagc.onrender.com"
// La unión resultará en "https://empresagc.onrender.com/api"
const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api` 
});

export default API;