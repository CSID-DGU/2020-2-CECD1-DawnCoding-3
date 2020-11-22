import React, { useEffect, useState } from "react";
import { Modal, Button, Form, InputGroup, FormControl } from "react-bootstrap";
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
  const [showAnalog, setShowAnalog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({
    deviceId: "",
    signalName: "",
    deviceName: "",
    currentStatusCode: 0,
    statuses: {},
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
      const { data } = await axios.get("/devices");
      // console.log(data);
      dispatch(initDevices(data));
    })();
    // eslint-disable-next-line
  }, []);

  const onClickClose = () => setShow(false);
  const onClickCloseAnalog = () => setShowAnalog(false); // 취소 누르면 원래 선택된 디바이스의 정보로 다시 롤백
  const onClickSensor = (e) => {
    // 클릭한 디바이스 이름 TTS로 읽어주기
    try {
      (async () => {
        await axios.get(`/device/${devices[e.target.name].deviceName}`);
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
    const theCode = Object.values(selectedDevice.statuses).findIndex(
      (code) => code === e.target.value
    );

    setSelectedStatus({
      code: theCode,
      name: e.target.value,
    });
  };
  const onChangeAnalog = (e) => {
    setSelectedAnalog({
      ...selectedAnalog,
      [e.target.name]:
        e.target.name === "currValue" &&
        e.target.value < selectedAnalog.lowCriticalPoint
          ? selectedAnalog.lowCriticalPoint
          : e.target.value > selectedAnalog.highCriticalPoint
          ? selectedAnalog.highCriticalPoint
          : e.target.value,
    });
  };

  const onClickEvent = () => {
    const theDate = new Date();
    const sendData = [];
    const theData = {
      createDate: `${theDate.getFullYear()}-${theDate.getMonth()}-${theDate.getDate()} ${theDate.getHours()}:${theDate.getMinutes()}:${theDate.getSeconds()}.${theDate.getMilliseconds()}`,
      deviceId: selectedDevice.deviceId,
      currentStatusCode: selectedStatus.code,
      tts: false,
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
    axios
      .put("/device", sendData)
      .then(({ data: result }) => {
        result = result.map((inner, i) => {
          return {
            // timestamp : inner.어쩌고저쩌고
            createDate: sendData[i].createDate,
            id: inner.deviceId,
            name: inner.deviceName,
            signalName: inner.signalName,
            status: inner.statuses[inner.currentStatusCode],
            statusCode: inner.currentStatusCode,
            TTS: `${inner.tts}`,
            blink: true,
            checked: false,
          };
        });
        dispatch(newEvents(result));
        // 실제 디바이스의 상태들도 변경
        dispatch(updateDevices(result));
        // TTS 요청
        axios.put("/device/tts", sendData).catch((err) => console.log(err));
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

  const onClickAnalog = (e) => {
    setShowAnalog(true);
    console.log(e.target);
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
      <Button variant={sensorTheme[0]} onClick={onClickAnalog} name={0}>
        아날로그 센서
      </Button>

      {/* 상태 모달 창 */}
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

      {/* 아날로그 모달 창 */}
      <Modal show={showAnalog} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>{selectedAnalog.deviceName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Signal Name : {selectedAnalog.signalName}</div>
          <br />
          <Form.Group>
            <Form.Label>수치</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>high bound</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="number"
                placeholder="high bound"
                name="highBound"
                value={selectedAnalog.highBound}
                onChange={onChangeAnalog}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>high critical point</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="number"
                placeholder="high critical point"
                name="highCriticalPoint"
                value={selectedAnalog.highCriticalPoint}
                onChange={onChangeAnalog}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>low critical point</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="number"
                placeholder="low critical point"
                name="lowCriticalPoint"
                value={selectedAnalog.lowCriticalPoint}
                onChange={onChangeAnalog}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>lower bound</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="number"
                placeholder="lower bound"
                name="lowerBound"
                value={selectedAnalog.lowerBound}
                onChange={onChangeAnalog}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>current value</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="number"
                placeholder="current value"
                name="currValue"
                value={selectedAnalog.currValue}
                onChange={onChangeAnalog}
              />
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onClickEvent}>
            수치 변경
          </Button>
          <Button variant="secondary" onClick={onClickCloseAnalog}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SensorGraphComponent;
