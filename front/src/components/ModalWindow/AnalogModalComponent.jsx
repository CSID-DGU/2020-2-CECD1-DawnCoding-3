import React from "react";
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";

function AnalogModalComponent({
  showAnalog,
  selectedAnalog,
  onChangeAnalog,
  onClickValueChange,
  onClickCloseAnalog,
}) {
  return (
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
              readOnly
              value={selectedAnalog.highBound}
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
              readOnly
              value={selectedAnalog.highCriticalPoint}
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
              readOnly
              value={selectedAnalog.lowCriticalPoint}
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
              readOnly
              value={selectedAnalog.lowerBound}
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
        <Button variant="primary" onClick={onClickValueChange}>
          수치 변경
        </Button>
        <Button variant="secondary" onClick={onClickCloseAnalog}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AnalogModalComponent;
