// 액션 생성 함수
export const updateDevices = (result) => {
  return { type: "UPDATE_DEVICES", result };
};
export const initDevices = (devices) => {
  return { type: "INIT_DEVICES", devices };
};
export const updateAnalog = ({ deviceId, currValue }) => {
  return { type: "UPDATE_ANALOG", deviceId, currValue };
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
    case "UPDATE_ANALOG":
      console.log(action);
      return state.map((v) =>
        v.deviceId === action.deviceId
          ? {
              ...v,
              currValue: action.currValue,
            }
          : v
      );
    default:
      return state;
  }
}
