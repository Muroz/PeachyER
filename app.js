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

//var later = require('later');


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

//var csv = require("fast-csv");

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

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//read spreadsheet data
// fs.createReadStream(path.join(__dirname,'public',"./staffInfo.csv"))
//     .pipe(csv())
//     .on("data", function(data){
//         Caregiver.create({
//           name: data[1]+" "+data[2],
//           employeeId: data[4],
//           phoneNumber:'+1709'+data[3],
//           company:'Coombs',
//           visits:[],
//           billedVisits:[],
//           payingHours:0,
//           missedVisits:0,
//           lateVisits:0,
//           missedClockInsOuts:0
//         })
//         // ClientModel.create({
//         //   name: data[1]+" "+data[2],
//         //   id: data[3],
//         //   phoneNumber:'+1709'+data[3],
//         //   company:'Coombs',
//         //   billedHours:0,
//         //   billedVisits:[],
//         //   visitsBy:[]
//         // })
        
//     })
//     .on("end", function(){
//         console.log("done");
// });

// Caregiver.create({
//   name: 'Diego',
//   employeeId: '0001',
//   phoneNumber:'+17097692872'
// })
// ClientModel.create({
//   name: 'Dieg',
//   id: '7692872',
//   phoneNumber:'+17097692872',
//   company:'Josecare'
// })


// fs.createReadStream(path.join(__dirname,'public',"./visits.csv"))
//     .pipe(csv())
//     .on("data", function(data){

//       ClientModel.findOne({id:data[1]}, function(err, client){
//         console.log(client.name);
//         Caregiver.findOne({employeeId:data[2]}, function(err, carer){
//           if(carer == null){
//             console.log('didnt find it', data[2]);
//           }
//           var startString = ''
//           var endString = ''
//           if (data[3].length == 3){
//             startString = data[3].slice(0,1)+':00'+data[3].slice(1,3);
//           } else if (data[3].length == 4){
//             startString = data[3].slice(0,2)+':00'+data[3].slice(2,4);
//           } else {
//             startString = data[3]
//           }

//           if (data[4].length == 3){
//             endString = data[4].slice(0,1)+':00'+data[4].slice(1,3);
//           }else if (data[4].length == 4){
//             endString = data[4].slice(0,2)+':00'+data[4].slice(2,4);
//           } else {
//             endString = data[4]
//           }

//           //moment().format('dddd')
//           var date = moment(data[5],'YYYY-MM-DD').toDate();

//           var counter = 1;
//           for (var i = 0; i < client.schedule[moment(date).format('dddd')].length; i++) {
//             var visit = client.schedule[moment(date).format('dddd')][i]
      
//             if (visit.caregiverName == carer.name && visit.date == moment(date).format('YYYY-MM-DD')){
//               counter += 1;
//             }
//           }
//           var visit = {
//             start : startString,
//             end : endString,
//             caregiverName: carer.name,
//             shiftNumber: counter,
//             date:moment(date).format('YYYY-MM-DD')
//           }
//           client.schedule[moment(date).format('dddd')].push(visit);
//           client.save();
//         })
//       })
//     })
//     .on("end", function(){
//         console.log("done");
// });


// ClientModel.find({}).remove().exec();
// Caregiver.find({}).remove().exec();




//change schedule info to day number 

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



// TestVisit.find({}).sort({clientName:1}).exec(function(err,visits){
//   visits.forEach(function(visit){
    // visit.payPeriod = moment(visit.date).week();
    // visit.save();
    //if (visit.status != "Unconfirmed"){
      // if(visit.clockOutTime != null && visit.clockInTime != null){
      //   visit.duration = (moment(visit.clockOutTime).diff(moment(visit.clockInTime),'hours',true));
      //   visit.save();
      // }

    // if (visit.payPeriod == 18 || visit.payPeriod == 19){
    //   console.log(JSON.stringify({ "Client name": visit.clientName, "Shift date": moment(visit.date).format('MM-DD-YYYY'), "Clocked in": moment(visit.clockInTime).format("h:mm a"),"Clocked out": moment(visit.clockOutTime).format("h:mm a"),"Employee":visit.caregiverName,"Actual hours worked":visit.duration}))
    //   console.log(',')
    // }
//     } else {
//       console.log(JSON.stringify({ "Client name": visit.clientName, "Shift date": moment(visit.date).format('MM-DD-YYYY'), "Clocked in": moment(visit.clockInTime).format("h:mm a"),"Clocked out": moment(visit.clockOutTime).format("h:mm a"),"Employee":visit.caregiverName,"Actual hours worked":visit.duration}))
//     }
//   })

// });

// console.log('This pay period');
// console.log(moment().week())
// TestVisit.find({}).remove().exec();

// Visit.find({},function(err,visits){

//   visits.forEach(function(visit){

//     var period =  new moment(visit.date).week()
//     var status = visit.status
//     if (visit.clockInTime != null && visit.clockOutTime != null){
//       status = 'Completed'
//     }
//     else if (visit.clockOutTime == null){
//       if(moment(visit.date) == new moment()){
//         status = 'In process'
//       }
//       else if( period==18 || period==19 ){
//         status = 'Unconfirmed'
//       }
//       else{
//         status = 'Discarded'
//       }
//     }
//     TestVisit.create({
//       visitId:visit.visitId,
//       caregiverName: visit.caregiverName,
//       clientName:visit.clientName,
//       status: status,
//       clockInTime: visit.clockInTime,
//       clockOutTime: visit.clockOutTime,
//       date:visit.date,
//       company:'Coombs',
//       timezone: 'Canada',
//       payPeriod: new moment().week()
//     }) 
//   })
// });





//scheduled actions



/////////////////////////////////////////////////////
/////////// Late runs every minutes
////////////////////////////////////////////////////

// var visitSched = later.parse.recur().every(1).minute();
// var t = later.setInterval(function() {
//     console.log('Checking for late people');
//     Visit.find({}, function(err,visits){

//       if (visits == undefined){
//         return;
//       }
//       visits.forEach(function(visit,index,arr){
//         var currentTime = new moment().tz('America/St_Johns');
//         var localStart = new moment(visit.startTime).tz('America/St_Johns');
//         var localEnd = new moment(visit.endTime).tz('America/St_Johns');

//         //search for company specifics here
//         if(visit.status == 'Scheduled'){

//           if (currentTime.diff(localStart,'minutes',true)>1){
//             if(currentTime.diff(localEnd)>1){
//               visit.status = 'Unconfirmed'
//               visit.statusLog.push('Unconfirmed');
//             } else {
//               visit.status = 'Late';
//               visit.statusLog.push('late');
//             }
//             visit.save();
//           }

//         }

//         else if(visit.status == 'In process'){
          
//           if(currentTime.diff(localEnd,'minutes',true)>5){
//             visit.status = 'Overtime';
//             visit.statusLog.push('Overtime')
//           }
//         }
//         //|| visit.status == 'Overtime'
//         else if(visit.status == 'Late'){
//           console.log(visit.status,'messaging');
//           // visit.caregiverMessage = { state:'sent', sentTime: new moment().tz('America/St_Johns'), reply:''}
//           if( currentTime.diff(localStart,'minutes',true)>5){
//             visit.status = 'Notified Caregiver';
//             visit.statusLog.push('Notified Caregiver');
//           }
//           //var visitState = visit.active?'out':'in'
//           // var bodyString = "Hi from Peachy. Reminder: you haven't clocked in/out for your scheduled shift. There is no need to reply to this message. Thanks!";
//           // clientTwilio.messages.create({
//           //   from: process.env.TWILIO_PHONE,
//           //   to: visit.replyNumberC,
//           //   body: bodyString
//           // }).then((messsage) => console.log(message.sid));
//         }

//         //create overtime notified
        
//         else if (visit.status == 'Notified Caregiver'){
//           console.log(currentTime.diff(localStart,'minutes',true));
//           if( currentTime.diff(localStart,'minutes',true)>15){
//           //if (currentTime.diff(visit.caregiverMessage.sentTime,'minutes',true)>10){
//             //visit.managerMessage = { state:'sent', sentTime: new moment().tz('America/St_Johns'), reply:''}
//             visit.status = 'Notified Manager';
//             visit.statusLog.push('Notified Manager');
//             //var visitState = visit.active?'out':'in'
//             // var bodyString = "Hi Tracy, this is Peachy letting you know that "+visit.caregiverName+" is late for their shift. There is no need to reply to this message. Thanks!";

//             // clientTwilio.messages.create({
//             //   from: process.env.TWILIO_PHONE,
//             //   to: visit.replyNumberM,
//             //   body: bodyString
//             // }).then((messsage) => console.log(message.sid));
          
//           }
//         } 
        
//         else if (visit.status == 'Notified Manager'){
//           var currentTime = new moment().tz('America/St_Johns');
//           if( currentTime.diff(localStart,'minutes',true)>30){
//           //if (currentTime.diff(visit.managerMessage.sentTime,'minutes',true)>10){
//             visit.status = 'Unconfirmed';
//             visit.statusLog.push('Unconfirmed');
//           }

//         }
//         visit.save();
//       },this);
//     })
//   }, visitSched);

///////////////////////////////////////////////////
///////// Schedules runs at 1am every day
//////////////////////////////////////////////////

// var lateSched = later.parse.recur().on('9:45:00').time();
// var late = later.setInterval(function(){
//   console.log('Creating schedules');
  // ClientModel.find({},function(err,clients){

  //   clients.forEach(function(client,index,arr){

  //     client.schedule['Saturday'].forEach(function(visit,index,arr){

  //       if(visit.date == '2018-04-14'){
  //         console.log(visit);

  //         var start = moment(visit.start,'hh:mma').toDate();
  //         start = moment(start).add(1,'day');
  //         var end = moment(visit.end,'hh:mma').toDate();
  //         end = moment(end).add(1,'day')

  //         var scheduledDuration = moment(end).diff(moment(start),'hours',true);

  //         Caregiver.findOne({name:visit.caregiverName}, function(err,carer){
  //           var cid = ''
  //           if(carer==null) {console.log(visit.caregiverName, 'is NULL');
  //                 return    
  //           }
  //           else{
  //             cid = carer.employeeId
  //           }
  //           console.log(carer.name);
  //           var vid = ''
  //           if(visit.shiftNumber == 1){
  //             vid = client.phoneNumber+cid
  //           } else {
  //             vid = client.phoneNumber+cid+visit.shiftNumber
  //           }
  //           Visit.create({
  //             visitId:vid,
  //             caregiverName: carer.name,
  //             clientName:client.name,
  //             date:moment(moment(visit.date+' 9:00 am','YYYY-MM-DD h:mm a').toDate()),
  //             startTime: start,
  //             endTime:end,
  //             scheduledDuration:scheduledDuration,
  //             replyNumberC:carer.phoneNumber,
  //             company:client.company
  //           });
    
            
  //           console.log('visit created');
  //         });
  //       }


       

  //     }, this);



  //   },this);
  //  })
// }, lateSched);











/*









/////////////////////////////////////////////////////
/////////// Real time updates runs every minute
////////////////////////////////////////////////////

var realTimeSched = later.parse.recur().every(1).minute();
var realTime = later.setInterval(function(){

  console.log('Updating real time');

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

    Visit.find({$and:[
      {$or:[{status:'Completed'},{status:'In process'}]}, {'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}
    ]}, function(err,visits){
    //Visit.find({$or:[{status:'Completed'},{status:'In process'}]}, function(err,visits){
      var checkValues = [];
     
      visits.forEach(function(visit,index,arr){
        var checkRow = [];
        var stringStart = moment(visit['startTime']).tz('America/St_Johns').format('h:mm a');
        var stringEnd = moment(visit['endTime']).tz('America/St_Johns').format('h:mm a');
        var stringClockIn = '';
        if (visit['clockInTime'] == undefined){
          stringClockIn = 'N/A'
        } else {
          stringClockIn = moment(visit['clockInTime']).tz('America/St_Johns').format('h:mm a');
        }
    

        //checkRow.push(visit['caregiverName'],visit['clientName'],stringClockIn,stringStart,stringEnd,stringDate, visit['visitId']);
        checkRow.push(visit['caregiverName'],visit['clientName'],stringClockIn,stringStart,stringEnd);
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
        range: "Who's Working!A6:G",
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
/////////// Unconfirmed and all shifts Reports runs every 5 minutes 
/////////////////////////////////////////////////////

var reportSched = later.parse.recur().every(1).minute();
var reportCreation = later.setInterval(function(){

  console.log('Updating reports');

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
    Visit.find({$or:[{status:'Unconfirmed'},{status:'Late'},{status:'Notified Caregiver'},{status:'Notified Manager'}]}, function(err,visits){
      var checkValues = [];

      visits.forEach(function(visit,index,arr){
        var checkRow = [];

        var stringDate = moment(visit['date']).tz('America/St_Johns').format("MMM D YY");
        var stringStart = moment(visit['startTime']).tz('America/St_Johns').format('h:mm a');
        var stringEnd = moment(visit['endTime']).tz('America/St_Johns').format('h:mm a');
        var stringClockIn = '';
        var stringClockOut = '';
        if (visit['clockInTime'] == undefined){
          stringClockIn = 'N/A'
        } else {
          stringClockIn = moment(visit['clockInTime']).tz('America/St_Johns').format('h:mm a');
        }
        if (visit['clockOutTime'] == undefined){
          stringClockOut = 'N/A'
        }else {
          stringClockOut = moment(visit['clockOutTime']).tz('America/St_Johns').format('h:mm a');
        }
        

											
        checkRow.push(visit['caregiverName'], visit['clientName'],stringClockIn,stringClockOut,visit.scheduledDuration,stringStart,stringEnd,visit.duration,visit.status,visit.notes,stringDate, visit['visitId']);

        checkValues.push(checkRow);
      })
      
      var infoLenght = checkValues.length + 6;
      
      sheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId: process.env.SPREADSHEET,
        range: 'Unconfirmed Shifts!A'+infoLenght+':L',
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
        range: 'Unconfirmed Shifts!A6:L',
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

     
    });



    //all shifts
   
    Visit.find({'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}, function(err,visits){
      var checkValues = [];

      visits.forEach(function(visit,index,arr){
        var checkRow = [];

        var stringDate = moment(visit['date']).tz('America/St_Johns').format("MMM D YY");
        var stringStart = moment(visit['startTime']).tz('America/St_Johns').format('h:mm a');
        var stringEnd = moment(visit['endTime']).tz('America/St_Johns').format('h:mm a');
        var stringClockIn = '';
        var stringClockOut = '';
        if (visit['clockInTime'] == undefined){
          stringClockIn = 'N/A'
        } else {
          stringClockIn = moment(visit['clockInTime']).tz('America/St_Johns').format('h:mm a');
        }
        if (visit['clockOutTime'] == undefined){
          stringClockOut = 'N/A'
        }else {
          stringClockOut = moment(visit['clockOutTime']).tz('America/St_Johns').format('h:mm a');
        }
        
        checkRow.push(visit['caregiverName'],visit['clientName'],stringStart,stringEnd,visit.scheduledDuration,stringClockIn,stringClockOut,visit.status,'',stringDate, visit['visitId']);

        checkValues.push(checkRow);
      })

      var infoLenght = checkValues.length + 6;
      
      sheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId:  process.env.SPREADSHEET,
        range: 'Scheduled Shifts Today!A'+infoLenght+':K',
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
        range: 'Scheduled Shifts Today!A6:K',
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
















//unconfirmed
var unconCaregiver = 0;
var unconClient = 1;
var unconClockIn = 2;
var unconClockOut = 3;
var unconSchedDuration = 4;
var unconStartTime = 5;
var unconEndTime = 6;
var unconDate = 7;
var unconVID = 8;
var unconDuration = 9;
var unconStatus = 10;



//all shifts
var allSCaregiver = 0;
var allSClient = 1;
var allSStartTime = 2;
var allSEndTime = 3;
var allSSchedDuration = 4;
var allSClockIn= 5;
var allSClockOut = 6;
var allSStatus = 7;
var allSSave = 8
var allSDate = 9;
var allSVID = 10;


/////////////////////////////////////////////////////
/////////// Report update runs every minute
////////////////////////////////////////////////////

var updateSched = later.parse.recur().every(1).minute();
var reportUpdate = later.setInterval(function(){

  console.log('Updating database');
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
    Visit.find({status:'Unconfirmed'}, function(err,visits){
      var checkValues = [];
      var arr1Lenght = 1;

      visits.forEach(function(visit,index,arr){
        var checkRow = [];
       
        var stringDate = moment(visit['date']).tz('America/St_Johns').format("MMM D YY");
        var stringStart = moment(visit['startTime']).tz('America/St_Johns').format('h:mm a');
        var stringEnd = moment(visit['endTime']).tz('America/St_Johns').format('h:mm a');
        var stringClockIn = '';
        var stringClockOut = '';
        if (visit['clockInTime'] == undefined){
          stringClockIn = 'N/A'
        } else {
          stringClockIn = moment(visit['clockInTime']).tz('America/St_Johns').format('h:mm a');
        }
        if (visit['clockOutTime'] == undefined){
          stringClockOut = 'N/A'
        }else {
          stringClockOut = moment(visit['clockOutTime']).tz('America/St_Johns').format('h:mm a');
        }
        
        checkRow.push(visit['caregiverName'], visit['clientName'],stringClockIn,stringClockOut,visit.scheduledDuration,stringStart,stringEnd,visit.duration,visit.status,visit.notes,stringDate, visit['visitId']);

        checkValues.push(checkRow);
      })
       arr1Lenght += checkValues.length + 6


       sheets.spreadsheets.values.get({
          auth: auth,
          spreadsheetId:  process.env.SPREADSHEET,
          range: 'Unconfirmed Shifts!A6:L'+arr1Lenght,
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
            console.log(response);
          }
          else if(response.values.length == 0){
            console.log('page is empty')
            console.log(response);
          }
          else if(!response.values.isMatch(checkValues)){
            console.log('updating visit information');
       
            for (var x = 0; x < checkValues.length; x++) {

              for (var y= 0; y < checkValues[0].length; y++) {

                if(response.values[x][y] != checkValues[x][y]){
                  if(response.values[x][unconStatus] != 'Confirmed'){
                    return;
                  }
                  else {
                    var query = {};
                    query['visitId'] = checkValues[x][unconVID];
                    var updateX = x;

                    Visit.findOne(query,function(err,visit){
                      if (visit == null) return;
                      console.log('visit found');

                        // Employee name	Time in	Time out	Client ID	Scheduled in	Scheduled out	Varience	Date	Visit ID

                      var stringStart = moment(response.values[updateX][unconStartTime],'h:mm a').tz('America/St_Johns');
                      var stringEnd = moment(response.values[updateX][unconEndTime],'h:mm a').tz('America/St_Johns');

                      //visit.visitId = response.values[updateX][unconVID]
                      visit.caregiverName =  response.values[updateX][unconCaregiver]
                      visit.status = 'Completed';
                      visit.startTime = stringStart;
                      visit.endTime = stringEnd;
                
                      console.log('updating');
                      visit.save();

                    })
                    continue;
                  }
                } 

              }
            }
          }

        });

     
    })



    

    //all shifts

    Visit.find({'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}, function(err,visits){
      var checkValues = [];
      var arr1Lenght = 1;

      visits.forEach(function(visit,index,arr){
        var checkRow = [];
       
        var stringDate = moment(visit['date']).tz('America/St_Johns').format("MMM D YY");
        var stringStart = moment(visit['startTime']).tz('America/St_Johns').format('h:mm a');
        var stringEnd = moment(visit['endTime']).tz('America/St_Johns').format('h:mm a');
        var stringClockIn = '';
        var stringClockOut = '';
        if (visit['clockInTime'] == undefined){
          stringClockIn = 'N/A'
        } else {
          stringClockIn = moment(visit['clockInTime']).tz('America/St_Johns').format('h:mm a');
        }
        if (visit['clockOutTime'] == undefined){
          stringClockOut = 'N/A'
        }else {
          stringClockOut = moment(visit['clockOutTime']).tz('America/St_Johns').format('h:mm a');
        }
        
        
        checkRow.push(visit['caregiverName'],visit['clientName'],stringStart,stringEnd,visit.scheduledDuration,stringClockIn,stringClockOut,visit.status,'',stringDate, visit['visitId']);

        checkValues.push(checkRow);
      })
       arr1Lenght += checkValues.length + 6;

       sheets.spreadsheets.values.get({
          auth: auth,
          spreadsheetId:  process.env.SPREADSHEET,
          range: 'Scheduled Shifts Today!A6:K'+arr1Lenght,
        }, function(err, response) {
          if (err) {
            console.log('The API returned an error: ' + err);
            return;
          };

          Array.prototype.isMatch = function ( array ) {
            return this.toString() == array.toString();
          };

          console.log('Consolidating all shifts info');
          if (response.values == undefined){
            console.log('no values found');
            console.log(response);
          }
          else if(response.values.length == 0){
            console.log('page is empty')
            console.log(response);
          }
          else if(!response.values.isMatch(checkValues)){
            console.log('updating visit information');
            for (var x = 0; x < checkValues.length; x++) {

              for (var y= 0; y < checkValues[0].length; y++) {
                console.log(response.values[x]);
                if(response.values[x][y] != checkValues[x][y]){
                  if(response.values[x][allSSave] =='Yes'){
                    var query = {};
                    console.log('yay');
                    query['visitId'] = checkValues[x][allSVID];
                    var updateX = x;

                    Visit.findOne(query,function(err,visit){
                      if (visit == null) return;

                      var stringStart = moment(response.values[updateX][allSStartTime],'h:mm a').tz('America/St_Johns');;
                      var stringEnd = moment(response.values[updateX][allSEndTime],'h:mm a').tz('America/St_Johns');;

                      //visit.visitId = response.values[updateX][allSVID];
                      visit.caregiverName =  response.values[updateX][allSCaregiver];
                      visit.startTime = stringStart;
                      visit.endTime = stringEnd;
                
                      console.log('updating');
                      visit.save();

                    })
                  }
                }
              }
            }
          }

        });

      
    })

  }

},updateSched);
*/
module.exports = app;


// ADD DAY NUMBER TO THE SCHEDULE SO PUT BOTH DAYS ON IT
//Uncomment messaging
// remove comments
// completed appear on all shifts, not who's working


/*
 timezone: 'Canada',
  duration: 2.958466666666667,
  status: 'Completed',
  active: false }
updating
(node:16636) UnhandledPromiseRejectionWarning: ValidationError: Visit validation failed: endTime: Cast to Date failed for value "moment.invalid(/* 2.958466667 )" at path "endTime"

at new ValidationError (/home/ec2-user/peachyER/PeachyER/node_modules/mongoose/lib/error/validation.js:28:11)
at model.Document.invalidate (/home/ec2-user/peachyER/PeachyER/node_modules/mongoose/lib/document.js:1673:32)
*/



//    checkRow.push(visit['caregiverName'], visit['clientName'],stringClockIn,stringClockOut,visit.scheduledDuration,stringStart,stringEnd,stringDate, visit['visitId'],visit.duration,visit.status);
//add note onto it and the schema
