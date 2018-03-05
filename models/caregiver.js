//models/caregiver.js

//Require Mongoose
var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var caregiverSchema = new Schema({
  name: String,
  visits: [
    {
      visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visit"
      }
    }
  ],
  billedVisits: [
    {
      visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visit"
      }
    }
  ],
  payingHours: Number,
  employeeId: String,
  phoneNumber: String,
  secondaryPhoneNumber: String,
  missedVisits: Number,
  lateVisits: Number,
  company: String,
  missedClockInsOuts: Number,
  region: String
});

//Export function to create "Caregiver" model class
module.exports = mongoose.model("Caregiver", caregiverSchema);
