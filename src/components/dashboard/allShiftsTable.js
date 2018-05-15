"use strict";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from 'moment-timezone';
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';

    import Dialog from 'material-ui/Dialog';
    import FlatButton from 'material-ui/FlatButton';
    import RaisedButton from 'material-ui/RaisedButton';
    import HelpOutline from 'material-ui/svg-icons/action/help-outline';

class AllShiftsTable extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            selected: [1],
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: true,
            selectable: true,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: false,
            showCheckboxes: false,
            height: '200px',

            open:false

        }

        this.togglePopup = this.togglePopup.bind(this);
    }
    
    togglePopup() {
        this.setState({
          open: !this.state.open
        });
    }


    setTableInfo(visit, index){

        var DurationHour = Math.floor(visit.duration);
        var durationDifference = Math.round((visit.duration - DurationHour)*60);

        var difference = visit.duration - visit.scheduledDuration

        if (Math.abs(difference)<1){
            difference = difference * 60;
        }

        return (<TableRow key={index} selected={this.props.isSelected(index)}>
                  <TableRowColumn ref={"caregiverName"+index} style={{fontSize:'15px'}}> {visit.caregiverName} </TableRowColumn>
                  <TableRowColumn ref={"clientName"+index} style={{fontSize:'15px'}}> {visit.clientName} </TableRowColumn>
                  <TableRowColumn ref={"clockInTime"+index} style={{fontSize:'15px'}}> {visit.clockInTime? moment(visit.clockInTime).tz('America/St_Johns').format('h:mm a'): 'Not available'} </TableRowColumn>
                  <TableRowColumn ref={"clockOutTime"+index} style={{fontSize:'15px'}}> {visit.clockOutTime? moment(visit.clockOutTime).tz('America/St_Johns').format('h:mm a'): 'Not available'} </TableRowColumn>
                  <TableRowColumn ref={"duration"+index} style={{fontSize:'15px'}}>  {DurationHour+':'+durationDifference+' '}</TableRowColumn>
                  <TableRowColumn ref={"status"+index} style={{fontSize:'15px'}}> {visit.status} </TableRowColumn>
                </TableRow>)
    }

    render() {
        const actions = [
            <FlatButton
              label="Ok"
              primary={true}
              onClick={this.togglePopup}
            />,
          ];

        return(
            <div>
            <Table onRowSelection={this.props.handleOpen}          
            height={this.state.height}
             fixedHeader={this.state.fixedHeader}
            fixedFooter={this.state.fixedFooter}
            selectable={this.state.selectable}
            multiSelectable={this.state.multiSelectable}
            >
            <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
            >
            <TableRow>
                <TableHeaderColumn colSpan="3" tooltip="Scheduled shifts today" className='tableHeader'>
                <div className='tabDescription'>
                    All shifts "In process" or "Completed" on {moment(this.props.selectedDate).format('MMM D')} <HelpOutline onClick={this.togglePopup}/>
                </div>
                </TableHeaderColumn>
            </TableRow>    
            <TableRow>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Employee">HSW</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Client">Client</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="ClockInTime">Time clocked in</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="ClockOutTime">Time clocked out</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Overtime">Duration (hrs)</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Status">Status</TableHeaderColumn>
            </TableRow>
            </TableHeader>

            <TableBody displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
            >
            {this.props.allShiftsFiltered ?this.props.allShiftsFiltered.map(this.setTableInfo,this):null}
            </TableBody>
        </Table>
         <Dialog
         title="Shifts happening today"
         actions={actions}
         modal={false}
         open={this.state.open}
         onRequestClose={this.togglePopup}
       >
         <div className='tabSub'>
         <p>This tab is where you will view and make changes to the scheduled shifts of the day as your care staff call in sick, change shift times, etc.
         You can change the scheduled care staff name, scheduled shift start + end time and the shift duration. The live status of the shift is updated 
         and shown under the 'Status' column. Status options include: scheduled, in process, late (1 min after shift start time), care staff 
         notified (5 min after shift start time), manager notified (15 min after shift start time), overtime, completed and unconfirmed. </p>
         </div>
       </Dialog>
       </div>
        )
    }

}

function mapStateToProps(state) {
  return {allShiftsFiltered: state.clientReducers.allShiftsFiltered};
}

export default connect(mapStateToProps)(AllShiftsTable);
