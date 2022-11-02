var express = require("express");
var global = require("../common");
var router = express.Router();

/* validation */
router.post("/", function (req, res, next) {
    // get username & password from request body
    const MongoClient = require("mongodb").MongoClient;
    MongoClient.connect(global.mongoUrl, function (err, client) {
      if (err) throw err;
      try {
        let website = req.body.website;
        let record = req.body.record;
        let mutarec = req.body.mutarec;
        let task = req.body.task;
        let username = req.body.username;
        let db = client.db("muva");
        let insertData = {
          username: username,
          website: website,
          record: JSON.parse(record),
          mutarec:JSON.parse(mutarec),
          task:task,
        };
        db.collection("records").insertOne(insertData);
      } catch (error) {
        console.log(error);
      }
    });
});

module.exports = router;
