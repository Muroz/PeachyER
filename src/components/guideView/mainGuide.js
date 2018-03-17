"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClients } from "../../actions/fetchingActions";
import Navbar from "../navbar";
import {
    Step,
    Stepper,
    StepLabel,
  } from 'material-ui/Stepper';
  import RaisedButton from 'material-ui/RaisedButton';
  import FlatButton from 'material-ui/FlatButton';

class MainGuide extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            finished: false,
            stepIndex: 0,
        }
    }

    handleNext = () => {
        const {stepIndex} = this.state;
        this.setState({
          stepIndex: stepIndex + 1,
          finished: stepIndex >= 2,
        });
    };
    
    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
          this.setState({stepIndex: stepIndex - 1});
        }
    };

    getStepContent(stepIndex) {
        switch (stepIndex) {
          case 0:
            return 'Select the visit by clicking on the table';
          case 1:
            return 'Modify the visit information by changing the fields as desired';
          case 2:
            return 'Save the changes!';
          default:
            return 'You\'re a long way from home sonny jim!';
        }
    }

    render() {
        const {finished, stepIndex} = this.state;
        const contentStyle = {margin: '0 16px'};

        return (<div>
            <Navbar />
            <div className='directoryBody'>
                <h1 className='directoryTitle'> Guides </h1>
            </div>

            <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
                <Stepper activeStep={stepIndex}>
                <Step>
                    <StepLabel>Select visit</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Modify visit</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Save</StepLabel>
                </Step>
                </Stepper>
                <div style={contentStyle}>
                {finished ? (
                    <p>
                    <a
                        href="#"
                        onClick={(event) => {
                        event.preventDefault();
                        this.setState({stepIndex: 0, finished: false});
                        }}
                    >
                        Click here
                    </a> to review the guide.
                    </p>
                ) : (
                    <div>
                    <p>{this.getStepContent(stepIndex)}</p>
                    <div style={{marginTop: 12}}>
                        <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onClick={this.handlePrev}
                        style={{marginRight: 12}}
                        />
                        <RaisedButton
                        label={stepIndex === 2 ? 'Finish' : 'Next'}
                        primary={true}
                        onClick={this.handleNext}
                        />
                    </div>
                    </div>
                )}
                </div>
            </div>

        </div>);
    }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MainGuide);