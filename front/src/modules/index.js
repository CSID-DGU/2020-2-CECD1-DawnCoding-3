import { combineReducers } from "redux";

import newEventsReducer from "./newEvents";

const rootReducer = combineReducers({ newEventsReducer });

export default rootReducer;
