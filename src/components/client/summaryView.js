"use strict"
import React from 'react';
import {connect} from 'react-redux';


class SummaryView extends React.Component{
render(){
    return(
        <div className='summaryView_container'>
            <div class="container">
                info goes here
            </div>
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(SummaryView);

