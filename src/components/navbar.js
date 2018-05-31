"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AddButton from "./addButton";

import Button from '@material-ui/core/Button';
import HelpOutline from 'material-ui/svg-icons/action/help-outline';
import GroupAdd from 'material-ui/svg-icons/social/group-add';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import Group from 'material-ui/svg-icons/social/group';
import List from 'material-ui/svg-icons/action/list';
import School from 'material-ui/svg-icons/social/school';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import moment from 'moment-timezone';
import {fireEvent} from './../helper';
import axios from 'axios';

class NavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      showPopup: false
    };
    this.togglePopup = this.togglePopup.bind(this);
  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
    axios.post("/fetch/getUser")
    .then(res => {
      if (res.data.username != 'DiegoZ'){
        fireEvent('AddItemClick', res.data.username);
      }
    })
  }
  render() {

    var period = moment().week()
    var periodDaysLeft = 0
    if(period % 2 == 0)
    {
      periodDaysLeft = 7 + 6 - moment().day() 
    }
    else
    {
      periodDaysLeft = 6 - moment().day();
    }

    return (
      <div className="navbar">
        <div > 
          <h1 className="dashboardDate midheader">  {moment().format('dddd, MMM D')} </h1>
          <h1 className='dashboardHeader subheader'> {periodDaysLeft} days left </h1> 
        </div>
        <div className="navbar_li navbar_add" onClick={this.togglePopup}>
          <a className="navbarAddLink"> 
            <Button variant="raised" className="navbarAdd">
            +
            </Button>
          </a>
        </div>
        <div className="navbar_li navbar_home">
          <a href="/dashboard" ><div className="navbarItem"><Dashboard color={'#fd6663'}/><div className="navbarTitle midheader">Home</div> </div></a>
        </div>
        <div className="navbar_li navbar_client">
          <a href="/clients"><div className="navbarItem"><img src="/images/heartLogo.png" className='navbarLogo'/><div className="navbarTitle midheader">Clients</div> </div></a>
        </div>
        <div className="navbar_li navbar_staff">
          <a href="/staff"><div className="navbarItem"> <Group color={'#fd6663'}/><div className="navbarTitle midheader">Staff</div> </div></a>
        </div>

        <div className="navbar_li navbar_help">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSccNAn2ySm4UMDskwOHIH44m80CWUex8s-VP2NX-laJnW_zfw/viewform?embedded=true" ><HelpOutline color={'#fd6663'}/><br/> Help</a>
        </div>
        <div className="navbar_logout" >
          <a href="/logout" ><ExitToApp color={'#fd6663'}/><br/> Logout </a>
        </div> 
         {this.state.showPopup ? (
           <AddButton togglePopup={this.togglePopup} showPopup={this.state.showPopup} />
         ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(NavBar);
