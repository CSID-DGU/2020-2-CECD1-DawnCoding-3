import React, { useEffect, useState } from "react";
import Sensor from "./Sensor";
import { Modal, Button } from "react-bootstrap";

import axios from "axios";

function SensorGraphComponent() {
  const [devices, setDevices] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/devices");
      setDevices(data);
    })();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <h1 className="title">Devices</h1>
      <div className="sensors">
        {devices &&
          devices.map(
            (device, index) =>
              device && (
                <Sensor
                  deviceInfo={device}
                  key={device.deviceId}
                  index={index % 6}
                  handleShow={handleShow}
                />
              )
          )}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SensorGraphComponent;
