import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import EventComponent from "./EventComponent";
import SensorGraphComponent from "./SensorGraphComponent";
import { v4 as uuid } from "uuid";
import "./EventTableStyle.css";
import { newEvents as newEventAction } from "../modules/newEvents";
import { updateDevices } from "../modules/devices";
// const StompJs = require("@stomp/stompjs");
// Object.assign(global, { WebSocket: require("websocket").w3cwebsocket });

function EventTableComponent() {
  const dispatch = useDispatch();
  const newEvents = useSelector((state) => state.newEventsReducer);
  const devices = useSelector((state) => state.devicesReducer);
  const theSetTimeout = useRef(null);
  // const client = useRef(new StompJs.Client());

  const [events, setEvents] = useState([]);
  const [watchMode, setWatchMode] = useState(false);
  const [ttsEnd, setTtsEnd] = useState(false);

  // useEffect(() => {
  //   client.current.brokerURL = "ws://localhost:7000/ws";
  //   client.current.onConnect = (frame) => {
  //     console.log("webSocket 연결 성공");
  //     client.current.subscribe(
  //       "/topic/public",
  //       function ({ body }) {
  //         console.log(body);
  //       },
  //       { simpUser: "goo" }
  //     );
  //   };
  //   client.current.activate();
  // }, []);

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
      theSetTimeout.current = makeSetTimeOut(theTimeSeed);
    } else {
      // watch 모드 아니면 이벤트 발생 중지
      if (theSetTimeout.current) {
        clearTimeout(theSetTimeout.current);
        theSetTimeout.current = null;
      }
    }
    // eslint-disable-next-line
  }, [watchMode]);

  useEffect(() => {
    if (watchMode) {
      const theTimeSeed = Math.floor(Math.random() * 2) + 4;
      theSetTimeout.current = makeSetTimeOut(theTimeSeed);
    } else {
      clearTimeout(theSetTimeout.current);
    }
  }, [ttsEnd]);

  const makeSetTimeOut = (theTimeSeed) => {
    setTimeout(() => {
      const isAnalog = Math.random() >= 0.5 ? true : false;
      if (isAnalog) {
        // 아날로그 데이터 -> 상한치/하한치를 랜덤하게 선택해서 해당 센서가 상한치/하한치 배열 안에 있다면 복귀 이벤트 발생, 아니면 초과 이벤트 발생
        // status: [ "상한치 초과", "상한치 복귀", "하한치 초과", "하한치 복귀"]
        const theDate = new Date();
        const sendData = [];
        sendData.push({
          createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${theDate.getMilliseconds()}`,
          id: "wlkfjkewpjgwoihgqweghqg",
          name: "어떤 감시용 아나로그센-사",
          signalName: "qowgehoh35135oih!32",
          status: "상한치 초과",
          statusCode: 0,
          TTS: `true`,
          blink: true,
          checked: false,
        });
        dispatch(newEventAction(sendData));

        (async () => {
          const theResult = await axios.post(
            "/device/tts",
            sendData.map((a) => a.name)
          );
          console.log(theResult);
          setTtsEnd(true);
        })();
      } else {
        // 상태 데이터의 감시 이벤트 발생
        const theSelectedIndex = Math.floor(Math.random() * devices.length);
        const theDate = new Date();
        const sendData = [];
        const selectedDevice = {
          createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${theDate.getMilliseconds()}`,
          deviceId: devices[theSelectedIndex].deviceId,
          currentStatusCode: devices[theSelectedIndex].code,
          tts: devices[theSelectedIndex].tts,
        };
        sendData.push(selectedDevice);
        // 총 4~5개의 센서 상태가 한 번에 변함
        const moreEventsNumber = 2 + Math.floor(Math.random() * 3);
        Array(moreEventsNumber)
          .fill()
          .forEach((v, i) => {
            const moreEventDevice = devices.find(
              (device) =>
                device.deviceId ===
                ((selectedDevice.deviceId + i) % devices.length) + 1
            );
            const theDate = new Date();
            sendData.push({
              createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${
                theDate.getMilliseconds() + Math.floor(Math.random() * 10)
              }`,
              deviceId: moreEventDevice.deviceId,
              currentStatusCode:
                (moreEventDevice.currentStatusCode + 1) %
                Object.keys(moreEventDevice.statuses).length,
              tts: moreEventDevice.tts,
            });
          });
        // 각각 변한 데이터를 put 요청
        Promise.all(sendData.map((data) => axios.put("/device", data)))
          .then((result) => {
            result = result.map((inner, i) => {
              return {
                // timestamp : inner.어쩌고저쩌고
                createDate: sendData[i].createDate,
                id: inner.data.deviceId,
                name: inner.data.deviceName,
                signalName: inner.data.signalName,
                status: inner.data.statuses[inner.data.currentStatusCode],
                statusCode: inner.data.currentStatusCode,
                TTS: `${inner.data.tts}`,
                blink: true,
                checked: false,
              };
            });
            (async () => {
              const theResult = await axios.post(
                "/device/tts",
                result.map((a) => a.name)
              );
              console.log(theResult);
              setTtsEnd(true);
            })();
            dispatch(newEventAction(result));
            // 실제 디바이스의 상태들도 변경
            dispatch(updateDevices(result));
          })
          .catch((err) => console.log(err));
      }
      // 우선 이벤트 발생 되면 서버에 이벤트 기록하고 감시 이벤트 발생을 중지
      // 감시 이벤트에서 TTS 읽어주기가 끝나면 다시 setTimeout 실행
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
