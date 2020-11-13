import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { newEvents, newEventsClear } from "../modules/newEvents";
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

  const [devices, setDevices] = useState(null);
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
      console.log(data);
      setDevices(data);
    })();
  }, []);

  const onClickClose = () => setShow(false);
  const onClickSensor = (e) => {
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
    const sendData = [];
    const theData = {
      deviceId: selectedDevice.deviceId,
      currentStatusCode: selectedStatus.code,
      tts: selectedDevice.tts,
    };
    sendData.push(theData);
    const moreEventsNumber = 2 + Math.floor(Math.random() * 2);
    Array(moreEventsNumber)
      .fill()
      .forEach((v, i) => {
        const moreEventDevice = devices.find(
          (device) =>
            device.deviceId === ((theData.deviceId + i) % devices.length) + 1
        );
        sendData.push({
          deviceId: moreEventDevice.deviceId,
          currentStatusCode:
            (moreEventDevice.currentStatusCode + 1) %
            Object.keys(moreEventDevice.statuses).length,
          tts: moreEventDevice.tts,
        });
      });
    Promise.all(sendData.map((data) => axios.put("/device", data)))
      .then((result) => {
        result = result.map((inner) => {
          return {
            id: inner.data.deviceId,
            name: inner.data.deviceName,
            signalName: inner.data.signalName,
            status: inner.data.statuses[inner.data.currentStatusCode],
            TTS: `${inner.data.tts}`,
            blink: true,
            checked: false,
          };
        });
        dispatch(newEvents(result));
      })
      .catch((err) => console.log(err));

    // const theDevice = devices.findIndex(
    //   (v) => v.deviceId === selectedDevice.deviceId
    // );
    // let newDevices = [];
    // devices.forEach((device, i) => {
    //   if (i !== theDevice) {
    //     newDevices.push(device);
    //   } else {
    //     newDevices.push({
    //       ...device,
    //       currentStatusCode: selectedStatus.code,
    //       currentStatusTitle: selectedStatus.Title,
    //     });
    //   }
    // });
    // setDevices(newDevices);
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
    dispatch(newEventsClear());
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
            이벤트 발생
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
