import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function StatusModalComponent({
  show,
  selectedDevice,
  onChangeStatus,
  onClickEvent,
  onClickClose,
}) {
  const [changeMode, setChangeMode] = useState(true);
  const [orderValue, setOrderValue] = useState([]);

  useEffect(() => {
    setOrderValue(
      selectedDevice.statuses.map((v) => {
        return v.status_order;
      })
    );
  }, [selectedDevice]);

  const onClickChangeMode = () => {
    setChangeMode(!changeMode);
  };

  const onClickOrderChange = () => {
    console.log(orderValue);
  };

  const onChangeOrderValue = (e) => {
    setOrderValue(
      orderValue.map((v, i) => (i === +e.target.name ? +e.target.value : +v))
    );
  };

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
              selectedDevice.statuses[selectedDevice.currentStatusCode] &&
              selectedDevice.statuses[selectedDevice.currentStatusCode]
                .status_name
            }
          >
            {selectedDevice.statuses &&
              selectedDevice.statuses.map(
                (v) => v && <option key={v.status_key}>{v.status_name}</option>
              )}
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
            {selectedDevice.statuses &&
              selectedDevice.statuses.map((v) => (
                <tr key={v.status_key}>
                  <td>{v.status_name}</td>
                  <td>
                    <input
                      style={{ width: "100%", border: "none" }}
                      type="text"
                      name={v.status_key}
                      value={orderValue[v.status_key]}
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
