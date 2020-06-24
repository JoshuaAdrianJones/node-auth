const express = require("express");
const router = express.Router();
const passport = require("passport");
//User model
const User = require("../models/User");

//bcrypt password hash
const bcrypt = require("bcryptjs");
const { ensureAuthenticated } = require("../config/auth");
// Login Page
router.get("/login", (req, res) => res.render("login"));
// Register Page
router.get("/register", (req, res) => res.render("register"));

//Change password Page
router.get("/change-password", ensureAuthenticated, (req, res) =>
  res.render("change-password", {
    name: req.user.name,
    id: req.user._id,
  })
);

// Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({
      msg: "Please fill in all fields.",
    });
  }
  //check pw match
  if (password !== password2) {
    errors.push({
      msg: "Passwords do not match.",
    });
  }
  //check pass length
  if (password.length < 6) {
    errors.push({
      msg: "Password should be at least 6 characters.",
    });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // vallidation passed

    User.findOne({
      email: email,
    })
    .then((user) => {
      if (user) {
        errors.push({
          msg: "Email already registered",
        });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        //hash password

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hashed
            newUser.password = hash;

            //save user
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in."
                );
                res.redirect("login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login handle

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true,
  })(req, res, next);
});

//Logout handle

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out successfully.");
  res.redirect("/");
});

// Delete user handle

router.post("/delete", (req, res) => {
  let checkedValue = req.body["delete_check_box"];

  if (!checkedValue) {
    req.flash(
      "error_msg",
      "Please tick the checkbox to confirm you really want to delete your account."
    );
    res.redirect("/dashboard");
  } else {
    User.deleteOne(
      {
        _id: req.user._id,
      },
      function (err) {}
    );

    req.logout();
    req.flash(
      "success_msg",
      "You have successfully deleted your account, you will have to re-register to access again."
    );
    res.redirect("/");
  }
});

// Update / Change password Handle

router.post("/change-password", (req, res) => {
  const { currentPassword, newPassword, newPassword2 } = req.body;
  let errors = []; //init array to push to to msg handler
  console.log(currentPassword);
  console.log(newPassword);
  console.log(newPassword2);
  console.log(req.user._id); //just checking it is working
  console.log(req.user.password);

  if (!currentPassword || !newPassword || !newPassword2) {
    errors.push({
      msg: "Please fill in all fields.",
    });
  }
  //check pw match
  if (newPassword !== newPassword2) {
    errors.push({
      msg: "Please re-type your new password correctly.",
    });
  }
  //check pass length
  if (newPassword.length < 6) {
    errors.push({
      msg: "New password should be at least 6 characters.",
    });
  }

  if (errors.length > 0) {
    res.render("change-password", {
      name: req.user.name,
      id: req.user._id,
      errors,
    });
  } else {
    //if passing form checks...

    //check existing password is correct

    bcrypt.compare(currentPassword, req.user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        //hash new password

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            //set password to hashed
            let hashPass = hash;

            //update user
            User.findByIdAndUpdate(
              req.user.id,
              {
                password: hashPass,
              },
              function (err, docs) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Updated User : ", docs);
                }
              }
            );
          });
        });

        req.flash(
          "success_msg",
          "You have successfully changed your password."
        );
        res.redirect("/dashboard");
        return;
      } else {
        errors.push({
          msg: "Password incorrect.",
        });
        res.render("change-password", {
          name: req.user.name,
          id: req.user._id,
          errors,
        });
        return;
      }
    });
  }
});

module.exports = router;
