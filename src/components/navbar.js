"use strict"
import React from 'react';
import {Image, Row, Col, Well, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


class NavBar extends React.Component{
render(){
    return(
            <Row bsClass='navbar'>
                <Col xs={3} md={2}>
                    <img src="/images/peachy_logo.png" className='logo' />
                </Col>
                <Col xs={2} md={1}>
                    <div className='barElement'> 
                        <a><h4> Home </h4></a>
                    </div>
                </Col>
                <Col xs={2} md={1}>
                    <div className='barElement'> 
                        <a><h4> Clients </h4></a>
                    </div>
                </Col>
                <Col xs={2} md={1}>
                    <div className='barElement'> 
                        <a><h4> Reports </h4></a>
                    </div>
                </Col>
                <Col xs={6} md={4}>
                </Col>
                <Col xs={4} md={2}>
                    
                    <img src="/images/profile_pic.jpg" className='profile_pic' />
                    <div className='profile_content'>
                        <h6 className='profile_name'> Diego Zuluaga </h6>
                        <a> <h6 className='log_out'> Log out </h6> </a>
                    </div>
                </Col>

            </Row>
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(NavBar);

