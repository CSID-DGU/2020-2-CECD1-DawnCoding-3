import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { newEvents, newEventsClear, fakeAjax } from "../modules/newEvents";
import "./SensorStyle.css";

function Sensor({ deviceInfo }) {
  const dispatch = useDispatch();
  const [sensorState, setSensorState] = useState(deviceInfo.statuses[0]);

  useEffect(() => {
    console.log(deviceInfo);
  }, []);

  const onClickEvent = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const result = await fakeAjax(deviceInfo.deviceName, sensorState); // 실제 서버와의 통신이 필요한 부분
        dispatch(newEvents(result));
      } catch (err) {
        console.log(err);
      }
    })();
    dispatch(newEventsClear());
  };

  const onChangeSensorState = (e) => {
    setSensorState(e.target.value);
  };

  return (
    <div id="sensor">
      <div id="sensorName">{deviceInfo.deviceName}</div>
      <select id="state" onChange={onChangeSensorState}>
        {Object.entries(deviceInfo.statuses).map((inner) => (
          <option key={inner[0]}>{inner[1]}</option>
        ))}
      </select>
      <button onClick={onClickEvent}>이벤트 발생</button>
    </div>
  );
}

export default Sensor;
