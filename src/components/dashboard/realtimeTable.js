// "use strict";
// import React from "react";



// import {
//     Table,
//     TableBody,
//     TableFooter,
//     TableHeader,
//     TableHeaderColumn,
//     TableRow,
//     TableRowColumn,
//   } from 'material-ui/Table';

// class RealtimeTable extends React.Component {

//     constructor(props){
//         super(props);

//         this.state = {
//             selected: [1],
//             fixedHeader: true,
//             fixedFooter: true,
//             stripedRows: false,
//             showRowHover: true,
//             selectable: false,
//             multiSelectable: false,
//             enableSelectAll: false,
//             deselectOnClickaway: false,
//             showCheckboxes: false,
//             height: '200px',
//             secondsElapsed: 0

//         }

//         this.tick = this.tick.bind(this);
//     }

//     tick() {
//         this.setState({secondsElapsed: this.state.secondsElapsed + 1});
//     }

//     componentDidMount(){
//         this.interval = setInterval(this.tick, 1000);
//     }

//     componentWillUnmount() {
//         clearInterval(this.interval);
//     }

//     setTableInfo(visit, index){
//         var duration = (moment().diff(moment(visit.clockInTime),'hours',true));
//         var DurationHour = Math.floor(duration);
//         var durationDifference = Math.round((duration - DurationHour)*60);

//         return (<TableRow key={index} >
//                   <TableRowColumn style={{fontSize:'15px'}} ref={"caregiverName"+index}> {visit.caregiverName} </TableRowColumn>
//                   <TableRowColumn style={{fontSize:'15px'}} ref={"clientName"+index}> {visit.clientName} </TableRowColumn>
//                   <TableRowColumn style={{fontSize:'15px'}} ref={"clockInTime"+index}> {visit.clockInTime? moment(visit.clockInTime).tz('America/St_Johns').format('h:mm a'): 'Not available'} </TableRowColumn>
//                   <TableRowColumn style={{fontSize:'15px'}}>  {DurationHour+':'+('0' + durationDifference).slice(-2)+' '}</TableRowColumn>
//                 </TableRow>)
//     }

//     render() {
//         return(
//             <Table    
//             height={this.state.height}
//              fixedHeader={this.state.fixedHeader}
//             fixedFooter={this.state.fixedFooter}
//             selectable={this.state.selectable}
//             multiSelectable={this.state.multiSelectable}
//             >
//             <TableHeader
//             displaySelectAll={this.state.showCheckboxes}
//             adjustForCheckbox={this.state.showCheckboxes}
//             enableSelectAll={this.state.enableSelectAll}
//             >
//             <TableRow>
//                 <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Employee">HSW</TableHeaderColumn>
//                 <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Client">Client</TableHeaderColumn>
//                 <TableHeaderColumn style={{fontSize:'15px'}} tooltip="ClockInTime">Time clocked in</TableHeaderColumn>
//                 <TableHeaderColumn style={{fontSize:'15px'}} tooltip="Duration">Duration</TableHeaderColumn>


//             </TableRow>
//             </TableHeader>

//             <TableBody displayRowCheckbox={this.state.showCheckboxes}
//             deselectOnClickaway={this.state.deselectOnClickaway}
//             showRowHover={this.state.showRowHover}
//             stripedRows={this.state.stripedRows}
//             >
//             {this.props.confirmed?this.props.confirmed.map(this.setTableInfo,this):null}
//             </TableBody>
//         </Table>
//         )
//     }

// }



// export default connect(mapStateToProps)(RealtimeTable);



import React from 'react';
import { connect } from "react-redux";
import classNames from 'classnames';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import AvTime from '@material-ui/icons/AvTimer'
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { bindActionCreators } from "redux";
import {clockOut, deleteItem} from '../../actions/fetchingActions';


const columnData = [
    { id: 'caregiverName', numeric: false, disablePadding: true, label: 'HSW' },
    { id: 'clientName', numeric: false, disablePadding: false, label: 'Client' },
    { id: 'clockInTime', numeric: false, disablePadding: false, label: 'Clock in time' },
    { id: 'duration', numeric: false, disablePadding: false, label: 'Duration' },
];

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
      this.props.onRequestSort(event, property);
    };
  
    render() {
      const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;
  
      return (
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
            {columnData.map(column => {
              return (
                <TableCell
                  key={column.id}
                  numeric={column.numeric}
                  padding={column.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={order}
                      onClick={this.createSortHandler(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              );
            }, this)}
          </TableRow>
        </TableHead>
      );
    }
  }
  
  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };









const toolbarStyles = theme => ({
    root: {
      paddingRight: theme.spacing.unit,
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
  });
  

  let EnhancedTableToolbar = props => {
    const { numSelected, classes, filter, clockOut, deleteItem} = props;
  
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subheading">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="title" id="tableTitle">
              Select desired shifts to clock out
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (<div>
            <Tooltip title="Clock out">
              <IconButton aria-label="calendar-clock" onClick={clockOut}>
                <AvTime />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton aria-label="delete" onClick={deleteItem}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
        </div>
          ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list" onClick={filter}>
                <FilterListIcon />
              </IconButton>

            </Tooltip>
          )}
        </div>
      </Toolbar>
    );
  };
  
  EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
  };
  
  EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);
















const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class RealtimeTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        order: 'asc',
        orderBy: 'duration',
        selected: [],
        data: [
        ],
        page: 0,
        rowsPerPage: 5,
        }
        this.sortItems = this.sortItems.bind(this);
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
    
        if (this.state.orderBy === property && this.state.order === 'desc') {
          order = 'asc';
        }
        this.setState({order, orderBy });
    };

    handleSelectAllClick = (event, checked) => {
        if (checked) {
          this.setState({ selected: this.props.confirmed.map(visit => visit.visitId) });
          return;
        }
        this.setState({ selected: [] });
    };
    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
    
        this.setState({ selected: newSelected });
    };
    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };
    
    isSelected = id => this.state.selected.indexOf(id) !== -1;


    sortItems = () => { 
        var orderProp = this.state.orderBy;
        if(orderProp == 'duration'){
            orderProp = 'clockInTime';
        }
        var asc = (this.state.order == 'asc')

        return this.props.confirmed.sort(function(a,b){return (a[orderProp] > b[orderProp] ) ? asc : ((b[orderProp]  > a[orderProp] ) ? !asc : 0);});
    }

    filter = () => {
        console.log('here is the filter');
    }

    clockOutItems = () => {
        console.log('clocking out the given people');
        console.log(this.state.selected);
        this.props.clockOut(this.state.selected);
        this.setState({ selected:[]});
    }

    deleteItem = () => {
        console.log('deleting');
        console.log(this.state.selected);
        this.props.deleteItem(this.state.selected);
        this.setState({ selected:[]});
    }

    render(){

        const { classes } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.confirmed.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
            <EnhancedTableToolbar numSelected={selected.length} filter={this.filter.bind(this)} clockOut={this.clockOutItems.bind(this)} deleteItem={this.deleteItem.bind(this)} />
            <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={this.props.confirmed.length}
                />
                <TableBody>
                {this.sortItems().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(visit => {
                    const isSelected = this.isSelected(visit.visitId);
                    var duration = (moment().diff(moment(visit.clockInTime),'hours',true));
                    var DurationHour = Math.floor(duration);
                    var durationDifference = Math.round((duration - DurationHour)*60);
                    return (
                    <TableRow 
                        key={visit.visitId}
                        hover
                        onClick={event => this.handleClick(event, visit.visitId)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        selected={isSelected}
                    >
                        <TableCell padding="checkbox">
                            <Checkbox checked={isSelected} />
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {visit.caregiverName}
                        </TableCell>
                        <TableCell>{visit.clientName}</TableCell>
                        <TableCell>{visit.clockInTime? moment(visit.clockInTime).tz('America/St_Johns').format('h:mm a'): 'Not available'}</TableCell>
                        <TableCell> {DurationHour+':'+('0' + durationDifference).slice(-2)+' '}</TableCell>
                
                    </TableRow>
                    );
                })}
                {emptyRows > 0 && (
                            <TableRow style={{ height: 49 * emptyRows }}>
                            <TableCell colSpan={6} />
                            </TableRow>
                )}
                </TableBody>
            </Table>
            </div>
            <TablePagination
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                    'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
            </Paper>
        );
    }
}

RealtimeTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

RealtimeTable.defaultProps = {
    confirmed: [],
};

function mapStateToProps(state) {
    return {confirmed: state.clientReducers.confirmed};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      clockOut:clockOut,
      deleteItem:deleteItem
    }, dispatch);
  }

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(RealtimeTable));

