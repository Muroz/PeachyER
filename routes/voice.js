//routes/voice.js

var express = require("express");
var router = express.Router();
const VoiceResponse = require("twilio").twiml.VoiceResponse;
var Visit = require("./../models/visit");
var Caregiver = require("./../models/caregiver");
var Client = require("./../models/client");
var Activity = require("./../models/recentActivity");

//import moment
var moment = require('moment-timezone');

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
router.post("/", function(req, res) {
  console.log('post', req.body)
  const twiml = new VoiceResponse();
  /** helper function to set up a <Gather> */
  function gather() {
    console.log('gather');
    const gatherNode = twiml.gather({ numDigits: 5, timeout:5 });
    gatherNode.say('Welcome to the peachy service, please enter your code and wait for confirmation');

    // If the user doesn't enter input, loop
    twiml.redirect('/voice');
  }

  function gatherAgain(){
    console.log('gatherAgain');
    const gatherNode = twiml.gather({ numDigits: 5, timeout:5 });
    console.log('after', req.body)
    gatherNode.say('Sorry, we could not find a visit with the given ID, please check your input');

    // If the user doesn't enter input, loop

    twiml.redirect('/voice');
  }

  function communicate(sentence){
    console.log('communicate',sentence);
    twiml.say(sentence);

    // Render the response as XML in reply to the webhook request
    res.type('text/xml');
    res.send(twiml.toString());

  }

  function checker(sentence){
    console.log('checker',sentence);
    twiml.say(sentence);

    //twiml.redirect('/voice');
    // Render the response as XML in reply to the webhook request
    res.type('text/xml');
    res.send(twiml.toString());

  }

  // If the user entered digits, process their request
  if (req.body.Digits) {
      console.log('at digits');
      //gotta change the gather functions
     if(req.body.Digits.length >= 4){
      console.log('4 or more digits');
      console.log(req.body.Digits);
      Visit.findOne({visitId: req.body.From+req.body.Digits, 'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}, function(err, visit){
        if(err) return err;
        
        if(visit==null) {
          console.log('at null visit')
          gatherAgain();
          
           // Render the response as XML in reply to the webhook request
          res.type('text/xml');
          res.send(twiml.toString());

        } 
        else if(visit.status == 'Completed' || visit.status == 'Cancelled'){
          console.log('at done visit',visit);
          checker('This visit has been completed already');
          res.type('text/xml');
          res.send(twiml.toString());
        } 
        else if (visit.active){
          console.log('at active visit', visit);
          communicate('You have just clocked out!')

          var endTime = new moment().tz('America/St_Johns');
          
          visit.clockOutTime = endTime;
          if(visit.clockInTime != null && visit.clockOutTime != null){
            visit.duration = (moment(visit.clockOutTime).diff(moment(visit.clockInTime),'hours',true));
          }
          visit.active = false;
          //if (visit.status != 'Unconfirmed'){
            visit.status = 'Completed ';
            visit.statusLog.push('Completed');
          //}
          Client.findOne({name:visit.clientName}, function(err,client){
            console.log('at client', client);
            if(err) return err;
            if(client==null) return 'No client found';
            client.billedHours += parseFloat(visit.scheduledDuration);
            client.billedVisits.push(visit);
            //client.schedule[moment().format('dddd')][2]
            Caregiver.findOne({name:visit.caregiverName}, function(err,carer){
              console.log('at caregiver', carer)
              if (err) return err;
              if(carer==null) {
                //checker('No carer found with the given ID');
                return 'No caregivers found';
              };
    
              carer.payingHours += parseFloat(visit.scheduledDuration);
              carer.billedVisits.push(visit);
              carer.visits.push(visit);
    
              carer.save();
    
              //client.visitsBy[carer.name].push(visit);
              client.save();
            });
          });
        } else {

          console.log('at clock in')
          communicate('You have just clocked in!');
          
          visit.clockInTime= new Date();
          visit.active = true;
          visit.status = 'In process';
          visit.statusLog.push('In process');
        }
        if(visit != null){
          visit.save();
        }

      })
     } 
     else {
       gather();

      // Render the response as XML in reply to the webhook request
      res.type('text/xml');
      res.send(twiml.toString());
     }
  } else {
    // If no input was sent, use the <Gather> verb to collect user input
    gather();


    // Render the response as XML in reply to the webhook request
    res.type('text/xml');
    res.send(twiml.toString());
  }


});


router.post("/message", function(req,res){
  console.log('receiving message');
  //implement handling for errors
});

module.exports = router;
