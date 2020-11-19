import React from "react";

function EventComponent({
  event: { createDate, name, signalName, status, TTS, blink, checked },
}) {
  return (
    <tr className={blink ? "blink" : null}>
      <td className={checked ? "black" : "red"}>{createDate}</td>
      <td className={checked ? "black" : "red"}>{name}</td>
      <td className={checked ? "black" : "red"}>{signalName}</td>
      <td className={checked ? "black" : "red"}>{status}</td>
      <td className={checked ? "black" : "red"}>{TTS}</td>
    </tr>
  );
}

export default EventComponent;
