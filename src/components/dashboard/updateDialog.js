// "use strict";
// import React from "react";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import moment from 'moment-timezone';
// import {
//     Table,
//     TableBody,
//     TableFooter,
//     TableHeader,
//     TableHeaderColumn,
//     TableRow,
//     TableRowColumn,
//   } from 'material-ui/Table';

// class UpdateDialog extends React.Component {

//     constructor(props){
//         super(props);

//         this.state = {
//             selected: [1],
//         }
//     }


//     render() {

//         const actions = [
//             <FlatButton
//               label="Save"
//               primary={true}
//               keyboardFocused={true}
//               disabled={!this.state.save}
//               onClick={this.handleSave}
//             />,<FlatButton
//             label="Cancel"
//             primary={false}
//             keyboardFocused={false}
//             onClick={this.handleClose}
//           />
          
//           ];
      
//         // var stringClockIn = this.props.unconfirmed[this.state.selected[0]]? moment(this.props.unconfirmed[this.state.selected[0]].clockInTime).format('HH:mm a'):"Not available"
//         // var stringClockOut =  this.props.unconfirmed[this.state.selected[0]]? moment(this.props.unconfirmed[this.state.selected[0]].clockInOutTime).format('HH:mm a'):"Not available"
//         // var stringStart =  this.props.unconfirmed[this.state.selected[0]]? moment(this.props.unconfirmed[this.state.selected[0]].startTime).format('HH:mm a'):"Not available"
//         // var stringEnd =  this.props.unconfirmed[this.state.selected[0]]? moment(this.props.unconfirmed[this.state.selected[0]].endTime).format('HH:mm a'):"Not available"

//         var stringClockIn = this.props.unconfirmed[this.props.selectedRow]? moment(this.props.unconfirmed[this.props.selectedRow].clockInTime).format('HH:mm a'):"Not available"
//         var stringClockOut =  this.props.unconfirmed[this.props.selectedRow]? moment(this.props.unconfirmed[this.props.selectedRow].clockInOutTime).format('HH:mm a'):"Not available"
//         var stringStart =  this.props.unconfirmed[this.props.selectedRow]? moment(this.props.unconfirmed[this.props.selectedRow].startTime).format('HH:mm a'):"Not available"
//         var stringEnd =  this.props.unconfirmed[this.props.selectedRow]? moment(this.props.unconfirmed[this.props.selectedRow].endTime).format('HH:mm a'):"Not available"
//         return(
//             <Dialog
//           title="Update information"
//           actions={actions}
//           modal={false}
//           open={this.props.open}
//           onRequestClose={this.handleClose}
//         >
//           <span>Caregiver : </span>   
//           <TextField
//             errorText='This is required'
//             ref='caregiverName'
//             id="text-field-default"
//             defaultValue={this.props.unconfirmed[this.props.selectedRow]? this.props.unconfirmed[this.props.selectedRow].caregiverName:"Not available"}
//           />
//           <span>Client : </span>   
//           <TextField
//             ref='clientName'
//             id="text-field-default1"
//             defaultValue={this.props.unconfirmed[this.props.selectedRow]? this.props.unconfirmed[this.props.selectedRow].clientName:"Not available"}
//           />
//           <br />
//           <span>Clock in time : </span>  
//           <TimePicker
//             ref="clockInTime"
//             hintText={this.props.unconfirmed[this.props.selectedRow]? this.props.unconfirmed[this.props.selectedRow].clockInTime:"Not available"}
//             value={this.state.clockInTime}
//             onChange={this.handleChangeTimePickerIn}
//           />
//           <span>Clock out time : </span>  
//           <TimePicker
//             ref="clockOutTime"
//             hintText={this.props.unconfirmed[this.props.selectedRow]? this.props.unconfirmed[this.props.selectedRow].clockOutTime:"Not available"}
//             value={this.state.clockOutTime}
//             onChange={this.handleChangeTimePickerOut}
//           />

//           <span>Shift duration : </span>  
//           <TextField
//             ref="scheduledDuration"
//             id="text-field-default2"
//             defaultValue={this.props.unconfirmed[this.props.selectedRow]? this.props.unconfirmed[this.props.selectedRow].scheduledDuration:"Not available"}
//           />
//           <br />

//           <span>Start time :     </span>  
//           <TimePicker
//             ref="startTime"
//             hintText={stringStart}
//             value={this.state.startTime}
//             onChange={this.handleChangeTimePickerStart}
//           />

//           <span>End time :     </span>  
//           <TimePicker
//             ref="endTime"
//             hintText={stringEnd}
//             value={this.state.endTime}
//             onChange={this.handleChangeTimePickerEnd}
//           />
//           <span>Status :     </span> 
//           <DropDownMenu ref="status" value={this.state.status} onChange={this.handleChangeStatus}  style={{width:200}}
//           autoWidth={false}>
//             <MenuItem value={'Unconfirmed'} primaryText="Unconfirmed" />
//             <MenuItem value={'Confirmed'} primaryText="Confirmed" />
//             <MenuItem value={'Cancelled'} primaryText="Cancelled" />
//           </DropDownMenu>

//           <span>Date :     </span> 
//           <DatePicker hintText="Date Picker" />
//         </Dialog>
//         )
//     }

// }

// function mapStateToProps(state) {
//   return {
//         unconfirmed: state.clientReducers.unconfirmed,
//         selectedRow: state.clientReducers.selectedRow
//     };
// }

// export default connect(mapStateToProps)(UnconfirmedTable);
