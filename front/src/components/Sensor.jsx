import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { newEvents, newEventsClear, fakeAjax } from "../modules/newEvents";
import "./SensorStyle.css";

function Sensor({ sensorName, sensorStates }) {
  const dispatch = useDispatch();
  const [sensorState, setSensorState] = useState(sensorStates[0]);
  const onClickEvent = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const result = await fakeAjax(sensorName, sensorState); // 실제 서버와의 통신이 필요한 부분
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
      <div id="sensorName">{sensorName}</div>
      <select id="state" onChange={onChangeSensorState}>
        {sensorStates.map((inner) => (
          <option key={inner}>{inner}</option>
        ))}
      </select>
      <button onClick={onClickEvent}>이벤트 발생</button>
    </div>
  );
}

export default Sensor;
