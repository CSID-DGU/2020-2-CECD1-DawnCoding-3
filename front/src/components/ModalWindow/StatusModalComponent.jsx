import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

function StatusModalComponent({
  show,
  selectedDevice,
  onChangeStatus,
  onClickEvent,
  onClickClose,
}) {
  return (
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
  );
}

export default StatusModalComponent;
