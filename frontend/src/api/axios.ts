import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // your Laravel API URL
  withCredentials: false, // true only if using cookies/Sanctum
});

export default api;
