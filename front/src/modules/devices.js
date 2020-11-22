// 액션 생성 함수
export const updateDevices = (result) => {
  return { type: "UPDATE_DEVICES", result };
};
export const initDevices = (devices) => {
  return { type: "INIT_DEVICES", devices };
};

// Initial State
const initialState = [];

export default function devicesReducer(state = initialState, action) {
  switch (action.type) {
    case "INIT_DEVICES":
      return action.devices;

    case "UPDATE_DEVICES":
      const result = action.result;
      const newDevices = [];
      state.forEach((v) => {
        newDevices.push({ ...v });
      });
      result.forEach((device) => {
        const theIndex = state.findIndex((v) => v.deviceId === device.id);
        newDevices[theIndex].currentStatusCode = device.statusCode;
        newDevices[theIndex].currentStatusTitle = device.status;
      });
      return newDevices;
    default:
      return state;
  }
}
