"use strict";
import React from "react";
import { connect } from "react-redux";
import {
  MenuItem,
  InputGroup,
  DropdownButton,
  Image,
  Col,
  Row,
  Well,
  Panel,
  FormControl,
  FormGroup,
  ControlLabel,
  Button
} from "react-bootstrap";
import { bindActionCreators } from "redux";
import { findDOMNode } from "react-dom";
import { addClient, addStaff } from "./../actions/fetchingActions";

class AddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formType: "client"
    };
    this.setForm = this.setForm.bind(this);
  }

  setForm(e, formType) {
    this.setState({ formType: formType });
  }

  handleSubmitClient() {
    const client = [
      {
        name: findDOMNode(this.refs.name).value,
        id: findDOMNode(this.refs.id).value
      }
    ];
    this.props.addClient(client);
  }

  handleSubmitStaff() {
    const staff = [
      {
        name: findDOMNode(this.refs.name).value
      }
    ];
    this.props.addStaff(staff);
  }

  resetForm() {
    //RESET THE Button
    //this.props.resetButton();

    findDOMNode(this.refs.title).value = "";
    findDOMNode(this.refs.description).value = "";
    findDOMNode(this.refs.price).value = "";
  }
  render() {
    return (
      <div className="addButton_overlay">
        <div className="addButton_popup">
          <Well>
            <Button onClick={e => this.setForm(e, "client")}>
              {" "}
              Add Client{" "}
            </Button>
            <Button onClick={e => this.setForm(e, "staff")}> Add Staff </Button>
            <Button onClick={this.props.closePopup}>Close</Button>
            {this.state.formType == "client" ? (
              <Panel>
                <FormGroup
                  controlId="name"
                  validationState={this.props.validation}
                >
                  <ControlLabel>Name</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder="Enter Name"
                    ref="name"
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  controlId="id"
                  validationState={this.props.validation}
                >
                  <ControlLabel>ID</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder="Enter the identification number"
                    ref="id"
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <Button
                  onClick={
                    !this.props.msg
                      ? this.handleSubmitClient.bind(this)
                      : this.resetForm.bind(this)
                  }
                >
                  {" "}
                  Add
                </Button>
              </Panel>
            ) : (
              <Panel>
                <FormGroup
                  controlId="name"
                  validationState={this.props.validation}
                >
                  <ControlLabel>Name</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder="Enter Name"
                    ref="name"
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <Button
                  onClick={
                    !this.props.msg
                      ? this.handleSubmitStaff.bind(this)
                      : this.resetForm.bind(this)
                  }
                >
                  {" "}
                  Add
                </Button>
              </Panel>
            )}
          </Well>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { addClient: addClient, addStaff: addStaff },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddButton);
