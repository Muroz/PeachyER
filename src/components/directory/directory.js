"use strict";
import React from "react";
import Navbar from "../navbar";
import DirectoryItem from './directoryItem'

class Directory extends React.Component {

  setItems(item,index){
    return(
        <DirectoryItem item={item} type={this.props.directoryType} key={index}/>
    )
  }
  render() {
    var content = this.props.content.map(this.setItems,this)

    return (
        <div className='directoryBody'>
          <div className='directoryList'>
            {content}
          </div>
        </div>
        );
  }
}

export default Directory;