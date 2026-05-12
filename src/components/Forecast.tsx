import React from "react";
import { Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { getWeatherIconUrl } from "../services/weatherService";

type ForecastProps = {
  data: any[];
  forecastView: "hourly" | "daily";
  onForecastViewChange: (view: "hourly" | "daily") => void;
  unitSystem: "imperial" | "metric";
};

const Forecast: React.FC<ForecastProps> = ({
  data,
  forecastView,
  onForecastViewChange,
  unitSystem,
}) => {
  const temperatureUnit = unitSystem === "imperial" ? "°F" : "°C";
  const windUnit = unitSystem === "imperial" ? "MPH" : "KM/H";

  const formatLabel = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    if (forecastView === "hourly") {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getTemperature = (temperature: number) => Math.round(temperature);
  const getWindSpeed = (speed: number) => Math.round(speed);

  const chartMax = Math.max(...data.map((entry) => entry.main.temp), 1);
  const getChartHeight = (temperature: number) =>
    `${Math.max(18, (temperature / chartMax) * 100)}%`;

  return (
    <div className="forecast-container">
      <div className="section-heading forecast-heading">
        <div>
          <span className="section-kicker">Outlook</span>
          <h2>
            {forecastView === "hourly" ? "Hourly forecast" : "5-day forecast"}
          </h2>
        </div>
        <ButtonGroup
          size="sm"
          className="forecast-toggle"
          aria-label="Forecast view toggle"
        >
          <Button
            variant={forecastView === "daily" ? "primary" : "outline-primary"}
            onClick={() => onForecastViewChange("daily")}
          >
            Daily
          </Button>
          <Button
            variant={forecastView === "hourly" ? "primary" : "outline-primary"}
            onClick={() => onForecastViewChange("hourly")}
          >
            Hourly
          </Button>
        </ButtonGroup>
      </div>

      <Row className="g-3 forecast-grid">
        {data.map((day, index) => (
          <Col key={index} xs={12} sm={6} xl={2}>
            <Card className="forecast-card shadow-sm h-100">
              <Card.Body className="text-center forecast-card-body">
                <Card.Title className="forecast-date">
                  {formatLabel(day.dt)}
                </Card.Title>
                <img
                  src={getWeatherIconUrl(day.weather[0].icon)}
                  alt={day.weather[0].description}
                  className="weather-icon weather-icon-md"
                />
                <p className="forecast-temp">
                  {getTemperature(day.main.temp)}
                  {temperatureUnit}
                </p>
                <p className="text-capitalize forecast-description">
                  {day.weather[0].description}
                </p>
                <div className="forecast-mini-stats">
                  <span>
                    Wind {getWindSpeed(day.wind.speed)} {windUnit}
                  </span>
                  <span>Humidity {day.main.humidity}%</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="forecast-chart-panel">
        <div className="section-heading forecast-chart-heading">
          <span className="section-kicker">Trend</span>
          <h2>
            {forecastView === "hourly"
              ? "Hourly temperature"
              : "Daily temperature"}
          </h2>
        </div>
        <div className="forecast-chart">
          {data.map((entry, index) => (
            <div className="forecast-chart-bar" key={`${entry.dt}-${index}`}>
              <div
                className="forecast-chart-fill"
                style={{ height: getChartHeight(entry.main.temp) }}
              />
              <span className="forecast-chart-value">
                {getTemperature(entry.main.temp)}
                {temperatureUnit}
              </span>
              <span className="forecast-chart-label">
                {formatLabel(entry.dt)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forecast;
