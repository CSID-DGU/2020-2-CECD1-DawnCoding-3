import React, { useState } from "react";
import EventComponent from "./EventComponent";
import "./EventTableStyle.css";

function EventTableComponent() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "(154kV 모선 보호)87_B IED Live Status",
      signalName: "E415_P6065_87_BCFG/DevIDLPHD1$ST$PhyHealth$stVal",
      status: "동작중",
      TTS: "able",
    },
    {
      id: 2,
      name: "(154kV 모선 보호)87_B IED Live Status",
      signalName: "E415_P6065_87_BCFG/DevIDLPHD1$ST$PhyHealth$stVal",
      status: "열림",
      TTS: "disable",
    },
  ]);

  console.log(events);
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
        {events.map((event, i) => (
          <EventComponent key={event.id} event={event} num={i + 1} />
        ))}
      </tbody>
    </table>
  );
}

export default EventTableComponent;
