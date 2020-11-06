import React from "react";

import Sensor from "./Sensor";

function SensorGraphComponent() {
  return (
    <div>
      <h1 className="title">센서</h1>
      <Sensor sensorName={"센서A"} sensorStates={["상태a", "상태b", "상태c"]} />
      <br />
      <br />
      <Sensor sensorName={"센서B"} sensorStates={["상태a", "상태b", "상태c"]} />
    </div>
  );
}

export default SensorGraphComponent;
