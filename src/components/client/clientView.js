"use strict"
import React from 'react';
import {Image, Row, Col, Well, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NavBar from './../navbar';
import SummaryView from './summaryView';
import StaffList from './clientList';
import {fetchClients} from './../../actions/fetchingActions.js';


class ClientView extends React.Component{


componentDidMount(){
    this.props.fetchClients();
}
render(){
    return(
        <div>
            <div className='navbar'>
                <NavBar />
            </div>
            <SummaryView />
            <StaffList />
           
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({fetchClients:fetchClients},dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientView);

