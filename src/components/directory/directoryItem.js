"use strict";
import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {formatPhone} from '../../helper'
import moment from 'moment-timezone';

class DirectoryItem extends React.Component {

    constructor(props){
        super(props);
        this.state = {logOpen:false, visitLog:[]}
        this.setItem = this.setItem.bind(this);
        this.fetchVisitLog = this.fetchVisitLog.bind(this);
        this.setLogs = this.setLogs.bind(this);
    }

    setLogs(visit, index){
        return(<div key={index} className='visitlogEntry'>
                <div> HSW = {visit.caregiverName} </div>
                <div> Status = {visit.status} </div>
                <div> Duration(Hrs) = {Math.round(visit.duration)} </div>
                <div> Date = {moment(visit.date).format('DD MMM')} </div>
                <div> Clock in time = {moment(visit.clockInTime).format('hh:mma')} </div>
                <div> Clock out time = {moment(visit.clockOutTime).format('hh:mma')} </div>
            </div>)
    }

    fetchVisitLog(name){
        var dict = {}
        dict['name'] = name
        dict['type'] = this.props.type;
        axios.post("/fetch/fetchVisitLog", dict)
        .then(res => {
            this.setState({visitLog:res.data});
        })
    }
  
    setItem(item){
        var visitLogs = [];
        if (this.state.logOpen){
            visitLogs = this.state.visitLog.map(this.setLogs,this);
        }
        //search for visits for a given 
        var phoneNumber = formatPhone(item.phoneNumber.substring(2));

        //onMouseOver={this.handlePopover.bind(this)} onMouseLeave={this.handleLeave.bind(this)}
        return(
        <div className='directoryItem' onClick={this.handleClick.bind(this, item.name)} >
            <div className='directoryItemTitle'>{item.name}-{item.employeeId || item.id}</div>
            <div className='directoryItemBody'>Telephone: {phoneNumber} </div>
            <div className='directoryItemBody'> Hours worked: {item.payingHours || item.billedHours || '0'} </div>
            {this.state.logOpen ? (
                <div className='directoryItemVisitLog'> 
                    <div> Visit log: </div>
                    <div className='visitlogBody'> {visitLogs}</div>
                </div>
            ):null}
        </div>
        )
    }

    handleClick = (name) =>{
        this.fetchVisitLog(name);
        this.setState({
            logOpen:!this.state.logOpen
        })
    }

    handlePopover = () =>{
        console.log('over');
        // this.setState({
        //     logOpen:true
        // })
    }

    handleLeave = () =>{
        console.log('leave')
        // this.setState({
        //     popover:false
        // })
    }

    render() {
        return (
            <div className='directoryList' >
                {this.setItem(this.props.item)}
            </div>
        );
    }
}

export default DirectoryItem;


  
  