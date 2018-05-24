//routes/fetch.js

var express = require("express");
var router = express.Router();
var Client = require("./../models/client");
var Caregiver = require("./../models/caregiver");
var Visit = require("./../models/visit");
var moment = require('moment-timezone');
var TestVisit = require('./../models/testerVisit');

// Axios HTTP requests to fetch data from the database
router.post("/clients",  isLoggedIn,function(req, res) {
  Client.find({}).sort({name:1}).exec(function(err,clients){
    if(err){
      throw err;
    }
    res.json(clients);
  })
});

router.post("/staff",  isLoggedIn,function(req, res) {
  Caregiver.find({}).sort({name:1}).exec(function(err,staff){
    if(err){
      throw err;
    }
    res.json(staff);
  })
});

router.post("/visit",  isLoggedIn,function(req, res) {
  TestVisit.find({}, function(err, visits) {
    res.json(visits);
  });
});

router.post("/getUnconfirmed",  isLoggedIn,function(req, res){
    //unconfirmed shifts
    TestVisit.find({$or:[{status:'Unconfirmed'}]}).sort({date:1}).exec(function(err,visits){
      if(err){
        throw err;
      }
      res.json(visits);
    })
})

router.post("/getConfirmed", isLoggedIn, function(req, res){
  //confirmed shifts
  TestVisit.find({$and:[
            {status:'In process'}
          ]}).sort({clockInTime:1}).exec(function(err,visits){
            if(err){
              throw err;
            }
            res.json(visits);
          });
})

//, {'date':{"$gte": new moment().startOf('day'), "$lt": new moment().endOf('day')}}


router.post("/getAllShifts", isLoggedIn, function(req, res){
  console.log(req.isAuthenticated())
  //all shifts
  TestVisit.find({'date':{"$gte": new moment().startOf('day'), "$lt": new moment().endOf('day')}}).sort({clockInTime:1}).exec(function(err,visits){
    if(err){
      throw err;
    }
    
    res.json(visits);
  })
})

router.post("/getAllShiftsFiltered", isLoggedIn, function(req, res){
  //all shifts
  TestVisit.find({'date':{"$gte": new moment(req.body.date).tz('America/St_Johns').startOf('day'), "$lt": new moment(req.body.date).tz('America/St_Johns').endOf('day')}}).sort({clockInTime:1}).exec(function(err,visits){
    if(err){
      throw err;
    }
    
    res.json(visits);
  })
})



router.post("/updateVisit",  isLoggedIn,function(req, res) {
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

router.post("/addStaff",  isLoggedIn,function(req, res) {
  var caregiver = req.body;
  Caregiver.create(caregiver, function(err, staff) {
    if (err) {
      throw err;
    }
    res.json(staff);
  });
});

router.post("/addVisit",  isLoggedIn,function(req,res){
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

router.post("/addItem",  isLoggedIn,function(req, res) {
  var info = req.body;
  console.log(info);
  if (info.type == 'Client'){
    Client.create({
      name: req.body.item.name,
      id: req.body.item.id,
      billedHours: 0,
      billedVisits: [],
      visitsBy:[],
      phoneNumber:'1709'+req.body.item.phone,
      company:'Coombs'
    }, function(err, clients){
        if (err) {
          throw err;
        }
        res.json(clients);
    }) 
  } else if (info.type == 'Staff'){
    Caregiver.create({
      name: req.body.item.name,
      id: req.body.item.phone,
      employeeId: req.body.item.id,
      payingHours: 0,
      billedVisits: [],
      visits:[],
      phoneNumber:'1709'+req.body.item.phone,
      company:'Coombs'
    }, function(err, staff){
        if (err) {
          throw err;
        }
        res.json(staff);
    }) 
  }
});

router.post("/addClient", isLoggedIn, function(req, res) {
  var client = req.body;
  Client.create(client, function(err, clients) {
    if (err) {
      throw err;
    }
    res.json(clients);
  });
});


router.post("/fetchVisitLog", isLoggedIn, function(req,res){
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

router.post("/clockOut",  isLoggedIn,function(req, res) {

  TestVisit.find({$and: [ {'visitId': req.body.visit.visitId},{'date':{"$gte": new moment(req.body.time.date).tz('America/St_Johns').startOf('day'), "$lt": new moment(req.body.time.date).tz('America/St_Johns').endOf('day')}}]}).exec(function(err,visits){

    var timeInfo = req.body.time.time;
    var clockOutTime = moment(req.body.time.date).set('hour',moment(timeInfo).get('hour')).set('minute',moment(timeInfo).get('minute'))

    var visit = visits[0]
      visit.clockOutTime = clockOutTime;
      visit.duration = (moment(visit.clockOutTime).diff(moment(visit.clockInTime),'hours',true));
      visit.status = 'Completed';
  
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
            carer.save();
          };
          visit.save();
        });
      });

});
});

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/");
}

module.exports = router;

