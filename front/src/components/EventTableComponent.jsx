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
      blink: true,
      checked: false, // 새로운 이벤트(체크 전, 후에 새로운 이벤트 등장하면 전체 checked를 false로 변경해주는 작업 필요)
    },
    {
      id: 2,
      name: "(154kV 모선 보호)87_B IED Live Status",
      signalName: "E415_P6065_87_BCFG/DevIDLPHD1$ST$PhyHealth$stVal",
      status: "열림",
      TTS: "disable",
      blink: false,
      checked: true, // 기존 이벤트(이미 체크함)
    },
  ]);

  const onClickButton = () => {
    let newEvents = [...events];
    newEvents.map((event) => (event.blink = false));
    setEvents(newEvents);
  };

  return (
    <div>
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
      <button className="stopBtn" onClick={onClickButton}>
        멈춤
      </button>
    </div>
  );
}

export default EventTableComponent;
