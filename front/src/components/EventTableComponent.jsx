import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import EventComponent from "./EventComponent";
import SensorGraphComponent from "./SensorGraphComponent";
import STTModalComponent from "./ModalWindow/STTModalComponent";
import ThresholdModalComponent from "./ModalWindow/ThresholdModalComponent";
import { v4 as uuid } from "uuid";
import "./EventTableStyle.css";
import { newEvents as newEventAction } from "../modules/newEvents";
import { updateDevices, updateAnalog } from "../modules/devices";

function EventTableComponent() {
  const dispatch = useDispatch();
  const newEvents = useSelector((state) => state.newEventsReducer);
  const devices = useSelector((state) => state.devicesReducer);
  const StatusDeviceNum = useSelector((state) => state.statusDeviceReducer); // 상태 정보를 갖는 디바이스의 개수
  const theSetTimeout = useRef(null);
  const highLimitList = useRef(0);
  const lowLimitList = useRef(0);
  const analogDeviceList = useRef([]);

  const [events, setEvents] = useState([]);
  const [watchMode, setWatchMode] = useState(false);
  const [ttsEnd, setTtsEnd] = useState(false);
  const [show, setShow] = useState(false);
  const [threShow, setThreShow] = useState(false);

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
    // eslint-disable-next-line
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
      const isAnalog = Math.random() >= 0.5 ? true : false;
      if (isAnalog) {
        // 아날로그 데이터 -> 상한치/하한치를 랜덤하게 선택해서 해당 센서가 상한치/하한치 배열 안에 있다면 복귀 이벤트 발생, 아니면 초과 이벤트 발생
        // status: ["상한치 초과", "상한치 복귀", "하한치 초과", "하한치 복귀"];
        const moreEventsNumber = 2 + Math.floor(Math.random() * 3);
        const theDate = new Date();
        const sendData = [];
        const settingData = [];
        Array(moreEventsNumber)
          .fill()
          .forEach((v, i) => {
            const isUpper = Math.random() >= 0.5 ? true : false;
            let theId = 0;
            let theLimit = 0;
            let theIndex = 0;
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
                theIndex = Math.floor(
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
                theIndex = Math.floor(
                  Math.random() * analogDeviceList.current.length
                );
                theLimit = devices[theId].lowCriticalPoint - 4;
                theId = analogDeviceList.current[theIndex];
                analogDeviceList.current.splice(theIndex, 1);
                eventStatus = `하한치 초과`;
                lowLimitList.current = theId;
              }
            }
            const sendDataObject = {
              createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${
                theDate.getMilliseconds() + 4 * i
                }`,
              deviceId: theId,
              currValue: theLimit,
              tts: true,
            };
            sendData.push(sendDataObject);
            const settingDeviceIndex = devices.findIndex(
              (v) => v.deviceId === sendDataObject.deviceId
            );
            settingData.push({
              createDate: sendDataObject.createDate,
              id: sendDataObject.deviceId,
              name: devices[settingDeviceIndex].deviceName,
              signalName: devices[settingDeviceIndex].signalName,
              status: eventStatus,
              TTS: "true",
              blink: true,
              checked: false,
            });
          });
        sendData
          .reduce((prevProm, data) => {
            return prevProm.then(() => axios.put("/tts/device", data));
          }, Promise.resolve())
          .then(() => {
            setTtsEnd(!ttsEnd);
          })
          .catch((err) => {
            console.error(err);
          });
        settingData.forEach((data, i) => {
          dispatch(
            updateAnalog({
              deviceId: data.id,
              currValue: sendData[i].currValue,
            })
          );
        });
        dispatch(newEventAction(settingData));
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
            devices[theSelectedIndex].statuses[selectedDevice.currentStatusCode]
              .status_name,
          statusCode: selectedDevice.currentStatusCode,
          TTS: `${selectedDevice.tts}`,
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
                theDate.getMilliseconds() + 4 * i
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
              status:
                moreEventDevice.statuses[nextData.currentStatusCode]
                  .status_name,
              statusCode: nextData.currentStatusCode,
              TTS: `${nextData.tts}`,
              blink: true,
              checked: false,
            });
          });
        // 각각 변한 데이터를 put 요청
        sendData
          .reduce((prevProm, data) => {
            return prevProm.then(() => axios.put("/tts/device", data));
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
    <>
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
      <Button
        className="thresholdBtn"
        variant="warning"
        onClick={() => {
          setThreShow(true);
        }}
      >
        Threshold
      </Button>
      <Button
        className="sttBtn"
        variant="primary"
        onClick={() => {
          setShow(true);
        }}
      >
        STT
      </Button>
      <STTModalComponent show={show} setShow={setShow} />
      <ThresholdModalComponent show={threShow} setShow={setThreShow} />
      <Button className="stopBtn" variant="danger" onClick={onClickStopBtn}>
        멈춤
      </Button>
      <SensorGraphComponent />
    </>
  );
}

export default EventTableComponent;
