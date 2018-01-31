// config/database.js
//connection to the mlab external database
module.exports = {
  url:
    "mongodb://" +
    process.env.ACCOUNT_LOG +
    "@ds161016.mlab.com:61016/peachy_er" // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
};
