"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class Topbar extends React.Component {
  constructor() {
    super();
  }
  render() {

    return (
        <div className="topBar"> 
            <img src="/images/peachy_logo.png" className="logo" />
            <h1 className="midheader topBarHeader"> <strong> Hello, </strong> {this.props.user ? this.props.user.username.split(' ')[0] : 'Unknown'} </h1> 
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.clientReducers.user
  };
}

Topbar.defaultProps = {
  user: {
    username: 'Unknown'
  },
};

export default connect(mapStateToProps)(Topbar);


