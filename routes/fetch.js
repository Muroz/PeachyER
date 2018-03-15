//routes/fetch.js

var express = require("express");
var router = express.Router();
var Client = require("./../models/client");
var Caregiver = require("./../models/caregiver");
var Activity = require("./../models/recentActivity");
var Visit = require("./../models/visit");
var moment = require('moment-timezone');

// Axios HTTP requests to fetch data from the database
router.post("/clients", function(req, res) {
  Client.find({}, function(err, clients) {
    res.json(clients);
  });
});

router.post("/staff", function(req, res) {
  Caregiver.find({}, function(err, staff) {
    res.json(staff);
  });
});

router.post("/visit", function(req, res) {
  Visit.find({}, function(err, visits) {
    res.json(visits);
  });
});

router.post("/getUnconfirmed", function(req, res){
    //unconfirmed shifts
    Visit.find({$or:[{status:'Unconfirmed'},{status:'Late'},{status:'Notified Caregiver'},{status:'Notified Manager'},{status:'Overtime'}]}, function(err,visits){
      if(err){
        throw err;
      }
      res.json(visits);
    })
})

router.post("/getConfirmed", function(req, res){
  //confirmed shifts
  Visit.find({$and:[
            {$or:[{status:'Completed'},{status:'In process'}]}, {'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}
          ]}, function(err,visits){
    if(err){
      throw err;
    }
    res.json(visits);
  })
})


router.post("/getAllShifts", function(req, res){
  //all shifts
  Visit.find({'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}, function(err,visits){
    if(err){
      throw err;
    }
    res.json(visits);
  })
})

router.post("/updateVisit", function(req, res) {
  console.log('updated visit')
  console.log(req.body);

  Visit.findOne({ _id: req.body._id }, function(err,visit){
    console.log('visit to be updated')
    console.log(visit);
    console.log(req.body);
    visit.clockInTime = req.body.clockInTime;
    visit.clockOutTime = req.body.clockOutTime;
    visit.caregiverName = req.body.caregiverName;
    visit.clientName = req.body.clientName;
    visit.scheduledDuration = req.body.scheduledDuration;
    visit.startTime = req.body.startTime;
    visit.endTime =  req.body.endTime;
    visit.status = req.body.status;
    visit.save();
    res.json(req.body);

  });
  // Visit.update({ _id:req.body._id}, req.body, function(err, numAffected){
  //   console.log(numAffected);
  //   console.log(err)
  //   res.json(req.body);
  // })
});


router.post("/activity", function(req, res) {
  Activity.find({}, function(err, activities) {
    res.json(activities);
  });
});

router.post("/addStaff", function(req, res) {
  var caregiver = req.body;
  Caregiver.create(caregiver, function(err, staff) {
    if (err) {
      throw err;
    }
    res.json(staff);
  });
});

router.post("/addClient", function(req, res) {
  var client = req.body;
  Client.create(client, function(err, clients) {
    if (err) {
      throw err;
    }
    res.json(clients);
  });
});



//todo
    //all shifts

    //Visit.find({'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}, function(err,visits){


        //unconfirmed shifts
        //Visit.find({status:'Unconfirmed'}, function(err,visits){



          // Visit.find({$and:[
          //   {$or:[{status:'Completed'},{status:'In process'}]}, {'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}
          // ]}, function(err,visits){
module.exports = router;
