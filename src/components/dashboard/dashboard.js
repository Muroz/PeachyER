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
import ReactGA from 'react-ga';

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
    this.props.fetchConfirmedShifts();
    this.props.fetchStaff();
    this.props.fetchClients();
  }
  componentDidMount() {
    setInterval( () => {
      this.props.fetchAllShiftsFiltered(this.state.currentDate);
      this.props.fetchConfirmedShifts();
    },20000);
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

      var period = moment().week()
      var periodDaysLeft = 0
      if(period % 2 == 0)
      {
        periodDaysLeft = 7 + 6 - moment().day() 
      }
      else
      {
        periodDaysLeft = 6 - moment().day();
      }
    return (
      <div className="dashboardRoot">
        <NavBar />
        <div className="topBar"> 
          <img src="/images/rsz_peachy_logo.png" className="logo" />
          <h1 className="headers topBarHeader"> Hello, Tracy </h1> 
        </div>
        <div className="dashboardHeaderContainer"> 
          <h1 className='dashboardHeader headers'> {periodDaysLeft} days left </h1> 
          <h1 className="dashboardDate subheader">  {moment().format('dddd, MMM D')} </h1>
          <h1 className="dashboardSubheader subheader"> in pay period </h1>
        </div>
        <div className="dashboardCotainer">
          <div className="tableContainer contentContainer">
            <h1 className="tableContainerTitle headers"> Live visit feed </h1>
            <RealtimeTable/>
          </div>
          <div className="tableContainer contentContainer">
            <h1 className="tableContainerTitle headers"> Completed visits </h1>
            <div className="allShiftsCalendar">
              <DatePicker
                  id="datePickerDashboard"
                  onChange={this.handleChangeDate}
                  defaultDate={this.state.currentDate}
                  firstDayOfWeek={0}
                  formatDate={(date) => moment(date).format('MMM D, YYYY')}
              />
            </div>
            <AllShiftsTable handleOpen={this.handleOpen.bind(this)} isSelected={this.isSelected.bind(this)} selectedDate = {this.state.currentDate}/>  
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
