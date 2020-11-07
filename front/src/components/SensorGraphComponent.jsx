import React, { useEffect, useState } from "react";
import Sensor from "./Sensor";
import axios from "axios";

function SensorGraphComponent() {
  const [devices, setDevices] = useState(null);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/devices");
      setDevices(data);
    })();
  }, []);
  return (
    <div>
      <h1 className="title">Devices</h1>
      {devices &&
        devices.map(
          (device) =>
            device && <Sensor deviceInfo={device} key={device.deviceId} />
        )}
    </div>
  );
}

export default SensorGraphComponent;
