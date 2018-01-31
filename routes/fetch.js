//routes/fetch.js

var express = require("express");
var router = express.Router();
var Client = require("./../models/client");
var Caregiver = require("./../models/caregiver");
var Activity = require("./../models/recentActivity");

// Axios HTTP requests to fetch data from the database
router.post("/clients", function(req, res) {
  Client.find({}, function(err, users) {
    res.json(users);
  });
});

router.post("/staff", function(req, res) {
  Caregiver.find({}, function(err, users) {
    res.json(users);
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
module.exports = router;
