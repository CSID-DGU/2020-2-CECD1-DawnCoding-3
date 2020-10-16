import React from "react";
import EventComponent from "./EventComponent";
import "./EventTableStyle.css";

function EventTableComponent() {
  return (
    <table>
      <thead>
        <tr>
          <th>Num</th>
          <th>명칭</th>
          <th>Signal Name</th>
          <th>상태</th>
          <th>TTS</th>
        </tr>
      </thead>
      <tbody>
        {Array(10)
          .fill()
          .map((v, i) => (
            <EventComponent key={i} />
          ))}
      </tbody>
    </table>
  );
}

export default EventTableComponent;
