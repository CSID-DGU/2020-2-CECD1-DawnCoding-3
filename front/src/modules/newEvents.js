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
