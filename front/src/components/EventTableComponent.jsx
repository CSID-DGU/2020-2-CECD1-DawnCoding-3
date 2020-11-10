import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EventComponent from "./EventComponent";
import SensorGraphComponent from "./SensorGraphComponent";
import { v4 as uuid } from "uuid";
import "./EventTableStyle.css";

function EventTableComponent() {
  const newEvents = useSelector((state) => state.newEventsReducer);

  const [events, setEvents] = useState([
    // {
    //   id: 1,
    //   name: "예시 센서1",
    //   signalName: "예시 센서1-시그널1",
    //   status: "동작중",
    //   TTS: "able",
    //   blink: true,
    //   checked: false, // 새로운 이벤트(체크 전, 후에 새로운 이벤트 등장하면 전체 checked를 true로 변경해주는 작업 필요)
    // },
    // {
    //   id: 2,
    //   name: "예시 센서1",
    //   signalName: "예시 센서1-시그널2",
    //   status: "열림",
    //   TTS: "disable",
    //   blink: false,
    //   checked: true, // 기존 이벤트(이미 체크함)
    // },
  ]);

  // 새로운 이벤트 들어오면 화면에 표시
  useEffect(() => {
    const beforeEvents = [];
    events.forEach((event) => {
      beforeEvents.push({
        ...event,
        id: event.id + newEvents.length, // Backend로부터 전달받은 newEvent 개수만큼 id를 더해줌
        blink: false,
        checked: true,
      });
    });
    newEvents.forEach((event) => beforeEvents.unshift(event));
    setEvents(beforeEvents);
  }, [newEvents]);

  const onClickStopBtn = () => {
    let newEvents = [];
    events.forEach((event) => {
      newEvents.push({ ...event });
    });
    newEvents.map((event) => (event.blink = false));
    setEvents(newEvents);
  };

  return (
    <div>
      <h1 className="title">이벤트 테이블</h1>
      <div className="tableOuter">
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
              <EventComponent
                key={`${event.id}${event.status}${uuid()}`}
                event={event}
                num={i + 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      <button className="stopBtn" onClick={onClickStopBtn}>
        멈춤
      </button>
      <SensorGraphComponent />
    </div>
  );
}

export default EventTableComponent;
