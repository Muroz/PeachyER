//Require Mongoose
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//Define a schema
var Schema = mongoose.Schema;

var caregiverSchema = new Schema({
    name: String,
    id: String,
    visits: [{
        visit: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Visit'
        }
    }],
    properties:[String],
    missedVisits: Number,
    lateVisits: Number,
    missedClockInsOuts: Number
});


//Export function to create "Caregiver" model class
module.exports = mongoose.model('Caregiver', caregiverSchema);