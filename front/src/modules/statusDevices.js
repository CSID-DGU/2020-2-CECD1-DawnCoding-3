// 액션 생성 함수
export const initStatusDeviceNum = (num) => {
  return { type: "INIT_STATUS_DEVICE_NUM", num };
};

// Initial State
const initialState = 0;

export default function statusDeviceReducer(state = initialState, action) {
  switch (action.type) {
    case "INIT_STATUS_DEVICE_NUM":
      return action.num;
    default:
      return state;
  }
}
