//Require Mongoose
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//Define a schema
var Schema = mongoose.Schema;

var visitSchema = new Schema({
    date: Date,
    state: String,
    clockInTime: Date,
    clockOutTime: Date,
    id: String,
    staffId: mongoose.Schema.Types.ObjectId,
    clientId: mongoose.Schema.Types.ObjectId,
    startTime: Date,
    endTime:Date,
    timezone:String
});


//Export function to create "Visit" model class
module.exports = mongoose.model('Visit', visitSchema);