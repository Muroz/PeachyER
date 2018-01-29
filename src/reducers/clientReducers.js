'use strict';



export function clientReducers(state={clients:[], staff:[]}, action){
    switch (action.type){
        case "GET_CLIENTS":
            return {...state, clients:action.payload}
            break;
        case "GET_STAFF":
            return {...state, staff:action.payload}
            break;
        case "ADD_CLIENT":
            return {...state, clients:[...state.clients, ...action.payload]}
            break;
        case "ADD_STAFF":
            return {...state, staff:[...state.staff, ...action.payload]}
            break;
    }
    return state
}