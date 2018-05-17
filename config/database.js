// config/database.js
//connection to the mlab external database
module.exports = {
  url:
    "mongodb://" +
    process.env.ACCOUNT_LOG +
    "@ds225840.mlab.com:25840/peachytest"
};