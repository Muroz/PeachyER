//routes/fetch.js

var express = require("express");
var router = express.Router();
var Client = require("./../models/client");
var Caregiver = require("./../models/caregiver");
var Activity = require("./../models/recentActivity");
var Visit = require("./../models/visit");
var moment = require('moment-timezone');
var TestVisit = require('./../models/testerVisit');

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
  TestVisit.find({}, function(err, visits) {
    res.json(visits);
  });
});

router.post("/getUnconfirmed", function(req, res){
    //unconfirmed shifts
    TestVisit.find({$or:[{status:'Unconfirmed'}]}).sort({date:1}).exec(function(err,visits){
      if(err){
        throw err;
      }
      res.json(visits);
    })
})

router.post("/getConfirmed", function(req, res){
  //confirmed shifts
  TestVisit.find({$and:[
            {status:'In process'}, {'date':{"$gte": new moment().startOf('day'), "$lt": new moment().endOf('day')}}
          ]}).sort({startTime:1}).exec(function(err,visits){
            if(err){
              throw err;
            }
            res.json(visits);
          });
})


router.post("/getAllShifts", function(req, res){
  //all shifts
  TestVisit.find({'date':{"$gte": new moment().startOf('day'), "$lt": new moment().endOf('day')}}).sort({clockInTime:1}).exec(function(err,visits){
    if(err){
      throw err;
    }
    
    res.json(visits);
  })
})

router.post("/getAllShiftsFiltered", function(req, res){
  //all shifts
  TestVisit.find({'date':{"$gte": new moment(req.body.date).tz('America/St_Johns').startOf('day'), "$lt": new moment(req.body.date).tz('America/St_Johns').endOf('day')}}).sort({clockInTime:1}).exec(function(err,visits){
    if(err){
      throw err;
    }
    
    res.json(visits);
  })
})



router.post("/updateVisit", function(req, res) {
  TestVisit.findOne({ _id: req.body._id }, function(err,visit){

    visit.clockInTime = req.body.clockInTime;
    visit.clockOutTime = req.body.clockOutTime;
    visit.caregiverName = req.body.caregiverName;
    visit.clientName = req.body.clientName;

    visit.status = req.body.status;
    visit.duration = 0;
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
            return 'No caregivers found';
          };

          carer.payingHours += parseFloat(visit.scheduledDuration);
          carer.billedVisits.push(visit);
          carer.visits.push(visit);

          //implement logic for change of staff for updating visit id
          visit.vid = client.phoneNumber+carer.employeeId

          carer.save();
          client.save();

          visit.save();
          res.json(visit);
        });
      });
    } else {
      visit.save();
      res.json(visit);
    }

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

router.post("/addVisit", function(req,res){
  var visit = req.body;

  Client.findOne({name:visit.clientName}, function(err,client){
    if (err){
      return err;
    }
    if(client == null){
      return 'no client found'
    }

    Caregiver.findOne({name:visit.caregiverName}, function(err,carer){

      var duration = (moment(visit.endTime).diff(visit.startTime,'hours',true));

      var cid = ''
      if(carer==null) {console.log(visit.caregiverName, 'is NULL');
        return    
      }
      else{
        cid = carer.employeeId
      }
      var vid = client.phoneNumber+cid
      TestVisit.findOne({ visitId:vid}, function(err,duplicatedVisit){
        if(duplicatedVisit !=null){
          vid = vid+'2'
        }
        TestVisit.create({
          visitId:vid,
          caregiverName: carer.name,
          clientName:client.name,
          date:new moment(),
          startTime: visit.startTime,
          endTime:visit.endTime,
          scheduledDuration:duration,
          replyNumberC:carer.phoneNumber,
          company:client.company
        }, function(err, newVisit){
          if (err) {
            throw err;
          }
          res.json(newVisit)
        });
      })
     
  
    })
  })
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


router.post("/fetchVisitLog", function(req,res){
  var period = moment().week()
  var extraPeriod = 0
  if(period % 2 == 0)
  {
    extraPeriod = period + 1
  }
  else
  {
    extraPeriod = period - 1
  }
  if (req.body['type'] == 'Clients'){
    TestVisit.find( {$and: [
        { clientName:req.body['name'] },
        { $or: [{payPeriod: period}, {payPeriod: extraPeriod}] }
      ]}).sort({date:1}).exec(function(err,visits){
        res.json(visits)
    })
  } else {
    TestVisit.find( {$and: [
      { caregiverName:req.body['name'] },
      { $or: [{payPeriod: period}, {payPeriod: extraPeriod}] }
    ]}).sort({date:1}).exec(function(err,visits){
      res.json(visits)
  })
  }
})
//todo
    //all shifts

    //Visit.find({'date':{"$gte": new moment().startOf('day'), "$lt": new moment().endOf('day')}}, function(err,visits){


        //unconfirmed shifts
        //Visit.find({status:'Unconfirmed'}, function(err,visits){



          // Visit.find({$and:[
          //   {$or:[{status:'Completed'},{status:'In process'}]}, {'date':{"$gte": new moment().startOf('day'), "$lt": new moment().endOf('day')}}
          // ]}, function(err,visits){
module.exports = router;
