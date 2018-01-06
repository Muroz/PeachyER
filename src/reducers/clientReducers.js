'use strict';



export function clientReducers(state={devices:[], users:[], userSelected:false, error:null, selectedUser:{}, zones:[]}, action){
    switch (action.type){
        case "SEARCH":
           return { ...state}
           break;

    }
    return state
}