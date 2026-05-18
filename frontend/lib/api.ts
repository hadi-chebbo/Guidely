import axios, { AxiosError, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return value ? decodeURIComponent(value) : null;
};

const getAuthToken = (): string | null => {
  const cookieToken = getCookie("auth_token");
  if (cookieToken) return cookieToken;

  if (typeof window === "undefined") return null;

  return window.localStorage.getItem("auth_token");
};

/* ─────────────────────────────
   REQUEST INTERCEPTOR (TOKEN)
───────────────────────────── */

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  config.headers.Accept = "application/json";

  return config;
});

/* ─────────────────────────────
   RESPONSE INTERCEPTOR
───────────────────────────── */

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;
