import axios from "axios";

export type UnitSystem = "imperial" | "metric";

const GOOGLE_WEATHER_API_KEY = (
  import.meta as ImportMeta & {
    env?: { VITE_GOOGLE_WEATHER_API_KEY?: string };
  }
).env?.VITE_GOOGLE_WEATHER_API_KEY;
const GOOGLE_WEATHER_BASE_URL = "https://weather.googleapis.com/v1";
const GOOGLE_GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode";
const DEFAULT_UNITS: UnitSystem = "imperial";
const MISSING_API_KEY_MESSAGE =
  "This deployment is missing VITE_GOOGLE_WEATHER_API_KEY. Add it to your hosting environment and redeploy.";

export const hasWeatherApiKey = Boolean(GOOGLE_WEATHER_API_KEY);

export const getMissingWeatherApiKeyMessage = () => MISSING_API_KEY_MESSAGE;

const unitSystemToGoogle = (units: UnitSystem) =>
  units === "imperial" ? "IMPERIAL" : "METRIC";

const toUnixSeconds = (isoDate?: string) => {
  if (!isoDate) return Math.floor(Date.now() / 1000);
  const millis = Date.parse(isoDate);
  return Number.isNaN(millis)
    ? Math.floor(Date.now() / 1000)
    : Math.floor(millis / 1000);
};

const toWeatherMain = (conditionType?: string) => {
  const type = String(conditionType ?? "").toUpperCase();

  if (type.includes("THUNDER")) return "Thunderstorm";
  if (type.includes("DRIZZLE")) return "Drizzle";
  if (type.includes("RAIN") || type.includes("SHOWERS")) return "Rain";
  if (type.includes("SNOW") || type.includes("ICE") || type.includes("FREEZ"))
    return "Snow";
  if (
    type.includes("MIST") ||
    type.includes("FOG") ||
    type.includes("HAZE") ||
    type.includes("SMOKE")
  ) {
    return "Mist";
  }
  if (type.includes("CLOUD") || type.includes("OVERCAST")) return "Clouds";

  return "Clear";
};

export const getWeatherIconUrl = (iconRef?: string) => {
  if (!iconRef) {
    return "https://maps.gstatic.com/weather/v1/sunny.png";
  }

  if (iconRef.startsWith("http")) {
    return iconRef.endsWith(".png") ? iconRef : `${iconRef}.png`;
  }

  return iconRef;
};

type GeocodeResponse = {
  results?: Array<{
    formatted_address?: string;
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
    };
  }>;
  status?: string;
};

type GoogleCurrentConditions = {
  currentTime?: string;
  weatherCondition?: {
    iconBaseUri?: string;
    description?: { text?: string };
    type?: string;
  };
  temperature?: { degrees?: number };
  feelsLikeTemperature?: { degrees?: number };
  relativeHumidity?: number;
  airPressure?: { meanSeaLevelMillibars?: number };
  wind?: { speed?: { value?: number } };
};

type GoogleHourlyForecastEntry = {
  interval?: { startTime?: string };
  weatherCondition?: {
    iconBaseUri?: string;
    description?: { text?: string };
    type?: string;
  };
  temperature?: { degrees?: number };
  relativeHumidity?: number;
  wind?: { speed?: { value?: number } };
};

type GoogleDailyForecastEntry = {
  interval?: { startTime?: string };
  daytimeForecast?: {
    weatherCondition?: {
      iconBaseUri?: string;
      description?: { text?: string };
      type?: string;
    };
    relativeHumidity?: number;
    wind?: { speed?: { value?: number } };
  };
  nighttimeForecast?: {
    weatherCondition?: {
      iconBaseUri?: string;
      description?: { text?: string };
      type?: string;
    };
  };
  maxTemperature?: { degrees?: number };
  minTemperature?: { degrees?: number };
};

type GoogleHourlyForecastResponse = {
  forecastHours?: GoogleHourlyForecastEntry[];
};

type GoogleDailyForecastResponse = {
  forecastDays?: GoogleDailyForecastEntry[];
};

export type NormalizedCurrentWeather = {
  name: string;
  dt: number;
  coord: { lat: number; lon: number };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  googleCurrentConditions: GoogleCurrentConditions;
};

export type NormalizedForecastEntry = {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
};

export const fetchCoordinatesByCity = async (city: string) => {
  if (!GOOGLE_WEATHER_API_KEY) {
    console.error(MISSING_API_KEY_MESSAGE);
    return null;
  }

  try {
    const { data } = await axios.get<GeocodeResponse>(
      `${GOOGLE_GEOCODE_BASE_URL}/json`,
      {
        params: {
          address: city,
          key: GOOGLE_WEATHER_API_KEY,
        },
      },
    );

    const first = data.results?.[0];
    const lat = first?.geometry?.location?.lat;
    const lon = first?.geometry?.location?.lng;

    if (typeof lat !== "number" || typeof lon !== "number") {
      return null;
    }

    return {
      lat,
      lon,
      label: first?.formatted_address ?? city,
    };
  } catch (error) {
    console.error("Error fetching coordinates by city:", error);
    return null;
  }
};

export const fetchGoogleCurrentConditions = async (
  lat: number,
  lon: number,
  units: UnitSystem = DEFAULT_UNITS,
) => {
  if (!GOOGLE_WEATHER_API_KEY) {
    console.error(MISSING_API_KEY_MESSAGE);
    return null;
  }

  try {
    const { data } = await axios.get<GoogleCurrentConditions>(
      `${GOOGLE_WEATHER_BASE_URL}/currentConditions:lookup`,
      {
        params: {
          key: GOOGLE_WEATHER_API_KEY,
          "location.latitude": lat,
          "location.longitude": lon,
          unitsSystem: unitSystemToGoogle(units),
        },
      },
    );

    return data;
  } catch (error) {
    console.error("Error fetching Google current conditions:", error);
    return null;
  }
};

export const fetchGoogleHourlyForecast = async (
  lat: number,
  lon: number,
  units: UnitSystem = DEFAULT_UNITS,
  hours = 24,
) => {
  if (!GOOGLE_WEATHER_API_KEY) {
    console.error(MISSING_API_KEY_MESSAGE);
    return [];
  }

  try {
    const { data } = await axios.get<GoogleHourlyForecastResponse>(
      `${GOOGLE_WEATHER_BASE_URL}/forecast/hours:lookup`,
      {
        params: {
          key: GOOGLE_WEATHER_API_KEY,
          "location.latitude": lat,
          "location.longitude": lon,
          unitsSystem: unitSystemToGoogle(units),
          hours,
          pageSize: hours,
        },
      },
    );

    return data.forecastHours ?? [];
  } catch (error) {
    console.error("Error fetching Google hourly forecast:", error);
    return [];
  }
};

export const fetchGoogleDailyForecast = async (
  lat: number,
  lon: number,
  units: UnitSystem = DEFAULT_UNITS,
  days = 5,
) => {
  if (!GOOGLE_WEATHER_API_KEY) {
    console.error(MISSING_API_KEY_MESSAGE);
    return [];
  }

  try {
    const { data } = await axios.get<GoogleDailyForecastResponse>(
      `${GOOGLE_WEATHER_BASE_URL}/forecast/days:lookup`,
      {
        params: {
          key: GOOGLE_WEATHER_API_KEY,
          "location.latitude": lat,
          "location.longitude": lon,
          unitsSystem: unitSystemToGoogle(units),
          days,
          pageSize: days,
        },
      },
    );

    return data.forecastDays ?? [];
  } catch (error) {
    console.error("Error fetching Google daily forecast:", error);
    return [];
  }
};

export const normalizeGoogleCurrentWeather = (
  currentConditions: GoogleCurrentConditions,
  cityLabel: string,
  lat: number,
  lon: number,
): NormalizedCurrentWeather => {
  const description =
    currentConditions.weatherCondition?.description?.text ??
    "Current conditions";

  return {
    name: cityLabel,
    dt: toUnixSeconds(currentConditions.currentTime),
    coord: { lat, lon },
    main: {
      temp: currentConditions.temperature?.degrees ?? 0,
      feels_like: currentConditions.feelsLikeTemperature?.degrees ?? 0,
      humidity: currentConditions.relativeHumidity ?? 0,
      pressure: currentConditions.airPressure?.meanSeaLevelMillibars ?? 0,
    },
    wind: {
      speed: currentConditions.wind?.speed?.value ?? 0,
    },
    weather: [
      {
        main: toWeatherMain(currentConditions.weatherCondition?.type),
        description,
        icon: getWeatherIconUrl(
          currentConditions.weatherCondition?.iconBaseUri,
        ),
      },
    ],
    googleCurrentConditions: currentConditions,
  };
};

export const normalizeGoogleHourlyForecast = (
  forecastHours: GoogleHourlyForecastEntry[],
): NormalizedForecastEntry[] =>
  forecastHours.map((entry) => ({
    dt: toUnixSeconds(entry.interval?.startTime),
    main: {
      temp: entry.temperature?.degrees ?? 0,
      humidity: entry.relativeHumidity ?? 0,
    },
    wind: {
      speed: entry.wind?.speed?.value ?? 0,
    },
    weather: [
      {
        main: toWeatherMain(entry.weatherCondition?.type),
        description: entry.weatherCondition?.description?.text ?? "",
        icon: getWeatherIconUrl(entry.weatherCondition?.iconBaseUri),
      },
    ],
  }));

export const normalizeGoogleDailyForecast = (
  forecastDays: GoogleDailyForecastEntry[],
): NormalizedForecastEntry[] =>
  forecastDays.map((entry) => {
    const daytime = entry.daytimeForecast;
    const fallbackCondition = entry.nighttimeForecast?.weatherCondition;
    const weatherCondition = daytime?.weatherCondition ?? fallbackCondition;

    return {
      dt: toUnixSeconds(entry.interval?.startTime),
      main: {
        temp:
          entry.maxTemperature?.degrees ?? entry.minTemperature?.degrees ?? 0,
        humidity: daytime?.relativeHumidity ?? 0,
      },
      wind: {
        speed: daytime?.wind?.speed?.value ?? 0,
      },
      weather: [
        {
          main: toWeatherMain(weatherCondition?.type),
          description: weatherCondition?.description?.text ?? "",
          icon: getWeatherIconUrl(weatherCondition?.iconBaseUri),
        },
      ],
    };
  });
