var express = require("express");
const { isObjectIdOrHexString } = require("mongoose");
var global = require("../common");
var router = express.Router();

router.post("/send", function (req, res, next) {
  // get data from request body
  const MongoClient = require("mongodb").MongoClient;
  MongoClient.connect(global.mongoUrl, function (err, client) {
    if (err) throw err;
    try {
      let db = client.db(global.collection);
      db.collection("chatlog").insertOne(req.body);
    } catch (error) {
      console.log(error);
    }
  });
});

router.get("/getAll", function (req, res, next) {
  // get data from request body
  const MongoClient = require("mongodb").MongoClient;
  MongoClient.connect(global.mongoUrl, function (err, client) {
    if (err) throw err;
    try {
      let db = client.db(global.collection);
      db.collection("chatlog")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          res.send(result);
        });
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = router;
