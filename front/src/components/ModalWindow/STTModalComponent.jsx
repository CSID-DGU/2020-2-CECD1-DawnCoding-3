import React, { useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import axios from "axios";
import "./STTModalComponent.css";

function StatusModalComponent({ show, setShow }) {
  const [sttMode, setSttMode] = useState(false);
  const [sttResult, setSttResult] = useState([]);
  const [sttCommand, setSttCommand] = useState("");

  const onClickStt = async () => {
    setSttMode(true);
    try {
      // 1. get 요청 보내면 서버에서 stt 시작
      // 2. 사용자가 말하면 결과 리스트 받아서 리턴
      // 3. 화면에 display
      const { data } = await axios.get("/stt");
      setSttResult(data.query);
      setSttCommand(data.command);
    } catch (err) {
      console.error(err);
    }
  };

  const onClickCancel = () => {
    setShow(false);
    setSttMode(false);
    setSttResult([]);
    setSttCommand("");
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
        <Modal.Title>STT 기능</Modal.Title>
      </Modal.Header>
      <Modal.Body className="STT-Modal-Body">
        {sttMode ? (
          sttResult.length === 0 ? (
            <>
              <h5>원하는 명령어를 음성으로 말해주세요.</h5>
              <LoadingComponent />
            </>
          ) : (
            <>
              <h5>검색 결과</h5>
              <h6>{sttCommand}</h6>
              <ListGroup>
                <ListGroup.Item>
                  <div>디바이스 이름</div>
                  <div>시그널 이름</div>
                  <div>상태/수치</div>
                </ListGroup.Item>
                {sttResult.map((v) => (
                  <ListGroup.Item key={v.deviceId}>
                    {v.analog ? (
                      <>
                        <div>{v.deviceName} (아날로그)</div>
                        <div>{v.signalName}</div>
                        <div>{v.currValue}</div>
                      </>
                    ) : (
                      <>
                        <div>{v.deviceName}</div>
                        <div>{v.signalName}</div>
                        <div>{v.currentStatusTitle}</div>
                      </>
                    )}

                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )
        ) : (
          <>
            <h5>음성인식 가능 명령어 목록</h5>
            <ol>
              <li>상태 디바이스 목록 알려줘</li>
            </ol>
            <Button onClick={onClickStt}>음성 인식 시작</Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClickCancel}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StatusModalComponent;
