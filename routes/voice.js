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

  const twiml = new VoiceResponse();

  /** helper function to set up a <Gather> */
  function gather() {
    const gatherNode = twiml.gather({ numDigits: 6, timeout:3 });
    gatherNode.say('Welcome to the peachy service, please enter your code and wait for confirmation');
    // If the user doesn't enter input, loop
    twiml.redirect('/voice');
  }

  function gatherAgain(){
    twiml.say('Sorry, we could not find a visit with the given ID, please check your input or re-enter your code and add an asterisk at the end to clock in regardless');
    twiml.redirect('/voice');
  }

  function communicate(sentence){
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
    // console.log('at digits', req.body.Digits.slice(-1));
    // if (req.body.Digits.slice(-1) == '*'){
    //   console.log('gonna confirm this shit')
    //   var input = req.body.Digits.slice(0, -1);
    //   Visit.create({
    //     visitId:req.body.From+input,
    //     caregiverName: input,
    //     clientName:req.body.From,
    //     clockInTime: new moment(),
    //     date:new moment(),
    //     startTime: null,
    //     endTime:null,
    //     scheduledDuration:0,
    //     replyNumberC:'Not found',
    //     status: 'Unconfirmed',
    //     company:'Coombs'
    //   });
    // }
    // else 
    if(req.body.Digits.length >= 4){
      Visit.findOne({visitId: req.body.From+req.body.Digits, 'date':{"$gte": new moment().startOf('day'), "$lt": new moment().endOf('day')}}, function(err, visit){
        if(err) return err;
        if(visit==null) {

          var input;
          if (req.body.Digits.length == 5){
            input = req.body.Digits.slice(0,-1);
          } else {
            input = req.body.Digits
          }

          Client.findOne({phoneNumber:req.body.From}, function(err,client){
            var clientName = req.body.From
            if (client != null){
              clientName = client.name
            }

            Caregiver.findOne({employeeId:input}, function(err, carer){

              var replyNumber = ''
              var carerName = req.body.Digits;
              if (carer != null){
                carerName = carer.name
                replyNumber = carer.phoneNumber
              }

              Visit.create({
                visitId:req.body.From+req.body.Digits,
                caregiverName: carerName,
                clientName:clientName,
                clockInTime: new moment(),
                date:new moment(),
                startTime: null,
                endTime:null,
                scheduledDuration:0,
                active:true,
                replyNumberC:replyNumber,
                status: 'Unconfirmed',
                statusLog: ['Unconfirmed'],
                company:'Coombs'
              });
              //gatherAgain();  

              communicate('You have just clocked in!');
              // Render the response as XML in reply to the webhook request
              // res.type('text/xml');
              // res.send(twiml.toString());

            })
          })


        } 

        else if(visit.status == 'Completed' || visit.status == 'Cancelled'){
          checker('This visit has been completed already');
          res.type('text/xml');
          res.send(twiml.toString());
        } 

        else if (visit.active){
          communicate('You have just clocked out!')
          var endTime = new moment().tz('America/St_Johns');
          visit.clockOutTime = endTime;
          if(visit.clockInTime != null && visit.clockOutTime != null){
            visit.duration = (moment(visit.clockOutTime).diff(moment(visit.clockInTime),'hours',true));
          }
          visit.active = false;
          if (visit.status != 'Unconfirmed'){
            visit.status = 'Completed';
            visit.statusLog.push('Completed');
          }
          Client.findOne({name:visit.clientName}, function(err,client){
            console.log('at client', client);
            if(err) return err;
            if(client!=null){
              client.billedHours += parseFloat(visit.scheduledDuration);
              client.billedVisits.push(visit);
              client.save();
            }
            //client.schedule[moment().format('dddd')][2]
            Caregiver.findOne({name:visit.caregiverName}, function(err,carer){
              console.log('at caregiver', carer)
              if (err) return err;
              if(carer!=null) {
                carer.payingHours += parseFloat(visit.scheduledDuration);
                carer.billedVisits.push(visit);
                carer.visits.push(visit);
                carer.save();
                //client.visitsBy[carer.name].push(visit);
                //checker('No carer found with the given ID');
              };


            });
          });

        } else {
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
