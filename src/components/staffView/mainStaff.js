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

  setStaff(caregiver,index){
    return(<div className='directoryItem' key={index}>
      <div className='directoryItemTitle'>{caregiver.name}</div>
      <div className='directoryItemBody'>Telephone: {caregiver.phoneNumber} </div>
      <div className='directoryItemBody'> Hours worked: {caregiver.payingHours} </div>
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