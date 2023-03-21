var MongoClient = require("mongodb").MongoClient;
const extractFrames = require("ffmpeg-extract-frames");

MongoClient.connect(
  "mongodb://127.0.0.1:27017/uxagent",
  function (err, client) {
    if (err) throw err;

    console.log("Connected to Database");
    var db = client.db("uxagent");
    db.collection("participants")
      .find()
      .toArray(async function (err, result) {
        if (err) throw err;

        // console.log(result);
        // res.send(JSON.stringify(result));
        for (var i = 0; i < result.length; i++) {
          // select
          if (result[i].property.participant !== 'agent') continue;
          // read log
          console.log(result[i].chapters);
          const log = require("./public" + result[i].chapters);
          let vc = log.chapters;
          // old for MUTA
          // var scroll_list = log.scrolls;
          // var start_time = scroll_list[0].time;
          // for (let i = 1; i < scroll_list.length; i++) {
          //   if (scroll_list[i].event === "pagestart") {
          //     vc.push((scroll_list[i].time - start_time) * 1000 + 1000);
          //   }
          // }
          // new for UXAgent
          // log.forEach((element) => {
          //   // time trans: from 1:00 to 60
          //   let start =
          //     parseInt(element.Start.split(":")[0]) * 60 +
          //     parseInt(element.Start.split(":")[1]);
          //   let end =
          //     parseInt(element.End.split(":")[0]) * 60 +
          //     parseInt(element.End.split(":")[1]);
          //   vc.push(start * 1000 + 1000);
          //   vc.push(end * 1000 + 1000);
          // });
          // console.log(vc);
          // extract frames
          var video = result[i].video;
          await extractFrames({
            input: "./public" + video,
            output:
              "./public/covers/" + result[i].property.name + "-c%i" + ".png",
            offsets: vc,
          });
          console.log("extracted " + result[i].property.name);
        }
        console.log("done");
        client.close();
      });
  }
);
