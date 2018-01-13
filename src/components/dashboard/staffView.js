"use strict"
import React from 'react';
import {Image, Row, Col, Well, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


class StaffView extends React.Component{
render(){
    return(
        <div>
            Staff view goes here
            <div>
                 //Staff panel
                <Panel>
                    <Panel.Heading>
                        <div>
                            <img width="75" src="{props.avatar_url}" />
                            <div className="cardCol2">
                                <div>{props.name}</div>
                                <div>{props.location}</div>
                            </div>
                        </div>
                    </Panel.Heading>
                    <Panel.Body>
                        //Panel for Dashboard content here
                    </Panel.Body>
		      </Panel>
        
            <div/>
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(StaffView);

