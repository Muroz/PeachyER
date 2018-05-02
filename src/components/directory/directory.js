"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchStaff, fetchClients } from "../../actions/fetchingActions";
import Navbar from "../navbar";
import {formatPhone} from '../../helper'


//props to pass
// directoryType: staff / client

class Directory extends React.Component {
  componentWillMount(){
      if (this.props.directoryType == 'Staff'){
        this.props.fetchStaff()
      } else if (this.props.directoryType == 'Clients'){
        this.props.fetchClients()
      }
  }

  setItems(item,index){
    console.log(item);
    var phoneNumber = formatPhone(item.phoneNumber.substring(2));
    return(<div className='directoryItem' key={index}>
      <div className='directoryItemTitle'>{item.name}-{item.employeeId || item.id}</div>
      <div className='directoryItemBody'>Telephone: {phoneNumber} </div>
      <div className='directoryItemBody'> Hours worked: {item.payingHours || item.billedHours || '0'} </div>
    </div>
    )
  }
  render() {
    var content;
    if (this.props.directoryType == 'Staff'){
        content = this.props.staff.map(this.setItems,this)
    } else if (this.props.directoryType == 'Clients'){
        content = this.props.clients.map(this.setItems,this)
    } else {
        content = []
    }
    return (<div>
        <div className='directoryBody'>
          <h1 className='directoryTitle'> {this.props.directoryType} </h1>
          <div className='directoryList'>
            {content}
          </div>
        </div>

    </div>);
  }
}

function mapStateToProps(state) {
  return {
      staff:state.clientReducers.staff,
      clients:state.clientReducers.clients
};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchStaff: fetchStaff, fetchClients: fetchClients }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Directory);