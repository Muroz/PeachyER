"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchStaff, fetchClients } from "../../actions/fetchingActions";
import Navbar from "../navbar";
import Directory from '../directory/directory'

class MainStaff extends React.Component {

  componentWillMount(){
    this.props.fetchStaff();
    this.props.fetchClients();
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
  return {staff:state.clientReducers.staff, clients:state.clientReducers.clients};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchStaff: fetchStaff, fetchClients: fetchClients }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MainStaff);


