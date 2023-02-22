var express = require("express");
var global = require("../common");
var router = express.Router();
/* validation */
router.post("/", function (req, res, next) {
  // get username & password from request body
  const MongoClient = require("mongodb").MongoClient;
  MongoClient.connect(global.mongoUrl, function (err, client) {
    try {
      if (err) throw err;
      let username = req.body.username;
      let password = req.body.password;
      let db = client.db(global.collection);
      let insertData = {
        username: username,
        password: password,
      };
      db.collection("users").findOne({ username: username }, (err, user) => {
        if (user) {
          let result = {
            username: user,
            status: "account already exists",
          };
          res.send(JSON.stringify(result));
        } else {
          let result = {
            username: user,
            status: "success",
          };
          db.collection("users").insertOne(insertData);
          res.send(JSON.stringify(result));
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = router;
