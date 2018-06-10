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

    createDict(type,value){
        return {value:value,type:type}
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
            //change fetching way, so pass in a variable
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
                                    [emptyVal,emptyVal,emptyVal,emptyVal,totalLabel,totalDuration],
                                    [emptyVal,emptyVal,emptyVal,emptyVal,emptyVal,emptyVal] 
                            )
                            duration = 0;
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
                filename: 'Report',
                  sheet: {
                  data: data
                }};
                zipcelx(config);
            })
    
          }
        })
    }

    render(){
        return (
            <div className="directoryHeaderContainer"> 
            <div className='directoryTitle'>
                <h1 className='headers directoryHeader'> {this.props.type} information</h1> 
                <Button variant="raised" color="primary" className="directoryDownload" onClick={this.handleDownload.bind(this)}>
                    Export now
                </Button>
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