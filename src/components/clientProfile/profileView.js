"use strict"
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NavBar from './../navbar';
import {fetchClients} from './../../actions/fetchingActions.js';
import ScheduleView from './scheduleView';


class ProfileView extends React.Component{

render(){
    return(
        <div>
            <NavBar />
            <ScheduleView />
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);

