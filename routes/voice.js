//routes/voice.js

var express = require("express");
var router = express.Router();
const VoiceResponse = require("twilio").twiml.VoiceResponse;
var Caregiver = require("./../models/caregiver");
var Client = require("./../models/client");
var TestVisit = require('./../models/testerVisit');

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
    twiml.say('Sorry, we could not find a visit with the number given, please check your input');
    twiml.redirect('/voice');
  }

  function communicate(sentence){
    twiml.say(sentence);
    // Render the response as XML in reply to the webhook request
    res.type('text/xml');
    res.send(twiml.toString());
  }

  function checker(sentence){
    twiml.say(sentence);

    //twiml.redirect('/voice');
    // Render the response as XML in reply to the webhook request
    res.type('text/xml');
    res.send(twiml.toString());

  }


  // If the user entered digits, process their request
  if (req.body.Digits) {
  
    if(req.body.Digits.length >= 4){
      var input;
      if (req.body.Digits.length == 5){
        input = req.body.Digits.slice(0,-1);
      } else {
        input = req.body.Digits
      }
      TestVisit.find({visitId: req.body.From+input, status:'In process'}, function(err, visitList){
        if(err) return err;
        if(visitList.length == 0) {
        
          //reply to the staff
          communicate('You have just clocked in!');

          Client.find({}, function(err,clients){
            // clients.forEach
            var phoneNumber = req.body.From;
            var filteredClients = [];
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].phones.indexOf(phoneNumber) >= 0) {
                  filteredClients.push(clients[i]);
                }
            }

            //In case that no client can be found with the given
            if(filteredClients.length == 0){
              var unkownClient = {name:req.body.From}
              filteredClients.push(unkownClient);
            }
  

            Caregiver.findOne({employeeId:input}, function(err, carer){
              var carerName = input;
              if (carer != null){
                carerName = carer.name
              }
              filteredClients.forEach(function(client){
                TestVisit.create({
                  visitId:req.body.From+input,
                  caregiverName: carerName,
                  clientName:client.name,
                  status: 'In process',
                  clockInTime: new moment(),
                  date:new moment(),
                  company:'Coombs',
                  timezone: 'Canada',
                  payPeriod: new moment().week()
                }) 
              })
            })
          })


        } else {
          communicate('You have just clocked out!')
          visitList.forEach(function(visit){
            var endTime = new moment().tz('America/St_Johns');
            visit.clockOutTime = endTime;
            visit.duration = (moment(visit.clockOutTime).diff(moment(visit.clockInTime),'hours',true));
            visit.status = 'Completed';
            visit.save()
            Client.findOne({name:visit.clientName}, function(err,client){
              if(err) return err;
              if(client!=null){
                client.billedHours += parseFloat(visit.duration);
                client.billedVisits.push(visit);
                client.save();
              }
              Caregiver.findOne({name:visit.caregiverName}, function(err,carer){
                if (err) return err;
                if(carer!=null) {
                  carer.payingHours += parseFloat(visit.duration);
                  carer.billedVisits.push(visit);
                  carer.visits.push(visit);

                  carer.save()
                };
              });
            });
          })
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

module.exports = router;










