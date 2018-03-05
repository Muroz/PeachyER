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

var app = express();

var configDB = require('./config/database.js');

const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

var later = require('later');


//import moment
var moment = require('moment');

//Import the mongoose module
var mongoose = require('mongoose');

var ClientModel = require('./models/client');
var Caregiver = require('./models/caregiver');
var Visit = require('./models/visit');


//google spreadsheets
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

//end google stuff

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


//////////////////////////////////////////////////////
////////////Helper functions
///////////////////////////////////////////////////////

function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

//scheduled actions


/////////////////////////////////////////////////////
/////////// Late runs every minutes
////////////////////////////////////////////////////

var visitSched = later.parse.recur().every(1).minute();
var t = later.setInterval(function() {
    console.log('Checking for late people');
    Visit.find({}, function(err,visits){

      visits.forEach(function(visit,index,arr){

        //search for company specifics here
        if(visit.status == 'Scheduled'){
          var currentTime = new moment();

          if (currentTime.diff(visit.startTime,'minutes',true)>10 || currentTime.diff(visit.endTime,'minutes',true)>10){
            if(currentTime.diff(visit.endTime)>10){
              visit.status = 'reported'
              visit.statusLog.push('reported');
            } else {
              visit.status = 'Late';
              visit.statusLog.push('late');
            }
            visit.save();
          }

        }

        else if(visit.status == 'Late'){
          visit.caregiverMessage = { state:'sent', sentTime: new moment(), reply:''}
          visit.status = 'notifiedC';
          visit.statusLog.push('notifiedC');
          var visitState = visit.active?'out':'in'
          var bodyString = "This is the peachy service, you haven't clocked "+ visitState + " yet for your shift.";
          // client.messages.create({
          //   from: process.env.TWILIO_PHONE,
          //   to: visit.replyNumberC,
          //   body: bodyString
          // }).then((messsage) => console.log(message.sid));
        } 
        
        else if (visit.status == 'notifiedC'){
          var currentTime = new moment();

          if (currentTime.diff(visit.caregiverMessage.sentTime,'minutes',true)>10){
            visit.managerMessage = { state:'sent', sentTime: new Date(), reply:''}
            visit.status = 'notifiedM';
            visit.statusLog.push('notifiedM');
            var visitState = visit.active?'out':'in'
            var bodyString = "This is the peachy service, "+visit.caregiverName+" hasn't clocked"+ visitState + "for the visit yet.";

            // client.messages.create({
            //   from: process.env.TWILIO_PHONE,
            //   to: visit.replyNumberM,
            //   body: bodyString
            // }).then((messsage) => console.log(message.sid));
          
          }
        } 
        
        else if (visit.status == 'notifiedM'){
          var currentTime = new moment();

          if (currentTime.diff(visit.managerMessage.sentTime,'minutes',true)>10){
            visit.status = 'reported';
            visit.statusLog.push('reported');
          }

        }
        visit.save();
      },this);
    })
  }, visitSched);


/////////////////////////////////////////////////////
/////////// Schedules runs at 1am every day
////////////////////////////////////////////////////

var lateSched = later.parse.recur().on(1).hour();
var late = later.setInterval(function(){
  console.log('Creating schedules');
  ClientModel.find({},function(err,clients){

    clients.forEach(function(client,index,arr){

      client.schedule[moment().format('dddd')].forEach(function(visit,index,arr){

        var startString = visit.start.split(':');

        if (!startString.length == 3){
          //implement error handling for erroneous schedules
          return 'Problem with the input start'
        }

        var startTime = new moment().hour(parseInt(startString[0])).minute(parseInt(startString[1])).seconds(parseInt(startString[2]));

        var endString = visit.end.split(':');

        if (!endString.length == 3){
          return 'Problem with the input end'
        }

        var endTime = new moment().hour(parseInt(endString[0])).minute(parseInt(endString[1])).seconds(parseInt(endString[2]));

        var duration = endTime.diff(startTime,'hours');

        Caregiver.findOne({phoneNumber:visit.phone}, function(err,carer){

          Visit.create({
            visitId:client.phoneNumber+carer.employeeId+visit.shiftNumber,
            caregiverName: carer.name,
            clientName:client.name,
            date:new moment(),
            startTime: startTime,
            endTime:endTime,
            scheduledDuration:duration,
            replyNumberC:visit.phone
          });
  
          console.log('visit created');
        });

      }, this);



    },this);
  })
}, lateSched);

/////////////////////////////////////////////////////
/////////// Real time updates runs every minute
////////////////////////////////////////////////////

var realTimeSched = later.parse.recur().every(1).minute();
var realTime = later.setInterval(function(){

  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    authorize(JSON.parse(content), updateCurrent);
  });

  function updateCurrent(auth) {
    var sheets = google.sheets('v4');
								
    //current completed shifts

    Visit.find({$or:[{status:'Completed'},{status:'In process'}]}, function(err,visits){
      var checkValues = [];
      visits.forEach(function(visit,index,arr){
        var checkRow = [];
        var stringDate = moment(visit['date']).format("MMM Do YY");
        var stringStart = moment(visit['startTime']).format('h:mm:ss a');
        var stringEnd = moment(visit['endTime']).format('h:mm:ss a');
        var stringClockIn = '';
        var stringClockOut = '';
        if (visit['clockInTime'] == undefined){
          stringClockIn = 'N/A'
        } else {
          stringClockIn = moment(visit['clockInTime']).format('h:mm:ss a');
        }
        if (visit['clockOutTime'] == undefined){
          stringClockOut = 'N/A'
        }else {
          stringClockOut = moment(visit['clockOutTime']).format('h:mm:ss a');
        }
        
        checkRow.push(visit['caregiverName'], stringClockIn,stringClockOut,visit['clientName'],stringStart,stringEnd,visit.duration,stringDate, visit['visitId']);

        checkValues.push(checkRow);
      })

      var infoLenght = checkValues.length + 6;
      
      sheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId:  process.env.SPREADSHEET,
        range: "Who's Working!A"+infoLenght+":I",
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        //console.log(response.updatedData);

      });

      sheets.spreadsheets.values.update({
        auth: auth,
        spreadsheetId:  process.env.SPREADSHEET,
        range: "Who's Working!A6:I",
        valueInputOption: 'RAW',
        includeValuesInResponse: true,
        resource:{
          values: checkValues
        }
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        //console.log(response.updatedData);
      });
     
    })
   


  }

},realTimeSched);


/////////////////////////////////////////////////////
/////////// Reports runs every 10 minutes
////////////////////////////////////////////////////

var reportSched = later.parse.recur().every(1).minute();
var reportCreation = later.setInterval(function(){

  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    authorize(JSON.parse(content), createReports);
  });

  function createReports(auth) {
    var sheets = google.sheets('v4');
    
    //unconfirmed shifts
    Visit.find({status:'reported'}, function(err,visits){
      var checkValues = [];

      visits.forEach(function(visit,index,arr){
        var checkRow = [];
        // for (key in listOfKeys){
        //   checkRow.push(visit[listOfKeys[key]])
        // }

        var stringDate = moment(visit['date']).format("MMM Do YY");
        var stringStart = moment(visit['startTime']).format('h:mm:ss a');
        var stringEnd = moment(visit['endTime']).format('h:mm:ss a');
        var stringClockIn = '';
        var stringClockOut = '';
        if (visit['clockInTime'] == undefined){
          stringClockIn = 'N/A'
        } else {
          stringClockIn = moment(visit['clockInTime']).format('h:mm:ss a');
        }
        if (visit['clockOutTime'] == undefined){
          stringClockOut = 'N/A'
        }else {
          stringClockOut = moment(visit['clockOutTime']).format('h:mm:ss a');
        }
        
        
        checkRow.push(visit['caregiverName'], stringClockIn,stringClockOut,visit['clientName'],stringStart,stringEnd,visit.duration,stringDate, visit['visitId']);

        checkValues.push(checkRow);
      })
      
      var infoLenght = checkValues.length + 6;
      
      sheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId: process.env.SPREADSHEET,
        range: 'Unconfirmed Shifts!A'+infoLenght+':I',
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        //console.log(response.updatedData);

      });

      sheets.spreadsheets.values.update({
        auth: auth,
        spreadsheetId:  process.env.SPREADSHEET,
        range: 'Unconfirmed Shifts!A6:I',
        valueInputOption: 'RAW',
        includeValuesInResponse: true,
        resource:{
          values: checkValues
        }
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        //console.log(response.updatedData);
      });

     
    })

    //all shifts

    Visit.find({}, function(err,visits){
      var checkValues = [];

      visits.forEach(function(visit,index,arr){
        var checkRow = [];

        var stringDate = moment(visit['date']).format("MMM Do YY");
        var stringStart = moment(visit['startTime']).format('h:mm:ss a');
        var stringEnd = moment(visit['endTime']).format('h:mm:ss a');
        var stringClockIn = '';
        var stringClockOut = '';
        if (visit['clockInTime'] == undefined){
          stringClockIn = 'N/A'
        } else {
          stringClockIn = moment(visit['clockInTime']).format('h:mm:ss a');
        }
        if (visit['clockOutTime'] == undefined){
          stringClockOut = 'N/A'
        }else {
          stringClockOut = moment(visit['clockOutTime']).format('h:mm:ss a');
        }
        
        checkRow.push(visit['caregiverName'], stringClockIn,stringClockOut,visit['clientName'],stringStart,stringEnd,visit.duration,stringDate, visit['visitId']);

        checkValues.push(checkRow);
      })

      var infoLenght = checkValues.length + 6;
      
      sheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId:  process.env.SPREADSHEET,
        range: 'Scheduled Shifts Today!A'+infoLenght+':I',
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        //console.log(response.updatedData);

      });

      sheets.spreadsheets.values.update({
        auth: auth,
        spreadsheetId:  process.env.SPREADSHEET,
        range: 'Scheduled Shifts Today!A6:I',
        valueInputOption: 'RAW',
        includeValuesInResponse: true,
        resource:{
          values: checkValues
        }
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        //console.log(response.updatedData);
      });

      
    })

   }

},reportSched);



/////////////////////////////////////////////////////
/////////// Report update runs every minute
////////////////////////////////////////////////////

var updateSched = later.parse.recur().every(10).minute();
var reportUpdate = later.setInterval(function(){

  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    authorize(JSON.parse(content), updateReports);
  });


  //Update the reports when changes are seen
  function updateReports(auth) {
    var sheets = google.sheets('v4');
    
    //unconfirmed shifts
    Visit.find({status:'reported'}, function(err,visits){
      var checkValues = [];
      var arr1Lenght = 1;

      visits.forEach(function(visit,index,arr){
        var checkRow = [];
       
        var stringDate = moment(visit['date']).format("MMM Do YY");
        var stringStart = moment(visit['startTime']).format('h:mm:ss a');
        var stringEnd = moment(visit['endTime']).format('h:mm:ss a');
        var stringClockIn = '';
        var stringClockOut = '';
        if (visit['clockInTime'] == undefined){
          stringClockIn = 'N/A'
        } else {
          stringClockIn = moment(visit['clockInTime']).format('h:mm:ss a');
        }
        if (visit['clockOutTime'] == undefined){
          stringClockOut = 'N/A'
        }else {
          stringClockOut = moment(visit['clockOutTime']).format('h:mm:ss a');
        }
        
        
        checkRow.push(visit['caregiverName'], stringClockIn,stringClockOut,visit['clientName'],stringStart,stringEnd,visit.duration,stringDate, visit['visitId']);

        checkValues.push(checkRow);
      })
       arr1Lenght += checkValues.length + 6


       sheets.spreadsheets.values.get({
          auth: auth,
          spreadsheetId:  process.env.SPREADSHEET,
          range: 'Unconfirmed Shifts!A6:I'+arr1Lenght,
        }, function(err, response) {
          if (err) {
            console.log('The API returned an error: ' + err);
            return;
          }
       
          Array.prototype.isMatch = function ( array ) {
            return this.toString() == array.toString();
          };
          console.log('Consolidating shift info');
          if (response.values == undefined){
            console.log('no values found');
          }
          else if(response.values.length == 0){
            console.log('page is empty')
          }
          else if(!response.values.isMatch(checkValues)){
            console.log('updating visit information');
            for (var x = 0; x < checkValues.length; x++) {

              for (var y= 0; y < checkValues[0].length; y++) {

                if(response.values[x][y] != checkValues[x][y]){
                  var query = {};
                  query['visitId'] = checkValues[x][8];
                  var updateX = x;

                  Visit.findOne(query,function(err,visit){
                    if (visit == null) return;
                    console.log('visit found');

                      // Employee name	Time in	Time out	Client ID	Scheduled in	Scheduled out	Varience	Date	Visit ID

                    var stringStart = moment(response.values[updateX][5],'h:mm:ss a');
                    var stringEnd = moment(response.values[updateX][6],'h:mm:ss a');

                    visit.visitId = response.values[updateX][8]
                    visit.caregiverName =  response.values[updateX][0]
                    visit.startTime = stringStart;
                    visit.endTime = stringEnd;
              
                    console.log('updating');
                    visit.save();

                  })
                }

              }
            }
          }

        });

     
    })



    

    //all shifts

    Visit.find({}, function(err,visits){
      var checkValues = [];
      var arr1Lenght = 1;

      visits.forEach(function(visit,index,arr){
        var checkRow = [];
       
        var stringDate = moment(visit['date']).format("MMM Do YY");
        var stringStart = moment(visit['startTime']).format('h:mm:ss a');
        var stringEnd = moment(visit['endTime']).format('h:mm:ss a');
        var stringClockIn = '';
        var stringClockOut = '';
        if (visit['clockInTime'] == undefined){
          stringClockIn = 'N/A'
        } else {
          stringClockIn = moment(visit['clockInTime']).format('h:mm:ss a');
        }
        if (visit['clockOutTime'] == undefined){
          stringClockOut = 'N/A'
        }else {
          stringClockOut = moment(visit['clockOutTime']).format('h:mm:ss a');
        }
        
        
        checkRow.push(visit['caregiverName'], stringClockIn,stringClockOut,visit['clientName'],stringStart,stringEnd,visit.duration,stringDate, visit['visitId']);

        checkValues.push(checkRow);
      })
       arr1Lenght += checkValues.length + 6;


       sheets.spreadsheets.values.get({
          auth: auth,
          spreadsheetId:  process.env.SPREADSHEET,
          range: 'Scheduled Shifts Today!A6:I'+arr1Lenght,
        }, function(err, response) {
          if (err) {
            console.log('The API returned an error: ' + err);
            return;
          }

          Array.prototype.isMatch = function ( array ) {
            return this.toString() == array.toString();
          };
          console.log('Consolidating all shift info');
          if (response.values == undefined){
            console.log('no values found');
          }
          else if(response.values.length == 0){
            console.log('page is empty')
          }
          else if(!response.values.isMatch(checkValues)){
            console.log('updating visit information');
            for (var x = 0; x < checkValues.length; x++) {

              for (var y= 0; y < checkValues[0].length; y++) {
                if(response.values[x][y] != checkValues[x][y]){
                  var query = {};
                  query['visitId'] = checkValues[x][8];
                  var updateX = x;

                  Visit.findOne(query,function(err,visit){
                    if (visit == null) return;
                    console.log('visit found');
                    console.log(visit);
                    //var keyList = ['date','visitId','caregiverName','clockInTime','clockOutTime','clientName','startTime','endTime'];

                    var stringStart = moment(response.values[updateX][5],'h:mm:ss a');
                    var stringEnd = moment(response.values[updateX][6],'h:mm:ss a');

                    visit.visitId = response.values[updateX][8]
                    visit.caregiverName =  response.values[updateX][0]
                    visit.startTime = stringStart;
                    visit.endTime = stringEnd;
              
                    console.log('updating');
                    visit.save();

                  })
                }
              }
            }
          }

        });

      
    })

  }

},updateSched);

module.exports = app;


// ADD DAY NUMBER TO THE SCHEDULE SO PUT BOTH DAYS ON IT
//Uncomment messaging
// remove comments