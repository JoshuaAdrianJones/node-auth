const express = require('express');
const router = express.Router();

//User model
const User = require('../models/User');

//bcrypt password hash
const bcrypt = require('bcryptjs');

// Login Page
router.get('/login', (req, res) => res.render('login'));
// Register Page
router.get('/register', (req, res) => res.render('register'));


// Register Handle
router.post('/register', (req, res) => {

    const {
        name,
        email,
        password,
        password2
    } = req.body;

    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill in all fields.'
        });
    }
    //check pw match
    if (password !== password2) {
        errors.push({
            msg: 'Passwords do not match.'
        });
    }
    //check pass length
    if (password.length < 6) {
        errors.push({
            msg: "Password should be at least 6 characters."
        })
    }

    if (errors.length > 0) {

        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });

    } else {
        // vallidation passed

        User.findOne({
                email: email
            })

            .then(user => {
                if (user) {
                    errors.push({
                        msg: 'Email already registered'
                    });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });


                } else {

                    const newUser = new User({
                        name,
                        email,
                        password


                    });

                    //hash password

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        //set password to hashed
                        newUser.password = hash;

                        //save user
                        newUser.save()
                        .then(user => {
                        res.flash('success_msg', 'You are now registered and can log in.');
                        res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                        })
                    });

                }
            });


    }


});

//Dashboard page
//router.get('/dashboard', (req,res)=> res.render('dashboard'));



module.exports = router;