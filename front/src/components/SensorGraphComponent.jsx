import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newEvents, fakeAjax } from "../modules/newEvents";

function SensorGraphComponent() {
  const evnets = useSelector((state) => state.newEventsReducer);

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
  };
  useEffect(() => {
    console.log(evnets);
  }, [evnets]);
  return (
    <div>
      <h1>sldfkjsdfl</h1>
      <button onClick={onClickEvent}>sdlfkj</button>
    </div>
  );
}

export default SensorGraphComponent;
