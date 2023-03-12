var express = require("express");
var global = require("../common");
var router = express.Router();

router.post("/", function (req, res, next) {
  const MongoClient = require("mongodb").MongoClient;
  MongoClient.connect(global.mongoUrl, function (err, client) {
    try {
      if (err) throw err;
      let db = client.db(global.collection);
      db.collection("record").insertOne(req.body);
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = router;
