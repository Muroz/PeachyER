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


import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';



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

    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        onClick={this.togglePopup}
      />,
    ];


    return (
      <div className="navbar">
        <Dialog
          title="Add a new client or employee (hooray!)"
          actions={actions}
          modal={false}
          open={this.state.showPopup}
          onRequestClose={this.togglePopup}
        >
          <div className='dialogText'>While we are currently building this feature you can follow the link to add a new client or employee.<a>Click here</a></div>
        </Dialog>
        <div className="navbar_logo">
          {" "}
          <img src="/images/peachy_logo.png" className="logo" />{" "}
        </div>
        <div className="navbar_li navbar_home">
          <a href="/dashboard"><Dashboard/>Dashboard</a>
        </div>
        <div className="navbar_li navbar_client">
          <a href="/clients"><Group/><br/>Clients</a>
        </div>
        <div className="navbar_li navbar_staff">
          <a href="/staff"><List/><br/>Staff</a>
        </div>
        <div className="navbar_li navbar_guides">
          <a href="/guides"><School/><br/>Guides</a>
        </div>
        <div className="navbar_li navbar_add" onClick={this.togglePopup}>
          <a ><GroupAdd /><br/> Add</a>
        </div>
        <div className="navbar_li navbar_help">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSccNAn2ySm4UMDskwOHIH44m80CWUex8s-VP2NX-laJnW_zfw/viewform?embedded=true"><HelpOutline /><br/> Help</a>
        </div>
        {/* <div className="navbar_li navbar_add">
          {" "}
          <a onClick={this.togglePopup.bind(this)}>Add person</a>{" "}
        </div> */}
        <div className="navbar_logout" >
          <a href="/logout" ><ExitToApp/><br/> Logout </a>
        </div>
{/* 
        {this.state.showPopup ? (
          <AddButton closePopup={this.togglePopup.bind(this)} />
        ) : null} */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(NavBar);
