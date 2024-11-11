import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

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
