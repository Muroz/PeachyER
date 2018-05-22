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
  }
  render() {



    return (
      <div className="navbar">
        <div className="navbar_li navbar_add" onClick={this.togglePopup}>
          <a > 
            <Button variant="raised" className="navbarAdd">
            +
            </Button>
          </a>
        </div>
        <div className="navbar_li navbar_home">
          <a href="/dashboard" ><div className="navbarItem"><Dashboard color={'#f55845'}/><div className="navbarTitle headers">Home</div> </div></a>
        </div>
        <div className="navbar_li navbar_client">
          <a href="/clients"><div className="navbarItem"><img src="/images/heartLogo.png" className='navbarLogo'/><div className="navbarTitle headers">Clients</div> </div></a>
        </div>
        <div className="navbar_li navbar_staff">
          <a href="/staff"><div className="navbarItem"> <Group color={'#f55845'}/><div className="navbarTitle headers">Staff</div> </div></a>
        </div>

        <div className="navbar_li navbar_help">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSccNAn2ySm4UMDskwOHIH44m80CWUex8s-VP2NX-laJnW_zfw/viewform?embedded=true" ><HelpOutline color={'#f4AE90'}/><br/> Help</a>
        </div>
        <div className="navbar_logout" >
          <a href="/logout" ><ExitToApp color={'#f4AE90'}/><br/> Logout </a>
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
