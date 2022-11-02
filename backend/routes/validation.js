var express = require("express");
var global = require("../common");
var router = express.Router();

/* validation */
router.post("/", function (req, res, next) {
  // get username & password from request body
    var MongoClient = require("mongodb").MongoClient;
    MongoClient.connect(global.mongoUrl, function (err, client) {
      if (err) throw err;
      try {
        var username = req.body.username;
        var password = req.body.password;
        var db = client.db("muva");
        db.collection("users").findOne({ username: username }, (err, user) => {
          if (user) {
            let result = {
              username: user,
              status: "success",
            };
            if (user.password == password) {
              res.send(JSON.stringify(result));
            } else {
              result.status = "wrong password";
              res.send(JSON.stringify(result));
            }
          } else {
            let result = {
              username: user,
              status: "user not found",
            };
            res.send(JSON.stringify(result));
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
});

module.exports = router;
