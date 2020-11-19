import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import EventComponent from "./EventComponent";
import SensorGraphComponent from "./SensorGraphComponent";
import { v4 as uuid } from "uuid";
import "./EventTableStyle.css";
import { newEvents as newEventAction } from "../modules/newEvents";

function EventTableComponent() {
  const dispatch = useDispatch();
  const newEvents = useSelector((state) => state.newEventsReducer);
  const theInterval = useRef(null);

  const [events, setEvents] = useState([]);
  const [watchMode, setWatchMode] = useState(false);

  // 새로운 이벤트 들어오면 화면에 표시
  useEffect(() => {
    const beforeEvents = [];
    events.forEach((event) => {
      beforeEvents.push({
        ...event,
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
      // watch 모드이면 감시 이벤트 발생
      const theTimeSeed = Math.floor(Math.random() * 2) + 4;
      theInterval.current = makeEventInterval(theTimeSeed);
    } else {
      // watch 모드 아니면 이벤트 발생 중지
      if (theInterval.current) {
        clearInterval(theInterval.current);
      }
    }
  }, [watchMode]);

  const makeEventInterval = (theTimeSeed) => {
    setInterval(() => {
      const isAnalog = Math.random() >= 0.5 ? true : false;
      if (isAnalog) {
        // 아날로그 데이터 -> 상한치/하한치를 랜덤하게 선택해서 해당 센서가 상한치/하한치 배열 안에 있다면 복귀 이벤트 발생, 아니면 초과 이벤트 발생
        // status: [ "상한치 초과", "상한치 복귀", "하한치 초과", "하한치 복귀"]
        const theDate = new Date();
        const sendingData = {
          createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${theDate.getMilliseconds()}`,
          id: "wlkfjkewpjgwoihgqweghqg",
          name: "어떤 감시용 아나로그센-사",
          signalName: "qowgehoh35135oih!32",
          status: "상한치 초과",
          statusCode: 0,
          TTS: `true`,
          blink: true,
          checked: false,
        };
        dispatch(newEventAction([sendingData]));
      } else {
      }
      // 우선 이벤트 발생 되면 서버에 이벤트 기록하고 감시 이벤트 발생을 중지
      // 감시 이벤트에서 TTS 읽어주기가 끝나면 다시 setInterval 실행
      clearInterval(theInterval.current);
    }, theTimeSeed * 1000);
  };

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
              <th>timeStamp</th>
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
              />
            ))}
          </tbody>
        </table>
      </div>

      <Form className="watchBtn">
        <Form.Check
          type="switch"
          id="custom-switch"
          label="감시모드"
          onChange={() => setWatchMode(!watchMode)}
        />
      </Form>
      <Button className="stopBtn" variant="danger" onClick={onClickStopBtn}>
        멈춤
      </Button>
      <SensorGraphComponent />
    </div>
  );
}

export default EventTableComponent;
