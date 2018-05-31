"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import NavBar from "./../navbar";
import {fetchAllShifts,fetchConfirmedShifts,fetchAllShiftsFiltered, updateVisit, selectRow, fetchStaff, fetchClients} from '../../actions/fetchingActions';
import moment from 'moment-timezone';
import DatePicker from 'material-ui/DatePicker';
import RealtimeTable from "./realtimeTable";
import AllShiftsTable from "./allShiftsTable";
import Popup from "./popup";
import {fireEvent} from './../../helper'
import Topbar from "../Topbar";
import axios from 'axios';


class Dashboard extends React.Component {
  state = {

    selected: [0],
    save: false,

    caregiverName:null,
    clientName:null,
    clockInTime: null,
    scheduledDuration:'',
    clockOutTime : null,
    startTime: null,
    endTime: null,
    status: '',

    messageClock:'',
    messageTime:'',

    tabValue: 'confirmed',

    errorTextcaregiverName:'',
    errorTextclientName:'',

    selectedVisit:null,

    open: false,

    currentDate:new Date()

  };


  componentWillMount(){
    //fetch all shifts (pass a date);
    this.props.fetchAllShiftsFiltered(this.state.currentDate);
    this.props.fetchAllShifts();
    this.props.fetchConfirmedShifts();
    this.props.fetchStaff();
    this.props.fetchClients();
  }
  componentDidMount() {
   
    axios.post("/fetch/getUser")
    .then(res => {
      if (res.data.username != 'DiegoZ'){
        fireEvent('Dashboard', res.data.username);
      }
    })

    setInterval( () => {
      this.props.fetchAllShiftsFiltered(this.state.currentDate);
      this.props.fetchConfirmedShifts();
      this.props.fetchAllShifts();
    },60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  handleOpen = (selectedRows) => {
    if(selectedRows.length == 0){
      selectedRows = this.state.selected;    
    }
    var selectedShift = this.props['allShifts'][selectedRows[0]]
    var stringClockIn = selectedShift.clockInTime ? moment(selectedShift.clockInTime) : null
    var stringClockOut =  selectedShift.clockOutTime ? moment(selectedShift.clockOutTime) : null
    var stringStart = moment(selectedShift.startTime)
    var stringEnd =  moment(selectedShift.endTime)
    var difference = Math.round(moment(stringEnd).diff(moment(stringStart),'hours',true))
    this.setState({
      selectedVisit:this.props['allShifts'][selectedRows[0]], 
      selected: selectedRows,
      caregiverName:selectedShift.caregiverName,
      clientName:selectedShift.clientName,
      clockInTime: stringClockIn,
      scheduledDuration:difference,
      clockOutTime : stringClockOut,
      startTime: stringStart,
      endTime: stringEnd,
      status: selectedShift.status,
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false, 
      // selected:[0], 
      selectedVisit:null,
      caregiverName:null,
      clientName:null,
      clockInTime: null,
      duration:null,
      clockOutTime : null,
      startTime: null,
      endTime: null,
      status: null});
  };

  handleChangeDate = (event, date) => {
    this.setState({
      currentDate: date,
    });
    this.props.fetchAllShiftsFiltered(date);
  };

  isSelected = (index) => {
    if (this.state.open){
      return false
    }
    else {
      //return index == this.props.selectedRow
      return this.state.selected.indexOf(index) !== -1;
    }
  };

  handleChangeTab = (value) => {
    this.setState({
      tabValue: value,
    });
  };

  render() {

    var editVisit = this.props['allShifts'][this.state.selected[0]]
    var dialog = <Popup visit={editVisit || {}} tabValue={'allShifts'} open={this.state.open} handleClose={this.handleClose.bind(this)}/>
    //handleOpen={this.handleOpen.bind(this)} isSelected={this.isSelected.bind(this)} 
    return (
      <div className="dashboardRoot">
        <NavBar />
        <Topbar />
        <div className="dashboardHeaderContainer"> 
          <h1 className='headers'> <strong> Overview </strong></h1> 
        </div>
        <div className="dashboardCotainer">
          <div className="tableContainer contentContainer">
            <h1 className="tableContainerTitle midheader"> Live visit feed </h1>
            <RealtimeTable/>
          </div>
          <div className="tableContainer contentContainer">
            <h1 className="tableContainerTitle midheader"> Completed visits </h1>
            <div className="allShiftsCalendar">
              <DatePicker
                  id="datePickerDashboard"
                  onChange={this.handleChangeDate}
                  defaultDate={this.state.currentDate}
                  firstDayOfWeek={0}
                  formatDate={(date) => moment(date).format('MMM D, YYYY')}
              />
            </div>
            
            <AllShiftsTable selectedDate = {this.state.currentDate}/>  
          </div>
        </div>
        {dialog}
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allShifts: state.clientReducers.allShifts,
    allShiftsFiltered: state.clientReducers.allShiftsFiltered,
    unconfirmed: state.clientReducers.unconfirmed,
    confirmed: state.clientReducers.confirmed,
    allShifts: state.clientReducers.allShifts,
    late: state.clientReducers.late,
    overtime: state.clientReducers.overtime,
    selectedRow: state.clientReducers.selectedRow,
    staff: state.clientReducers.staff,
    clients: state.clientReducers.clients
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    fetchAllShifts: fetchAllShifts, 
    fetchConfirmedShifts:fetchConfirmedShifts, 
    updateVisit:updateVisit, 
    selectRow:selectRow,
    fetchClients: fetchClients,
    fetchStaff: fetchStaff,
    fetchAllShiftsFiltered:fetchAllShiftsFiltered}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
