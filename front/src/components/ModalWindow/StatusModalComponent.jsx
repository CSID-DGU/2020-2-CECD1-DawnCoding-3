import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { v4 as uuid } from 'uuid';

function StatusModalComponent({
  show,
  selectedDevice,
  onChangeStatus,
  onClickEvent,
  onClickClose,
}) {
  const [changeMode, setChangeMode] = useState(true);
  const [orderValue, setOrderValue] = useState([])

  useEffect(() => {
    // 현재 단순히 index로 우선순위 처리 -> 나중에 변경 필요
    const newOrderValue = Object.entries(selectedDevice.statuses).map((v, i) => i)
    setOrderValue(newOrderValue);
  }, [selectedDevice])

  const onClickChangeMode = () => {
    setChangeMode(!changeMode);
  };

  const onClickOrderChange = () => { };

  const onChangeOrderValue = (e) => {
    setOrderValue(orderValue.map((v, i) => i === +e.target.name ? e.target.value : v))
  }

  return changeMode ? (
    <Modal show={show} onHide={() => { }}>
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
            {Object.entries(selectedDevice.statuses).map((v) => (
              <option key={v[0]}>{v[1]}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={onClickChangeMode}>
          우선순위 변경창
        </Button>
        <Button variant="primary" onClick={onClickEvent}>
          상태 제어
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            onClickClose();
            setChangeMode(true);
          }}
        >
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  ) : (
      <Modal show={show} onHide={() => { }}>
        <Modal.Header>
          <Modal.Title>{selectedDevice.deviceName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead style={{ borderTop: "1px solid black" }}>
              <tr>
                <th>상태 명</th>
                <th>우선순위</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(selectedDevice.statuses).map((v, i) => (
                <tr key={uuid()}
                >
                  <td>{v[1]}</td>
                  <td>
                    <input
                      style={{ width: "100%", border: "none" }}
                      type="text"
                      name={i}
                      value={orderValue[i]}
                      onChange={onChangeOrderValue}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={onClickChangeMode}>
            상태 제어창
        </Button>
          <Button variant="primary" onClick={onClickOrderChange}>
            우선순위 변경
        </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onClickClose();
              setChangeMode(true);
            }}
          >
            닫기
        </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default StatusModalComponent;
