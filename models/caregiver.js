//models/caregiver.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var caregiverSchema = new Schema({
    name: String,
    visits: [{
        visit: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Visit'
        }
    }],
    employeeID: String,
    phoneNumber: String,
    properties:[String],
    missedVisits: Number,
    lateVisits: Number,
    missedClockInsOuts: Number,
    region:String
});


//Export function to create "Caregiver" model class
module.exports = mongoose.model('Caregiver', caregiverSchema);