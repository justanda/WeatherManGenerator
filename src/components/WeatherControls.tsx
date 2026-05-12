import React from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";

type WeatherControlsProps = {
  activeCity: string;
  unitSystem: "imperial" | "metric";
  onToggleUnits: () => void;
  onUseCurrentLocation: () => void;
  onSaveCurrentLocation: () => void;
  canSaveCurrentLocation: boolean;
  isDisabled?: boolean;
};

const WeatherControls: React.FC<WeatherControlsProps> = ({
  activeCity,
  unitSystem,
  onToggleUnits,
  onUseCurrentLocation,
  onSaveCurrentLocation,
  canSaveCurrentLocation,
  isDisabled,
}) => {
  return (
    <Card className="controls-card search-section">
      <div className="section-heading">
        <span className="section-kicker">Controls</span>
        <h2>Mode, location, units</h2>
        <p>
          Toggle visual mode, jump to your current position, switch units, or
          save the active city.
        </p>
      </div>

      <div className="controls-chip-row">
        <span className="controls-chip">
          {activeCity || "No location loaded"}
        </span>
        <span className="controls-chip controls-chip-muted">
          {unitSystem === "imperial" ? "Imperial" : "Metric"}
        </span>
      </div>

      <ButtonGroup className="controls-actions" aria-label="Weather controls">
        <Button variant="outline-primary" onClick={onUseCurrentLocation} disabled={isDisabled}>
          <i className="bi bi-geo-alt me-2"></i>
          My location
        </Button>
        <Button variant="outline-primary" onClick={onToggleUnits} disabled={isDisabled}>
          <i className="bi bi-arrow-left-right me-2"></i>
          {unitSystem === "imperial"
            ? "Switch to metric"
            : "Switch to imperial"}
        </Button>
        <Button
          variant="primary"
          onClick={onSaveCurrentLocation}
          disabled={!canSaveCurrentLocation || isDisabled}
        >
          <i className="bi bi-bookmark-plus me-2"></i>
          Save city
        </Button>
      </ButtonGroup>
    </Card>
  );
};

export default WeatherControls;
