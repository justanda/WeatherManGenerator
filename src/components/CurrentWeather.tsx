import React from "react";
import { Card } from "react-bootstrap";

type CurrentWeatherProps = {
  data: any;
};

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  return (
    <Card className="shadow-sm my-3">
      <Card.Body>
        <Card.Title className="text-center">
          {data.name} ({new Date(data.dt * 1000).toLocaleDateString()})
        </Card.Title>
        <Card.Text className="text-center">
          <img
            src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt={data.weather[0].description}
          />
          <p>Temp: {data.main.temp}°F</p>
          <p>Wind: {data.wind.speed} MPH</p>
          <p>Humidity: {data.main.humidity}%</p>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CurrentWeather;
