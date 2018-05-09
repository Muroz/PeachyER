// "use strict";
// import React from "react";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import NavBar from "./../navbar";
// import {fetchAllShifts,fetchConfirmedShifts,fetchUnconfirmedShifts, updateVisit, selectRow, fetchOvertimeShifts, fetchLateShifts, fetchStaff, fetchClients} from '../../actions/fetchingActions';
// import {Tabs, Tab} from 'material-ui/Tabs';
// import Badge from 'material-ui/Badge';
// import moment from 'moment-timezone';
// import TextField from 'material-ui/TextField';
// import Toggle from 'material-ui/Toggle';
// import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';
// import RaisedButton from 'material-ui/RaisedButton';
// import DatePicker from 'material-ui/DatePicker';
// import TimePicker from 'material-ui/TimePicker';
// import DropDownMenu from 'material-ui/DropDownMenu';
// import MenuItem from 'material-ui/MenuItem';
// import UnconfirmedTable from "./unconfirmedTable";
// import RealtimeTable from "./realtimeTable";
// import AllShiftsTable from "./allShiftsTable";
// import LateTable from "./lateTable";
// import OvertimeTable from "./overtimeTable";
// import Popup from "./popup";

// class Dashboard extends React.Component {
//   state = {

//     selected: [0],
//     save: false,

//     messageClock:'',
//     messageTime:'',

//     tabValue: 'confirmed',

//     errorTextcaregiverName:'',
//     errorTextclientName:'',

//     selectedVisit:null,

//     open: false,

//     openDialog: false,
//     selectedVisit:null

//   };


//   componentWillMount(){
//     this.props.fetchAllShifts();
//     this.props.fetchConfirmedShifts();
//     this.props.fetchUnconfirmedShifts();
//     this.props.fetchOvertimeShifts();
//     this.props.fetchLateShifts();
//     this.props.fetchStaff();
//     this.props.fetchClients();
//   }

//   componentDidMount() {
//     setInterval( () => {
//       this.props.fetchAllShifts();
//       this.props.fetchConfirmedShifts();
//       this.props.fetchUnconfirmedShifts();
//       this.props.fetchOvertimeShifts();
//       this.props.fetchLateShifts();
//     },20000);
//   }

//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }
//   //******************************************/
//   //this should only change the state and then the popup should be added onto the render function, check over all functions, and finally combine the unconfirmed and the scheduled table into a single component. Do all of this
//   // handleOpen = (visit, close, tabValue) => {
//   //   this.setState({
//   //     openDialog:true,
//   //     selectedVisit:visit,
//   //     close:close
//   //   })

//   // }
//   handleOpen = (selectedRows) => {

//     if(selectedRows.length == 0){
//       console.log('this is still a thing');
//       selectedRows = this.state.selected;    
//     }
//     var selectedShift = this.props[this.state.tabValue][selectedRows[0]]
//     this.setState({
//       selectedVisit:this.props[this.state.tabValue][selectedRows[0]], 
//       selected: selectedRows,
//       open: true
//     });
//   };

//   handleClose = () => {

//     this.setState({
//       open: false, 
//       // selected:[0], 
//       selectedVisit:null
//     });
//   };



//   isSelected = (index) => {

//     if (this.state.open){
//       return false
//     }
//     else {
//       //return index == this.props.selectedRow
//       return this.state.selected.indexOf(index) !== -1;
//     }
//   };
//   handleChangeTab = (value) => {
//     this.setState({
//       tabValue: value,
//     });
//   };


//   render() {


 
//     var dialog = null;

//     if(this.state.tabValue == 'unconfirmed' || this.state.tabValue == 'allShifts'){
//       var editVisit = this.props[this.state.tabValue][this.state.selected[0]]

//      dialog = <Dialog> info </Dialog>
//     } else {
//       dialog = null;
//     }

 
//     return (
//       <div>
//         <NavBar />

//       {dialog}
//       <Tabs
//         value={this.state.tabValue}
//         onChange={this.handleChangeTab}
//       >

//         <Tab 
//           label="Currently working" 
//           value="confirmed"
//           className='tabContainer'
//         > 
//           <div className='tabDescription'>
//           This tab shares live updates on staff that are currently working, late for their shift and working overtime.  
//           </div>
//           <div className='tabSub'>
//             Welcome to your first week with Peachy, Tracy! We are excited to start adding value to your business and learn how we can add even more. 
//           </div>
//           <div className='summaryTable'>
//           <div className='summaryItem'>
//             <div style={{margin:'auto'}}><p className='summaryItemTitle'>{this.props.confirmed? this.props.confirmed.length:'0'}</p></div>
//             <div style={{margin:'auto'}}><p className='summaryItemSub'>Working</p></div>
//           </div>
//           <div className='summaryItem'>
//             <div style={{margin:'auto'}}><p className='summaryItemTitle'>{this.props.late ? this.props.late.length:'0'}</p></div>
//             <div style={{margin:'auto'}}><p className='summaryItemSub'>Late</p></div>
//           </div>
//           <div className='summaryItem'>
//             <div style={{margin:'auto'}}><p className='summaryItemTitle'>{this.props.allShifts ? this.props.overtime.length:'0'}</p></div>
//             <div style={{margin:'auto'}}><p className='summaryItemSub'>Overtime</p></div>
//           </div>
//           </div>  
//           <RealtimeTable/>

//         </Tab>
//         <Tab 
//           label={"Shifts scheduled today ("+this.props.allShifts.length+")"}
//           value="allShifts"
//           className='tabContainer'
//         >
//           <AllShiftsTable handleOpen={this.handleOpen.bind(this)} isSelected={this.isSelected.bind(this)}/>
//         </Tab>
//         <Tab 
//           label={"Unconfirmed shifts ("+this.props.unconfirmed.length+")"}
//           value="unconfirmed"
//           className='tabContainer'
//         >
//           <UnconfirmedTable handleOpen={this.handleOpen.bind(this)} isSelected={this.isSelected.bind(this)}/>
//         </Tab>
//       </Tabs>
        
//       </div>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     allShifts: state.clientReducers.allShifts,
//     unconfirmed: state.clientReducers.unconfirmed,
//     confirmed: state.clientReducers.confirmed,
//     allShifts: state.clientReducers.allShifts,
//     late: state.clientReducers.late,
//     overtime: state.clientReducers.overtime,
//     selectedRow: state.clientReducers.selectedRow,
//     staff: state.clientReducers.staff,
//     clients: state.clientReducers.clients
//   };
// }


// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ 
//     fetchAllShifts: fetchAllShifts, 
//     fetchUnconfirmedShifts:fetchUnconfirmedShifts, 
//     fetchAllShifts:fetchAllShifts, 
//     fetchConfirmedShifts:fetchConfirmedShifts, 
//     updateVisit:updateVisit, 
//     selectRow:selectRow,
//     fetchOvertimeShifts: fetchOvertimeShifts,
//     fetchLateShifts: fetchLateShifts,
//     fetchClients: fetchClients,
//     fetchStaff: fetchStaff}, dispatch);
// }
// export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);


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
      duration:null,
      clockOutTime : null,
      startTime: null,
      endTime: null,
      status: null});
  };

  handleSave = () => {
    //check all values
    var visit = this.state.selectedVisit;
    visit.clockInTime = this.state.clockInTime ? moment(this.state.clockInTime) : visit.clockInTime;
    visit.clockOutTime = this.state.clockOutTime ? moment(this.state.clockOutTime) : visit.clockOutTime;
    visit.caregiverName = this.state.caregiverName ? this.state.caregiverName : visit.caregiverName;
    visit.clientName = this.state.clientName ? this.state.clientName : visit.clientName;
    visit.duration = this.state.duration ? this.state.duration : visit.duration;
    visit.status = this.state.status ? this.state.status : visit.status;

 
    this.setState({ 
        open : false,
        save: false,

        visitId:null,
        caregiverName:null,
        clientName:null,
        clockInTime: null,
        duration:null,
        clockOutTime : null,
        status: null,
        company: null,
        date: null,
        timezone:null
      });
    this.props.updateVisit(visit,this.props.tabValue);
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
 
    var dialog;

    if(this.state.tabValue == 'unconfirmed' || this.state.tabValue == 'allShifts'){
      var editVisit = this.props[this.state.tabValue][this.state.selected[0]]

      dialog = <Popup visit={editVisit} tabValue={this.state.tabValue} open={this.state.open} handleClose={this.handleClose.bind(this)}/>
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
