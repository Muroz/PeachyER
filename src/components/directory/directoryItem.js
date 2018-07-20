"use strict";
import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {formatPhone} from '../../helper'
import moment from 'moment-timezone';
import Popup from './../dashboard/popup'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';
import EditScreen from "./editScreen";
import Delete from '@material-ui/icons/Delete';
import DeleteDialog from "./deleteDialog";
import { deleteItem } from "../../actions/fetchingActions";


class DirectoryItem extends React.Component {

    constructor(props){
        super(props);
        this.state = {logOpen:false, visitLog:[],openDialog:false,selectedVisit:null, showPopup: false, deletePopup: false}
        this.setItem = this.setItem.bind(this);
        this.fetchVisitLog = this.fetchVisitLog.bind(this);
        this.setLogs = this.setLogs.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
        axios.post("/fetch/getUser")
        .then(res => {
            if (res.data.username != 'DiegoZ'){
                fireEvent('AddItemClick', res.data.username);
            }
        })
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

    handleDeleteClick = () => {
        this.setState({
            deletePopup: true
        })
    }

    handleCancel = () => {
        this.setState({
            deletePopup: false
        })
    }

      
    setLogs(visit, index){
        //onClick={this.openVisitDialog.bind(this,visit)}
        return(<div key={index} className='visitlogEntry' >
                <div> Staff = {visit.caregiverName} </div>
                <div> Status = {visit.status} </div>
                <div> Duration (hrs) = {Math.round(visit.duration)} </div>
                <div> Date = {moment(visit.date).format('MMM D')} </div>
                <div> Clock in time = {moment(visit.clockInTime).format('h:mma')} </div>
                <div> Clock out time = {moment(visit.clockOutTime).format('h:mma')} </div>
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
        var phoneNumber;
        //onMouseOver={this.handlePopover.bind(this)} onMouseLeave={this.handleLeave.bind(this)}
        var numberType = ''
        if(this.props.type == 'Clients'){
            numberType = 'Billed Hours'
            phoneNumber = formatPhone(item.phones[0].substring(2));
        } else {
            numberType = 'Hours Worked';
            phoneNumber = formatPhone(item.phoneNumber.substring(2));
        }
        var hourNumber = item.payingHours || item.billedHours || 0
        return(
        <div className='directoryItemHead'>
        <div className='directoryItem'  >
            <div className='directoryItemContainer' onClick={this.handleClick.bind(this, item.name)}>
                <div className='directoryItemBody subheader'>{item.name} {- item.employeeId || ''}</div>
                <div className='directoryItemBody subheader'>Telephone: {phoneNumber} </div>
                <div className='directoryItemBody subheader'>  {numberType}: {hourNumber.toFixed(2)} </div>
            </div>
            <div>
                <IconButton onClick={this.togglePopup}>
                            <Settings />
                </IconButton>
                <IconButton className="deleteIcon" onClick={this.handleDeleteClick}>
                    <Delete />
                </IconButton>
            </div>
            {this.state.showPopup ? (
                    <EditScreen togglePopup={this.togglePopup} showPopup={this.state.showPopup} item={item} type={this.props.type}/>
            ) : null}
        </div>
        {this.state.logOpen ? (
                <div className='directoryItemVisitLog'> 
                    <div className='visitlogTitle midheader'> Visit log: </div>
                    <div className='visitlogBody subheader'> {visitLogs}</div>
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
            <div >
                {dialog}
                {this.setItem(this.props.item)}
                <DeleteDialog open={this.state.deletePopup} id={this.props.item._id} type={this.props.type} cancel={this.handleCancel.bind(this)}/>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {  deleteItem:deleteItem },
      dispatch
    );
  }
  function mapStateToProps(state) {
    return {
      staff:state.clientReducers.staff,
      clients:state.clientReducers.clients
    };
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(DirectoryItem);



  
  