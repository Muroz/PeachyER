"use strict"
import React from 'react';
import {Image, Row, Col, Well, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import styles from './../../../public/css/main.css';


class Dashboard extends React.Component{
render(){
    return(
        <div>
        <Well>
            <Row>                   
                <Col xs={18} md={12}> This is the nav bar </Col>
            </Row>
            
        </Well>
        <Well>
            <Row>
                <Col xs={12} md={8}>
                    Dashboard title
                </Col>
                <Col xs={6} md={4}>
                    Search bar
                </Col>
            </Row>
        </Well>
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(Dashboard);

