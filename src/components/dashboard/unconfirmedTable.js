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

class UnconfirmedTable extends React.Component {

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
            height: '600px',

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
            suffix = 'mins';
        }


        return (<TableRow key={index} selected={this.props.isSelected(index)}>
                  <TableRowColumn style={{fontSize:'15px'}}  tooltip={visit.caregiverName} ref={"caregiverName"+index}> {visit.caregiverName} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}}  ref={"clientName"+index}> {visit.clientName} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}}  ref={"clockInTime"+index}> {visit.clockInTime? moment(visit.clockInTime).tz('America/St_Johns').format('h:mm a'): 'Not available'} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}}  ref={"clockOutTime"+index}> {visit.clockOutTime? moment(visit.clockOutTime).tz('America/St_Johns').format('h:mm a'): 'Not available'} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}}  ref={"duration"+index}> {DurationHour+'.'+durationDifference+' '} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}}  ref={"date"+index}>{visit.date? moment(visit.date).tz('America/St_Johns').format('MMMM Do'): 'Not available'} </TableRowColumn>
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
                <TableHeaderColumn colSpan="3" tooltip="Unconfirmed Shifts" className='tableHeader'>
                <div className='tabDescription' >
                    View, edit and confirm unconfirmed shifts <HelpOutline onClick={this.togglePopup}/>
                </div>
                </TableHeaderColumn>
            </TableRow>
            <TableRow>
                <TableHeaderColumn style={{fontSize:'15px'}}  tooltip="Employee">HSW</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}}  tooltip="Client">Client</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}}  tooltip="ClockInTime">Time clocked in</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}}  tooltip="ClockOutTime">Time clocked out</TableHeaderColumn>
                {/* <TableHeaderColumn style={{fontSize:'15px'}}  tooltip="Overtime">Overtime</TableHeaderColumn> */}
                <TableHeaderColumn style={{fontSize:'15px'}}  tooltip="Status">Shift variation</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}}  tooltip="Date">Date</TableHeaderColumn>
            </TableRow>
            </TableHeader>

            <TableBody displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
            >
            {this.props.unconfirmed? this.props.unconfirmed.map(this.setTableInfo,this):null}
            </TableBody>

         
        </Table>
        <Dialog
          title="Unconfirmed shifts"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.togglePopup}
        >
           <div className='tabSub'>
                This tab is where you will see all past scheduled shifts that have been left unconfirmed due to a variance with the shift that actually
                occurred. This tab is where you will effortlessly ensure that all shift records are up-to-date and accurate, ready for payroll + invoicing.
                Click on the cell under the 'Status' column to make edits and confirm or cancel the shift. (italisized) Note: shift duration and date cannot
                be edited. 
                </div>
        </Dialog>
        </div>
        )
    }

}

function mapStateToProps(state) {
  return {unconfirmed: state.clientReducers.unconfirmed};
}

export default connect(mapStateToProps)(UnconfirmedTable);
