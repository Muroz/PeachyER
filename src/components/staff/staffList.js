"use strict";
import React from "react";
import { Image, Row, Col, Well, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import StaffCell from "./staffCell";

class StaffList extends React.Component {
  constructor(props) {
    super(props);

    this.setStaff = this.setStaff.bind(this);
  }

  setStaff(staff, index) {
    return <StaffCell key={index} name={staff.name} />;
  }
  render() {
    return (
      <div className="staffList_container">
        <ul>{this.props.staff.map(this.setStaff)}</ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    staff: state.clientReducers.staff
  };
}

export default connect(mapStateToProps)(StaffList);
