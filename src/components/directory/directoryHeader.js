"use strict";
import React from "react";
import moment from 'moment-timezone';


import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import zipcelx from 'zipcelx';
import axios from 'axios';
import Button from '@material-ui/core/Button';



class DirectoryHeader extends React.Component {

    constructor(props){
        super(props);
        this.state = {admin: false}
    }

    createDict(type,value){
        return {value:value,type:type}
    }

    componentWillMount(){
        axios.post("/fetch/getUser")
        .then(res => {
            if (res.data.type == 'Admin'){
                this.setState({admin:true})
            }
        })
    }



    handleDownload(){
        // type={'Client'}
        axios.post("/fetch/getAuth")
        .then(res => {
          if(res.data){
            var data = []
            var varName = '';
            var duration = 0;
            if(this.props.type == 'Client'){
                var headersTitles = ['Client', 'Date', 'Clock in time', 'Clock out time', 'Caregiver', 'Duration'];
                var keys = ['clientName', 'date', 'clockInTime', 'clockOutTime', 'caregiverName', 'duration'];
            } else if (this.props.type == 'Staff'){
                var headersTitles = ['Caregiver', 'Date', 'Clock in time', 'Clock out time', 'Client', 'Duration'];
                var keys = ['caregiverName', 'date', 'clockInTime', 'clockOutTime', 'clientName', 'duration'];
            } else {
                var keys = [];
                var headersTitles = [];
            }
            var dict = {}
            dict['type'] = this.props.varName
            //change fetching way, so pass in a date
            axios.post("/fetch/reportInfo", dict)
            .then(res => {
                res.data.forEach((visit,index) => {
                    var row = [];
                    if (visit[this.props.varName] != varName){
                        if (index == 0){
                            var headers = []
                            headersTitles.forEach(key => {
                                var header = this.createDict('string',key);
                                headers.push(header);
                            });
                            data.push(headers);
                        } else {
                            var emptyVal = this.createDict('string','');
                            var totalLabel =  this.createDict('string','Total duration');
                            var totalDuration = this.createDict('number',Math.round(duration));
                            data.push(
                                    [emptyVal,emptyVal,emptyVal,emptyVal,totalLabel,totalDuration] 
                            )
                            duration = 0;
                            var headers = []
                            headersTitles.forEach(key => {
                                var header = this.createDict('string',key);
                                headers.push(header);
                            });
                            data.push(headers);
                        }
                        varName = visit[this.props.varName];
                    }
                    duration = duration + visit['duration'];
                    keys.forEach(key => {
                        var value = visit[key];
                        var type = 'string'
                        if (key == 'clockInTime' || key == 'clockOutTime'){
                            value = moment(value).format("h:mm a")
                        } else if (key == 'date'){
                            value = moment(value).format('MM-DD-YYYY')
                        } else if (key == 'duration'){
                            value = Math.round(value);
                            type = 'number'
                        }
                        var dict = this.createDict(type,value);
                        row.push(dict);
                    });
                    data.push(row);
                    if (index+1 == res.data.length){
                        var emptyVal = this.createDict('string','');
                        var totalLabel =  this.createDict('string','Total duration');
                        var totalDuration = this.createDict('number',Math.round(duration));
                        data.push([emptyVal,emptyVal,emptyVal,emptyVal,totalLabel,totalDuration])
                        duration = 0;
                    }
        
                })

                const config = {
                filename: this.props.type+' report',
                  sheet: {
                  data: data
                    }
                };
                zipcelx(config);
            })
    
          }


        })
    }

    handleListDownloadStaff(){
        axios.post("/fetch/getAuth")
        .then(res => {
            if(res.data){
                var data = []
                var headersTitles = ['name', 'employeeId', 'phoneNumber'];
                axios.post("/fetch/reportStaff")
                .then(res => {
                    var headers = []
                    headersTitles.forEach(key => {
                        var header = this.createDict('string',key);
                        headers.push(header);
                    },this);
                    data.push(headers);
                    res.data.forEach((staff) => {
                        var row = [];
                 
                        headersTitles.forEach(key => {
                            var value = staff[key];
                            var type = 'string'
                            if (key == 'phones'){
                                value.forEach(function(phone){
                                    var dict = this.createDict(type,phone);
                                    row.push(dict);
                                },this)
                            } else {
                                var dict = this.createDict(type,value);
                                row.push(dict);
                            }
                        });
                        data.push(row);
                    }, this)
    
                    const config = {
                    filename: 'Staff list',
                      sheet: {
                      data: data
                        }
                    };
                    zipcelx(config);
                })
            }
        })

    }

    handleListDownloadClients(){
        axios.post("/fetch/getAuth")
        .then(res => {

            if(res.data){
                var data = []
                var headersTitles = ['name', 'id', 'phones'];
                axios.post("/fetch/reportClient")
                .then(res => {
                    var headers = []
                    headersTitles.forEach(key => {
                        var header = this.createDict('string',key);
                        headers.push(header);
                    },this);
                    data.push(headers);
                    res.data.forEach((client) => {
                        var row = [];
                        headersTitles.forEach(key => {
                            var value = client[key];
                            var type = 'string'
                            if (key == 'phones'){
                                value.forEach(function(phone){
                                    var dict = this.createDict(type,phone);
                                    row.push(dict);
                                },this)
                            } else {
                                var dict = this.createDict(type,value);
                                row.push(dict);
                            }
                        });
                        data.push(row);
                    }, this)
    
                    const config = {
                    filename: 'Client list',
                      sheet: {
                      data: data
                        }
                    };
                    zipcelx(config);
                })
            }
        })
    }

            //onClick={this.handleDownload.bind(this)}>
    render(){

        var itemDownload = null;
        if (this.state.admin){
            if(this.props.type == 'Client'){
                itemDownload = <Button variant="raised" color="primary" className="directoryDownload" onClick={this.handleListDownloadClients.bind(this)}>     
                                    Download list
                                </Button> 
            } else {
                itemDownload = <Button variant="raised" color="primary" className="directoryDownload" onClick={this.handleListDownloadStaff.bind(this)}>     
                                    Download list
                                </Button>
            }
        }
        return (
            <div className="directoryHeaderContainer"> 
            <div className='directoryTitle'>
                <h1 className='headers directoryHeader'> {this.props.type} information</h1> 
                {this.state.admin ? 
                <Button variant="raised" color="primary" className="directoryDownload" onClick={this.handleDownload.bind(this)}>     
                    Download report
                </Button> :    
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScg8GcuJyX2MFOe0e3zWGnz2ASVG3whtS_WwehHqHhwyeWARA/viewform?usp=sf_link">              
                <Button variant="raised" color="primary" className="directoryDownload" onClick={this.handleDownload.bind(this)}>     
                    Request report
                </Button>
                </a>}
                {itemDownload}

            </div>
            <TextField
                className='directorySearchBar'
                id="input-with-icon-textfield"
                placeholder="Search"
                onChange = {this.props.handleInputChange}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <Search />
                    </InputAdornment>
                ),
                }}
            />
            </div>
        )
    }
}

export default DirectoryHeader;