"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClients, fetchStaff } from "../../actions/fetchingActions";
import Navbar from "../navbar";
import {formatPhone} from '../../helper';
import Directory from '../directory/directory'

class MainClient extends React.Component {

  componentWillMount(){
    this.props.fetchClients();
    this.props.fetchStaff();
  }
  render() {
    return (<div>
        <Navbar />
        <Directory directoryType="Clients" content={this.props.clients} />

    </div>);
  }
}

function mapStateToProps(state) {
  return {staff:state.clientReducers.staff, clients:state.clientReducers.clients};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchStaff: fetchStaff, fetchClients: fetchClients }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MainClient);
