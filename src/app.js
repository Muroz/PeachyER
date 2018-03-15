"use strict";
//React
import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import reducers from "./reducers/index";
import Dashboard from "./components/dashboard/dashboard";
import MainStaff from './components/staffView/mainStaff'
import MainClient from './components/clientView/mainClient'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const middleWare = applyMiddleware(thunk, createLogger());
const store = createStore(reducers, middleWare);

render(
  <Provider store={store}>
    <BrowserRouter>
      <MuiThemeProvider>
      <div>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/staff" component={MainStaff} />
        <Route exact path="/clients" component={MainClient} />
      </div>
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);
