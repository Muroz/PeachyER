var express = require('express');
var router = express.Router();
var Client = require('./../models/client');
var Caregiver = require('./../models/caregiver');

router.get('/' ,function(res,req,next){
    console.log('here')
});
// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
router.post('/clients', function(req,res,next) {
    Client.find({}, function(err,users){
        console.log(users);
        res.json(users);
    })
});

router.post('/staff', function(req,res,next) {
    Caregiver.find({}, function(err,users){
        console.log(users);
        res.json(users);
    })
});

router.post('/addStaff', function(req,res,next){
    var caregiver = req.body
    Caregiver.create(caregiver, function(err,staff){
        if(err){
            throw err;
        }
        res.json(staff);
    })
})

router.post('/addClient', function(req,res,next){
    var client = req.body
    Client.create(client, function(err,clients){
        if(err){
            throw err;
        }
        res.json(clients);
    })
})
module.exports = router;
