"use strict";
import React from "react";
import Navbar from "../navbar";
import Directory from '../directory/directory'

class MainClient extends React.Component {

  render() {
    return (
      <div>
          <Navbar />
          <Directory directoryType="Clients" />
      </div>);
  }
}

export default MainClient;