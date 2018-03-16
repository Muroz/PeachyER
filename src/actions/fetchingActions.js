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


// Fetch activity information
export function fetchActivity() {
  return function(dispatch) {
    axios
      .post("/fetch/activity")
      .then(function(response) {
        dispatch({ type: "GET_ACTIVITY", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "GET_ACTIVITY_REJECTED", payload: err });
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

// Fetch late shifts information
export function fetchLateShifts() {
  return function(dispatch) {
    axios
      .post("/fetch/getLate")
      .then(function(response) {
        dispatch({ type: "GET_LATE", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "GET_LATE_REJECTED", payload: err });
      });
  };
}

// Fetch overtime shifts information
export function fetchOvertimeShifts() {
  return function(dispatch) {
    axios
      .post("/fetch/getOvertime")
      .then(function(response) {
        dispatch({ type: "GET_OVERTIME", payload: response.data });
      })
      .catch(function(err) {
        dispatch({ type: "GET_OVERTIME_REJECTED", payload: err });
      });
  };
}


// Add client entry
export function updateVisit(visit,type) {
  console.log('updating');
  console.log(visit);

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

export function checkIn(id) {
  return function(dispatch) {};
}
