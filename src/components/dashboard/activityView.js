"use strict"
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { setImmediate, setInterval } from 'timers';
import { fetchActivity } from '../../actions/fetchingActions';


class ActivityView extends React.Component{
    constructor() {
        super();
        this.state = {
          timer: null
        };
        this.tick = this.tick.bind(this);

      }

      componentDidMount() {
        let timer = setInterval(this.tick, 5000);
        this.setState({timer});
      }
      componentWillUnmount(){
        this.clearInterval(this.state.timer);
      }
      tick(){
        console.log('ticking');
        this.props.fetchActivity();
      }
render(){
    return(
        <div style={{ textAlign: "center" }}>
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
      activity:state.clientReducers.activity
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({fetchActivity:fetchActivity},dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ActivityView);

