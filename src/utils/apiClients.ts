import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const handleApiError = (err: unknown): string => {
  if (err instanceof AxiosError && err.response) {
    return err.response.data.message || "Something went wrong.";
  }
  return "An unexpected error occurred.";
};

export default apiClient;