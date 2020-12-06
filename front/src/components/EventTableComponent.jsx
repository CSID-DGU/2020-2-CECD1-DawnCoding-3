import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import EventComponent from "./EventComponent";
import SensorGraphComponent from "./SensorGraphComponent";
import { v4 as uuid } from "uuid";
import "./EventTableStyle.css";
import { newEvents as newEventAction } from "../modules/newEvents";
import { updateDevices, updateAnalog } from "../modules/devices";

const StatusDeviceNum = 7; // 상태 정보를 갖는 디바이스의 개수

function EventTableComponent() {
  const dispatch = useDispatch();
  const newEvents = useSelector((state) => state.newEventsReducer);
  const devices = useSelector((state) => state.devicesReducer);
  const theSetTimeout = useRef(null);
  const highLimitList = useRef(0);
  const lowLimitList = useRef(0);
  const analogDeviceList = useRef([]);

  const [events, setEvents] = useState([]);
  const [watchMode, setWatchMode] = useState(false);
  const [ttsEnd, setTtsEnd] = useState(false);

  // 아날로그 디바이스의 인덱스를 배열에 저장
  useEffect(() => {
    const deviceNumber = devices.length;
    if (deviceNumber === 0) {
      return;
    }
    Array(deviceNumber - StatusDeviceNum)
      .fill()
      // eslint-disable-next-line
      .map((v, i) => {
        analogDeviceList.current.push(i + StatusDeviceNum);
      });
  }, [devices]);

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
    // eslint-disable-next-line
  }, [ttsEnd]);

  const makeSetTimeOut = (theTimeSeed) => {
    setTimeout(() => {
      // const isAnalog = Math.random() >= 0.5 ? true : false;
      const isAnalog = true;
      if (isAnalog) {
        // 아날로그 데이터 -> 상한치/하한치를 랜덤하게 선택해서 해당 센서가 상한치/하한치 배열 안에 있다면 복귀 이벤트 발생, 아니면 초과 이벤트 발생
        // status: ["상한치 초과", "상한치 복귀", "하한치 초과", "하한치 복귀"];
        const moreEventsNumber = 2 + Math.floor(Math.random() * 3);
        const theDate = new Date();
        const sendData = [];
        Array(moreEventsNumber)
          .fill()
          .forEach((v, i) => {
            const isUpper = Math.random() >= 0.5 ? true : false;
            let theId = 0;
            let theLimit = 0;
            let eventStatus = "";
            if (isUpper) {
              // 상한치 초과
              if (highLimitList.current !== 0) {
                theId = highLimitList.current;
                analogDeviceList.current.push(theId);
                highLimitList.current = 0;
                eventStatus = `상한치 복귀`;
                theLimit = devices[theId].highCriticalPoint - 5;
              } else {
                const theIndex = Math.floor(
                  Math.random() * analogDeviceList.current.length
                );
                theId = analogDeviceList.current[theIndex];
                analogDeviceList.current.splice(theIndex, 1);
                highLimitList.current = theId;
                eventStatus = `상한치 초과`;
                theLimit = devices[theId].highCriticalPoint + 4;
              }
            } else {
              // 하한치 초과
              if (lowLimitList.current !== 0) {
                theId = lowLimitList.current;
                analogDeviceList.current.push(theId);
                lowLimitList.current = 0;
                theLimit = devices[theId].lowCriticalPoint + 5;
                eventStatus = `하한치 복귀`;
              } else {
                const theIndex = Math.floor(
                  Math.random() * analogDeviceList.current.length
                );
                theLimit = devices[theId].lowCriticalPoint - 4;
                theId = analogDeviceList.current[theIndex];
                analogDeviceList.current.splice(theIndex, 1);
                eventStatus = `하한치 초과`;
                lowLimitList.current = theId;
              }
            }
            sendData.push({
              createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${
                theDate.getMilliseconds() + Math.floor(Math.random() * 10)
              }`,
              deviceId: theId,
              currValue: theLimit,
              tts: true,
            });
            // axios
            //   .put("/device", sendData)
            //   .then((res) => {
            //     const theResult = res.data[0];

            //     const result = [
            //       {
            //         createDate: sendData[0].createDate,
            //         id: theResult.deviceId,
            //         name: theResult.deviceName,
            //         signalName: theResult.signalName,
            //         status: eventStatus,
            //         TTS: `${theResult.tts}`,
            //         blink: true,
            //         checked: false,
            //       },
            //     ];

            //     dispatch(newEventAction(result));
            //     dispatch(
            //       updateAnalog({
            //         deviceId: theResult.deviceId,
            //         currValue: theResult.currValue,
            //       })
            //     );
            //     // TTS 요청
            //     axios
            //       .put("/device/tts", sendData)
            //       .then((res) => {
            //         // console.log(res);
            //         setTtsEnd(!ttsEnd);
            //       })
            //       .catch((err) => console.log(err));
            //   })
            //   .catch((err) => console.error(err));
          });
        console.log(sendData);
      } else {
        // 상태 데이터의 감시 이벤트 발생
        const theSelectedIndex = Math.floor(Math.random() * StatusDeviceNum);
        const theDate = new Date();
        const sendData = [];
        const settingData = [];
        const selectedDevice = {
          createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${theDate.getMilliseconds()}`,
          deviceId: devices[theSelectedIndex].deviceId,
          currentStatusCode: devices[theSelectedIndex].currentStatusCode,
          tts: devices[theSelectedIndex].tts,
        };
        settingData.push({
          createDate: selectedDevice.createDate,
          id: selectedDevice.deviceId,
          name: devices[theSelectedIndex].deviceName,
          signalName: devices[theSelectedIndex].signalName,
          status:
            devices[theSelectedIndex].statuses[
              selectedDevice.currentStatusCode
            ],
          statusCode: selectedDevice.currentStatusCode,
          TTS: selectedDevice.tts,
          blink: true,
          checked: false,
        });
        sendData.push(selectedDevice);
        // 총 4~5개의 센서 상태가 한 번에 변함
        const moreEventsNumber = 2 + Math.floor(Math.random() * 3);
        Array(moreEventsNumber)
          .fill()
          .forEach((v, i) => {
            const moreEventDevice = devices.find(
              (device) =>
                device.deviceId ===
                ((selectedDevice.deviceId + i) % StatusDeviceNum) + 1
            );
            const theDate = new Date();
            const nextData = {
              createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${
                theDate.getMilliseconds() + Math.floor(Math.random() * 10)
              }`,
              deviceId: moreEventDevice.deviceId,
              currentStatusCode:
                (moreEventDevice.currentStatusCode + 1) %
                Object.keys(moreEventDevice.statuses).length,
              tts: moreEventDevice.tts,
            };
            sendData.push(nextData);
            settingData.push({
              createDate: nextData.createDate,
              id: moreEventDevice.deviceId,
              name: moreEventDevice.deviceName,
              signalName: moreEventDevice.signalName,
              status: moreEventDevice.statuses[nextData.currentStatusCode],
              statusCode: nextData.currentStatusCode,
              TTS: nextData.tts,
              blink: true,
              checked: false,
            });
          });
        // 각각 변한 데이터를 put 요청
        sendData
          .reduce((prevProm, data) => {
            return prevProm.then(() => axios.put("/device", data));
          }, Promise.resolve())
          .then(() => {
            setTtsEnd(!ttsEnd);
          })
          .catch((err) => {
            console.error(err);
          });
        dispatch(newEventAction(settingData)); // 이벤트 테이블
        dispatch(updateDevices(settingData)); // 실제 디바이스의 상태들도 변경
      }
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
