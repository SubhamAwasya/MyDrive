// axios.js
import axios from "axios";

const isProduction = true;
export const serverURL = isProduction
  ? "https://mydrive-75kj.onrender.com"
  : "http://localhost:3000";

const api = axios.create({
  baseURL: serverURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
