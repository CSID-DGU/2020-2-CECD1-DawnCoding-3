import React from "react";
import { useDispatch } from "react-redux";
import { newEvents, newEventsClear, fakeAjax } from "../modules/newEvents";

function SensorGraphComponent() {
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
    <div>
      <h1>센서들</h1>
      <button onClick={onClickEvent}>이벤트 발생시키기</button>
    </div>
  );
}

export default SensorGraphComponent;
