"use strict"
import React from 'react';
import {Image, Row, Col, Well, Button, Panel} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


class ClientCell extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <a hrer="/profile">
            <Well>
                <h3> {this.props.name} </h3>
            </Well>
            </a>
        )
    }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(ClientCell);

