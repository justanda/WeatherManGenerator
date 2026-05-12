import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

type SearchFormProps = {
  onSearch: (city: string) => void;
  isLoading?: boolean;
};

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity("");
    }
  };

  return (
    <div className="search-section">
      <div className="section-heading">
        <span className="section-kicker">Explore</span>
        <h2>Search any city</h2>
        <p>Load current conditions and a five-day outlook.</p>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className="visually-hidden">Search for a city</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Try San Diego, Tokyo, or London"
              aria-label="City name"
            />
            <Button type="submit" variant="primary" disabled={isLoading}>
              <i className="bi bi-search me-2"></i>
              {isLoading ? "Searching" : "Search"}
            </Button>
          </InputGroup>
          <Form.Text className="text-muted">
            Enter a city name to get current weather and forecast.
          </Form.Text>
        </Form.Group>
      </Form>
    </div>
  );
};

export default SearchForm;
