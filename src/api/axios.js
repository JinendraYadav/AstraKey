// src/api/axios.js
import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials: true, // ✅ Important
});

export default API;
