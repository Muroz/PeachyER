"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClients, fetchStaff } from "../../actions/fetchingActions";
import Navbar from "../navbar";
import {formatPhone} from '../../helper';
import Directory from '../directory/directory';
import DirectoryHeader from '../directory/directoryHeader';
import moment from 'moment-timezone';


import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Search from '@material-ui/icons/Search';
import Topbar from "../Topbar";
import IconButton from '@material-ui/core/IconButton';
import Download from '@material-ui/icons/CloudDownload'


class MainClient extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      filter:''
    }
  }

  componentWillMount(){
    this.props.fetchClients();
    this.props.fetchStaff();
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
  return bindActionCreators({ fetchStaff: fetchStaff, fetchClients: fetchClients }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MainClient);
