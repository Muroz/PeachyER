"use strict"
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


class StaffView extends React.Component{
render(){
    return(
        <div>
            Staff view goes here
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(StaffView);

