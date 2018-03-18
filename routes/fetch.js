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
  Client.find({}).sort({name:1}).exec(function(err,clients){
    if(err){
      throw err;
    }
    res.json(clients);
  })
});

router.post("/staff", function(req, res) {
  Caregiver.find({}).sort({name:1}).exec(function(err,staff){
    if(err){
      throw err;
    }
    res.json(staff);
  })
});

router.post("/visit", function(req, res) {
  Visit.find({}, function(err, visits) {
    res.json(visits);
  });
});

router.post("/getUnconfirmed", function(req, res){
    //unconfirmed shifts
    Visit.find({$or:[{status:'Unconfirmed'},{status:'Late'},{status:'Notified Caregiver'},{status:'Notified Manager'},{status:'Overtime'}]}).sort({startTime:1}).exec(function(err,visits){
      if(err){
        throw err;
      }
      res.json(visits);
    })
})

router.post("/getConfirmed", function(req, res){
  //confirmed shifts
  Visit.find({$and:[
            {status:'In process'}, {'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}
          ]}).sort({startTime:1}).exec(function(err,visits){
            if(err){
              throw err;
            }
            res.json(visits);
          });
})

router.post("/getLate", function(req, res){
  //confirmed shifts
  Visit.find({$and:[
    {$or:[{status:'Late'},{status:'Notified Caregiver'},{status:'Notified Manager'}]}, {'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}
          ]}).sort({startTime:1}).exec(function(err,visits){
            if(err){
              throw err;
            }
            res.json(visits);
          })
});

router.post("/getOvertime", function(req, res){
  //confirmed shifts
  Visit.find({$and:[
            {status:'Overtime'}, {'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}
          ]}).sort({startTime:1}).exec(function(err,visits){
            if(err){
              throw err;
            }
            res.json(visits);
          });
})


router.post("/getAllShifts", function(req, res){
  //all shifts
  Visit.find({'date':{"$gte": new moment().startOf('day').tz('America/St_Johns'), "$lt": new moment().endOf('day').tz('America/St_Johns')}}).sort({startTime:1}).exec(function(err,visits){
    if(err){
      throw err;
    }
    res.json(visits);
  })
})


router.post("/updateVisit", function(req, res) {

  Visit.findOne({ _id: req.body._id }, function(err,visit){

    visit.clockInTime = req.body.clockInTime;
    visit.clockOutTime = req.body.clockOutTime;
    visit.caregiverName = req.body.caregiverName;
    visit.clientName = req.body.clientName;
    visit.scheduledDuration = req.body.scheduledDuration;
    visit.startTime = req.body.startTime;
    visit.endTime =  req.body.endTime;
    visit.status = req.body.status;
 
    visit.statusLog.push(visit.status);


    visit.duration = 0;
    visit.active = false;
    if (visit.status == 'Completed'){
      Client.findOne({name:visit.clientName}, function(err,client){
        if(err) return err;
        if(client==null) return 'No client found';

        if(visit.clockInTime != null && visit.clockOutTime != null){
          visit.duration = Math.round(moment(visit.clockOutTime).diff(moment(visit.clockInTime),'hours',true));
        }
        client.billedHours += parseFloat(visit.scheduledDuration);
        client.billedVisits.push(visit);
        Caregiver.findOne({name:visit.caregiverName}, function(err,carer){
          if (err) return err;
          if(carer==null) {
            //checker('No carer found with the given ID');
            return 'No caregivers found';
          };

          carer.payingHours += parseFloat(visit.scheduledDuration);
          carer.billedVisits.push(visit);
          carer.visits.push(visit);

          carer.save();
          client.save();

          visit.save();
          res.json(req.body);
        });
      });
    } else {
      visit.save();
      res.json(req.body);
    }
          


    /*

          var endTime = new moment().tz('America/St_Johns');
          var localClockIn = new moment(visit.clockInTime).tz('America/St_Johns')
          //duration in minutes
          var duration = Math.round(endTime.diff(localClockIn,'hours',true));
          
          visit.clockOutTime = endTime;
          visit.duration = duration;
          visit.active = false;
          if (visit.status != 'Unconfirmed'){
            visit.status = 'Completed ';
          }
          Client.findOne({name:visit.clientName}, function(err,client){
            if(err) return err;
            if(client==null) return 'No client found';
            client.billedHours += visit.scheduledDuration;
            client.billedVisits.push(visit);
            //client.schedule[moment().format('dddd')][2]
            Caregiver.findOne({name:visit.caregiverName}, function(err,carer){
              if (err) return err;
              if(carer==null) {
                //checker('No carer found with the given ID');
                return 'No caregivers found';
              };
    
              carer.payingHours += visit.scheduledDuration;
              carer.billedVisits.push(visit);
              carer.visits.push(visit);
    
              carer.save();
    
              //client.visitsBy[carer.name].push(visit);
              client.save();
            });




    */

  });
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
