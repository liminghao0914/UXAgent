var express = require("express");
var global = require("../common");
var router = express.Router();

/* GET users listing. */
router.get("/:task", function (req, res, next) {
    var MongoClient = require("mongodb").MongoClient;

    MongoClient.connect(global.mongoUrl, function (err, client) {
      if (err) throw err;

      var task = req.params.task;
      var db = client.db("muva");
      console.log(task);
      if (task !== "list") {
        db.collection("participants")
          .find({ "property.name": { $regex: task } })
          .toArray(function (err, result) {
            if (err) throw err;

            console.log(result);
            res.send(JSON.stringify(result));
          });
      } else {
        db.collection("participants")
          .find()
          .toArray(function (err, result) {
            if (err) throw err;

            console.log(result);
            res.send(JSON.stringify(result));
          });
      }
    });
});

module.exports = router;
