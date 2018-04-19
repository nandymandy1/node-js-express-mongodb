const express = require('express');
const router = express.Router();
// Bring in the mongoose
const mongoose = require('mongoose');
// Ideas Page Route

// Loading Idea Schema to use in the app
require('../models/Idea');
const Idea = mongoose.model('ideas');



router.get('/', (req, res) => {
  // fetching the ideas from the database and show it o this page
  Idea.find({})
  .sort({date:'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    });
  })
});

// Add Idea Form
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
      res.render('ideas/edit', {
        idea: idea
      });
  });
});

// Add Idea in to the databse Logic
router.post('/', (req, res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({text:'Please Add a Title'})
  }
  if(!req.body.details){
    errors.push({text:'Please Add some Details'})
  }
  if(errors.length > 0){
    res.render('ideas/add',{
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    // Saving the data into the database
    const newUser = {
      title:req.body.title,
      details:req.body.details
    }
    new Idea(newUser).save()
    .then(idea => {
      req.flash('success_msg', 'Video Idea Added');
      res.redirect('/ideas');
    })
  }
});

// Edit Video Details Processs
router.put('/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      req.flash('success_msg', 'Video Idea Updated');
      res.redirect('/ideas');
    });
  });
});

// Delete Idea Request
router.delete('/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
  .then(()=>{
    req.flash('success_msg', 'Video Idea Deleted');
    res.redirect('/ideas');
  });
});


module.exports = router;
