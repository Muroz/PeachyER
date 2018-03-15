"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClients } from "../../actions/fetchingActions";
import Navbar from "../navbar";

class MainClient extends React.Component {
  componentWillMount(){
    this.props.fetchClients()
  }

  setClients(client, index){

    return(<div className='directoryItem' key={index}>
        <div className='directoryItemTitle'>{client.name}</div>
        <div className='directoryItemBody'>Telephone: {client.phoneNumber} </div>
        <div className='directoryItemBody'> Billed hours: {client.billedHours} </div>
      </div>
    )
  }
  render() {
    return (<div>
        <Navbar />
        <div className='directoryBody'>
          <h1 className='directoryTitle'> Clients </h1>
          <div className='directoryList'>
            {this.props.clients.map(this.setClients,this)}
          </div>
        </div>

    </div>);
  }
}

function mapStateToProps(state) {
  return {clients:state.clientReducers.clients};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchClients: fetchClients }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MainClient);