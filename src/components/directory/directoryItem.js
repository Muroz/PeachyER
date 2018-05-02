"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchStaff, fetchClients } from "../../actions/fetchingActions";
import Navbar from "../navbar";
import {formatPhone} from '../../helper'


//props to pass
// item: object

class DirectoryItem extends React.Component {

  setItem(item){
    var phoneNumber = formatPhone(item.phoneNumber.substring(2));
    return(<div className='directoryItem'>
      <div className='directoryItemTitle'>{item.name}-{item.employeeId || item.id}</div>
      <div className='directoryItemBody'>Telephone: {phoneNumber} </div>
      <div className='directoryItemBody'> Hours worked: {item.payingHours || item.billedHours || '0'} </div>
    </div>
    )
  }
  
  render() {
    return (
        <div className='directoryList'>
        {this.setItem(this.props.item)}
        </div>
    );
  }
}

export default DirectoryItem;