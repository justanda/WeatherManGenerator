import axios from "axios";

const API_KEY = "4bfcaa0ff68a125f5d73fa1355c4c6ed";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchCurrentWeather = async (city: string) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: { q: city, appid: API_KEY, units: "imperial" },
    });
    return data;
  } catch (error) {
    console.error("Error fetching current weather data:", error);
    return null;
  }
};

export const fetchForecast = async (city: string) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: { q: city, appid: API_KEY, units: "imperial" },
    });
    return data.list.filter((entry: any) => entry.dt_txt.includes("12:00:00"));
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return [];
  }
};
