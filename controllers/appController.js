const express = require("express");
const passport = require("../config/passport");
const router = express.Router();
const db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");

router.get("/", (req, res) => {
    if (req.user) {
        res.render("calendar");
    }
    res.render("login");
});

router.get("/signup", (req, res) => {
    if (req.user) {
        res.render("calendar");
    }
    res.render("signup");
});

router.get("/calendar", isAuthenticated, (req, res) => {
    res.render("calendar");
});

router.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
});

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

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/api/user_data", (req, res) => {
    if (!req.user) {
        // The user is not logged in, send back an empty object
        res.json({});
    } else {
        // Otherwise send back the user's email and id
        // Sending back a password, even a hashed password, isn't a good idea
        res.json({
            email: req.user.email,
            id: req.user.id
        });
    }
});

module.exports = router;