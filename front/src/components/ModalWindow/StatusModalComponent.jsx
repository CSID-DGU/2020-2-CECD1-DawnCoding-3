import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import { updateStatusOrder } from "../../modules/devices";

function StatusModalComponent({
  show,
  selectedDevice,
  onChangeStatus,
  onClickEvent,
  onClickClose,
}) {
  const dispatch = useDispatch();
  const [changeMode, setChangeMode] = useState(true);
  const [orderValue, setOrderValue] = useState([]);

  useEffect(() => {
    setOrderValue(selectedDevice.statuses.map((v) => v.status_order));
  }, [selectedDevice]);

  const onChangeOrderValue = (e) => {
    setOrderValue(
      orderValue.map((v, i) => (i === +e.target.name ? e.target.value : v))
    );
  };

  const onClickChangeMode = () => {
    setChangeMode(!changeMode);
  };

  const onClickOrderChange = () => {
    const originalOrder = selectedDevice.statuses.map((v) => +v.status_order);
    let noChanged = true;
    let invalid = false;
    let wrongOrder = false;
    const numCount = Array(originalOrder.length).fill(0);
    orderValue.forEach((v, i) => {
      if (+v <= originalOrder.length) {
        numCount[+v - 1] += 1;
      }
      if (+v !== originalOrder[i]) noChanged = false;
      if (+v <= 0) invalid = true;
    });
    // 변한 것이 없으면 api 호출 낭비 하지 말자
    if (noChanged) {
      onClickChangeMode();
      onClickClose();
      return;
    }
    if (invalid) {
      alert("올바른 값을 입력해주세요.");
      return;
    }
    numCount.forEach((v) => {
      if (+v !== 1) wrongOrder = true;
    });
    if (wrongOrder) {
      alert("순서를 올바르게 입력해주세요.");
      return;
    }
    const sendValue = orderValue.map((v) => +v);

    (async () => {
      try {
        const settingStatuses = selectedDevice.statuses.map((v, i) => {
          return {
            ...v,
            status_order: sendValue[i],
          };
        });
        await axios.put(`/tts/statusOrder/${selectedDevice.deviceId}`, {
          orderList: sendValue,
        });
        dispatch(
          updateStatusOrder({
            deviceId: selectedDevice.deviceId,
            statusInfo: settingStatuses,
          })
        );
        alert("상태 우선순위가 변경되었습니다.");
      } catch (err) {
        console.error(err);
      }
      onClickChangeMode();
      onClickClose();
    })();
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
