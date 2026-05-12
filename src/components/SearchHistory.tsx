import React from "react";
import { ListGroup, Button } from "react-bootstrap";

type SearchHistoryProps = {
  data: string[];
  onSelectCity: (city: string) => void;
  onClear?: () => void;
};

const SearchHistory: React.FC<SearchHistoryProps> = ({
  data,
  onSelectCity,
  onClear,
}) => {
  return (
    <div className="search-history">
      <div className="section-heading section-heading-row">
        <div>
          <span className="section-kicker">Recent</span>
          <h2>Search history</h2>
        </div>
        {data.length > 0 && onClear && (
          <Button
            variant="link"
            className="clear-history-btn"
            onClick={onClear}
          >
            Clear
          </Button>
        )}
      </div>
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
        <p className="text-muted">No saved searches yet.</p>
      )}
    </div>
  );
};

export default SearchHistory;
