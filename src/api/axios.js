// src/api/axios.js
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // ✅ Important
});

export default API;
