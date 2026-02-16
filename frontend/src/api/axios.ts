import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // your Laravel API URL
  withCredentials: true,
  withXSRFToken: true, // Add this line
  timeout: 600000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest", // Add this line
  },
});

export default api;
