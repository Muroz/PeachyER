"use strict"
//React
import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';

import reducers from './reducers/index';
import Dashboard from './components/dashboard/dashboard';
import ClientView from './components/client/clientView';
import StaffView from './components/staff/staffView';
 
const middleWare = applyMiddleware(thunk,createLogger());
const store = createStore(reducers,middleWare);

render((
    <Provider store={store}>
    <BrowserRouter>
        <div>
            <Route exact path="/dashboard" component={Dashboard}/>
            <Route exact path="/client" component={ClientView}/>
            <Route exact path="/staff" component={StaffView}/>
        </div>
    
    </BrowserRouter>
    </Provider>
), document.getElementById('app'))
