"use strict";

export function clientReducers(
  state = { clients: [], staff: [], activity: [], allShifts:[], unconfirmed:[],confimed:[],allShifts:[], selectedRow:-1 },
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
    case "GET_ALL_SHIFTS":
      return {...state, allShifts: action.payload};
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
    case "UPDATE_UNCONFIRMED_VISIT":
      const shiftsToUpdate = [...state.unconfirmed]
      const indexToUpdate = shiftsToUpdate.findIndex(
        function(shift){
          return shift._id === action.payload._id;
        }
      )
      return {...state, unconfirmed: [...shiftsToUpdate.slice(0, indexToUpdate), action.payload, ...shiftsToUpdate.slice(indexToUpdate + 1)]}
      break;
    case "SELECT_ROW":
      return {...state, selectedRow:action.payload}
  }
  return state;
}
