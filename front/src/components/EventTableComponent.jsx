import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EventComponent from "./EventComponent";
import SensorGraphComponent from "./SensorGraphComponent";
import "./EventTableStyle.css";

function EventTableComponent() {
  const newEvents = useSelector((state) => state.newEventsReducer);

  const [events, setEvents] = useState([
    {
      id: 1,
      name: "(154kV 모선 보호)87_B IED Live Status",
      signalName: "E415_P6065_87_BCFG/DevIDLPHD1$ST$PhyHealth$stVal",
      status: "동작중",
      TTS: "able",
      blink: true,
      checked: false, // 새로운 이벤트(체크 전, 후에 새로운 이벤트 등장하면 전체 checked를 true로 변경해주는 작업 필요)
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

  useEffect(() => {
    console.log(newEvents);
  }, [newEvents]);

  const onClickStopBtn = () => {
    let newEvents = [...events];
    newEvents.map((event) => (event.blink = false));
    setEvents(newEvents);
  };

  // const onClickNewEventBtn = () => {
  //   // Backend로부터 전달받을 event 배열로 바꿔야 함
  //   const newEvent = [
  //     {
  //       id: 1,
  //       name: "(154kV 모선 보호)87_B IED Live Status",
  //       signalName: "E415_P6065_87_BCFG/DevIDLPHD1$ST$PhyHealth$stVal",
  //       status: "닫힘",
  //       TTS: "able",
  //       blink: true,
  //       checked: false,
  //     },
  //     {
  //       id: 2,
  //       name: "(154kV 모선 보호)87_B IED Live Status",
  //       signalName: "E415_P6065_87_BCFG/DevIDLPHD1$ST$PhyHealth$stVal",
  //       status: "안열림",
  //       TTS: "able",
  //       blink: true,
  //       checked: false,
  //     },
  //   ];

  //   const beforeEvents = [];
  //   events.forEach((event) => {
  //     beforeEvents.push({
  //       ...event,
  //       id: event.id + newEvent.length, // Backend로부터 전달받은 newEvent 개수만큼 id를 더해줌
  //       blink: false,
  //       checked: true,
  //     });
  //   });
  //   newEvent.forEach((event) => beforeEvents.unshift(event));
  //   setEvents(beforeEvents);
  // };

  const onClickNewEventBtn = (e) => {
    e.preventDefault();
    console.log(newEvents);
  };

  return (
    <div>
      <h1 className="eventTableTitle">이벤트 테이블</h1>
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
      <button className="stopBtn" onClick={onClickStopBtn}>
        멈춤
      </button>
      <button className="newEvent" onClick={onClickNewEventBtn}>
        이벤트 추가
      </button>
    </div>
  );
}

export default EventTableComponent;
