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
            open:true
        }
    }

    handleNext = () => {
        const {stepIndex} = this.state;
        this.setState({
          stepIndex: stepIndex + 1,
          finished: stepIndex >= 4,
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
            return (<div style={{background:'#00000'}}>
                <p>Select the visit by clicking on the table.</p>  
                <br/>  
                <img style={{width:'900px'}}src="/images/guide1.png" className="guide1" />
                            
                </div>);
          case 1:
            return  (<div style={{background:'#00000'}}>
            <p>Modify the visit information by changing the fields as desired.</p> 
            <br/>  
            <img style={{width:'900px'}}src="/images/guide2a.png" className="guide1" />
                        
            </div>);
          case 2:
            return  (<div style={{background:'#00000'}}>
            <p>For example you can change the name of the care staff that worked that shift from a given list.</p>
            <br/>  
            <img style={{width:'900px'}}src="/images/guide2b.png" className="guide1" />
                        
            </div>);
          case 3:
            return  (<div style={{background:'#00000'}}>
            <p>You can also change the times of the shift. Just keep in mind that you are not able to provide an ending time that is earlier than the starting time and vice versa.</p>
            <img style={{width:'900px'}}src="/images/guide2c.png" className="guide1" />
                        
            </div>);
          case 4:
            return(<div style={{background:'#00000'}}>
            <p>Save the changes!</p> 
            <br/>  
            <img style={{width:'900px'}}src="/images/guide3.png" className="guide1" />
                        
            </div>);
          default:
            return 'You\'re a long way from home sonny jim!';
        }
    }

    handleChange = () => {
        var change = !this.state.open
        this.setState({open:change})
    }

    render() {
        const {finished, stepIndex} = this.state;
        const contentStyle = {margin: '0 16px'};

        var stepper =             <div style={{width: '100%', maxWidth: 1000, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
        <Step>
            <StepLabel>Select visit</StepLabel>
        </Step>
        <Step>
            <StepLabel>Modify visit</StepLabel>
        </Step>
        <Step>
            <StepLabel>Example</StepLabel>
        </Step>
        <Step>
            <StepLabel>Another option</StepLabel>
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
                {this.getStepContent(stepIndex)}
            <div style={{marginTop: 12}}>
                <FlatButton
                label="Back"
                disabled={stepIndex === 0}
                onClick={this.handlePrev}
                style={{marginRight: 12}}
                />
                <RaisedButton
                label={stepIndex === 4 ? 'Finish' : 'Next'}
                primary={true}
                onClick={this.handleNext}
                />
            </div>
            </div>
        )}
        </div>
    </div>

        return (<div>
            <Navbar />
            <div className='directoryBody'>
                <h1 className='directoryTitle'> Guides </h1>
                We are currently growing our guide section to help you use Peachy the best you can! In the mean time, you can ask specific questions by clicking the help icon. If there is a guide you wish to request you can do so by following the link.  <a href='https://docs.google.com/forms/d/e/1FAIpQLSf4EmJgK_CxMh6jiuo8_iPM8ZYOpQusdSvEnvtv-auvaIGzlA/viewform?usp=sf_link'> Click here </a>
                <div className='guideTitle' >
                {/* onClick={this.handleChange} */}
                    1. How to modify visit information
                </div>
                {this.state.open ? stepper : null}
               
            </div>

            {/* <div className='formDivFrame'><iframe src="https://docs.google.com/forms/d/e/1FAIpQLSccNAn2ySm4UMDskwOHIH44m80CWUex8s-VP2NX-laJnW_zfw/viewform?embedded=true" width="760" height="800" frameBorder="0" marginHeight="100" marginWidth="100" align="center">Loading...</iframe></div> */}

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