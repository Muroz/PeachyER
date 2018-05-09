"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchStaff } from "../../actions/fetchingActions";
import Navbar from "../navbar";
import Directory from '../directory/directory'

class MainStaff extends React.Component {

  componentWillMount(){
    this.props.fetchStaff();
  }
  render() {
    return (
      <div>
          <Navbar />
          <Directory directoryType="Staff" content={this.props.staff}/>
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