import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

type SearchFormProps = {
  onSearch: (city: string) => void;
};

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(city);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Search for a City:</Form.Label>
        <Form.Control
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
      </Form.Group>
      <Button type="submit" variant="primary" className="mt-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchForm;
