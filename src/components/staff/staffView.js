"use strict"
import React from 'react';
import {Image, Row, Col, Well, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NavBar from './../navbar';
import SummaryView from './summaryView';
import StaffList from './staffList';
import {fetchStaff} from './../../actions/fetchingActions.js';


class StaffView extends React.Component{


componentDidMount(){
    this.props.fetchStaff();
}
render(){
    return(
        <div>
            <div className='navbar'>
                <NavBar />
            </div>
            <StaffList />
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
        staff:state.clientReducers.staff
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({fetchStaff:fetchStaff},dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StaffView);

