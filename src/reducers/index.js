"use strict";

import { combineReducers } from "redux";

import { clientReducers } from "./clientReducers";

//Combine reducers
const reducers = combineReducers({
  clientReducers
});

export default reducers;
