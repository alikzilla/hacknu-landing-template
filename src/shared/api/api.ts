import axios, { AxiosError } from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://hacknu-4bou.onrender.com/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export function toApiError(error: unknown): string {
  const e = error as AxiosError<any>;
  if (e.response?.data?.message) return e.response.data.message as string;
  if (e.response?.status) return `HTTP ${e.response.status}`;
  if (e.message) return e.message;
  return "Unknown error";
}
