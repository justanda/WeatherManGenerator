import React from "react";
import { ListGroup } from "react-bootstrap";

type SearchHistoryProps = {
  data: string[];
  onSelectCity: (city: string) => void;
};

const SearchHistory: React.FC<SearchHistoryProps> = ({
  data,
  onSelectCity,
}) => {
  return (
    <div className="mt-4">
      <h5>Search History</h5>
      <ListGroup>
        {data.map((city, index) => (
          <ListGroup.Item
            key={index}
            action
            onClick={() => onSelectCity(city)}
            className="text-primary"
          >
            {city}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default SearchHistory;
