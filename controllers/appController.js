const express = require("express");
const passport = require("../config/passport");
const router = express.Router();
const db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");

// GET login or calendar if logged in
router.get("/", (req, res) => {
  if (req.user) {
    res.render("calendar");
  }
  res.render("login");
});

// GET singup or calendar if logged in
router.get("/signup", (req, res) => {
  if (req.user) {
    res.render("calendar");
  }
  res.render("signup");
});

// GET calendar if logged in, render handle-bars pg
router.get("/calendar", isAuthenticated, (req, res) => {
  res.render("calendar", { goals: true });
});

// GET calendar if logged in, render handle-bars pg
router.get("/addgoal", isAuthenticated, (req, res) => {
  res.render("calendar", { add: true });
});

// POST method for user login
router.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
});

// POST to db User info
router.post("/api/signup", (req, res) => {
  db.User.create({
    email: req.body.email,
    password: req.body.password
  })
    .then(() => {
      res.redirect(307, "/api/login");
    })
    .catch(err => {
      res.status(401).json(err);
    });
});

// GET logout
router.post("/api/short-term-goal", (req, res) => {
  // db.User.create({
  //   email: req.body.email,
  //   password: req.body.password
  // })
  //   .then(() => {
  //     res.redirect(307, "/api/login");
  //   })
  //   .catch(err => {
  //     res.status(401).json(err);
  //   });
  res.json({}); // Network request piece
  console.log("Short-Term-Goal end point called");
  console.log(req);
  // console.log(JSON.stringify(req));
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/api/goals/:id", (req, res) => {
  if (!req.user) {
    res.json({});
  } else {
    db.Goals.findAll({
      where: {
        UserID: req.params.id
      }
    }).then(dbGoals => {
      res.json(dbGoals);
    });
  }
});

router.get("/api/user_data", (req, res) => {
  if (!req.user) {
    res.json({});
  } else {
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  }
});

// GET goals
router.get("/api/goals", (req, res) => {
  if (!req.user) {
    res.json({});
  } else {
    db.Goals.findAll({
      include: [db.User]
    }).then(dbGoals => {
      res.json(dbGoals);
    });
  }
});

// POST goals
router.post("/api/goals", isAuthenticated, (req, res) => {
  db.Goals.create(req.body).then(data => {
    res.json(data);
  });
});

// GET days completed
router.get("/api/days_completed", (req, res) => {
  if (!req.user) {
    res.json({});
  } else {
    db.Days.findAll({
      include: [db.Goals]
    }).then(dbDays => {
      res.json(dbDays);
    });
  }
});

// POST days completed
router.post("/api/days_completed", isAuthenticated, (req, res) => {
  db.Days.create(req.body).then(data => {
    res.json(data);
  });
});

module.exports = router;
