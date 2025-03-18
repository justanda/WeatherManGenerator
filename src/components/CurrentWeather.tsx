import React from "react";
import { Card } from "react-bootstrap";

type CurrentWeatherProps = {
  data: any;
};

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  return (
    <Card className="current-weather-card shadow">
      <Card.Body>
        <Card.Title className="text-center">
          {data.name} ({new Date(data.dt * 1000).toLocaleDateString()})
        </Card.Title>
        <div className="current-weather-info">
          <img
            src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            alt={data.weather[0].description}
            className="weather-icon"
          />
          <div className="current-weather-details">
            <p className="current-weather-temp">
              {Math.round(data.main.temp)}°F
            </p>
            <p className="text-capitalize">{data.weather[0].description}</p>
            <p>Wind: {data.wind.speed} MPH</p>
            <p>Humidity: {data.main.humidity}%</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CurrentWeather;
