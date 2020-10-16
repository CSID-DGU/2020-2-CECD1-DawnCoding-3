import React from "react";

function EventComponent({ num, event: { name, signalName, status, TTS } }) {
  return (
    <tr>
      <td>{num}</td>
      <td>{name}</td>
      <td>{signalName}</td>
      <td>{status}</td>
      <td>{TTS}</td>
    </tr>
  );
}

export default EventComponent;
