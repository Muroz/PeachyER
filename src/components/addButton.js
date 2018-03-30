"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addClient, addStaff, addVisit } from "./../actions/fetchingActions";
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
      clientState: "",
      staffState:"",
      stage:0,
      saved:[false,false,false,false],

      selectedStaff: null,
      selectedClient: null,
      selectedStart: null,
      selectedEnd: null,
      selectedDate: new moment()
    };

  }

  setNewVal = (value,type) => {
    var newState = {}
    newState[type] = value
    this.setState(newState);
  }

  setClients(client,index){

    return(<MenuItem key={index} value={client.name} primaryText={client.name} />)
  }

  // handleInputChange = (type,event) => {
  //   console.log(type);
  //   console.log(event.target.value)
  // }

  handleDropdownChange = (type, event, index, value) => {
    var newState = {};

    newState[type] = value;

    this.setState(newState);
  }

  handleChangeTimeChange = (type,event, date) => {

    var newState = {};

    newState[type] = date;

    this.setState(newState);

  }

  handleSave = () => {
    console.log('saving');
    
    if (this.state.selectedClient != null && this.state.selectedStaff != null){
      console.log('valid people');

      if (this.state.selectedStart != null && this.state.selectedEnd != null){

        if(moment(this.state.selectedStart).diff(moment(this.state.selectedEnd),'minutes')<0){
          console.log('saving bro')
          var newVisit = {};
          newVisit['caregiverName'] = this.state.selectedStaff;
          newVisit['clientName'] = this.state.selectedClient;
          newVisit['startTime'] = this.state.selectedStart;
          newVisit['endTime'] = this.state.selectedEnd;
          this.props.addVisit(newVisit);
        } else {
          console.log('cant save bro, times are not logically correct')
        }
      } else {
        console.log('info not filled')
      }
    } else {
      console.log('info not filled');
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.togglePopup}
      />,
      <FlatButton
      label="Save"
      primary={true}
      onClick={this.handleSave}
  />
    ];

    
    var currentDate = new moment();

    return (
      <Dialog
          title={"Add a visit ("+currentDate.format('MMM DD')+")"}
          actions={actions}
          modal={false}
          open={this.props.showPopup}
          onRequestClose={this.props.togglePopup}
        >
        <div className='dialogBody'>
          <div className='dialogText'>Add a visit for today's schedule</div>
          <div className="dropdown_title">HSW:</div> 
          <InputDropdown title="Staff name" type='staffName' defaultValue={this.state.selectedStaff} list={this.props.staff} handleChange={this.handleDropdownChange.bind(this,'selectedStaff')}/>
          <div className="dropdown_title">Client:</div> 
          <InputDropdown title="Client name" type='clientName' defaultValue={this.state.selectedClient} list={this.props.clients} handleChange={this.handleDropdownChange.bind(this,'selectedClient')}/>

          <div>Scheduled start: </div>  
          <div>
            <TimePicker
               //hintText={stringClockIn}
               value={this.state.selectedStart}
               onChange={this.handleChangeTimeChange.bind(this,'selectedStart')}
            />
          </div>

          <div>Scheduled end: </div>  
          <div>
            <TimePicker
              //hintText={moment(this.state.selectedEnd).format('HH:mm')}
               value={this.state.selectedEnd}
               onChange={this.handleChangeTimeChange.bind(this,'selectedEnd')}
            />
          </div>

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
    { addClient: addClient, addStaff: addStaff, addVisit:addVisit },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddButton);


