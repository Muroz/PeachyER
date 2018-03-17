"use strict";
import React from "react";
import { Image, Row, Col, Well, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AddButton from "./addButton";

class NavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      showPopup: false
    };
  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  render() {
    return (
      <div className="navbar">
        <div className="navbar_logo">
          {" "}
          <img src="/images/peachy_logo.png" className="logo" />{" "}
        </div>
        <div className="navbar_li navbar_home">
          <a href="/dashboard">Dashboard</a>
        </div>
        <div className="navbar_li navbar_client">
          <a href="/clients">Clients</a>
        </div>
        <div className="navbar_li navbar_staff">
          <a href="/staff">Staff</a>
        </div>
        <div className="navbar_li navbar_guides">
          <a href="/guides">Guides</a>
        </div>
        <div className="navbar_li navbar_+">
          <a href="">+</a>
        </div>
        <div className="navbar_li navbar_?">
          <a href="">?</a>
        </div>
        {/* <div className="navbar_li navbar_add">
          {" "}
          <a onClick={this.togglePopup.bind(this)}>Add person</a>{" "}
        </div> */}
        <div className="navbar_li navbar_logout" >
          <a href="/logout"> Logout </a>
        </div>

        {this.state.showPopup ? (
          <AddButton closePopup={this.togglePopup.bind(this)} />
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(NavBar);
