"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import NavBar from "./../navbar";
import {fetchAllShifts,fetchConfirmedShifts,fetchUnconfirmedShifts, updateVisit, selectRow, fetchOvertimeShifts, fetchLateShifts, fetchStaff, fetchClients} from '../../actions/fetchingActions';
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
import LateTable from "./lateTable";
import OvertimeTable from "./overtimeTable";

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

    open: false

  };

  handleOpen = (selectedRows) => {

    if(selectedRows.length == 0){
      console.log('this is still a thing');
      selectedRows = this.state.selected;    
    }

    var selectedShift = this.props[this.state.tabValue][selectedRows[0]]
    var stringClockIn = selectedShift.clockInTime ? moment(selectedShift.clockInTime) : null
    var stringClockOut =  selectedShift.clockOutTime ? moment(selectedShift.clockOutTime) : null
    var stringStart = moment(selectedShift.startTime)
    var stringEnd =  moment(selectedShift.endTime)
    var difference = Math.round(moment(stringEnd).diff(moment(stringStart),'hours',true))
    this.setState({
      selectedVisit:this.props[this.state.tabValue][selectedRows[0]], 
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
      scheduledDuration:'',
      clockOutTime : null,
      startTime: null,
      endTime: null,
      status: ''});
  };

  handleSave = () => {
    //check all values
    console.log('saving');
    var visit = this.state.selectedVisit;
    visit.clockInTime = this.state.clockInTime ? moment(this.state.clockInTime) : null
    visit.clockOutTime = this.state.clockOutTime ? moment(this.state.clockOutTime) : null
    // visit.caregiverName = this.refs.caregiverName.getValue()
    // visit.clientName = this.refs.clientName.getValue()
    // visit.scheduledDuration = this.refs.scheduledDuration.getValue()
    visit.caregiverName = this.state.caregiverName;
    visit.clientName = this.state.clientName;
    visit.scheduledDuration = this.state.scheduledDuration;

    visit.startTime = moment(this.state.startTime)
    visit.endTime =  moment(this.state.endTime)
    visit.status = this.refs.status.props.value

 
    this.setState({open: false,
      // selected:[0], 
      selectedVisit:null,
      caregiverName:null,
      clientName:null,
      clockInTime: null,
      scheduledDuration:'',
      duration:'',
      clockOutTime : null,
      startTime: null,
      endTime: null,
      status: '',
      save:false});
    this.props.updateVisit(visit,this.state.tabValue);
  }

  componentWillMount(){
    this.props.fetchAllShifts();
    this.props.fetchConfirmedShifts();
    this.props.fetchUnconfirmedShifts();
    this.props.fetchOvertimeShifts();
    this.props.fetchLateShifts();
    this.props.fetchStaff();
    this.props.fetchClients();
  }

 
  //create a callback function for everyone setters to check the dialog box
  //apply css changes
  //apply updates onto react
  // create lists

  componentDidMount() {
    setInterval( () => {
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

  isSelected = (index) => {

    if (this.state.open){
      return false
    }
    else {
      //return index == this.props.selectedRow
      return this.state.selected.indexOf(index) !== -1;
    }
  };


  handleChangeTimeChange = (type,event, date) => {

    if(type == 'clockInTime'){
      // if(this.state.clockInTime == null && this.state.clockOutTime == null){
      //   this.setState({'clockInTime':date, 'save':false})
      // } else 
      if (this.state.clockOutTime != null) {
        // console.log(moment(date).diff(moment(this.state.clockOutTime),'minutes'));
        if(moment(date).diff(moment(this.state.clockOutTime),'minutes')<0){
          this.setState({'clockInTime':date, 'save':true, messageClock:''})
        } else {
          var message = 'Clock in time cannot be later than the set clock out time';
          this.setState({'save':false, messageClock:message})
        }
      } else {
        this.setState({'clockInTime':date,'save':true, messageClock:''});
      }
    } 
    
    else if(type == 'clockOutTime'){
      // if(this.state.clockInTime == null && this.state.clockOutTime == null){
      //   this.setState({'clockOutTime':date, 'save':false})
      // } else 
      if (this.state.clockInTime != null) {
        if(moment(date).diff(moment(this.state.clockInTime),'minutes')>0){
          this.setState({'clockOutTime':date, 'save':true, messageClock:''})
        } else {
          var message = 'Clock out time cannot be earlier than the set clock in time';
          this.setState({'save':false, messageClock:message})
        }
      } else {
        this.setState({'clockOutTime':date,'save':true, messageClock:''});
      }
    } 
    
    else if(type == 'startTime'){
      // if(this.state.startTime == null && this.state.endTime == null){
      //   this.setState({'startTime':date, 'save':false})
      // } else 
      if (this.state.endTime != null) {
        var difference = Math.round(moment(this.state.endTime).diff(moment(date),'hours',true));
        if(moment(date).diff(moment(this.state.endTime),'minutes')<0){
          this.setState({'startTime':date, 'save':true, scheduledDuration:difference, messageTime:''})
        } else {
          var message = 'Start time cannot be later than the set end time';
          this.setState({'save':false, scheduledDuration:0, messageTime:message})
        }
      } else {
        this.setState({'startTime':date,'save':true, scheduledDuration:0, messageTime:''});
      }
    } 
    
    else if(type == 'endTime'){
      // if(this.state.startTime == null && this.state.endTime == null){
      //   this.setState({'endTime':date, 'save':false})
      // } else 
      if (this.state.startTime != null) {
        var difference = Math.round(moment(date).diff(moment(this.state.startTime),'hours',true));
        if(moment(date).diff(moment(this.state.startTime),'minutes')>0){
          this.setState({'endTime':date, 'save':true, scheduledDuration:difference, messageTime:''})
        } else {
          var message = 'End time cannot be earlier than the set start time';
          this.setState({'save':false, scheduledDuration:0,messageTime:message})
        }
      } else {
        this.setState({'endTime':date,'save':true, scheduledDuration:0, messageTime:''});
      }
    } 
  };

  handleChangeStatus = (event, index, value) => {
    if(value=='In process' || value =='Overtime'){
      this.setState({status:value, clockOutTime:null, save:true});
      console.log('1 this is ', value);
    } else if(value=='Scheduled' || value=='Late'){
      this.setState({status:value, clockInTime:null,clockOutTime:null, save:true});
      console.log('2 this is ', value);
    } else {
      this.setState({status:value});
    }

  }

  handleChangeTab = (value) => {
    this.setState({
      tabValue: value,
    });
  };

  handleTextChange = (event) => {
    if (event.target.value == ""){
      var errorId = 'errorText' + event.target.id
      var errorState = {}
      errorState[errorId] = 'This field cannot be empty';
      errorState['save'] = false
      this.setState(errorState);
    } else {
      var validId = 'errorText' + event.target.id
      var validState = {}
      validState[validId] = '';
      validState['save'] = true;
      validState[event.target.id] = event.target.value;
      this.setState(validState);
    }
  };


  handleChangeCaregiver = (event, index, value) => {
    this.setState({caregiverName:value, save:true});
  }

  setStaff(staff,index){

    return(<MenuItem key={index} value={staff.name} primaryText={staff.name} />)
  }

  handleChangeClient = (event, index, value) => {
    this.setState({clientName:value, save:true});
  }

  setClients(client,index){

    return(<MenuItem key={index} value={client.name} primaryText={client.name} />)
  }

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
 
    var dialog;

    if(this.state.tabValue == 'unconfirmed' || this.state.tabValue == 'allShifts'){
      var editVisit = this.props[this.state.tabValue][this.state.selected[0]]

    var stringClockIn = editVisit? editVisit.clockInTime? moment(editVisit.clockInTime).format('H:mm a'):"Not Available" :"Not available"
    var stringClockOut =  editVisit? editVisit.clockOutTime? moment(editVisit.clockOutTime).format('H:mm a'):"Not Available" :"Not available"
    var stringStart =  editVisit? moment(editVisit.startTime).format('H:mm a'):"Not available"
    var stringEnd =  editVisit? moment(editVisit.endTime).format('H:mm a'):"Not available"
      dialog = 
      <Dialog
        title="Update information"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        bodyClassName="dialogWindow"
      >
        
        {/* <div className="row1a">Care staff name: </div>   
        <TextField
          className="row1b"
          ref='caregiverName'
          id="caregiverName"
          errorText= {this.state.errorTextcaregiverName}
          defaultValue={this.state.caregiverName}
          onChange={this.handleTextChange}
        /> */}
        <div className="row8a">HSW name:     </div> 
        <DropDownMenu 
          ref="caregiverName" value={this.state.caregiverName} 
          onChange={this.handleChangeCaregiver}  
          className="dropdown"
          style={{width:'100px'}}
          autoWidth={true}>
          {this.props.staff.map(this.setStaff,this)}
        </DropDownMenu>

        <div className="row8a">Client name:     </div> 
        <DropDownMenu 
          ref="clientName" value={this.state.clientName} 
          onChange={this.handleChangeClient}  
          className="dropdown"
          style={{width:'100px'}}
          autoWidth={true}>
          {this.props.clients.map(this.setClients,this)}
        </DropDownMenu>

        {/* <div className="row2a">Client ID: </div>   
        <TextField
          ref='clientName'
          id="clientName"
          errorText= {this.state.errorTextclientName}
          className="row2b"
          defaultValue={this.state.clientName}
          onChange={this.handleTextChange}
        /> */}
        <div className="row3a">Time clocked in: </div>  
        <div className="row3b">
        <TimePicker
          ref="clockInTime"
          hintText={stringClockIn}
          value={this.state.clockInTime}
          onChange={this.handleChangeTimeChange.bind(this,'clockInTime')}
        />
        </div>

        <div className="row4a">Time clocked out: </div>  
        <div className="row4b">
        <TimePicker
          ref="clockOutTime"
          hintText={stringClockOut}
          value={this.state.clockOutTime}
          onChange={this.handleChangeTimeChange.bind(this,'clockOutTime')}
        />
        </div>

        <div className="row5a">Shift duration: </div>  
        <TextField
          ref="scheduledDuration"
          className="row5b"
          id="scheduledDuration"
          disabled={true}
          value={this.state.scheduledDuration}
          onChange={this.handleTextChange}
        />

        <div className="row6a">Scheduled start:     </div>  
        <TimePicker
          ref="startTime"
          className="row6b"
          hintText={stringStart}
          value={this.state.startTime}
          onChange={this.handleChangeTimeChange.bind(this,'startTime')}
        />

        <div className="row7a">Schedulded end:     </div>  
        <TimePicker
          ref="endTime"
          className="row7b"
          hintText={stringEnd}
          value={this.state.endTime}
          onChange={this.handleChangeTimeChange.bind(this,'endTime')}
        />
        <div className="row8a">Status:     </div> 
        {this.state.tabValue == 'allShifts' ?
        <DropDownMenu 
          ref="status" value={this.state.status} 
          onChange={this.handleChangeStatus}  
          className="row8b"
          className="dropdown"
          autoWidth={true}>

            <MenuItem value={'Unconfirmed'} primaryText="Unconfirmed" />
            <MenuItem value={'Completed'} primaryText="Completed" />
            <MenuItem value={'Cancelled'} primaryText="Cancelled" />
            <MenuItem value={'Late'} primaryText="Late" />
            <MenuItem value={'Overtime'} primaryText="Overtime" />
            <MenuItem value={'Notified Caregiver'} primaryText="Notified Caregiver" />
            <MenuItem value={'Notified Manager'} primaryText="Notified Manager" />
            <MenuItem value={'In process'} primaryText="In process" />
            <MenuItem value={'Scheduled'} primaryText="Scheduled" />
              
        </DropDownMenu>
        :
        <DropDownMenu 
          ref="status" value={this.state.status} 
          onChange={this.handleChangeStatus}  
          className="row8b"
          className="dropdown"
          autoWidth={true}>

            <MenuItem value={'Unconfirmed'} primaryText="Unconfirmed" />
            <MenuItem value={'Completed'} primaryText="Completed" />
            <MenuItem value={'Cancelled'} primaryText="Cancelled" />
              
        </DropDownMenu>
        }


        <div className='alertMessage'>
          {this.state.messageClock}
          <br />
          {this.state.messageTime}
        </div>

      </Dialog>
    } else {
      dialog = null;
    }

    return (
      <div>
        <NavBar />

      {dialog}
      <Tabs
        value={this.state.tabValue}
        onChange={this.handleChangeTab}
      >

        <Tab 
          label="Currently working" 
          value="confirmed"
          className='tabContainer'
        > 
          <div className='tabDescription'>
          This tab shares live updates on staff that are currently working, late for their shift and working overtime.  
          </div>
          <div className='tabSub'>
            Welcome to your first week with Peachy, Tracy! We are excited to start adding value to your business and learn how we can add even more. 
          </div>
          <div className='summaryTable'>
          <div className='summaryItem'>
            <div style={{margin:'auto'}}><p className='summaryItemTitle'>{this.props.confirmed? this.props.confirmed.length:'0'}</p></div>
            <div style={{margin:'auto'}}><p className='summaryItemSub'>Working</p></div>
          </div>
          <div className='summaryItem'>
            <div style={{margin:'auto'}}><p className='summaryItemTitle'>{this.props.late ? this.props.late.length:'0'}</p></div>
            <div style={{margin:'auto'}}><p className='summaryItemSub'>Late</p></div>
          </div>
          <div className='summaryItem'>
            <div style={{margin:'auto'}}><p className='summaryItemTitle'>{this.props.allShifts ? this.props.overtime.length:'0'}</p></div>
            <div style={{margin:'auto'}}><p className='summaryItemSub'>Overtime</p></div>
          </div>
          </div>  
          <RealtimeTable/>
          <LateTable />
          <OvertimeTable/>

        </Tab>
        <Tab 
          label={"Shifts scheduled today ("+this.props.allShifts.length+")"}
          value="allShifts"
          className='tabContainer'
        >
          <AllShiftsTable handleOpen={this.handleOpen.bind(this)} isSelected={this.isSelected.bind(this)}/>
        </Tab>
        <Tab 
          label={"Unconfirmed shifts ("+this.props.unconfirmed.length+")"}
          value="unconfirmed"
          className='tabContainer'
        >
          <UnconfirmedTable handleOpen={this.handleOpen.bind(this)} isSelected={this.isSelected.bind(this)}/>
        </Tab>
      </Tabs>
        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allShifts: state.clientReducers.allShifts,
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
    fetchStaff: fetchStaff}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);


//implemete notify caregiver overtime
//implement guide
//connect late to employees
//make sure i'm pushing to the status log everywhere
