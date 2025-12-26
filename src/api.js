import axios from 'axios';

const API = axios.create({
    // Aquí pones la URL de tu BACKEND (el otro repo cuando lo corras)
    // Por ahora usamos el puerto 3000 que es el estándar
    baseURL: 'http://localhost:3000/api' 
});

export default API;