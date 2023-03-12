var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var bodyParser = require("body-parser");
var socketio = require("socket.io");
var app = express();

// Create the http server
const server = require("http").createServer(app);

// Create the Socket IO server on
// the top of http server
const io = socketio(server, {
  cors: {
    origin: "http://localhost:8080",
    credentials: true,
  },
});

// socket.io
io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("chatmsg", (msg) => {
    let content = msg.content;
    let fromUser = msg.fromUser;
    let toUser = msg.toUser;
    let created_at = msg.created_at;
    let video_time = msg.video_time;
    console.log("video_time: " + video_time);
    const message = {
      content: content,
      fromUser: fromUser,
      toUser: toUser,
      created_at: created_at,
      video_time: video_time
    };
    // socket.emit("privatemessage", {msg:message});
    io.to(toUser).emit("private message", message);
  });

  socket.on("alert", (data) => {
    console.log("alert: " + data.name);
    io.to(data.to).emit("alert", data);
  });

  socket.on("join", (userID) => {
    socket.userID = userID;
    socket.join(userID);
  });
});

app.use(function (req, res, next) {
  res.io = io;
  next();
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var infosRouter = require("./routes/infos");
var truthRouter = require("./routes/truth");
var validationRouter = require("./routes/validation");
var registrationRouter = require("./routes/registration");
var exportReportRouter = require("./routes/exportReport");
var chatRouter = require("./routes/chat");
var recordRouter = require("./routes/record");

app.use(cors());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/infos", infosRouter);
app.use("/truth", truthRouter);
app.use("/validation", validationRouter);
app.use("/registration", registrationRouter);
app.use("/exportReport", exportReportRouter);
app.use("/chat", chatRouter);
app.use("/record", recordRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = { app: app, server: server, appio: io };
