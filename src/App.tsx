import React from "react";
import { Container, Row, Col, Alert, Badge } from "react-bootstrap";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import SearchForm from "./components/SearchFrom";
import SearchHistory from "./components/SearchHistory";
import SavedLocations from "./components/SavedLocations";
import WeatherControls from "./components/WeatherControls";
import { useWeatherDashboard } from "./hooks/useWeatherDashboard";
import { useTheme } from "./hooks/useTheme";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./weather-app.css";

const getWeatherMood = (weather: any) => {
  const condition = String(weather?.main ?? "").toLowerCase();
  const iconCode = String(weather?.icon ?? "");

  if (iconCode.endsWith("n")) return "night";
  if (condition.includes("thunder")) return "thunderstorm";
  if (condition.includes("drizzle")) return "drizzle";
  if (condition.includes("rain")) return "rain";
  if (condition.includes("snow")) return "snow";
  if (
    condition.includes("mist") ||
    condition.includes("fog") ||
    condition.includes("haze") ||
    condition.includes("smoke") ||
    condition.includes("dust") ||
    condition.includes("sand") ||
    condition.includes("ash") ||
    condition.includes("squall") ||
    condition.includes("tornado")
  ) {
    return "mist";
  }
  if (condition.includes("cloud")) return "clouds";

  return "clear";
};

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const {
    activeCity,
    clearSearchHistory,
    currentWeather,
    error,
    forecast,
    forecastView,
    loading,
    removeSavedLocation,
    saveActiveLocation,
    savedLocations,
    searchCity,
    searchCoordinates,
    searchHistory,
    setForecastView,
    toggleUnitSystem,
    unitSystem,
    useCurrentLocation,
  } = useWeatherDashboard();

  return (
    <div
      className="weather-app"
      data-theme={theme}
      data-weather={getWeatherMood(currentWeather?.weather?.[0])}
    >
      <div className="weather-app-bg" aria-hidden="true" />
      <Container className="app-shell">
        <header className="app-header">
          <div>
            <span className="section-kicker">Weather dashboard</span>
            <h1 className="app-title">
              <i className="bi bi-cloud-sun me-2"></i>
              Weather Explorer
            </h1>
            <p className="app-subtitle">
              Search for any city worldwide to get current conditions and a
              five-day forecast. Save your favorite locations and access them
              anytime.
            </p>
          </div>
          <div className="app-header-controls">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "moody dark" : "cyberpunk light"} mode`}
              aria-label="Toggle theme"
            >
              <i className={`bi bi-${theme === "light" ? "moon-stars" : "brightness-high"}`}></i>
            </button>
            <div className="app-header-badges">
              <Badge bg="light" text="dark" className="app-badge">
                {activeCity || "No city selected"}
              </Badge>
              <Badge bg="primary" className="app-badge">
                {loading ? "Updating" : currentWeather ? "Live data" : "Ready"}
              </Badge>
            </div>
          </div>
        </header>

        <Row className="g-4 align-items-start">
          <Col lg={4} md={5}>
            <SearchForm onSearch={searchCity} isLoading={loading} />
            <WeatherControls
              activeCity={activeCity}
              unitSystem={unitSystem}
              onToggleUnits={toggleUnitSystem}
              onUseCurrentLocation={useCurrentLocation}
              onSaveCurrentLocation={saveActiveLocation}
              canSaveCurrentLocation={Boolean(
                currentWeather?.coord && currentWeather?.name,
              )}
            />
            <SearchHistory
              data={searchHistory}
              onSelectCity={(city) => searchCity(city)}
              onClear={clearSearchHistory}
            />
            <SavedLocations
              data={savedLocations}
              onSelectLocation={(location) =>
                searchCoordinates(location.lat, location.lon, location.name)
              }
              onRemoveLocation={removeSavedLocation}
            />
          </Col>

          <Col lg={8} md={7}>
            {loading && (
              <div className="loading-panel">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 mb-0">Fetching weather data...</p>
              </div>
            )}

            {error && (
              <Alert variant="danger" className="status-alert my-3">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            {currentWeather && !loading && (
              <div className="content-stack">
                <CurrentWeather data={currentWeather} unitSystem={unitSystem} />
                <Forecast
                  data={forecast}
                  forecastView={forecastView}
                  onForecastViewChange={setForecastView}
                  unitSystem={unitSystem}
                />
              </div>
            )}

            {!currentWeather && !loading && !error && (
              <div className="empty-state-panel">
                <i className="bi bi-search display-4"></i>
                <h2>Search for a city</h2>
                <p>
                  Start with a location to unlock the current conditions and
                  forecast.
                </p>
              </div>
            )}
          </Col>
        </Row>

        <footer className="app-footer text-center">
          <small>
            Weather data provided by{" "}
            <a
              href="https://developers.google.com/maps/documentation/weather"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Weather API
            </a>
          </small>
        </footer>
      </Container>
    </div>
  );
};

export default App;
