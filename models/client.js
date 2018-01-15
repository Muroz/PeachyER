//Require Mongoose
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//Define a schema
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    name: String,
    id: String,
    visitsBy: [{
        staffId: mongoose.Schema.Types.ObjectId,
        visits: [{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Visit'
        }]
    }],
    properties:[String],
    missedVisits: Number,
    lateVisits: Number,
    missedClockInsOuts: Number
});


//Export function to create "Client" model class
module.exports = mongoose.model('Client', clientSchema);