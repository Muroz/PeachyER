"use strict";

export function clientReducers(
  state = { clients: [], staff: [], activity: [], allShifts:[],allShiftsFiltered:[], unconfirmed:[],late:[],overtime:[],confimed:[],allShifts:[], selectedRow:-1,selectedVisit:{} },
  action
) {
  switch (action.type) {
    case "GET_CLIENTS":
      return { ...state, clients: action.payload };
      break;
    case "GET_STAFF":
      return { ...state, staff: action.payload };
      break;
    case "GET_ACTIVITY":
      return { ...state, activity: action.payload };
      break;
    case "ADD_CLIENT":
      return { ...state, clients: [...state.clients, ...action.payload] };
      break;
    case "ADD_STAFF":
      return { ...state, staff: [...state.staff, ...action.payload] };
      break;
    case "ADD_VISIT":
      return { ...state, allShifts: [...state.allShifts, ...action.payload]};
      break;
    case "GET_ALLSHIFTS_FILTERED":
      return {...state, allShiftsFiltered: action.payload};
      break;
    case "GET_UNCONFIRMED":
      return {...state, unconfirmed: action.payload}
      break;
    case "GET_CONFIRMED":
      return {...state, confirmed: action.payload}
      break;
    case "GET_ALLSHIFTS":
      return {...state, allShifts: action.payload}
      break;
    case "GET_LATE":
      return{...state, late:action.payload}
      break;
    case "GET_OVERTIME":
      return{...state, overtime:action.payload}
      break;
    case "ADD_ITEM":
      console.log('yay');
      console.log(action);
      return{...state}
      break;
    case "UPDATE_UNCONFIRMED_VISIT":
      const shiftsToUpdate = [...state.unconfirmed]
      const indexToUpdate = shiftsToUpdate.findIndex(
        function(shift){
          return shift._id === action.payload._id;
        }
      )
      return {...state, unconfirmed: [...shiftsToUpdate.slice(0, indexToUpdate), action.payload, ...shiftsToUpdate.slice(indexToUpdate + 1)]}
      break;
    case "UPDATE_ALLSHIFTS_VISIT":
      const allshiftsToUpdate = [...state.allShifts]
      const allindexToUpdate = allshiftsToUpdate.findIndex(
        function(shift){
          return shift._id === action.payload._id;
        }
      )
      return {...state, allShifts: [...allshiftsToUpdate.slice(0, allindexToUpdate), action.payload, ...allshiftsToUpdate.slice(allindexToUpdate + 1)]}
      break;
    case "SELECT_ROW":
      return {...state, selectedRow:action.payload}
  }
  return state;
}
