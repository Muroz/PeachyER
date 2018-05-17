"use strict";
import React from "react";
import { Image, Row, Col, Well, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AddButton from "./addButton";


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
          <a > <div className="navbarItem"><GroupAdd /> <div className="navbarTitle headers">Add</div> </div></a>
        </div>
        <div className="navbar_logo">
          <img src="/images/Icon.png" className="logo" />
        </div>
        <div className="navbar_li navbar_home">
          <a href="/dashboard" ><div className="navbarItem"><Dashboard/><div className="navbarTitle headers">Home</div> </div></a>
        </div>
        <div className="navbar_li navbar_client">
          <a href="/clients"><div className="navbarItem"><Group/><div className="navbarTitle headers">Clients</div> </div></a>
        </div>
        <div className="navbar_li navbar_staff">
          <a href="/staff"><div className="navbarItem"> <List/><div className="navbarTitle headers">Staff</div> </div></a>
        </div>

        <div className="navbar_li navbar_help">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSccNAn2ySm4UMDskwOHIH44m80CWUex8s-VP2NX-laJnW_zfw/viewform?embedded=true" ><HelpOutline /><br/> Help</a>
        </div>
        <div className="navbar_logout" >
          <a href="/logout" ><ExitToApp/><br/> Logout </a>
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
