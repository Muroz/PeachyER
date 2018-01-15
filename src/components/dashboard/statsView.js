"use strict"
import React from 'react';
import {Image, Row, Col, Well, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

var LineChart = require("react-chartjs").Line;


class StatsView extends React.Component{
render(){
        var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var dataset = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        Math.random()
                    ],
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        Math.random()
                    ],
                }
            ]
                // datasets: [{
                //     label: "My First dataset",
                //     backgroundColor: '#0000000',
                //     borderColor: '#000000',
                //     data: 
                //     fill: false,
                // }, {
                //     label: "My Second dataset",
                //     fill: false,
                //     backgroundColor: '#ffffff',
                //     borderColor: '#ffffff',
                //     data: [
                //         Math.random(),
                //         Math.random(),
                //         Math.random(),
                //         Math.random(),
                //         Math.random(),
                //         Math.random(),
                //         Math.random()
                //     ],
                // }]
            }
         var options = {
                responsive: true,
                title:{
                    display:true,
                    text:'Chart.js Line Chart'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                }
            }

    return(
        <div>
            <h4> Statistics </h4>
            <LineChart data={dataset} options={options} width="800" height="200"/>
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(StatsView);

