import React from "react";
import { Card } from "react-bootstrap";
import { getWeatherIconUrl } from "../services/weatherService";

type CurrentWeatherProps = {
  data: any;
  unitSystem: "imperial" | "metric";
};

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  unitSystem,
}) => {
  const weather = data.weather?.[0] ?? {};
  const temperatureUnit = unitSystem === "imperial" ? "°F" : "°C";
  const windUnit = unitSystem === "imperial" ? "MPH" : "KM/H";
  const formattedWindSpeed = Math.round(data.wind.speed);

  return (
    <Card className="current-weather-card shadow">
      <Card.Body>
        <div className="current-weather-header">
          <div>
            <p className="current-weather-label">Current conditions</p>
            <Card.Title className="current-weather-city">
              {data.name}
            </Card.Title>
            <p className="current-weather-date">
              {new Date(data.dt * 1000).toLocaleDateString([], {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="current-weather-condition text-capitalize">
            {weather.description}
          </div>
        </div>

        <div className="current-weather-info">
          <img
            src={getWeatherIconUrl(weather.icon)}
            alt={weather.description}
            className="weather-icon weather-icon-xl"
          />
          <div className="current-weather-details">
            <p className="current-weather-temp">
              {Math.round(data.main.temp)}
              {temperatureUnit}
            </p>
            <div className="weather-metrics-grid">
              <div className="metric-card">
                <span>Feels like</span>
                <strong>
                  {Math.round(data.main.feels_like)}
                  {temperatureUnit}
                </strong>
              </div>
              <div className="metric-card">
                <span>Wind</span>
                <strong>
                  {formattedWindSpeed} {windUnit}
                </strong>
              </div>
              <div className="metric-card">
                <span>Humidity</span>
                <strong>{data.main.humidity}%</strong>
              </div>
              <div className="metric-card">
                <span>Pressure</span>
                <strong>{data.main.pressure} hPa</strong>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CurrentWeather;
