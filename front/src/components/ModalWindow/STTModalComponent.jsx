import React, { useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import axios from "axios";
import "./STTModalComponent.css";

function StatusModalComponent({ show, setShow }) {
  const [sttMode, setSttMode] = useState(false);
  const [sttResult, setSttResult] = useState([]);

  const onClickStt = async () => {
    setSttMode(true);
    try {
      // 1. get 요청 보내면 서버에서 stt 시작
      // 2. 사용자가 말하면 결과 리스트 받아서 리턴
      // 3. 화면에 display
      const { data } = await axios.get("/stt");
      setSttResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onClickCancel = () => {
    setShow(false);
    setSttMode(false);
    setSttResult([]);
    // STT 도중 취소 로직 생각해보기
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
              <ListGroup>
                {sttResult.map((v) => (
                  <ListGroup.Item key={v.deviceId}>
                    {v.deviceName}
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
