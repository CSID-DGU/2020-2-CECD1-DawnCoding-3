const fakeEvents = [
  {
    id: 1,
    name: "a",
    signalName: "a1",
    status: "동작중",
    TTS: "able",
    blink: true,
    checked: false,
  },
  {
    id: 2,
    name: "a",
    signalName: "a2",
    status: "열림",
    TTS: "disable",
    blink: true,
    checked: false,
  },
  {
    id: 3,
    name: "b",
    signalName: "b1",
    status: "동작중",
    TTS: "disable",
    blink: true,
    checked: false,
  },
  {
    id: 4,
    name: "b",
    signalName: "b2",
    status: "열림",
    TTS: "able",
    blink: true,
    checked: false,
  },
];

export const fakeAjax = async (sensorName, sensorState) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let returnEvents = [];
  const thisIter = ["상태a", "상태b", "상태c"];
  const iterIndex = thisIter.findIndex((v) => v === sensorState);
  fakeEvents.forEach((v, i) => {
    returnEvents.push({
      ...v,
      name: sensorName,
      signalName: thisIter[(iterIndex + i) % 3],
    });
  });
  return returnEvents;
};

// 액션 타입
const NEW_EVENTS = "NEW_EVENTS";
const NEW_EVENTS_CLEAR = "NEW_EVENTS_CLEAR";

// 액션 생성 함수
export const newEvents = (events) => {
  return { type: NEW_EVENTS, events };
};
export const newEventsClear = () => {
  return { type: NEW_EVENTS_CLEAR };
};

// Initial State
const initialState = [];

export default function newEventsReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_EVENTS:
      return action.events;
    case NEW_EVENTS_CLEAR:
      return [];
    default:
      return state;
  }
}
