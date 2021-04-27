import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import axios from "axios";
import "./STTModalComponent.css";

function StatusModalComponent({ show, setShow }) {
  const [overMode, setOverMode] = useState(true);
  const [thresholdResult, setThresholdResult] = useState([]);

  const onClickToggle = async () => {
    if (overMode) {
      try {
        const { data } = await axios.get("/devices/excluded");
        setThresholdResult(data);
      } catch(err) {
        console.error(err);
        setThresholdResult([]);
        setOverMode(!overMode);
        return;
      }
    } else {
      setThresholdResult([]);
    }
    setOverMode(!overMode);
  };

  const onClickCancel = () => {
    setShow(false);
    setOverMode(true);
  };
  const onClickThreshold = async (id) => {
    const change = window.prompt("새로운 Threshold 값을 입력하세요");
    if (change === null) {
      return;
    }
    if (change === "") {
      alert("잘못된 입력입니다.");
    } else {
      for (let i = 0; i < change.length; i++) {
        if (change[i] < '0' || change[i] > '9') {
          alert("잘못된 입력입니다.");
          return;
        }
      }
      if(window.confirm("Threshold 값을 변경하겠습니까?")) {
        try{
          const {data} = await axios.put("/devices/excluded", {
            id,
            threshold : change
          });
          const newThreshold = thresholdResult.map(v => {
            if (v.id === data.id) {
              return data;
            } else {
              return v;
            }
          })
          setThresholdResult(newThreshold);
          alert("변경되었습니다.");
        } catch(err) {
          console.error(err);
        }
      } 
      return;
    }
  }

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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>디바이스 ID</th>
              <th>디바이스 이름</th>
              <th>초과 수치</th>
              <th>상태변화 시퀀스</th>
              <th>시그널 이름</th>
              <th>Threshold</th>
            </tr>
          </thead>
          <tbody>
            {thresholdResult &&
              thresholdResult.length !== 0 &&
              thresholdResult.map((v) => (
                <tr key={v.id}>
                  <td>{v.deviceId}</td>
                  <td>{v.deviceName}</td>
                  <td>{v.excludedAcc}</td>
                  <td>{v.sequence}</td>
                  <td>{v.signalName}</td>
                  <td className="threshold-value" onClick={() => onClickThreshold(v.id)}>{v.threshold}</td>
                </tr>
              ))}
          </tbody>
        </Table>
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
