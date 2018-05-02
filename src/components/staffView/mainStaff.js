"use strict";
import React from "react";
import Navbar from "../navbar";
import Directory from '../directory/directory'

class MainStaff extends React.Component {

  render() {
    return (
      <div>
          <Navbar />
          <Directory directoryType="Staff" />
      </div>);
  }
}

export default MainStaff;