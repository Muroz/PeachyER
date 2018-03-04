//models/company.js

//Require Mongoose
var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var companySchema = new Schema({
  name: String,
  spreadsheetId: String,
  managerPhone: String
});

//Export function to create "Caregiver" model class
module.exports = mongoose.model("Company", companySchema);