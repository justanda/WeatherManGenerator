import React, { useState } from "react";
import { fetchCurrentWeather, fetchForecast } from "../services/weatherService";
import CurrentWeather from "../components/CurrentWeather";
import Forecast from "../components/Forecast";
import SearchForm from "../components/SearchFrom";
import SearchHistory from "../components/SearchHistory";
import { Container, Row, Col } from "react-bootstrap";

const WeatherDashboard: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async (city: string) => {
    const current = await fetchCurrentWeather(city);
    const forecastData = await fetchForecast(city);

    setCurrentWeather(current);
    setForecast(forecastData);

    if (city && !searchHistory.includes(city)) {
      setSearchHistory([city, ...searchHistory].slice(0, 5)); // Limit to 5 cities
    }
  };

  return (
    <Container fluid>
      <Row className="my-4">
        <Col md={3}>
          <h3>Weather Dashboard</h3>
          <SearchForm onSearch={handleSearch} />
          <SearchHistory data={searchHistory} onSelectCity={handleSearch} />
        </Col>
        <Col md={9}>
          <Row>
            <Col md={12}>
              {currentWeather && <CurrentWeather data={currentWeather} />}
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mt-4">
              <h4>5-Day Forecast:</h4>
              <Forecast data={forecast} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default WeatherDashboard;
