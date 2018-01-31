//models/recentActivity.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var activitySchema = new Schema({
    state: String,
    client: String,
    employee: String,
    actionDescription: String,
    region:String,
    timestamp:Number
});


//Export function to create "Activity" model class
module.exports = mongoose.model('Activity', activitySchema);