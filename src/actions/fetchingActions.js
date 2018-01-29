//src/actions/fetchingActions.js

'use strict'
import axios from 'axios';


//Fetch client info
export function fetchClients(){ return function(dispatch){
        axios.post('/fetch/clients').then(function(response){
            dispatch({type:'GET_CLIENTS', payload:response.data})
        })
        .catch(function(err){
            dispatch({type:'GET_CLIENTS_REJECTED', payload:err})
        })

}};

//Fetch staff info
export function fetchStaff(){ return function(dispatch){
        axios.post('/fetch/staff').then(function(response){
            dispatch({type:'GET_STAFF', payload:response.data})
        })
        .catch(function(err){
            dispatch({type:'GET_CLIENTS_STAFF', payload:err})
        })

}};


// Add staff entry
export function addStaff(staff){
  return function(dispatch){
    axios.post("/fetch/addStaff", staff)
      .then(function(response){
        dispatch({type:"ADD_STAFF", payload:response.data})
      })
      .catch(function(err){
        dispatch({type:"ADD_STAFF_REJECTED", payload:"there was an error while adding staff info"})
      })
  }
}

// Add client entry
export function addClient(client){
  return function(dispatch){
    axios.post("/fetch/addClient", client)
      .then(function(response){
        dispatch({type:"ADD_CLIENT", payload:response.data})
      })
      .catch(function(err){
        dispatch({type:"ADD_CLIENT_REJECTED", payload:"there was an error while adding client info"})
      })
  }
}

export function checkIn(id){
    return function(dispatch){
        
    }
}