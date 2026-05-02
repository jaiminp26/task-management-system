import axios from "axios";

const localApi =
  import.meta.env.VITE_API_URL_LOCAL || "http://localhost:5000/api";
const liveApi =
  import.meta.env.VITE_API_URL_REMOTE ||
  "https://task-management-system-lb5q.onrender.com/api";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const configuredApi =
  import.meta.env.VITE_API_URL || (isLocalhost ? localApi : liveApi);

const api = axios.create({
  baseURL: configuredApi,
  withCredentials: true,
});

export default api;
