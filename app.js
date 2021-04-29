var express = require("express");
var app = express();
var path = require("path");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  ); // s used in your requests

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  var options = {
    root: path.join(__dirname),
  };
  var fileName = "index.html";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent: ", fileName);
    }
  });
});
app.get("/select.html", function (req, res) {
  var options = {
    root: path.join(__dirname),
  };
  var fileName = "select.html";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent: ", fileName);
    }
  });
});
app.get("/game.html", function (req, res) {
  var options = {
    root: path.join(__dirname),
  };
  var fileName = "game.html";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent: ", fileName);
    }
  });
});
app.get("/game-over.html", function (req, res) {
  var options = {
    root: path.join(__dirname),
  };
  var fileName = "game-over.html";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent: ", fileName);
    }
  });
});
app.get("/won.html", function (req, res) {
  var options = {
    root: path.join(__dirname),
  };
  var fileName = "won.html";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent: ", fileName);
    }
  });
});
app.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on port: ${process.env.PORT}`);
});
