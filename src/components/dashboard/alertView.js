"use strict"
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


class AlertView extends React.Component{
render(){
    return(
        <div>
            Alert view goes here
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(AlertView);

