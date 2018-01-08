//Require Mongoose
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//Define a schema
var Schema = mongoose.Schema;

var caregiverSchema = new Schema({
    name: String,
    id: String,
});


//Export function to create "Caregiver" model class
module.exports = mongoose.model('Caregiver', caregiverSchema);