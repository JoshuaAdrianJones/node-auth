const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

//Welcome page
router.get("/", (req, res) => res.render("welcome", req.logout()));

//Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    name: req.user.name,
    email: req.user.email,
    date: req.user.date,
    id: req.user._id,
  })
);

module.exports = router;
