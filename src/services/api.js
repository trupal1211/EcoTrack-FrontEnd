import axios from "axios";

const api = axios.create({
  baseURL: "https://ecotrack-2yax.onrender.com/api", // or your backend URL
  withCredentials: true, // 👈 CRUCIAL for sending cookies
});

export default api;
