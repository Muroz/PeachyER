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
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {updateVisit} from '../../actions/fetchingActions';

  //props
  //pass a visit
  //pass a close function
  //pass tab value
  class Popup extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            open : true,
            save: false,

            visitId:null,
            caregiverName:null,
            clientName:null,
            clockInTime: null,
            duration:null,
            clockOutTime : null,
            status: null,
            company: null,
            date: null,
            timezone:null,
        
            messageClock:'',
            messageTime:'',
        
        }

    }


    handleSave = () => {
        //check all values
        var visit = this.props.visit;
        visit.clockInTime = this.state.clockInTime ? moment(this.state.clockInTime) : visit.clockInTime;
        visit.clockOutTime = this.state.clockOutTime ? moment(this.state.clockOutTime) : visit.clockOutTime;
        visit.caregiverName = this.state.caregiverName ? this.state.caregiverName : visit.caregiverName;
        visit.clientName = this.state.clientName ? this.state.clientName : visit.clientName;
        visit.duration = this.state.duration ? this.state.duration : visit.duration;
        visit.status = this.state.status ? this.state.status : visit.status;
    
     
        this.setState({ 
            open : false,
            save: false,

            visitId:null,
            caregiverName:null,
            clientName:null,
            clockInTime: null,
            duration:null,
            clockOutTime : null,
            status: null,
            company: null,
            date: null,
            timezone:null});
        this.props.updateVisit(visit,this.props.tabValue);
        this.props.handleClose()
      }
    
    //   isSelected = (index) => {

    //     if (this.state.open){
    //       return false
    //     }
    //     else {
    //       //return index == this.props.selectedRow
    //       return this.state.selected.indexOf(index) !== -1;
    //     }
    //   };
    
    
      handleChangeTimeChange = (type,event, date) => {
    
        if(type == 'clockInTime'){
          if (this.state.clockOutTime != null) {
            if(moment(date).diff(moment(this.state.clockOutTime),'minutes')<0){
              this.setState({clockInTime:date, save:true, messageClock:''})
            } else {
              var message = 'Clock in time cannot be later than the set clock out time';
              this.setState({save:false, messageClock:message})
            }
          } else {
            this.setState({clockInTime:date,save:true, messageClock:''});
          }
        } 
        
        else if(type == 'clockOutTime'){
          if (this.state.clockInTime != null) {
            if(moment(date).diff(moment(this.state.clockInTime),'minutes')>0){
              this.setState({'clockOutTime':date, 'save':true, messageClock:''})
            } else {
              var message = 'Clock out time cannot be earlier than the set clock in time';
              this.setState({save:false, messageClock:message})
            }
          } else {
            this.setState({clockOutTime:date,save:true, messageClock:''});
          }
        } 
        
      };
    
      handleChangeStatus = (event, index, value) => {
        this.setState({status:value, save:true});
      }
    
      handleChangeCaregiver = (event, index, value) => {
        this.setState({caregiverName:value, save:true});
      }
    
      setStaff(staff,index){
        return(<MenuItem key={index} value={staff.name} primaryText={staff.name} />)
      }
    
      handleChangeClient = (event, index, value) => {
        this.setState({clientName:value, save:true});
      }
    
      setClients(client,index){
        return(<MenuItem key={index} value={client.name} primaryText={client.name} />)
      }
    
    render() {
        const actions = [
            <FlatButton
              label="Save"
              primary={true}
              keyboardFocused={true}
              disabled={!this.state.save}
              onClick={this.handleSave}
            />,<FlatButton
            label="Cancel"
            primary={false}
            keyboardFocused={false}
            onClick={this.props.handleClose}
          />
          
          ];
        
        var stringClockIn = this.props.visit? this.props.visit.clockInTime? moment(this.props.visit.clockInTime).format('H:mm a'):"Not Available" :"Not available"
        var stringClockOut =  this.props.visit? this.props.visit.clockOutTime? moment(this.props.visit.clockOutTime).format('H:mm a'):"Not Available" :"Not available"
        return(
            <div>
            <Dialog
            title="Update information"
            titleClassName='dialogTitle'
            actions={actions}
            modal={false}
            open={this.props.open}
            onRequestClose={this.props.handleClose}
            bodyClassName="dialogWindow"
          >
          
            <div className="row8a">HSW name:     </div> 
            <DropDownMenu 
              ref="caregiverName" value={this.props.visit.caregiverName} 
              onChange={this.handleChangeCaregiver}  
              className="dropdown"
              style={{width:'100px'}}
              autoWidth={true}>
              {this.props.staff.map(this.setStaff,this)}
            </DropDownMenu>
    
            <div className="row8a">Client name:     </div> 
            <DropDownMenu 
              ref="clientName" value={this.props.visit.clientName} 
              onChange={this.handleChangeClient}  
              className="dropdown"
              style={{width:'100px'}}
              autoWidth={true}>
              {this.props.clients.map(this.setClients,this)}
            </DropDownMenu>
    
            <div className="row3a">Time clocked in: </div>  
            <div className="rowItem">
            <TimePicker
              hintText={stringClockIn}
              value={this.props.visit.clockInTime}
              onChange={this.handleChangeTimeChange.bind(this,'clockInTime')}
            />
            </div>
    
            <div className="row4a">Time clocked out: </div>  
            <div className="rowItem">
            <TimePicker
              ref="clockOutTime"
              hintText={stringClockOut}
              value={this.props.visit.clockOutTime}
              onChange={this.handleChangeTimeChange.bind(this,'clockOutTime')}
            />
            </div>
    
            <div className="row5a">Shift duration: </div>  
            <TextField
              ref="scheduledDuration"
              className="rowItem"
              id="scheduledDuration"
              disabled={true}
              value={Number(this.props.visit.duration).toFixed(2)}
            />
    
    
            <div className="row8a">Status:     </div> 
            {this.props.tabValue == 'allShifts' ?
            <DropDownMenu 
              ref="status" value={this.props.visit.status} 
              onChange={this.handleChangeStatus}  
              className="row8b"
              className="dropdown"
              autoWidth={true}>
    
                <MenuItem value={'Unconfirmed'} primaryText="Unconfirmed" />
                <MenuItem value={'Completed'} primaryText="Completed" />
                <MenuItem value={'Cancelled'} primaryText="Cancelled" />
                <MenuItem value={'In process'} primaryText="In process" />
                  
            </DropDownMenu>
            :
            <DropDownMenu 
              ref="status" value={this.props.visit.status} 
              onChange={this.handleChangeStatus}  
              className="row8b"
              className="dropdown"
              autoWidth={true}>
    
                <MenuItem value={'Unconfirmed'} primaryText="Unconfirmed" />
                <MenuItem value={'Completed'} primaryText="Completed" />
                <MenuItem value={'Cancelled'} primaryText="Cancelled" />
                  
            </DropDownMenu>

            }
    
            <div className='alertMessage'>
              {this.state.messageClock}
              <br />
              {this.state.messageTime}
            </div>
    
          </Dialog>
          </div>
        )
    }

}

function mapStateToProps(state) {
    return {
      staff: state.clientReducers.staff,
      clients: state.clientReducers.clients
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  updateVisit:updateVisit  }, dispatch);
  }
export default connect(mapStateToProps,mapDispatchToProps)(Popup);

