import React from "react";
import { Card, Row, Col } from "react-bootstrap";

type ForecastProps = {
  data: any[];
};

const Forecast: React.FC<ForecastProps> = ({ data }) => {
  // Format date to show day of week
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="d-flex flex-nowrap overflow-auto py-2">
        {data.map((day, index) => (
          <div key={index} className="px-2">
            <Card className="forecast-card shadow-sm h-100">
              <Card.Body className="text-center">
                <Card.Title>{formatDate(day.dt)}</Card.Title>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="weather-icon"
                />
                <p className="fw-bold">{Math.round(day.main.temp)}°F</p>
                <p className="text-capitalize small">
                  {day.weather[0].description}
                </p>
                <p className="small">Wind: {day.wind.speed} MPH</p>
                <p className="small">Humidity: {day.main.humidity}%</p>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
