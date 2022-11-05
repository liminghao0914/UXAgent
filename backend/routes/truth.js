var express = require("express");
var global = require("../common");
var router = express.Router();

/* GET users listing. */
router.get("/:id", function (req, res, next) {
    var MongoClient = require("mongodb").MongoClient;

    MongoClient.connect(global.mongoUrl, function (err, client) {
      if (err) throw err;
      var id = req.params.id;
      var db = client.db(global.collection);
      db.collection("groudtruth")
        .find({ id: id })
        .toArray(function (err, result) {
          if (err) throw err;

          console.log(result);
          res.send(JSON.stringify(result));
        });
    });
});

module.exports = router;
