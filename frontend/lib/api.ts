import axios, { AxiosError, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

/* -- Request: no need for Bearer token with Sanctum cookies -- */

/* -- Response: normalise errors ---------------------------------- */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

export default api;
