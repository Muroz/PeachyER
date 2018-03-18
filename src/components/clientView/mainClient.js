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

    /**
     *  Format phone numbers
    */
    formatPhone(phonenum) {
      var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (regexObj.test(phonenum)) {
          var parts = phonenum.match(regexObj);
          var phone = "";
          if (parts[1]) { phone += "+1 (" + parts[1] + ") "; }
          phone += parts[2] + "-" + parts[3];
          return phone;
      }
      else {
          //invalid phone number
          return phonenum;
      }
    }

  setClients(client, index){
    var phoneNumber = this.formatPhone(client.phoneNumber.substring(2));
    return(<div className='directoryItem' key={index}>
        <div className='directoryItemTitle'>{client.name}</div>
        <div className='directoryItemBody'>Telephone: {phoneNumber} </div>
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