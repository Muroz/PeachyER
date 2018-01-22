var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var passport = require('passport');
var flash    = require('connect-flash');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');

var voice = require('./routes/voice');
var fetch = require('./routes/fetch');
var main = require('./routes/main');

var app = express();

var configDB = require('./config/database.js');

var later = require('later');

//schema importing


//Import the mongoose module
var mongoose = require('mongoose');

var Client = require('./models/client');
var Caregiver = require('./models/caregiver');
var Visit = require('./models/visit');

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


//hardcoded values
// var alex = new Caregiver({
//     name: "Alex",
//     missedVisits:0,
//     lateVisits:0,
//     missedClockInsOuts:0,
//     visits:[]
// });

// var joe = new Client({
//     name: "Joe",
//     id: '7097692806'
// })

// var today= new Date();
// //console.log(today.toDateString() == 'Mon Jan 15 2018');
// var dateString = today.toDateString();
// dateString = dateString.replace(/\s+/g, '');
// visitId = dateString + joe.id;

// var startDate = new Date(2018, 1, 15, 20, 45);
// var endDate = new Date(2018, 1, 15, 22, 45);
// var visit = new Visit({
//     visitId: visitId,
//     date: today,
//     state: 'Will happen',
//     staffId: alex._id,
//     clientId: joe._id,
//     startTime: startDate,
//     endTime: endDate,
//     timezone: 'Canada'

// })

// alex.save();
// joe.save();
// visit.save();


//end of hardcoded values

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ 
  secret: 'ilovestequilabywithlotsofwhiskey', 
  resave: true,
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./routes/main.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use('/voice', voice);
app.use('/fetch', fetch);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var sched = later.parse.recur().every(1).minute().onWeekday();
var t = later.setInterval(function() {
    console.log(new Date());
  }, sched);
module.exports = app;

