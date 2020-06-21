const express = require('express');

const router = express.Router();

// Login Page
router.get('/login', (req,res)=> res.render('login'));
// Register Page
router.get('/register', (req,res)=> res.render('register'));


// Register Handle
router.post('/register', (req,res) => {

    const {name, email, password, password2 } = req.body;

    let errors = [];

    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields.'});
    }

    if(password !== password2){
        errors.push({msg:'Passwords do not match.'});
    }

    console.log(req.body);
    
});

//Dashboard page
//router.get('/dashboard', (req,res)=> res.render('dashboard'));



module.exports = router;