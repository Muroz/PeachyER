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


class ClockOutPopup extends React.Component {
    state = {
        date: null,
        time: null,
        visit: null
      };

  handleClose = () => {
    this.props.onClose();
  };

  handleChange = (type, event, newVal) => {
    var newState = {};
    newState[type] = newVal;
    this.setState(newState);
  };

  render() {
    const {onClose, ...other } = this.props;
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
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
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

export default ClockOutPopup;