import { combineReducers } from "redux";
import newEventsReducer from "./newEvents";
import devicesReducer from "./devices";

const rootReducer = combineReducers({ newEventsReducer, devicesReducer });

export default rootReducer;
