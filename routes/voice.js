var express = require('express');
var router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.get('/', function(req,res,next){
    console.log('works');
})

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
router.post('/', function(req,res,next) {

  const twiml = new VoiceResponse();
  //twiml.say({ voice: 'alice' }, 'Welcome to the Peachy service! Stay in line to receive the care plan for this visit');

   // Use the <Gather> verb to collect user input
  const gather = twiml.gather({numDigits: 4});
  gather.say('Please press iysit id');
  console.log(gather)

  // If the user doesn't enter input, loop
  twiml.redirect('/voice');

  // Render the response as XML in reply to the webhook request
  res.type('text/xml');
  res.send(twiml.toString());

});

module.exports = router;
