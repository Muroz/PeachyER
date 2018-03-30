"use strict";
import React from "react";


import TextField from 'material-ui/TextField';

class InputTextField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
        <div className='textField'> 
          <div className="textFieldTitle">{this.props.title} </div>   
          <TextField
            className="textFieldBody"
            ref={this.props.type}
            id={this.props.type}
            onChange={this.props.handleChange}
          />
        </div>
    );
  }
}




export default InputTextField;
