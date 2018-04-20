const express = require('express');
const router = express.Router();

// Bring in the mongoose
const mongoose = require('mongoose');

// Bring in BCRYPT
const bcrypt = require('bcryptjs');

// Bring in Passpodt
const passport = require('passport');

// Initializing the USERS schema
require('../models/User');
const User = mongoose.model('users');
// USERS ROUTES

// LOGIN ROUTE
router.get('/login', (req, res) => {
    res.render('users/login');
});
  
/// User Registration
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Hooking the register route
router.post('/register', (req, res) => {
  let errors = [];
  if(req.body.password != req.body.password2){
    errors.push({text:'Password Do not Match'});
  }
  if(req.body.password.length < 6){
    errors.push({text:'Password Length Should be greater than 6 Characters'});
  }
  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    User.findOne({email: req.body.email})
    .then(
      user => {
        if(user){
          req.flash('error_msg', 'Email already Exists');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
          });
      
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) =>{
              if(err) throw err;
              newUser.password = hash;
              // save the User
              newUser.save()
              .then(user => {
                req.flash('success_msg', 'Your are now registered and now can log in');
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
                return;
              }); 
            });
          });
        }
      });
  }
});

// Hoocking up the login form post
router.post('/login', (req, res, next)=> {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Your are Logged out');
  res.redirect('/users/login');
});

module.exports = router;
