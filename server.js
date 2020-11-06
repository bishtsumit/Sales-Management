const express = require("express");
const { MongoURI } = require("./config/keys");
const mongoose = require("mongoose");
const user = require("./api/user");
const r = require("rethinkdb");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const app = express();
const multer = require("multer");
const cors = require("cors");
const User = require("./models/User");
//  ------------- Mongo DB Scpoe ----------///

mongoose
  .connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Success MongoDb Connected");

    User.findOne({ email: "admin@gmail.com" }).then((admin) => {
      if (!admin) {
        const admin = new User({
          email: "admin@gmail.com",
          password: "admin@123",
          name: "admin",
          type: 1,
          phone: "1234567890",
        });

        admin
          .save()
          .then((res) => {
            console.log("admin detail saved");
          })
          .catch((err) => console.log("error in saving admin value : " + err));
      }
    });
  })
  .catch((err) => console.log("Error : " + err));

global.RethinkDBConnection = null;

// ------------------- Body Parser Middleware --------------//

app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(upload.array());

/// for cross origin ////
app.use(cors());

// ------------------- Body Parser Middleware --------------//

//  ------------- Rethink DB Scpoe ----------///

// passport middleware
app.use(passport.initialize());

require("./config/passport")(passport);

// -------------- API scope ---------------////

app.use("/api/user", user);

// -------------- API scope ---------------////

// server static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// -------------- PORT Scope ----------------//

/// Process.env.PORT for heouku server only.
//// else by default run on 5000
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("server running on " + port);
});

// -------------- PORT Scope ----------------//
