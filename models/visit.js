//models/visit.js

//Require Mongoose
var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var visitSchema = new Schema({
  visitId: String,
  date: Date,
  active: {type:Boolean, default:false},
  status: {type:String, default:'Scheduled'},
  clockInTime: Date,
  clockOutTime: Date,
  startTime: Date,
  endTime: Date,
  scheduledDuration: Number,
  duration : {type:Number, default:0},
  timezone: {type:String,default:'Canada'},
  caregiverMessage:{type:{}, default:{}},
  managerMessage:{type:{}, default:{}},
  replyNumberC: {type:String, default:'Not available'},
  replyNumberM: {type:String, default:'Not available'},
  caregiverName: {type:String, default:'Not available'},
  clientName: {type:String, default:'Not available'},
  company: String

});

//Export function to create "Visit" model class
module.exports = mongoose.model("Visit", visitSchema);
