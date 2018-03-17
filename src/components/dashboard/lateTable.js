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

class LateTable extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            selected: [1],
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: true,
            selectable: false,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: false,
            showCheckboxes: false,
            height: '200px'

        }
    }


    setTableInfo(visit, index){
        return (<TableRow key={index}>
                  <TableRowColumn style={{fontSize:'15px'}} ref={"caregiverName"+index}> {visit.caregiverName} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}} ref={"clientName"+index}> {visit.clientName} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}} ref={"clockInTime"+index}> {visit.clockInTime? moment(visit.clockInTime).tz('America/St_Johns').format('h:mm a'): '00:00'} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}} ref={"startTime"+index}> {moment(visit.startTime).tz('America/St_Johns').format('h:mm a')} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}} ref={"endTime"+index}> {moment(visit.endTime).tz('America/St_Johns').format('h:mm a')} </TableRowColumn>
                </TableRow>)
    }

    render() {
        return(
            <Table         
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
                <TableHeaderColumn colSpan="3" tooltip="Currently working" className='tableHeader'>
                Uh-oh... these staff are late!
                </TableHeaderColumn>
            </TableRow>
            <TableRow>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Employee">Care staff name</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Client">Client ID</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="ClockInTime">Time clocked in</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Start">Scheduled start</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="End">Scheduled end</TableHeaderColumn>
            </TableRow>
            </TableHeader>

            <TableBody displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
            >
            {this.props.late?this.props.late.map(this.setTableInfo,this):null}
            </TableBody>
        </Table>
        )
    }

}

function mapStateToProps(state) {
  return {late: state.clientReducers.late};
}

export default connect(mapStateToProps)(LateTable);
