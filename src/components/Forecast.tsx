import React from "react";
import { Card, Row, Col } from "react-bootstrap";

type ForecastProps = {
  data: any[];
};

const Forecast: React.FC<ForecastProps> = ({ data }) => {
  return (
    <Row>
      {data.map((day, index) => (
        <Col key={index} md={2}>
          <Card className="mb-3 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>
                {new Date(day.dt * 1000).toLocaleDateString()}
              </Card.Title>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
              />
              <p>Temp: {day.main.temp}°F</p>
              <p>Wind: {day.wind.speed} MPH</p>
              <p>Humidity: {day.main.humidity}%</p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Forecast;
