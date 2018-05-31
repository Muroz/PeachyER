"use strict";
import React from "react";

class Topbar extends React.Component {
  constructor() {
    super();
  }
  render() {

    return (
        <div className="topBar"> 
            <img src="/images/rsz_peachy_logo.png" className="logo" />
            <h1 className="midheader topBarHeader"> <strong> Hello, </strong> Chris </h1> 
        </div>
    );
  }
}


export default Topbar;
