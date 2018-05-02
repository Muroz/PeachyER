"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchStaff } from "../../actions/fetchingActions";
import Navbar from "../navbar";
import {formatPhone} from '../../helper'
import Directory from '../directory/directory'

class MainStaff extends React.Component {

  //props to pass
// directoryType: staff / client
  render() {
    return (
      <div>
          <Navbar />
          <Directory directoryType="Staff" />
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