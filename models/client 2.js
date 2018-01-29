//models/client.js

//Require Mongoose
var mongoose = require('mongoose');

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
    phoneNumber: String,
    region: String
});


//Export function to create "Client" model class
module.exports = mongoose.model('Client', clientSchema);