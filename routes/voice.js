//routes/voice.js

var express = require("express");
var router = express.Router();
const VoiceResponse = require("twilio").twiml.VoiceResponse;
var Visit = require("./../models/visit");
var Caregiver = require("./../models/caregiver");
var Client = require("./../models/client");
var Activity = require("./../models/recentActivity");

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
router.post("/", function(req, res) {
  //   const twiml = new VoiceResponse();
  //   //twiml.say({ voice: 'alice' }, 'Welcome to the Peachy service! Stay in line to receive the care plan for this visit');

  // /** helper function to set up a <Gather> */
  //   function gather() {
  //     const gatherNode = twiml.gather({ numDigits: 7, timeout: 15});
  //     gatherNode.say({ voice: 'alice' }, 'Welcome to the Peachy service! Please press the visit id');

  //     // If the user doesn't enter input, loop
  //     twiml.redirect('/voice');
  //   }
  var today = new Date();

  // If the user entered digits, process their request
  // if (req.body.Digits.length == 7) {
  var today = new Date();
  var idString = today.toDateString();
  idString = idString.replace(/\s+/g, "");
  var idedString = idString + req.body.digits;
  Visit.findOne({ visitId: idedString }, function(err, visit) {
    if (err) return err;
    Caregiver.findOne({ _id: visit.staffId }, function(err, staff) {
      if (err) return err;
      Client.findOne({ _id: visit.clientId }, function(err, client) {
        if (err) return err;
        var recent = new Activity({
          timestamp: Date.now(),
          state: "late",
          client: client.name,
          employee: staff.name,
          action: "Checked in",
          region: visit.timezone
        });
        recent.save();
      });
    });
  });
  console.log(req.body.Digits);
  // } else {
  //   // If no input was sent, use the <Gather> verb to collect user input
  //   gather();
  // }

  // console.log('here')
  // console.log(req.body.Digits);

  // Render the response as XML in reply to the webhook request
  res.type("text/xml");
  //res.send(twiml.toString());
  res.send();
});

module.exports = router;
