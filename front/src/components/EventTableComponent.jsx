import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import EventComponent from "./EventComponent";
import SensorGraphComponent from "./SensorGraphComponent";
import { v4 as uuid } from "uuid";
import "./EventTableStyle.css";

function EventTableComponent() {
  const newEvents = useSelector((state) => state.newEventsReducer);

  const [events, setEvents] = useState([]);
  const [watchMode, setWatchMode] = useState(false);

  // 새로운 이벤트 들어오면 화면에 표시
  useEffect(() => {
    const beforeEvents = [];
    events.forEach((event) => {
      beforeEvents.push({
        ...event,
        // timestamp,
        id: event.id + newEvents.length, // Backend로부터 전달받은 newEvent 개수만큼 id를 더해줌
        blink: false,
        checked: true,
      });
    });
    newEvents.forEach((event) => beforeEvents.unshift(event));
    setEvents(beforeEvents);
    // eslint-disable-next-line
  }, [newEvents]);

  useEffect(() => {
    if (watchMode) {
      console.log(Date.now());
    }
  }, [watchMode]);

  const onClickStopBtn = () => {
    let newEvents = [];
    events.forEach((event) => {
      newEvents.push({ ...event });
    });
    newEvents.map((event) => (event.blink = false));
    setEvents(newEvents);
  };

  const onClickWatchEvent = () => {
    setWatchMode(!watchMode);
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

      <Form className="watchBtn">
        <Form.Check type="switch" id="custom-switch" label="감시모드" />
      </Form>
      <Button className="stopBtn" variant="danger" onClick={onClickStopBtn}>
        멈춤
      </Button>
      <SensorGraphComponent />
    </div>
  );
}

export default EventTableComponent;
