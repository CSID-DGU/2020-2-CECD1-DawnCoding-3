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
    TTS: "able",
    blink: true,
    checked: false,
  },
  {
    id: 4,
    name: "b",
    signalName: "b2",
    status: "열림",
    TTS: "disable",
    blink: true,
    checked: false,
  },
];

export const fakeAjax = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return fakeEvents;
};

// 액션 타입
const NEW_EVENTS = "NEW_EVENTS";

// 액션 생성 함수
export const newEvents = (events) => {
  return { type: NEW_EVENTS, events };
};

// Initial State
const initialState = [];

export default function newEventsReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_EVENTS:
      return action.events;
    default:
      return state;
  }
}
