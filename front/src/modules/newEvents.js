import axios from "axios";

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

const fakeAjax = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return fakeEvents;
};

// 액션 타입
const NEW_EVENTS = "NEW_EVENTS";
const NEW_EVENTS_ERROR = "NEW_EVENTS_ERROR";
const NEW_EVENTS_SUCCESS = "NEW_EVENTS_SUCCESS";

// thunk 함수
export const newEvents = () => async (dispatch) => {
  dispatch({ type: NEW_EVENTS });
  try {
    // const events = await axios.get("/events");
    const events = await fakeEvents();
    dispatch({ type: NEW_EVENTS_SUCCESS, events });
  } catch (err) {
    dispatch({ type: NEW_EVENTS_ERROR, error: err });
  }
};

// Initial State
const initialState = {
  events: [],
};

export default function newEventsReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_EVENTS:
      return {
        ...state,
        events: {
          data: null,
          error: null,
        },
      };
    case NEW_EVENTS_SUCCESS:
      return {
        ...state,
        events: {
          data: action.events,
          error: null,
        },
      };
    case NEW_EVENTS_ERROR:
      return {
        ...state,
        events: {
          data: null,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
