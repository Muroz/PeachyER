"use strict";
import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {formatPhone} from '../../helper'
import moment from 'moment-timezone';
import Popup from './../dashboard/popup'
import {GridList, GridTile} from 'material-ui/GridList';

class DirectoryItem extends React.Component {

    constructor(props){
        super(props);
        this.state = {logOpen:false, visitLog:[],openDialog:false,selectedVisit:null}
        this.setItem = this.setItem.bind(this);
        this.fetchVisitLog = this.fetchVisitLog.bind(this);
        this.setLogs = this.setLogs.bind(this);
    }

    openVisitDialog = (visit) => {

        this.setState({
            openDialog:true,
            selectedVisit:visit
        });
    }

    handleClose = () => {
        this.setState({
            open: false, 
            selectedVisit: null
        })
    };

      
    setLogs(visit, index){
        return(<div key={index} className='visitlogEntry' onClick={this.openVisitDialog.bind(this,visit)}>
                <div> HSW = {visit.caregiverName} </div>
                <div> Status = {visit.status} </div>
                <div> Duration (hrs) = {Math.round(visit.duration)} </div>
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
        var phoneNumber = formatPhone(item.phoneNumber.substring(2));
        //onMouseOver={this.handlePopover.bind(this)} onMouseLeave={this.handleLeave.bind(this)}
        var numberType = ''
        if(this.props.type == 'Clients'){
            numberType = 'Billed Hours'
        } else {
            numberType = 'Hours Worked'
        }

        var hourNumber = item.payingHours || item.billedHours || 0

        return(
        <div className='directoryItemHead'>
        <div className='directoryItem' onClick={this.handleClick.bind(this, item.name)} >
            <div className='directoryItemTitle'>{item.name} - {item.employeeId || item.id}</div>
            <div className='directoryItemBody'>Telephone: {phoneNumber} </div>
            <div className='directoryItemBody'>  {numberType}: {hourNumber.toFixed(2)} </div>
        </div>
        {this.state.logOpen ? (
                <div className='directoryItemVisitLog'> 
                    <div className='visitlogTitle'> Visit log: </div>
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

    render() {
        var dialog = null;
        if (this.state.openDialog && this.state.selectedVisit != null){
            var tabValue = 'unconfirmed'
            if (this.state.selectedVisit.status != 'Unconfirmed'){
                tabValue = "allShifts"
            }
            dialog = <Popup visit={this.state.selectedVisit || {}} tabValue={tabValue} open={this.state.openDialog} handleClose={this.handleClose.bind(this)}/>
        }
        return (
            <div className='directoryList' >
                {dialog}
                {this.setItem(this.props.item)}
            </div>
        );
    }
}

export default DirectoryItem;


  
  