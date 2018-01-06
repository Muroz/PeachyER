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
            <h1> Dashboard specs to come soon </h1>
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(Dashboard);

