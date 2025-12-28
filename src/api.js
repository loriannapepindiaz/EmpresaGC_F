import axios from 'axios';

const API = axios.create({
    // Ya no usamos localhost, usamos tu link de Render
    baseURL: 'https://empresagc.onrender.com/api' 
});

export default API;