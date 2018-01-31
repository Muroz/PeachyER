"use strict"
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import socketIOClient from "socket.io-client";
import { endianness } from 'os';
import { setImmediate, setInterval } from 'timers';


class ActivityView extends React.Component{
    constructor() {
        super();
        this.state = {
          timer: null
        };
      }

      componentDidMount() {
        let timer = setInterval(this.tick, 1000);
        this.setState({timer});
      }
      componentWillUnmount(){
        this.clearInterval(this.state.timer);
      }
      tick(){
        console.log('ticking');
      }
render(){
    return(
        <div style={{ textAlign: "center" }}>
          Here comes the info    
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(ActivityView);

