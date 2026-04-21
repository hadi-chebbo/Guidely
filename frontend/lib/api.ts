import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

/* ── Request: attach Bearer token ──────────────────────────────── */
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("guidely_token")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ── Response: normalise errors ────────────────────────────────── */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("guidely_token");
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

export default api;
