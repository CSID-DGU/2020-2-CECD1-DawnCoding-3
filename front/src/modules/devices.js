import { initStatusDeviceNum } from "./statusDevices";

// 액션 생성 함수
export const updateDevices = (result) => {
  return { type: "UPDATE_DEVICES", result };
};
export const initDevices = (devices, dispatch) => {
  let the_cnt = 0;
  devices.forEach((v) => {
    if (!v.analog) {
      the_cnt += 1;
    }
  });
  dispatch(initStatusDeviceNum(the_cnt));
  return { type: "INIT_DEVICES", devices };
};
export const updateAnalog = ({ deviceId, currValue }) => {
  return { type: "UPDATE_ANALOG", deviceId, currValue };
};
export const updateStatusOrder = ({ deviceId, statusInfo }) => {
  return { type: "UPDATE_STATUS_ORDER", deviceId, statusInfo };
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
      return state.map((v) =>
        v.deviceId === action.deviceId
          ? {
              ...v,
              currValue: action.currValue,
            }
          : v
      );
    case "UPDATE_STATUS_ORDER":
      return state.map((v) =>
        v.deviceId === action.deviceId
          ? {
              ...v,
              statuses: action.statusInfo,
            }
          : v
      );
    default:
      return state;
  }
}
