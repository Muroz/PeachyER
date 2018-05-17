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

class RealtimeTable extends React.Component {

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
        return (<TableRow key={index} >
                  <TableRowColumn style={{fontSize:'15px'}} ref={"caregiverName"+index}> {visit.caregiverName} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}} ref={"clientName"+index}> {visit.clientName} </TableRowColumn>
                  <TableRowColumn style={{fontSize:'15px'}} ref={"clockInTime"+index}> {visit.clockInTime? moment(visit.clockInTime).tz('America/St_Johns').format('h:mm a'): 'Not available'} </TableRowColumn>
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
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Employee">HSW</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Client">Client</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:'15px'}} tooltip="ClockInTime">Time clocked in</TableHeaderColumn>

            </TableRow>
            </TableHeader>

            <TableBody displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
            >
            {this.props.confirmed?this.props.confirmed.map(this.setTableInfo,this):null}
            </TableBody>
        </Table>
        )
    }

}

function mapStateToProps(state) {
  return {confirmed: state.clientReducers.confirmed};
}

export default connect(mapStateToProps)(RealtimeTable);
