"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClients, fetchStaff, getUser } from "../../actions/fetchingActions";
import Navbar from "../navbar";
import {formatPhone} from '../../helper';
import Directory from '../directory/directory';
import DirectoryHeader from '../directory/directoryHeader';
import moment from 'moment-timezone';
import Topbar from "../Topbar";
import {fireEvent} from './../../helper'
import axios from 'axios';


class MainClient extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      filter:''
    }
  }

  componentWillMount(){
    this.props.getUser();
    this.props.fetchClients();
    this.props.fetchStaff();
  }

  componentDidMount(){
    axios.post("/fetch/getUser")
    .then(res => {
      if (res.data.username != 'DiegoZ'){
        fireEvent('Client', res.data.username);
      }
    })
  }

  handleInputChange = (event) => {
    this.setState({filter:event.target.value})
  }

  filter(){
    var checker = this.state.filter;
    return this.props.clients.filter(
      function(a){
        if (a['name'].toUpperCase().includes(checker.toUpperCase())){
          return a;
        }
      })
  }


  render() {
    return (<div className='directoryRoot'>
        <Navbar />
        <Topbar />
        <DirectoryHeader type={'Client'} varName={'clientName'} handleInputChange={this.handleInputChange.bind(this)}/>

        <Directory directoryType="Clients" content={this.filter()} />

    </div>);
  }
}

function mapStateToProps(state) {
  return {staff:state.clientReducers.staff, clients:state.clientReducers.clients};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchStaff: fetchStaff, fetchClients: fetchClients, getUser:getUser }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MainClient);
