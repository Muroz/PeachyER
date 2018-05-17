"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addClient, addStaff, addVisit, addItem } from "./../actions/fetchingActions";
import InputTextField from './inputTextField';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import DropDownMenu from 'material-ui/DropDownMenu';
import TimePicker from 'material-ui/TimePicker';
import MenuItem from 'material-ui/MenuItem';
import InputDropdown from "./inputDropdown";

import moment from 'moment-timezone';

class AddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: null,
      itemPhone: null,

      message:'',

      typeSelected:null
    };

  }

  handleInputChange = (type, event, newVal) => {
    var newState = {};
    newState[type] = newVal;
    this.setState(newState);
  }

  handleSave = () => {

    console.log(this.state);

    if(this.state.itemName != null && this.state.itemPhone != null){
      console.log('ready to save');
      var newItemData = {
        name:this.state.itemName,
        phone:this.state.itemPhone
      }
      var newItem = {
        type:this.state.typeSelected,
        item:newItemData
      }
      this.props.addItem(newItem);
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
          title="Add a client/staff"
          actions={actions}
          modal={false}
          open={this.props.showPopup}
          onRequestClose={this.props.togglePopup}
        >
        <div className='dialogBody'>
          <FlatButton
            className="dialogButton"
            label="Add client"
            primary={true}
            onClick={this.addItem.bind(this,'Client')}
          />
          <FlatButton
            className="dialogButton"
            label="Add staff"
            primary={true}
            onClick={this.addItem.bind(this,'Staff')}
          />

          { this.state.typeSelected ?   
            (<div className="formBody">
              <TextField
                floatingLabelText="Name"
                name="itemName"
                onChange={this.handleInputChange.bind(this,'itemName')}
                value={this.state.itemName}
              /> 
              <TextField
                floatingLabelText="Telephone number"
                name="itemPhone"
                onChange={this.handleInputChange.bind(this,'itemPhone')}
                value={this.state.itemPhone}        
              /> 
              <FlatButton
                className="formButton"
                label="Back"
                primary={true}
                value={this.state.itemPhone}
                onClick={this.goBack.bind(this)}
              /> 
            </div>) : null}
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


