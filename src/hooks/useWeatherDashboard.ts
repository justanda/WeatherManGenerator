import { useEffect, useMemo, useState } from "react";
import {
  fetchCoordinatesByCity,
  fetchGoogleCurrentConditions,
  fetchGoogleDailyForecast,
  fetchGoogleHourlyForecast,
  getMissingWeatherApiKeyMessage,
  hasWeatherApiKey,
  normalizeGoogleCurrentWeather,
  normalizeGoogleDailyForecast,
  normalizeGoogleHourlyForecast,
  type NormalizedForecastEntry,
  type UnitSystem,
} from "../services/weatherService";

type ForecastView = "hourly" | "daily";

type SavedLocation = {
  name: string;
  lat: number;
  lon: number;
};

type SearchTarget =
  | { type: "city"; value: string }
  | { type: "coords"; lat: number; lon: number; label?: string };

type WeatherBundle = {
  currentWeather: any;
  hourlyForecast: NormalizedForecastEntry[];
  dailyForecast: NormalizedForecastEntry[];
};

const STORAGE_KEYS = {
  history: "weatherSearchHistory",
  lastCity: "weatherLastCity",
  savedLocations: "weatherSavedLocations",
  unitSystem: "weatherUnitSystem",
  forecastView: "weatherForecastView",
};

const getErrorMessage = (value: unknown) =>
  value instanceof Error ? value.message : "An unexpected error occurred.";

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return fallback;
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
};

const fetchWeatherBundle = async (
  target: SearchTarget,
  unitSystem: UnitSystem,
): Promise<WeatherBundle | null> => {
  const resolved =
    target.type === "city"
      ? await fetchCoordinatesByCity(target.value)
      : {
          lat: target.lat,
          lon: target.lon,
          label: target.label ?? "Your location",
        };

  if (!resolved) {
    return null;
  }

  const currentConditions = await fetchGoogleCurrentConditions(
    resolved.lat,
    resolved.lon,
    unitSystem,
  );

  if (!currentConditions) {
    return null;
  }

  const [hourlyRaw, dailyRaw] = await Promise.all([
    fetchGoogleHourlyForecast(resolved.lat, resolved.lon, unitSystem, 24),
    fetchGoogleDailyForecast(resolved.lat, resolved.lon, unitSystem, 5),
  ]);

  const currentWeather = normalizeGoogleCurrentWeather(
    currentConditions,
    resolved.label,
    resolved.lat,
    resolved.lon,
  );

  return {
    currentWeather,
    hourlyForecast: normalizeGoogleHourlyForecast(hourlyRaw).slice(0, 12),
    dailyForecast: normalizeGoogleDailyForecast(dailyRaw).slice(0, 5),
  };
};

const WEATHER_API_KEY_MESSAGE = getMissingWeatherApiKeyMessage();

export const useWeatherDashboard = () => {
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [hourlyForecast, setHourlyForecast] = useState<
    NormalizedForecastEntry[]
  >([]);
  const [dailyForecast, setDailyForecast] = useState<NormalizedForecastEntry[]>(
    [],
  );
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const [forecastView, setForecastView] = useState<ForecastView>("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    hasWeatherApiKey ? "" : WEATHER_API_KEY_MESSAGE,
  );
  const [activeCity, setActiveCity] = useState("");
  const [lastSearchTarget, setLastSearchTarget] = useState<SearchTarget | null>(
    null,
  );
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setSearchHistory(readJson<string[]>(STORAGE_KEYS.history, []));
    setSavedLocations(
      readJson<SavedLocation[]>(STORAGE_KEYS.savedLocations, []),
    );
    setUnitSystem(readJson<UnitSystem>(STORAGE_KEYS.unitSystem, "imperial"));
    setForecastView(readJson<ForecastView>(STORAGE_KEYS.forecastView, "daily"));
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(searchHistory));
  }, [hasHydrated, searchHistory]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(
      STORAGE_KEYS.savedLocations,
      JSON.stringify(savedLocations),
    );
  }, [hasHydrated, savedLocations]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(STORAGE_KEYS.unitSystem, unitSystem);
  }, [hasHydrated, unitSystem]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(STORAGE_KEYS.forecastView, forecastView);
  }, [hasHydrated, forecastView]);

  const updateHistory = (city: string) => {
    const normalizedCity = city.trim();
    if (!normalizedCity) return;

    setSearchHistory((previousHistory) => {
      const nextHistory = [
        normalizedCity,
        ...previousHistory.filter((entry) => entry !== normalizedCity),
      ];

      return nextHistory.slice(0, 10);
    });
  };

  const setWeatherFromBundle = (bundle: WeatherBundle) => {
    setCurrentWeather(bundle.currentWeather);
    setHourlyForecast(bundle.hourlyForecast);
    setDailyForecast(bundle.dailyForecast);
  };

  const executeSearch = async (target: SearchTarget, recordHistory = true) => {
    if (!hasWeatherApiKey) {
      setError(WEATHER_API_KEY_MESSAGE);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const nextActiveCity =
      target.type === "city" ? target.value : (target.label ?? "Your location");

    setActiveCity(nextActiveCity);
    setLastSearchTarget(target);

    try {
      const bundle = await fetchWeatherBundle(target, unitSystem);

      if (!bundle) {
        setError(
          target.type === "city"
            ? `No weather data found for "${target.value}". Please try another location.`
            : "Unable to load weather for your location. Please try again.",
        );
        return;
      }

      setWeatherFromBundle(bundle);
      setActiveCity(bundle.currentWeather?.name ?? nextActiveCity);

      if (target.type === "city") {
        localStorage.setItem(STORAGE_KEYS.lastCity, target.value);
        if (recordHistory) {
          updateHistory(target.value);
        }
      } else if (target.label) {
        localStorage.setItem(STORAGE_KEYS.lastCity, target.label);
        if (recordHistory) {
          updateHistory(target.label);
        }
      }
    } catch (caughtError) {
      console.error(caughtError);
      setError(getErrorMessage(caughtError));
    } finally {
      setLoading(false);
    }
  };

  const searchCity = async (city: string, recordHistory = true) => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    await executeSearch({ type: "city", value: trimmedCity }, recordHistory);
  };

  const searchCoordinates = async (
    lat: number,
    lon: number,
    label?: string,
  ) => {
    await executeSearch({ type: "coords", lat, lon, label }, true);
  };

  const useCurrentLocation = () => {
    if (!hasWeatherApiKey) {
      setError(WEATHER_API_KEY_MESSAGE);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void searchCoordinates(
          position.coords.latitude,
          position.coords.longitude,
          "Your location",
        );
      },
      () => {
        setLoading(false);
        setError("Location access was denied or unavailable.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  const toggleUnitSystem = () => {
    setUnitSystem((previousSystem) =>
      previousSystem === "imperial" ? "metric" : "imperial",
    );
  };

  useEffect(() => {
    if (!hasHydrated) return;

    if (!hasWeatherApiKey) {
      setError(WEATHER_API_KEY_MESSAGE);
      return;
    }

    const lastCity = localStorage.getItem(STORAGE_KEYS.lastCity);
    if (lastCity) {
      void searchCity(lastCity, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  useEffect(() => {
    if (!hasHydrated || !lastSearchTarget || !hasWeatherApiKey) return;

    const refreshLastSearch = async () => {
      setLoading(true);
      setError("");

      const bundle = await fetchWeatherBundle(lastSearchTarget, unitSystem);

      if (!bundle) {
        setError("Unable to refresh weather data. Please try again.");
        setLoading(false);
        return;
      }

      setWeatherFromBundle(bundle);
      setLoading(false);
    };

    void refreshLastSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitSystem]);

  const forecast = useMemo(
    () => (forecastView === "hourly" ? hourlyForecast : dailyForecast),
    [dailyForecast, forecastView, hourlyForecast],
  );

  const addSavedLocation = (location: SavedLocation) => {
    setSavedLocations((previousLocations) => {
      const alreadySaved = previousLocations.some(
        (entry) => entry.name.toLowerCase() === location.name.toLowerCase(),
      );

      if (alreadySaved) {
        return previousLocations;
      }

      return [location, ...previousLocations].slice(0, 10);
    });
  };

  const removeSavedLocation = (name: string) => {
    setSavedLocations((previousLocations) =>
      previousLocations.filter((entry) => entry.name !== name),
    );
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const saveActiveLocation = () => {
    if (!currentWeather?.coord || !currentWeather?.name) return;

    addSavedLocation({
      name: currentWeather.name,
      lat: currentWeather.coord.lat,
      lon: currentWeather.coord.lon,
    });
  };

  return {
    activeCity,
    addSavedLocation,
    clearSearchHistory,
    currentWeather,
    dailyForecast,
    error,
    forecast,
    forecastView,
    hourlyForecast,
    loading,
    removeSavedLocation,
    saveActiveLocation,
    savedLocations,
    searchCity,
    searchCoordinates,
    searchHistory,
    setForecastView,
    setUnitSystem,
    toggleUnitSystem,
    unitSystem,
    useCurrentLocation,
  };
};
