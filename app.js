var express = require('express');
var compression = require('compression')
var path = require('path');
var favicon = require('serve-favicon');
var passport = require('passport');
var flash    = require('connect-flash');
var helmet = require('helmet')

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');

var voice = require('./routes/voice');
var fetch = require('./routes/fetch');

var app = express();

var configDB = require('./config/database.js');

const clientTwilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

//import moment
var moment = require('moment-timezone');

//Import the mongoose module
var mongoose = require('mongoose');

var ClientModel = require('./models/client');
var Caregiver = require('./models/caregiver');
var Visit = require('./models/visit');
var TestVisit = require('./models/testerVisit');

//Security measure
//app.use(helmet())
var fs = require('fs');

//Set up default mongoose connection
mongoose.connect(configDB.url, {
  useMongoClient: true
});

require('./config/passport')(passport);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public','images', 'peachy.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: true,
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(compression());
require('./routes/main.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use('/voice', voice);
app.use('/fetch', fetch);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});


// TestVisit.find({}).sort({clientName:1}).exec(function(err,visits){
//   visits.forEach(function(visit){
//     visit.payPeriod = moment(visit.date).week();
//     visit.save();
//     if (visit.status != "Unconfirmed"){
//       if(visit.clockOutTime != null && visit.clockInTime != null){
//         visit.duration = (moment(visit.clockOutTime).diff(moment(visit.clockInTime),'hours',true));
//         visit.save();
//       }

//     if (visit.payPeriod == 18 || visit.payPeriod == 19){
//       console.log(JSON.stringify({ "Client name": visit.clientName, "Shift date": moment(visit.date).format('MM-DD-YYYY'), "Clocked in": moment(visit.clockInTime).format("h:mm a"),"Clocked out": moment(visit.clockOutTime).format("h:mm a"),"Employee":visit.caregiverName,"Actual hours worked":visit.duration}))
//       console.log(',')
//     }
//     } else {
//       console.log(JSON.stringify({ "Client name": visit.clientName, "Shift date": moment(visit.date).format('MM-DD-YYYY'), "Clocked in": moment(visit.clockInTime).format("h:mm a"),"Clocked out": moment(visit.clockOutTime).format("h:mm a"),"Employee":visit.caregiverName,"Actual hours worked":visit.duration}))
//     }
//   })

// });

//find all of the visits in process
// TestVisit.find({status:'In process'}, function(err, visits){
//   visits.forEach(function(visit){
//     console.log(visit);
//     var endTime = new moment().tz('America/St_Johns');
//     visit.clockOutTime = endTime;
//     visit.duration = (moment(visit.clockOutTime).diff(moment(visit.clockInTime),'hours',true));
//     visit.status = 'Completed';
//     visit.save();
//   })

// })


//wipe staff hours clean
// Caregiver.find({}, function(err, staff){
//   staff.forEach(function(caregiver){
//     caregiver.payingHours = 0;
//     caregiver.save();
//   })
// })

// //wipe client hours clean
// ClientModel.find({}, function(err, clients){
//   clients.forEach(function(client){
//     client.billedHours = 0
//     client.save();
//   })
// })

// TestVisit.find({}).sort({clientName:1}).exec(function(err,visits){

//   var period = moment().week()
//   var extraPeriod = 0
//   if(period % 2 == 0)
//   {
//     extraPeriod = period + 1
//   }
//   else
//   {
//     extraPeriod = period - 1
//   }
//   visits.forEach(function(visit){
//     if (visit.status != "Unconfirmed"){
//       if (visit.payPeriod == period || visit.payPeriod == extraPeriod){
        
//         console.log(JSON.stringify({ "Client name": visit.clientName, "Shift date": moment(visit.date).format('MM-DD-YYYY'), "Clocked in": moment(visit.clockInTime).format("h:mm a"),"Clocked out": moment(visit.clockOutTime).format("h:mm a"),"Employee":visit.caregiverName,"Actual hours worked":visit.duration}))
//         console.log(',')
//       }
//     } else {
//       console.log(JSON.stringify({ "Client name": visit.clientName, "Shift date": moment(visit.date).format('MM-DD-YYYY'), "Clocked in": moment(visit.clockInTime).format("h:mm a"),"Clocked out": moment(visit.clockOutTime).format("h:mm a"),"Employee":visit.caregiverName,"Actual hours worked":visit.duration}))
//     }
//   })

// });

module.exports = app;


