//routes/voice.js

var express = require('express');
var router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;
var Visit= require('./../models/visit');


// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
router.post('/', function(req,res) {

  const twiml = new VoiceResponse();
  //twiml.say({ voice: 'alice' }, 'Welcome to the Peachy service! Stay in line to receive the care plan for this visit');

/** helper function to set up a <Gather> */
  function gather() {
    const gatherNode = twiml.gather({ numDigits: 7, timeout: 15});
    gatherNode.say({ voice: 'alice' }, 'Welcome to the Peachy service! Please press the visit id');

    // If the user doesn't enter input, loop
    twiml.redirect('/voice');
  }

    console.log(req);
    var today = new Date();
    console.log(today.toDateString() == 'Mon Jan 15 2018');

  // If the user entered digits, process their request
  if (req.body.Digits.length == 7) {
    // var today = new Date();
    // console.log(today.toDateString())
    // var idString = today.toDateString();
    // idString = idString.replace(/\s+/g, '');
    // var idedString = idString + req.body.Caller;

    // Visit.findOne({'visitid':idedString, 'client':req.body.Digits}, function(err, visit){
    //   if(err) return handleError(err);

    //   console.log(visit);
    // })
    console.log(req.body.Digits);
  } else {
    // If no input was sent, use the <Gather> verb to collect user input
    gather();
  }

  console.log('here')
  console.log(req.body.Digits);

  // Render the response as XML in reply to the webhook request
  res.type('text/xml');
  res.send(twiml.toString());

});

module.exports = router;
