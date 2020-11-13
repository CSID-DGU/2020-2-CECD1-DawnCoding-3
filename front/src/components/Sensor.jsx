import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { newEvents, newEventsClear } from "../modules/newEvents";
import "./SensorStyle.css";
import axios from "axios";

const sensorTheme = [
  "outline-primary",
  "outline-secondary",
  "outline-success",
  "outline-danger",
  "outline-info",
  "outline-dark",
];

function Sensor({ deviceInfo, handleShow, index }) {
  const dispatch = useDispatch();
  const [sensorState, setSensorState] = useState(
    deviceInfo.statuses[deviceInfo.currentStatusCode]
  );

  const onClickEvent = (e) => {
    e.preventDefault();
    (async () => {
      try {
        let statusCode = null;
        Object.entries(deviceInfo.statuses).forEach((inner, index) => {
          if (inner[1] === sensorState) statusCode = index;
        });
        const sendData = {
          deviceId: deviceInfo.deviceId,
          currentStatusCode: statusCode,
          tts: deviceInfo.tts,
        };
        const { data } = await axios.put("/device", sendData);
        let beforeData = [];
        beforeData.push(data);
        let result = [];
        console.log(data);
        beforeData.forEach((v) => {
          result.push({
            id: v.deviceId,
            name: v.deviceName,
            signalName: v.signalName,
            status: v.statuses[v.currentStatusCode],
            TTS: `${v.tts}`,
            blink: true,
            checked: false,
          });
        });
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
    <Button variant={sensorTheme[index]}>{deviceInfo.deviceName}</Button>
    // <div id="sensor">
    //   <div id="sensorName">{deviceInfo.deviceName}</div>
    //   <select id="state" onChange={onChangeSensorState}>
    //     {Object.entries(deviceInfo.statuses).map((inner) => (
    //       <option key={inner[0]}>{inner[1]}</option>
    //     ))}
    //   </select>
    //   <button onClick={onClickEvent}>이벤트 발생</button>
    // </div>
  );
}

export default Sensor;
