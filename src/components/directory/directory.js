"use strict";
import React from "react";
import Navbar from "../navbar";
import DirectoryItem from './directoryItem'

const dummyData = [{
  billedHours:10,id:'11202',name:'Kayla Burry', phoneNumber:'+17097692872'
},
{
  billedHours:22,id:'11203',name:'Marc Tony', phoneNumber:'+17097656872'
},
{
  billedHours:13,id:'11212',name:'John Smith', phoneNumber:'+17097122872'
},
{
  billedHours:5,id:'11222',name:'Paula Murphy', phoneNumber:'+17097695572'
},
{
  billedHours:4,id:'11223',name:'Stan Daley', phoneNumber:'+12031692872'
},
{
  billedHours:15,id:'11232',name:'Elias Parsons', phoneNumber:'+17097021872'
},
{
  billedHours:32,id:'11233',name:'Tracy Smith', phoneNumber:'+17097692113'
},
{
  billedHours:12,id:'11234',name:'Tony Walsh', phoneNumber:'+17097763872'
},
{
  billedHours:7,id:'11235',name:'Mary Stanley', phoneNumber:'+17097098572'
}]
class Directory extends React.Component {

  setItems(item,index){
    return(
        <DirectoryItem item={item} type={this.props.directoryType} key={index}/>
    )
  }
  render() {
    var content = this.props.content.map(this.setItems,this)
    //var content = dummyData.map(this.setItems,this)
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