import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
