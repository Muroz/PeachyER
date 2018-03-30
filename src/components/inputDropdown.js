"use strict";
import React from "react";

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Toggle from 'material-ui/Toggle';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class InputDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  setFields(object,index){

    return(<MenuItem key={index} value={object.name} primaryText={object.name} />)
  }

  render() {

    return (
        <div className='dropdown'>
            <div className="dropdown_title">{this.props.title}</div> 
            <DropDownMenu 
            ref={this.props.type}
            value={this.props.defaultValue} 
            onChange={this.props.handleChange}  
            className="dropdown_body"
            autoWidth={true}>
            {this.props.list.map(this.setFields,this)}
            </DropDownMenu>     
      </div>
    );
  }
}



export default InputDropdown;
