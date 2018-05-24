//src/actions/fetchingActions.js

"use strict";
import axios from "axios";

//Select rows
export function selectRow(selectedRow){return function(dispatch){
  console.log(selectedRow)
  dispatch({
    type:"SELECT_ROW",
    payload:{selectedRow     
    }
  })
}}

//Fetch client info
export function fetchClients() {
  return function(dispatch) {
    axios
      .post("/fetch/clients")
      .then(function(response) {
        dispatch({ type: "GET_CLIENTS", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "GET_CLIENTS_REJECTED", payload: err });
      });
  };
}

//Fetch staff info
export function fetchStaff() {
  return function(dispatch) {
    axios
      .post("/fetch/staff")
      .then(function(response) {
        dispatch({ type: "GET_STAFF", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "GET_STAFF_REJECTED", payload: err });
      });
  };
}

// Add staff entry
export function addStaff(staff) {
  return function(dispatch) {
    axios
      .post("/fetch/addStaff", staff)
      .then(function(response) {
        dispatch({ type: "ADD_STAFF", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "ADD_STAFF_REJECTED", payload: err });
      });
  };
}

// Add client entry
export function addClient(client) {
  return function(dispatch) {
    axios
      .post("/fetch/addClient", client)
      .then(function(response) {
        dispatch({ type: "ADD_CLIENT", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "ADD_CLIENT_REJECTED", payload: err });
      });
  };
}

export function addItem(item) {
  console.log('at addingItem')
  return function(dispatch) {
    axios
      .post("/fetch/addItem", item)
      .then(function(response) {
        dispatch({ type: "ADD_ITEM", payload: response.data, item:item.type });
      })
      .catch(function(err) {
        dispatch({ type: "ADD_ITEM_REJECTED", payload: err });
      });
  };
}

// Add visit entry
export function addVisit(visit) {
  return function(dispatch) {
    axios
      .post("/fetch/addVisit", visit)
      .then(function(response) {
        dispatch({ type: "ADD_VISIT", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "ADD_VISIT_REJECTED", payload: err });
      });
  };
}


// Fetch all shift information
export function fetchAllShifts() {
  return function(dispatch) {
    axios
      .post("/fetch/getAllShifts")
      .then(function(response) {
        dispatch({ type: "GET_ALLSHIFTS", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "GET_ALLSHIFTS_REJECTED", payload: err });
      });
  };
}

//////
export function fetchAllShiftsFiltered(date) {
  var dict = {}
  dict['date'] = date
  return function(dispatch) {
    axios
      .post("/fetch/getAllShiftsFiltered",dict)
      .then(function(response) {
        dispatch({ type: "GET_ALLSHIFTS_FILTERED", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "GET_ALLSHIFTS_FILTERED_REJECTED", payload: err });
      });
  };
}
///////

// Fetch unconfirmed shifts information
export function fetchUnconfirmedShifts() {
  return function(dispatch) {
    axios
      .post("/fetch/getUnconfirmed")
      .then(function(response) {
        dispatch({ type: "GET_UNCONFIRMED", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "GET_UNCONFIRMED_REJECTED", payload: err });
      });
  };
}


// Fetch current shifts information
export function fetchConfirmedShifts() {
  return function(dispatch) {
    axios
      .post("/fetch/getConfirmed")
      .then(function(response) {
        dispatch({ type: "GET_CONFIRMED", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "GET_CONFIRMED_REJECTED", payload: err });
      });
  };
}


// Add client entry
export function updateVisit(visit,type) {
  return function(dispatch) {
    axios
      .post("/fetch/updateVisit", visit)
      .then(function(response) {
        if(type=='unconfirmed'){
          dispatch({ type: "UPDATE_UNCONFIRMED_VISIT", payload: response.data });
        } else if(type=='allShifts'){
          dispatch({ type: "UPDATE_ALLSHIFTS_VISIT", payload: response.data });
        }
      })
      .catch(function(err) {
        dispatch({ type: "UPDATE_VISIT_REJECTED", payload: err });
      });
  };

}

//clockout people
export function clockOut(visit,time) {
  var body = {}
  body['visit'] = visit
  body['time'] = time
  return function(dispatch) {
    axios
      .post("/fetch/clockOut", body)
      .then(function(response) {
          dispatch({ type: "CLOCK_OUT", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "CLOCK_OUT_REJECTED", payload: err });
      });
  };
}

