"use strict";
import React from "react";
import { Image, Row, Col, Well, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AlertView from "./alertView";
import ActivityView from "./activityView";
import StaffView from "./staffView";
import StatsView from "./statsView";
import NavBar from "./../navbar";

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Dashboard);
