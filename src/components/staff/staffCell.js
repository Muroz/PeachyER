"use strict";
import React from "react";
import { Image, Row, Col, Well, Button, Panel } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class StaffCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Well>
        <h3> {this.props.name} </h3>
      </Well>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(StaffCell);
