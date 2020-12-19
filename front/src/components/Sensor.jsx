import React from "react";
import { Button } from "react-bootstrap";

const sensorTheme = [
  "outline-primary",
  "outline-secondary",
  "outline-success",
  "outline-danger",
  "outline-info",
  "outline-dark",
];

function Sensor({ deviceInfo, handleShow, index }) {
  return (
    <Button variant={sensorTheme[index]} onClick={handleShow}>
      {deviceInfo.deviceName}
    </Button>
  );
}

export default Sensor;
