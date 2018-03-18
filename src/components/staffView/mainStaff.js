"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchStaff } from "../../actions/fetchingActions";
import Navbar from "../navbar";

class MainStaff extends React.Component {
  componentWillMount(){
    this.props.fetchStaff()
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

  setStaff(caregiver,index){
    var phoneNumber = this.formatPhone(caregiver.phoneNumber.substring(2));
    return(<div className='directoryItem' key={index}>
      <div className='directoryItemTitle'>{caregiver.name}</div>
      <div className='directoryItemBody'>Telephone: {phoneNumber} </div>
      <div className='directoryItemBody'> Hours worked: {caregiver.payingHours} </div>
      <div className='directoryItemBody'> Late shifts: {caregiver.missedVisits} </div>
    </div>
    )
  }
  render() {
    return (<div>
        <Navbar />
        <div className='directoryBody'>
          <h1 className='directoryTitle'> Staff </h1>
          <div className='directoryList'>
            {this.props.staff.map(this.setStaff,this)}
          </div>
        </div>

    </div>);
  }
}

function mapStateToProps(state) {
  return {staff:state.clientReducers.staff};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchStaff: fetchStaff }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MainStaff);