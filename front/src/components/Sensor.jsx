import React from "react";
import { useDispatch } from "react-redux";
import { newEvents, newEventsClear, fakeAjax } from "../modules/newEvents";
import "./SensorStyle.css";

function Sensor() {
  const dispatch = useDispatch();
  const onClickEvent = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const result = await fakeAjax();
        dispatch(newEvents(result));
      } catch (err) {
        console.log(err);
      }
    })();
    dispatch(newEventsClear());
  };

  return (
    <div id="sensor">
      <span id="sensorName">센서 A</span>
      <select name="state" id="state">
        <option value="aa">aa</option>
        <option value="bb">bb</option>
        <option value="cc">cc</option>
      </select>
      <button onClick={onClickEvent}>이벤트 발생</button>
    </div>
  );
}

export default Sensor;
