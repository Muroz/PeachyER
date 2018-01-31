//models/user.js

//Require Mongoose
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

//Define a schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  region: String
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

//Export function to create "User" model class
module.exports = mongoose.model("User", userSchema);
