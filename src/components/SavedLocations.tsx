import React from "react";
import { Button, Card, ListGroup } from "react-bootstrap";

type SavedLocation = {
  name: string;
  lat: number;
  lon: number;
};

type SavedLocationsProps = {
  data: SavedLocation[];
  onSelectLocation: (location: SavedLocation) => void;
  onRemoveLocation: (name: string) => void;
};

const SavedLocations: React.FC<SavedLocationsProps> = ({
  data,
  onSelectLocation,
  onRemoveLocation,
}) => {
  return (
    <Card className="search-history saved-locations-card">
      <div className="section-heading section-heading-row">
        <div>
          <span className="section-kicker">Saved</span>
          <h2>Locations</h2>
        </div>
      </div>

      {data.length > 0 ? (
        <ListGroup>
          {data.map((location) => (
            <ListGroup.Item key={location.name} className="saved-location-item">
              <button
                type="button"
                className="saved-location-button"
                onClick={() => onSelectLocation(location)}
              >
                <i className="bi bi-bookmark-fill me-2"></i>
                <span>{location.name}</span>
              </button>
              <Button
                variant="link"
                className="saved-location-remove"
                onClick={() => onRemoveLocation(location.name)}
              >
                Remove
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">Save a few cities to revisit them faster.</p>
      )}
    </Card>
  );
};

export default SavedLocations;
