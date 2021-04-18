import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { newEvents } from "../modules/newEvents";
import { updateDevices, initDevices, updateAnalog } from "../modules/devices";
import "./SensorStyle.css";

import axios from "axios";
import StatusModalComponent from "./ModalWindow/StatusModalComponent";
import AnalogModalComponent from "./ModalWindow/AnalogModalComponent";

const sensorTheme = [
  "outline-primary",
  "outline-secondary",
  "outline-success",
  "outline-danger",
  "outline-info",
  "outline-dark",
];

function SensorGraphComponent() {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devicesReducer);

  const [show, setShow] = useState(false);
  const [showAnalog, setShowAnalog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({
    deviceId: "",
    signalName: "",
    deviceName: "",
    currentStatusCode: 0,
    statuses: [],
    tts: false,
  });

  const [selectedAnalog, setSelectedAnalog] = useState({
    deviceId: "",
    deviceName: "",
    signalName: "",
    lowerBound: 0,
    lowCriticalPoint: 20,
    highBound: 100,
    highCriticalPoint: 80,
    currValue: 40,
  });

  const [selectedStatus, setSelectedStatus] = useState({
    code: 0,
    name: "",
  });

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/tts/devices");
      dispatch(initDevices(data, dispatch));
    })();
    // eslint-disable-next-line
  }, []);

  const onClickClose = () => setShow(false);

  const onClickCloseAnalog = () => setShowAnalog(false); // 취소 누르면 원래 선택된 디바이스의 정보로 다시 롤백
  const onClickSensor = (e) => {
    // 클릭한 디바이스 이름 TTS로 읽어주기
    try {
      (async () => {
        await axios.get(`/tts/device/${devices[e.target.name].deviceName}`);
      })();
    } catch (err) {
      console.error(err);
    }

    setShow(true);
    setSelectedDevice({
      ...selectedDevice,
      deviceId: devices[e.target.name].deviceId,
      deviceName: devices[e.target.name].deviceName,
      signalName: devices[e.target.name].signalName,
      currentStatusCode: devices[e.target.name].currentStatusCode,
      statuses: devices[e.target.name].statuses,
      tts: devices[e.target.name].tts,
    });
    setSelectedStatus({
      code: devices[e.target.name].currentStatusCode,
      name: devices[e.target.name].currentStatusTitle,
    });
  };
  const onChangeStatus = (e) => {
    const theCode = selectedDevice.statuses.findIndex(
      (v) => v.status_name === e.target.value
    );
    setSelectedStatus({
      code: theCode,
      name: e.target.value,
    });
  };

  const onChangeAnalog = (e) => {
    setSelectedAnalog({
      ...selectedAnalog,
      currValue: e.target.value,
    });
  };

  const onClickEvent = () => {
    const theDate = new Date();
    const sendData = [];
    const originalData = devices.find(
      (v) => v.deviceId === selectedDevice.deviceId
    ); // 선택한 디바이스의 오리지날 상태
    const theData = {
      createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${theDate.getMilliseconds()}`,
      deviceId: selectedDevice.deviceId,
      currentStatusCode: originalData.currentStatusCode,
      tts: originalData.tts,
    };
    sendData.push(theData);

    // 선택한 디바이스의 상태가 변경될 때 거치는 상태들 추가
    const moreEventsNumber = 2 + Math.floor(Math.random() * 2);
    Array(moreEventsNumber)
      .fill()
      .forEach((v, i) => {
        sendData.push({
          createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${
            theDate.getMilliseconds() + 4 * i
            }`,
          deviceId: theData.deviceId,
          currentStatusCode:
            (+originalData.currentStatusCode + i + 1) %
            Object.entries(originalData.statuses).length,
          tts: originalData.tts,
        });
      });

    // 최종적으로 선택한 상태로 변경
    sendData.push({
      createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${
        theDate.getMilliseconds() + 4
        }`,
      deviceId: theData.deviceId,
      currentStatusCode: selectedStatus.code,
      tts: originalData.tts,
    });

    // TTS 요청
    sendData
      .reduce((prevProm, data) => {
        return prevProm.then(() => axios.put("/tts/device", data));
      }, Promise.resolve())
      .catch((err) => {
        console.error(err);
      });

    const result = [];
    sendData.forEach((v) => {
      result.push({
        createDate: v.createDate,
        id: v.deviceId,
        name: selectedDevice.deviceName,
        signalName: selectedDevice.signalName,
        status: selectedDevice.statuses[v.currentStatusCode].status_name,
        statusCode: v.currentStatusCode,
        TTS: `${v.tts}`,
        blink: true,
        checked: false,
      });
    });

    dispatch(newEvents(result));
    // 실제 디바이스의 상태들도 변경
    dispatch(updateDevices(result));

    setSelectedDevice({
      deviceId: "",
      signalName: "",
      deviceName: "",
      currentStatusCode: 0,
      statuses: [],
      tts: false,
    });
    setSelectedStatus({
      code: 0,
      name: "",
    });
    onClickClose();
  };

  const onClickAnalog = (e) => {
    setShowAnalog(true);
    setSelectedAnalog({
      deviceId: devices[e.target.name].deviceId,
      deviceName: devices[e.target.name].deviceName,
      signalName: devices[e.target.name].signalName,
      highBound: devices[e.target.name].highBound,
      highCriticalPoint: devices[e.target.name].highCriticalPoint,
      lowCriticalPoint: devices[e.target.name].lowCriticalPoint,
      lowerBound: devices[e.target.name].lowerBound,
      currValue: devices[e.target.name].currValue,
      tts: devices[e.target.name].tts,
    });
    // 클릭한 디바이스 이름 TTS로 읽어주기
    try {
      (async () => {
        await axios.get(`/tts/device/${devices[e.target.name].deviceName}`);
      })();
    } catch (err) {
      console.error(err);
    }
  };

  const onClickValueChange = () => {
    try {
      (async () => {
        const { data } = await axios.put(`/tts/device`, {
          deviceId: selectedAnalog.deviceId,
          currValue: selectedAnalog.currValue,
          tts: selectedAnalog.tts,
        });
        dispatch(
          updateAnalog({
            deviceId: data.deviceId,
            currValue: data.currValue,
          })
        );
      })();
      setShowAnalog(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="title">Devices</h1>
      <div className="sensors">
        {devices &&
          devices.map(
            (device, index) =>
              device && (
                <Button
                  variant={sensorTheme[index % 6]}
                  onClick={(e) => {
                    device.analog ? onClickAnalog(e) : onClickSensor(e);
                  }}
                  key={device.deviceId}
                  name={index}
                >
                  {device.deviceName}
                </Button>
              )
          )}
      </div>

      {/* 상태 모달 창 */}
      <StatusModalComponent
        show={show}
        selectedDevice={selectedDevice}
        onChangeStatus={onChangeStatus}
        onClickEvent={onClickEvent}
        onClickClose={onClickClose}
      />

      {/* 아날로그 모달 창 */}
      <AnalogModalComponent
        showAnalog={showAnalog}
        selectedAnalog={selectedAnalog}
        onChangeAnalog={onChangeAnalog}
        onClickValueChange={onClickValueChange}
        onClickCloseAnalog={onClickCloseAnalog}
      />
    </div>
  );
}

export default SensorGraphComponent;
