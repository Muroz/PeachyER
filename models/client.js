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
    Monday: [{start:String, end:String, caregiverName:String, shiftNumber:Number}],
    Tuesday: [{start:String, end:String, caregiverName:String, shiftNumber:Number}],
    Wednesday: [{start:String, end:String, caregiverName:String, shiftNumber:Number}],
    Thursday: [{start:String, end:String, caregiverName:String, shiftNumber:Number}],
    Friday: [{start:String, end:String, caregiverName:String, shiftNumber:Number}],
    Saturday: [{start:String, end:String, caregiverName:String, shiftNumber:Number}],
    Sunday: [{start:String, end:String, caregiverName:String, shiftNumber:Number}],
  },
  phoneNumber: String,
  secondaryPhoneNumber: String,
  region: String,
  company: String
});

//Export function to create "Client" model class
module.exports = mongoose.model("Client", clientSchema);
