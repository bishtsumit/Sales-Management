const express = require("express");
const router = express.Router();
const r = require("rethinkdb");
const jwt = require("jsonwebtoken");
const key = require("../config/keys");
const passport = require("passport");
const date = require("date-and-time");
const multer = require("multer");
const fs = require("fs");

// ---------- Validation Imports -----------------//
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const SiteRequestDetails = require("../validation/SiteDetails");
const validateAdminClientRequest = require("../validation/updateClientRequest");
const IsEmpty = require("../validation/is-empty");
const GetCurrentDate = require("../common/commonfunction");
// ---------------------------------------------//

// --------------------- Mongoose Models -------------//
const User = require("../models/User");
const Device = require("../models/device");
const Clientrequests = require("../models/clientrequests");
const Websites = require("../models/websites");
// --------------------- Mongoose Models -------------//

const { exception } = require("console");
const { request } = require("http");

// ----------------------- users Apis -------------------------//

/// Register User OR signUp .. Post Request
/// Params -- name , email , phone , password , password2 -- all string
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log(errors);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "email already exists";
      return res.status(400).json();
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        type: 2,
      });

      newUser
        .save()
        .then((user) => res.json(user))
        .catch((err) => console.log(err));
    }
  });
});

// Login registered user .. Post Request.
/// Params -- email , password , device , date -- all string
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        errors.email = "user does not exist !";
        return res.status(404).json(errors);
      } else {
        if (user.password !== password) {
          errors.password = "password is incorrect";
          return res.status(400).json(errors);
        }
        // success block
        else {
          Device.findOne({
            device: IsEmpty(req.body.device) ? "Misc" : req.body.device,
            email: req.body.email,
            date: req.body.date,
          })
            .then((item) => {
              // if entry has not done

              console.log(item);

              if (!item) {
                const newDetail = new Device({
                  device: IsEmpty(req.body.device) ? "Misc" : req.body.device,
                  email: email,
                  date: req.body.date,
                });

                newDetail.save();

                console.log(user);

                const payload = {
                  _id: user._id,
                  email: email,
                  password: password,
                  type: user.type,
                  name: user.name,
                };

                jwt.sign(
                  payload,
                  key.secretKey,
                  { expiresIn: 3600 },
                  (err, token) => {
                    if (err) console.log(err);
                    else
                      res.status(200).json({
                        success: true,
                        token: "Bearer " + token,
                      });
                  }
                );
              } else {
                const payload = {
                  _id: user._id,
                  email: email,
                  password: password,
                  type: user.type,
                  name: user.name,
                };

                console.log("if device is found " + user._id);

                jwt.sign(
                  payload,
                  key.secretKey,
                  { expiresIn: 3600 },
                  (err, token) => {
                    if (err) console.log(err);
                    else
                      res.status(200).json({
                        success: true,
                        token: "Bearer " + token,
                      });
                  }
                );
              }
            })
            .catch((err) => console.log(err));
        }
      }
    })
    .catch((err) => console.log(err));
});

/// Get current user by inserting bearer token;
// only for api testing from postman
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      _id: req.user._id,
      email: req.user.email,
      type: req.user.type,
    });
  }
);

// client requsts website for buying .. type Post
/// Params -- clientname , siterequested , subscriptiontype , organizationname , address , mobile -- all string
router.post(
  "/requestsite",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = SiteRequestDetails(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const pattern = date.compile("MMM DD YYYY");

    const newClientRequest = new Clientrequests({
      clientname: req.body.clientname,
      siterequested: req.body.siterequested,
      subscriptiontype: req.body.subscriptiontype,
      paymentmode: "",
      organizationname: req.body.organizationname,
      address: req.body.address,
      mobile: req.body.mobile,
      status: 0, ///// status 0 - requested , -1 - deleted , 1 - sold to client.
      date: date.format(new Date(), pattern),
      customization: req.body.customization,
    });

    newClientRequest
      .save()
      .then((result) => res.status(200).json(result))
      .catch((err) => console.log(err));
  }
);

// ----------------------- users Apis -------------------------//

// ----------------------- admin Apis -------------------------//

// get all the list of requests made by clients for buying admin will authenticate all the requests from here
// params None
router.post(
  "/getresquestsites",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check if user login type is admin only
    if (req.user.type == 1) {
      Clientrequests.find({ status: 0 })
        .then((requests) => {
          return res.status(200).json({ message: requests });
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    } else {
      res.status(400).json({ message: "unauthorized" });
    }
  }
);

// updating client requests by confirming or deleting requests
router.post(
  "/updateClientRequestStatus",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAdminClientRequest(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (req.user.type == 1) {
      // check if details are updated only by admin
      const clientdetail = {
        clientname: req.body.clientname,
        siterequested: req.body.siterequested,
        subscriptiontype: req.body.subscriptiontype,
        paymentmode: req.body.paymentmode,
        organizationname: req.body.organizationname,
        address: req.body.address,
        mobile: req.body.mobile,
        status: req.body.status, ///// status 0 - requested , -1 - deleted , 1 - sold to client.
        remarks: req.body.remarks,
        contactperson: req.body.contactperson,
        epochtime: new Date().getTime(),
      };

      Clientrequests.findByIdAndUpdate(req.body._id, clientdetail)
        .then((result) => {
          return res.status(200).json(clientdetail);
        })
        .catch((err) => console.log(err));
    } else {
      res.status(400).json({ message: "unauthorized" });
    }
  }
);

// get all the list of requests made by clients for buying admin will authenticate all the requests from here
// params None
router.post(
  "/allrequests",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Clientrequests.find({ status: 0 })
      .then((requests) => {
        console.log(requests);
        return res.status(200).json(requests);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
);

// get all the requests of particular Id
// Type GET - param id
router.get(
  "/getRequestById/:_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Clientrequests.findById(req.params._id)
      .then((request) => {
        console.log(request);
        return res.status(200).json(request);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
);

// This Api is linked with /addWebsite API
// First this APi is called then /addWebsite will be called
// this website checks if website exists or not
// if user only wants to update website or its images
// these api will be called after one by one synchronous
// 1 is for checking website details or deleting old images
// 2 is for only upload new Files
router.post("/CheckWebsite", (req, res) => {
  const errors = {};

  if (req.body.sitename == "" || req.body.sitename == null) {
    errors.sitename = "Enter SiteName";
  } else if (req.body.sitename.length < 3 || req.body.sitename > 10) {
    errors.description =
      "Name should be greater than 3 characters and less than 10 characters";
  }

  if (req.body.description == "" || req.body.description == null) {
    errors.description = "Enter Description";
  } else if (req.body.description < 100) {
    errors.description = "Should be atleast 100 characters";
  }

  if (!IsEmpty(errors)) res.status(400).json(errors);
  else {
    Websites.findOne({ sitename: req.body.sitename })
      .then((site) => {
        // 1 - means check for insertion and in that case website should not exist.
        if (req.body.type == 1) {
          if (site) {
            errors.sitename = "Website already exists";
            return res.status(400).json(errors);
          } else {
            return res.status(200).json(req.body);
          }
        }
        // 2 , 3 -means for updation and in that website should exist
        else {
          if (!site) {
            errors.sitename = "Website does not exist";
            res.status(400).json(errors);
          } else {
            if (req.body.filecount > 0) {
              const files = site.files;
              console.log(files);
              let ctr = 0;
              for (var key in files) {
                if (fs.existsSync("uploads/" + files[key].filename)) {
                  fs.unlinkSync("uploads/" + files[key].filename, (err) => {
                    if (err) console.log(err);
                    else console.log("filed deleted");
                  });
                }
                ++ctr;
                if (ctr == files.length) {
                  return res.status(200).json(req.body);
                }
              }
            } else {
              return res.status(200).json(req.body);
            }
          }
        }
      })
      .catch((err) => console.log(err));
  }
});

// API is uploading files and updating or inserting website details
// this API is called after CheckWebsite
// method - POST recieve FormData .. file[] , sitename , description
router.post(
  "/addWebsite",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body);

    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads");
      },
      filename: function (req, file, cb) {
        // console.log("1");
        cb(null, Date.now() + "-" + file.originalname);
      },
    });

    var upload = multer({ storage: storage }).array("file");

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }

      const websiteDetails = new Websites({
        sitename: req.body.sitename,
        description: req.body.description,
        files: req.files,
      });

      websiteDetails
        .save()
        .then((result) => {
          return res.status(200).json(websiteDetails);
        })
        .catch((err) => console.log(err));
    });
  }
);

// updating website details //
router.post(
  "/updateWebsite",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads");
      },
      filename: function (req, file, cb) {
        // console.log("1");
        cb(null, Date.now() + "-" + file.originalname);
      },
    });

    var upload = multer({ storage: storage }).array("file");

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }

      var websiteDetails = {};
      // this check is used if user uploads new files then only files will be updated else old files
      // details will be used.

      if (req.files.length > 0)
        websiteDetails = {
          sitename: req.body.sitename,
          description: req.body.description,
          files: req.files,
        };
      else
        websiteDetails = {
          sitename: req.body.sitename,
          description: req.body.description,
        };

      //res.status(200).json(websiteDetails);

      console.log(req.body.sitename);

      Websites.findOneAndUpdate({ sitename: req.body.sitename }, websiteDetails)
        .then((result) => {
          return res.status(200).json(websiteDetails);
        })
        .catch((err) => console.log(err));
    });
  }
);

// Delete website Details
// Type - POST , PARAMS - sitename
router.post(
  "/deleteWebsite",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Websites.deleteOne({ sitename: req.body.sitename })
      .then((result) => {
        return res.status(200).json({});
      })
      .catch((err) => console.log(err));
  }
);

// get all websites list with images details
// Type - POST , params - none
router.post(
  "/GetAllSites",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Websites.find()
      .then((sites) => {
        console.log(sites);

        var fullUrl = req.protocol + "://" + req.get("host");

        sites["URL"] = fullUrl;

        res.status(200).json(sites);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
);

// ----------------------- admin Apis -------------------------//

// ----------------------- Admin Dashboard Apis -------------------------//

// Getting all dashboard Data DeviceCount , websites selling Details , website selling count , client details
// type POST - paramns none
router.post(
  "/GetDashboardData",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var date = GetCurrentDate();

    // getting today website device access count

    Websites.find({})
      .then((websites) => {
        const websiteAvg = websites.map((item) => {
          let container = {};

          let total =
            item.ratings.reduce(function (a, b) {
              return a + b["rate"];
            }, 0) / item.ratings.length;

          container["sitename"] = item.sitename;
          container["average"] =
            item.ratings.length == 0 ? 0 : total.toFixed(2);
          return container;
        });

        console.log(JSON.stringify(websiteAvg));

        Device.find({ date: date })
          .then((ArrDevice) => {
            let devicedetail = [];
            let mapdeviceToindex = {};
            let ctrdev = -1;

            //creating device count in the form which can be passed directly to d3.js donut function
            // in client side
            for (var key in ArrDevice) {
              if (mapdeviceToindex[ArrDevice[key].device] == undefined) {
                devicedetail.push({ label: ArrDevice[key].device, value: 1 });
                mapdeviceToindex[ArrDevice[key].device];

                ++ctrdev;
                mapdeviceToindex[ArrDevice[key].device] = ctrdev;
              } else {
                devicedetail[mapdeviceToindex[ArrDevice[key].device]].value =
                  devicedetail[mapdeviceToindex[ArrDevice[key].device]].value +
                  1;
              }
            }

            Clientrequests.find({ status: 1 })
              .sort({ epochtime: -1 })
              .then((ArrSite) => {
                let ArrSiteCount = [];
                let MapSiteToIndex = {};
                let ctrSite = -1;
                let ArrRecentSales = [];

                for (var keysite in ArrSite) {
                  if (ArrSite[keysite].siterequested !== undefined) {
                    if (
                      MapSiteToIndex[ArrSite[keysite].siterequested] ==
                      undefined
                    ) {
                      ArrSiteCount.push({
                        label: ArrSite[keysite].siterequested,
                        value: 1,
                      });
                      ++ctrSite;
                      MapSiteToIndex[ArrSite[keysite].siterequested] = ctrSite;
                    } else {
                      ArrSiteCount[
                        MapSiteToIndex[ArrSite[keysite].siterequested]
                      ].value =
                        ArrSiteCount[
                          MapSiteToIndex[ArrSite[keysite].siterequested]
                        ].value + 1;
                    }
                  }
                }

                // Get 5 websites with highest sales count
                ArrSiteCount = ArrSiteCount.sort(function (a, b) {
                  return b.value - a.value;
                }).slice(0, 5);
                // console.log(ArrSiteCount);

                /*  // Get recent most Sale for showing by which admin
                ArrRecentSales = ArrSite.sort(function (a, b) {
                  return b.epochtime - a.epochtime;
                }).slice(0, 10);

                console.log(JSON.stringify(ArrRecentSales)); */

                setTimeout(() => {
                  return res.status(200).json({
                    devicedetail: devicedetail,
                    ArrSite: ArrSite,
                    ArrSiteCount: ArrSiteCount,
                    ArrSiteRating: ArrRecentSales,
                    websiteAvg: websiteAvg,
                  });
                }, 3000);
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

// getting all the signed up users list for getting their follow up.
router.post(
  "/GetSignupUsers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var data = req.body;
    data.type = 2;

    console.log(data);

    user.find(data).then((user) => {
      res.status(200).send(user);
    });
  }
);

router.post(
  "/updateClientFollowup",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    userFollowup = {
      previousfollowupDate: req.body.previousfollowupDate,
      nextfollowupDate: req.body.nextfollowupDate,
      followUpstatus: req.body.followUpstatus,
      remarks: req.body.remarks,
    };

    console.log(userFollowup);

    User.findOneAndUpdate({ email: req.body.email }, userFollowup)
      .then((result) => {
        return res.status(200).json(userFollowup);
      })
      .catch((err) => console.log(err));
  }
);

router.post(
  "/updateClientRating",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    websiteRating = {
      text: req.body.text,
      rate: req.body.rating,
      email: req.body.email,
      name: req.body.name,
      date: GetCurrentDate(),
    };

    Websites.findOneAndUpdate(
      { _id: req.body.siteId, "ratings.email": req.body.email },
      {
        $set: {
          "ratings.$": websiteRating,
        },
      },
      { useFindAndModify: false }
    )
      .then((result) => {
        console.log(" Result Updated " + result);

        if (result == null) {
          Websites.findOneAndUpdate(
            { _id: req.body.siteId },
            {
              $push: {
                ratings: websiteRating,
              },
            },
            { useFindAndModify: false }
          )
            .then((result) => {
              console.log(" Result Updated " + result);

              return res.status(200).json(websiteRating);
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json(websiteRating);
            });
        } else {
          return res.status(200).json(websiteRating);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(websiteRating);
      });
  }
);

// ----------------------- Dashboard Apis -------------------------//

module.exports = router;
