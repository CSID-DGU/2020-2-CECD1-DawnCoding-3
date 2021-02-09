import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";

function StatusModalComponent({ show, setShow }) {
  const dispatch = useDispatch();

  return (
    <Modal show={show} onHide={() => {}}>
      <Modal.Header>
        <Modal.Title>STT 기능</Modal.Title>
      </Modal.Header>
      <Modal.Body>STT</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShow(false);
          }}
        >
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StatusModalComponent;
