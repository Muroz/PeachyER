import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {clockOut, deleteItem} from '../../actions/fetchingActions';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ClockOutPopup extends React.Component {
    state = {
        date: null,
        time: null,
        errorMessage: ''
      };

  handleClose = () => this.reset()

  reset = () => {
    this.setState({     
        date: null,
        time: null,
        errorMessage: ''});
    this.props.onClose();
  }

  handleChange = (type, event, newVal) => {
    var newState = {};
    newState[type] = newVal;
    this.setState(newState);
  };

  handleClockout = () => {
      if (this.state.date != null && this.state.time !=null){
        var timeInfo = {}
        timeInfo['date']= this.state.date;
        timeInfo['time']=this.state.time
        var visit = this.props.visit
        this.props.clockOut(visit,timeInfo);
        this.reset();
      } else {
        this.setState({errorMessage:'Please fill all of the required information'})
      }
  }

  render() {
    const {onClose, clockOut,...other } = this.props;
    return (
      <Dialog onClose={this.handleClose} 
            aria-labelledby="simple-dialog-title" 
            {...other} 
            >
        <DialogTitle className='dialogTitle' id="simple-dialog-title">Clock out</DialogTitle>
        <DialogContent>
            <div className="row4a">Time clocked out: </div>  
            <div className="rowItem">
            <TimePicker
              hintText='Time'
              value={this.state.time}
              onChange={this.handleChange.bind(this,'time')}
            />
            </div>
            <div className="row4a">Date: </div>  
            <div className="rowItem">
            <DatePicker
                hintText="Date"
                value={this.state.date}
                onChange={this.handleChange.bind(this,'date')}
            />
            </div>
            <div style={{color:'red'}}> {this.state.errorMessage} </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleClockout} color="primary">
            Clock out
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ClockOutPopup.propTypes = {
  onClose: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 

    }, dispatch);
}

function mapStateToProps(state) {
    return {confirmed: state.clientReducers.confirmed};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      clockOut:clockOut,
      deleteItem:deleteItem
    }, dispatch);
  }

export default connect(mapStateToProps,mapDispatchToProps)(ClockOutPopup);

