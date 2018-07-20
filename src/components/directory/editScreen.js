"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateItem, addItem } from "../../actions/fetchingActions";

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
import axios from 'axios';


import {TextMaskCustom} from '../../helper.js'



class EditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      id: '',
      phones: [],
      phoneNumber: '',
    };
    this.addNumber = this.addNumber.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillMount(){
    if (this.props.type == 'Clients'){
      this.setState({phones:this.props.item.phones,name:this.props.item.name})
    } else if (this.props.type == 'Staff'){
      this.setState({phoneNumber:this.props.item.phoneNumber,name:this.props.item.name,id:this.props.item.employeeId})
    }
  }

  handleSave(){
    var cleanPhones = []
    this.state.phones.forEach(function(phone){
      cleanPhones.push("+1"+phone.replace(/\D+/g, ''))
    })
    var item = {}
    item['name'] = this.state.name;
    item['type'] = this.props.type;
    item['phones'] = cleanPhones;
    item['phoneNumber'] = "+1"+this.state.phoneNumber.replace(/\D+/g, '');
    item['id'] = this.state.id;
    item['uuid'] = this.props.item._id
    this.props.updateItem(item);
    this.props.togglePopup();
  }

  handleInputChange = (type, event) => {
    var newState = {};
    newState[type] = event.target.value;
    this.setState(newState);
  }

  handlePhoneChange = (index) => (event) => {
    const newPhones = this.state.phones.map((phone, sidx) => {
      if (index !== sidx) return phone;
      return event.target.value;
    });
    this.setState({phones:newPhones});
  }

  setPhones = (phone, index) => {
    var deleteButton = null;
    if (index > 0){
      deleteButton =  <Button onClick={this.removeNumber.bind(this,index)} className={"deleteNumberButton"}>
                        Remove
                      </Button>
    }
    var label = "Secondary phone "+index
    if (index == 0){
      label = "Primary Phone (Required – edit to change primary)"
    }
    return (<div key={`phone_${index}`} className='phoneRow'>
              <FormControl>
                <InputLabel htmlFor="formatted-text-mask-input">{label}</InputLabel>
                <Input
                  value={phone.substring(2,12)}
                  onChange={this.handlePhoneChange(index)}
                  id="formatted-text-mask-input"
                  inputComponent={TextMaskCustom}
                />
              </FormControl>
              {deleteButton}
            </div>
    )
  }

  addNumber = () => {
    this.setState({phones:this.state.phones.concat('+1709')})
  }

  removeNumber = (index) => {
    this.setState({phones:this.state.phones.filter((s, sidx) => index !== sidx) });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

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
    var id = "";
    var phoneInfo;
    if(this.props.type == 'Clients'){
      id = 'id'
      phoneInfo = this.state.phones.map(this.setPhones,this);

    } else if (this.props.type == 'Staff'){
      id = 'employeeId'
      phoneInfo =  <FormControl>
                      <InputLabel htmlFor="formatted-text-mask-input">Primary Phone (Required – edit to change primary)</InputLabel>
                      <Input
                        value={this.state.phoneNumber.substring(2,12)}
                        onChange={this.handleChange('phoneNumber')}
                        id="formatted-text-mask-input"
                        inputComponent={TextMaskCustom}
                      />
                    </FormControl>
    }

    return (
      <Dialog
          title="Edit"
          actions={actions}
          modal={false}
          open={this.props.showPopup}
          onRequestClose={this.props.togglePopup}
          className='editDialog'
        >
        <div className='editDialogBody'>

          <TextField
              className='editDialogText'
              id="input-with-icon-textfield"
              label="Name"
              onChange = {this.handleInputChange.bind(this,'name')}
              value={this.state.name}
            />

      
            {this.props.type == 'Staff' ?
            <TextField
              className='editDialogText'
              id="input-with-icon-textfield"
              value = {this.state.id}
              label="ID"
              onChange = {this.handleInputChange.bind(this,'id')}
            /> : null}

          {phoneInfo}
        {this.props.type == 'Clients' ?
          <Button onClick={this.addNumber} className="addNumberButton">
            Add number
          </Button> :
          null
        }

        </div>

        </Dialog>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {  updateItem:updateItem },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    staff:state.clientReducers.staff,
    clients:state.clientReducers.clients
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(EditScreen);

