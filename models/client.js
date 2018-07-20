//models/client.js

//Require Mongoose
var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var clientSchema = new Schema({
  name: String,
  id: String,
  billedHours: Number,
  billedVisits: [
    {
      staffId: mongoose.Schema.Types.ObjectId,
      visitLog: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Visit"
        } 
                ]
    }
  ],
  visitsBy: [
    {
      staffId: mongoose.Schema.Types.ObjectId,
      visitLog: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Visit"
        }
      ]
    }
  ],
  schedule:{ 
    Monday: [{start:String, end:String, caregiverName:String, shiftNumber:Number, date: String}],
    Tuesday: [{start:String, end:String, caregiverName:String, shiftNumber:Number, date: String}],
    Wednesday: [{start:String, end:String, caregiverName:String, shiftNumber:Number, date: String}],
    Thursday: [{start:String, end:String, caregiverName:String, shiftNumber:Number, date: String}],
    Friday: [{start:String, end:String, caregiverName:String, shiftNumber:Number, date: String}],
    Saturday: [{start:String, end:String, caregiverName:String, shiftNumber:Number, date: String}],
    Sunday: [{start:String, end:String, caregiverName:String, shiftNumber:Number, date: String}],
  },
  phoneNumber: String,
  phones: [String],
  region: String,
  company: String
});

//Export function to create "Client" model class
module.exports = mongoose.model("Client", clientSchema);
