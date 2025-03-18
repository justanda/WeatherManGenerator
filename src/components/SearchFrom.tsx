import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

type SearchFormProps = {
  onSearch: (city: string) => void;
};

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
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
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Search for a City:</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              aria-label="City name"
            />
            <Button type="submit" variant="primary">
              <i className="bi bi-search"></i> Search
            </Button>
          </InputGroup>
          <Form.Text className="text-muted">
            Enter a city name to get current weather and forecast
          </Form.Text>
        </Form.Group>
      </Form>
    </div>
  );
};

export default SearchForm;
