var express = require("express");
const { isObjectIdOrHexString } = require("mongoose");
const Sentiment = require("sentiment");
var global = require("../common");
var router = express.Router();

function getSentiment(text) {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(text);
  return result.score;
}

router.post("/send", function (req, res, next) {
  const MongoClient = require("mongodb").MongoClient;
  MongoClient.connect(global.mongoUrl, function (err, client) {
    if (err) throw err;
    try {
      let db = client.db(global.collection);
      db.collection("chatlog").insertOne(req.body);
      let sent = getSentiment(req.body.content);
      console.log("sentiment: " + sent);
    } catch (error) {
      console.log(error);
    }
  });
});

router.get("/getAll", function (req, res, next) {
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

  router.get("/allUser", function (req, res, next) {
    const MongoClient = require("mongodb").MongoClient;
    MongoClient.connect(global.mongoUrl, function (err, client) {
      if (err) throw err;
      try {
        let db = client.db(global.collection);
        db.collection("users")
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
});

module.exports = router;
