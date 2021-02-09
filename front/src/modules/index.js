import { combineReducers } from "redux";
import newEventsReducer from "./newEvents";
import devicesReducer from "./devices";
import statusDeviceReducer from "./statusDevices";

const rootReducer = combineReducers({
  newEventsReducer,
  devicesReducer,
  statusDeviceReducer,
});

export default rootReducer;
