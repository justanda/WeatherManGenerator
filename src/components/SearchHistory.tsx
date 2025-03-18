import React from "react";
import { ListGroup, Badge } from "react-bootstrap";

type SearchHistoryProps = {
  data: string[];
  onSelectCity: (city: string) => void;
};

const SearchHistory: React.FC<SearchHistoryProps> = ({
  data,
  onSelectCity,
}) => {
  return (
    <div className="search-history">
      <h5>
        <i className="bi bi-clock-history"></i> Search History
        {data.length > 0 && (
          <Badge bg="primary" className="ms-2">
            {data.length}
          </Badge>
        )}
      </h5>
      {data.length > 0 ? (
        <ListGroup>
          {data.map((city, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => onSelectCity(city)}
              className="d-flex align-items-center"
            >
              <i className="bi bi-geo-alt me-2"></i>
              {city}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">No search history yet</p>
      )}
    </div>
  );
};

export default SearchHistory;
