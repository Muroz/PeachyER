//models/testerVisit.js

//Require Mongoose
var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var testerVisitSchema = new Schema({
  visitId: String,
  date: Date,
  status: {type:String, default:'Uncertain'},
  clockInTime: Date,
  clockOutTime: Date,
  duration : {type:Number, default:0},
  timezone: {type:String,default:'Canada'},
  caregiverName: {type:String, default:'Not available'},
  clientName: {type:String, default:'Not available'},
  company: String,
  payPeriod: String

});

//Export function to create "Visit" model class
module.exports = mongoose.model("TestVisit", testerVisitSchema);
