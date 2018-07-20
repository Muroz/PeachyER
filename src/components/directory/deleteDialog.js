import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { deleteItem } from "../../actions/fetchingActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class DeleteDialog extends React.Component {

  delete = () => {
      var dict = {};
      dict['id'] = this.props.id;
      dict['type'] = this.props.type
      this.props.deleteItem(dict);
      this.props.cancel();
  }

  render() {
    return (
        <Dialog
          open={this.props.open}
          onClose={this.props.cancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete entry</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure that you want to delete this entry from the system?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.cancel} color="primary" autoFocus>
              No
            </Button>
            <Button onClick={this.delete} color="primary" >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}



function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {  deleteItem:deleteItem },
      dispatch
    );
  }

  function mapStateToProps(state) {
    return {
      staff:state.clientReducers.staff,
      clients:state.clientReducers.clients
    };
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(DeleteDialog);