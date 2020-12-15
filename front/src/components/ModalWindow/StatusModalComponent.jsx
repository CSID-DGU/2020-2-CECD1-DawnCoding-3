import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function StatusModalComponent({
  show,
  selectedDevice,
  onChangeStatus,
  onClickEvent,
  onClickClose,
}) {
  const [changeMode, setChangeMode] = useState(true);

  const onClickChangeMode = () => {
    setChangeMode(!changeMode);
  };

  const onClickOrderChange = () => {};

  return changeMode ? (
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
    <Modal show={show} onHide={() => {}}>
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
              <tr>
                <td>{v[1]}</td>
                <td>
                  <input
                    style={{ width: "100%", border: "none" }}
                    type="text"
                    value={i + 1}
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
