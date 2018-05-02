//models/payPeriod.js

//Require Mongoose
var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var payPeriodSchema = new Schema({
  startDate: Date,
  endDate: Date,
  visits: [
    {
      visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visit"
      }
    }
  ]
});

//Export function to create "Caregiver" model class
module.exports = mongoose.model("PayPeriod", payPeriodSchema);