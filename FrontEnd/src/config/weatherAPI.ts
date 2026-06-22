export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/weather";

export const ENDPOINTS = {
  currentWeather: "/current",
  forecast: "/next-12-hours",
};
