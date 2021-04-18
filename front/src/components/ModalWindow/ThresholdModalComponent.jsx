import React, { useState } from "react";
import { Button, Modal, ListGroup } from "react-bootstrap";
import axios from "axios";
import "./STTModalComponent.css";

function StatusModalComponent({ show, setShow }) {
  const [overMode, setOverMode] = useState(true);
  const [thresholdResult, setThresholdResult] = useState([]);


  const onClickToggle = async () => {
    if (overMode) {
      const { data } = await axios.get("/devices/excluded");
      setThresholdResult(data);
      console.log(data);
    } else {
      setThresholdResult([]);
    }
    setOverMode(!overMode);
  };

  const onClickCancel = () => {
    setShow(false);
    setOverMode(true);
  };

  return (
    <Modal
      className="STT-Modal"
      show={show}
      onHide={() => {
        setShow(false);
      }}
    >
      <Modal.Header>
        <Modal.Title>Threshold 확인</Modal.Title>
      </Modal.Header>
      <Modal.Body className="STT-Modal-Body">
        <ListGroup>
          <ListGroup.Item>
            <div>디바이스 ID</div>
            <div>디바이스 이름</div>
            <div>초과 수치</div>
            <div>상태변화 시퀀스</div>
            <div>시그널 이름</div>
            <div>Threshold</div>
          </ListGroup.Item>
          {thresholdResult && thresholdResult.length !== 0 && thresholdResult.map(v => <ListGroup.Item key={v.id}>
            <div>{v.deviceId}</div>
            <div>{v.deviceName}</div>
            <div>{v.excludedAcc}</div>
            <div>{v.sequence}</div>
            <div>{v.signalName}</div>
            <div>{v.threshold}</div>
          </ListGroup.Item>)}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={onClickToggle}>
          {overMode ? "Threshold over 목록" : "전체 디바이스 목록"}
        </Button>
        <Button variant="secondary" onClick={onClickCancel}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StatusModalComponent;
