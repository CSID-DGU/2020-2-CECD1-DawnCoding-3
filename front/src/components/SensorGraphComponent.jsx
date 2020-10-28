import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import newEvents from "../modules/newEvents";

function SensorGraphComponent() {
  const data = useSelector((state) => state.events);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(data);
    dispatch(newEvents);
  }, [dispatch]);
  return (
    <div>
      <h1>sldfkjsdfl</h1>
    </div>
  );
}

export default SensorGraphComponent;
