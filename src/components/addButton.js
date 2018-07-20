"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addClient, addStaff, addVisit, addItem } from "./../actions/fetchingActions";

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Toggle from 'material-ui/Toggle';
import DropDownMenu from 'material-ui/DropDownMenu';
import TimePicker from 'material-ui/TimePicker';
import MenuItem from 'material-ui/MenuItem';

import moment from 'moment-timezone';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Phone from '@material-ui/icons/Phone';
import CreditCard from '@material-ui/icons/CreditCard';


import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from "@material-ui/core/Button/Button";

import {TextMaskCustom} from '../helper.js'


class AddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '+1709',
      id: '',

      message:'',

      typeSelected:''
    };

  }

  handleInputChange = (type, event) => {

    var newState = {};
    newState[type] = event.target.value;
    this.setState(newState);
  }

  handleSave = () => {
    if(this.state.name != '' && this.state.phone != '' && this.state.typeSelected != ''){
      var newItemData = {
        name:this.state.name,
        phone:"+1"+this.state.phone.replace(/\D+/g, ''),
        id:this.state.id
      }
      var newItem = {
        type:this.state.typeSelected,
        item:newItemData
      }
      this.props.addItem(newItem);
      this.setState({
        name: '',
        phone: '+1709',
        id: '',
        message: '',
        typeSelected: ''
      });
      this.props.togglePopup();
    }
  }

  addItem = (type) => this.setState({typeSelected:type});
  

  goBack = () => this.setState({typeSelected:null,itemName: null,itemPhone: null})


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.togglePopup}
      />,
      <FlatButton
      label="Save"
      primary={false}
      onClick={this.handleSave}
  />
    ];

    
    var currentDate = new moment();

    return (
      <Dialog
          title="Add"
          actions={actions}
          modal={false}
          open={this.props.showPopup}
          onRequestClose={this.props.togglePopup}
          className='addDialog'
        >
        <div className='dialogBody'>
            <RadioGroup
              aria-label="type"
              name="type"
              className='dialogRadioGroup'
              value={this.state.typeSelected}
              onChange={this.handleInputChange.bind(this,'typeSelected')}
            >
              <FormControlLabel value="Staff" control={<Radio color="primary"  style={{color: '#f55845'}}/>} label="Staff" />
              <FormControlLabel value="Client" control={<Radio color="primary"  style={{color: '#f55845'}}/>} label="Client" />
          </RadioGroup>
          <TextField
            className='dialogText'
            id="input-with-icon-textfield"
            label="Name"
            onChange = {this.handleInputChange.bind(this,'name')}
          />
          <FormControl className='dialogText'>
            <InputLabel htmlFor="formatted-text-mask-input">Phone</InputLabel>
            <Input
              value={this.state.phone.substring(2,12)}
              onChange={this.handleInputChange.bind(this,'phone')}
              id="formatted-text-mask-input"
              inputComponent={TextMaskCustom}
            />
          </FormControl>
          {this.state.typeSelected == 'Staff' ?
          <TextField
            className='dialogText'
            id="input-with-icon-textfield"
            label="ID"
            onChange = {this.handleInputChange.bind(this,'id')}
          /> : null}

        </div>
        

        </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    staff:state.clientReducers.staff,
    clients:state.clientReducers.clients
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { addClient: addClient, addStaff: addStaff, addVisit:addVisit, addItem:addItem },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddButton);