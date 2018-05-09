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

  class PlaceholderName extends React.Component {

    constructor(props){
        super(props);

        this.state = {
        }
    }
    
    render() {
        return(
            <div> </div>
        )
    }

}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
  }
export default connect(mapStateToProps,mapDispatchToProps)(PlaceholderName);

