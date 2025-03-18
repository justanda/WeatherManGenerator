import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import SearchForm from "./components/SearchFrom";
import SearchHistory from "./components/SearchHistory";
import { fetchCurrentWeather, fetchForecast } from "./services/weatherService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./weather-app.css";

const App: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("weatherSearchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError("");

    try {
      const weatherData = await fetchCurrentWeather(city);

      if (!weatherData) {
        setError(
          `No weather data found for "${city}". Please try another location.`
        );
        setLoading(false);
        return;
      }

      setCurrentWeather(weatherData);

      const forecastData = await fetchForecast(city);
      setForecast(forecastData);

      // Add city to search history if not already present
      if (!searchHistory.includes(city)) {
        setSearchHistory([city, ...searchHistory.slice(0, 9)]);
      }
    } catch (err) {
      setError(
        "An error occurred while fetching weather data. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <Container>
        <header className="app-header">
          <h1 className="app-title">
            <i className="bi bi-cloud-sun"></i> Weather Dashboard
          </h1>
          <p className="app-subtitle">
            Check current weather and forecasts for cities around the world
          </p>
        </header>

        <Row>
          <Col lg={4} md={5}>
            <SearchForm onSearch={handleSearch} />
            <SearchHistory data={searchHistory} onSelectCity={handleSearch} />
          </Col>

          <Col lg={8} md={7}>
            {loading && (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Fetching weather data...</p>
              </div>
            )}

            {error && (
              <Alert variant="danger" className="my-3">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            {currentWeather && !loading && (
              <>
                <CurrentWeather data={currentWeather} />
                <Forecast data={forecast} />
              </>
            )}

            {!currentWeather && !loading && !error && (
              <div className="text-center my-5 p-5 bg-light rounded">
                <i className="bi bi-search display-1 text-muted"></i>
                <p className="mt-3">
                  Search for a city to view weather information
                </p>
              </div>
            )}
          </Col>
        </Row>

        <footer className="text-center mt-5 pt-3 text-muted">
          <small>
            Weather data provided by{" "}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenWeatherMap
            </a>
          </small>
        </footer>
      </Container>
    </div>
  );
};

export default App;
