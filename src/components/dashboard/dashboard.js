"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import NavBar from "./../navbar";
import {fetchAllShifts,fetchConfirmedShifts,fetchUnconfirmedShifts,fetchAllShiftsFiltered, updateVisit, selectRow, fetchOvertimeShifts, fetchLateShifts, fetchStaff, fetchClients} from '../../actions/fetchingActions';
import {Tabs, Tab} from 'material-ui/Tabs';
import Badge from 'material-ui/Badge';
import moment from 'moment-timezone';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import UnconfirmedTable from "./unconfirmedTable";
import RealtimeTable from "./realtimeTable";
import AllShiftsTable from "./allShiftsTable";
import Popup from "./popup";

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
    this.props.fetchUnconfirmedShifts();
    this.props.fetchOvertimeShifts();
    this.props.fetchLateShifts();
    this.props.fetchStaff();
    this.props.fetchClients();
  }
  componentDidMount() {
    setInterval( () => {
      this.props.fetchAllShiftsFiltered(this.state.currentDate);
      this.props.fetchAllShifts();
      this.props.fetchConfirmedShifts();
      this.props.fetchUnconfirmedShifts();
      this.props.fetchOvertimeShifts();
      this.props.fetchLateShifts();
    },20000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  handleOpen = (selectedRows) => {
    if(selectedRows.length == 0){
      console.log('this is still a thing');
      selectedRows = this.state.selected;    
    }
    console.log('the rows');
    console.log(selectedRows);
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

    const actions = [
      <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        disabled={!this.state.save}
        onClick={this.handleSave}
      />,<FlatButton
      label="Cancel"
      primary={false}
      keyboardFocused={false}
      onClick={this.handleClose}
    />
    
    ];
    var editVisit = this.props['allShifts'][this.state.selected[0]]
    var dialog = <Popup visit={editVisit || {}} tabValue={'allShifts'} open={this.state.open} handleClose={this.handleClose.bind(this)}/>

    // if(this.state.tabValue == 'unconfirmed' || this.state.tabValue == 'allShifts'){
    //   var editVisit = this.props[this.state.tabValue][this.state.selected[0]]

  
    // } else {
    //   dialog = null;
    // }

              {/* <div className='summaryTable'>
          <div className='summaryItem'>
            <div style={{margin:'auto'}}><p className='summaryItemTitle'>{this.props.confirmed? this.props.confirmed.length:'0'}</p></div>
            <div style={{margin:'auto'}}><p className='summaryItemSub'>Working</p></div>
          </div>
          </div>   */}

           {/* <Tabs
        value={this.state.tabValue}
        onChange={this.handleChangeTab}
      >

        <Tab 
          label="Currently working" 
          value="confirmed"
          className='tabContainer'
        > 



        </Tab>
        <Tab 
          label={"Shifts scheduled today ("+this.props.allShifts.length+")"}
          value="allShifts"
          className='tabContainer'
        >
          <div className="allShiftsCalendar">
          <DatePicker
            onChange={this.handleChangeDate}
            floatingLabelText="Shifts on"
            defaultDate={this.state.currentDate}
          />
          </div>
          <AllShiftsTable handleOpen={this.handleOpen.bind(this)} isSelected={this.isSelected.bind(this)} selectedDate = {this.state.currentDate}/>
        </Tab>
        <Tab 
          label={"Unconfirmed shifts ("+this.props.unconfirmed.length+")"}
          value="unconfirmed"
          className='tabContainer'
        >
          <UnconfirmedTable handleOpen={this.handleOpen.bind(this)} isSelected={this.isSelected.bind(this)}/>
        </Tab>
      </Tabs> */}
    return (
      <div className="dashboardRoot">
        <NavBar />
        <div className="topBar"> <h1 className="headers topBarHeader"> Hello, Tracy </h1> </div>
        <div className="dashboardHeaderContainer"> 
          <h1 className='dashboardHeader headers'> 10 days left </h1> 
          <h1 className="dashboardDate subheader"> Monday, May 7 </h1>
          <h1 className="dashboardSubheader subheader"> in pay period </h1>
        </div>
        <div className="tableContainer contentContainer">
          <h1 className="tableContainerTitle headers"> Live visit feed </h1>
          <RealtimeTable/>
        </div>
        <div className="tableContainer contentContainer">
          <h1 className="tableContainerTitle headers"> Completed visits </h1>
          <div className="allShiftsCalendar">
            <DatePicker
                onChange={this.handleChangeDate}
                defaultDate={this.state.currentDate}
                firstDayOfWeek={0}
                formatDate={(date) => moment(date).format('MMM D, YYYY')}
            />
          </div>
          <AllShiftsTable handleOpen={this.handleOpen.bind(this)} isSelected={this.isSelected.bind(this)} selectedDate = {this.state.currentDate}/>  
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
    fetchUnconfirmedShifts:fetchUnconfirmedShifts, 
    fetchAllShifts:fetchAllShifts, 
    fetchConfirmedShifts:fetchConfirmedShifts, 
    updateVisit:updateVisit, 
    selectRow:selectRow,
    fetchOvertimeShifts: fetchOvertimeShifts,
    fetchLateShifts: fetchLateShifts,
    fetchClients: fetchClients,
    fetchStaff: fetchStaff,
    fetchAllShiftsFiltered:fetchAllShiftsFiltered}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
