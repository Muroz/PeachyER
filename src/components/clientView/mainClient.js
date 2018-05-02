"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClients } from "../../actions/fetchingActions";
import Navbar from "../navbar";
import {formatPhone} from '../../helper';
import Directory from '../directory/directory'

class MainClient extends React.Component {

  render() {
    return (
      <div>
          <Navbar />
          <Directory directoryType="Clients" />
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