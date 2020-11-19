import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { newEvents } from "../modules/newEvents";
import { updateDevices, initDevices } from "../modules/devices";
import "./SensorStyle.css";

import axios from "axios";

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
  const [selectedDevice, setSelectedDevice] = useState({
    deviceId: "",
    signalName: "",
    deviceName: "",
    currentStatusCode: 0,
    statuses: {},
    tts: false,
  });
  const [selectedStatus, setSelectedStatus] = useState({
    code: 0,
    name: "",
  });

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/devices");
      // console.log(data);
      dispatch(initDevices(data));
    })();
  }, []);

  const onClickClose = () => setShow(false);
  const onClickSensor = (e) => {
    ///// 여기서 웹소켓으로 "어떤 센서를 클릭했습니다" 이거 알려줘야 함
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
    const theCode = Object.values(selectedDevice.statuses).findIndex(
      (code) => code === e.target.value
    );

    setSelectedStatus({
      code: theCode,
      name: e.target.value,
    });
  };

  const onClickEvent = () => {
    const theDate = new Date();
    const sendData = [];
    const theData = {
      createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${theDate.getMilliseconds()}`,
      deviceId: selectedDevice.deviceId,
      currentStatusCode: selectedStatus.code,
      tts: selectedDevice.tts,
    };
    sendData.push(theData);
    // 총 3~4개 센서의 상태가 한 번에 변함
    const moreEventsNumber = 2 + Math.floor(Math.random() * 2);
    Array(moreEventsNumber)
      .fill()
      .forEach((v, i) => {
        const moreEventDevice = devices.find(
          (device) =>
            device.deviceId === ((theData.deviceId + i) % devices.length) + 1
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
        dispatch(newEvents(result));
        // 실제 디바이스의 상태들도 변경
        dispatch(updateDevices(result));
      })
      .catch((err) => console.log(err));
    onClickClose();
    setSelectedDevice({
      deviceId: "",
      signalName: "",
      deviceName: "",
      currentStatusCode: 0,
      statuses: {},
      tts: false,
    });
    setSelectedStatus({
      code: 0,
      name: "",
    });
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
                  onClick={onClickSensor}
                  key={device.deviceId}
                  name={index}
                >
                  {device.deviceName}
                </Button>
              )
          )}
      </div>

      <Modal show={show} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>{selectedDevice.deviceName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Signal Name : {selectedDevice.signalName}</div>
          <br />
          <Form.Group>
            <Form.Label>상태</Form.Label>
            <Form.Control
              onChange={onChangeStatus}
              as="select"
              defaultValue={
                selectedDevice.statuses[selectedDevice.currentStatusCode]
              }
            >
              {Object.entries(selectedDevice.statuses).map((v, index) => (
                <option key={v[0]}>{v[1]}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onClickEvent}>
            상태 제어
          </Button>
          <Button variant="secondary" onClick={onClickClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SensorGraphComponent;
