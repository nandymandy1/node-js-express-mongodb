////////////////// PACKAGES ////////////////////
const express = require('express');
// Bring the handle bars module
const exphbs  = require('express-handlebars');
// Path modukle
const path = require('path');
// Bring in the mongoose
const mongoose = require('mongoose');
// To get the form data with the help of body parser
const bodyParser = require('body-parser');
// Bring In passport
const passport = require('passport');
// Initializing the Express server
const app = express();
// Flash Session
const flash = require('connect-flash');
// Express session
const session = require('express-session');
// Bring in the mthod-overider
const mOver = require('method-override');

////////////////// DATABASE CONNECTION ////////////////////

// MAP Global Promise get rid of the warnning
mongoose.Promise = global.Promise;

// Connecting to the mongoose databse
mongoose.connect('mongodb://127.0.0.1:27017/vidjot-dev', {
  //useMongoClient:true
})
// Promise in return
.then(() => {
  console.log('MONGODB Connected...');
}).catch(err => console.log(err));


////////////////// LOAD ROUTES  //////////////
// Load Ideas Routes
const ideas = require('./routes/ideas');

// Load User Authentication Routes
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

////////////////// MIDDLEWARES ////////////////////

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Method overider middleware
app.use(mOver('_method'));

// Express Session Middleware
app.use(session({
  secret: 'keyborad cat',
  resave: true,
  saveUninitialized: true
}));

// Flash Middleware
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})


/////////////////  ROUTES     ////////////////////
// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});



// USE Routes Registering IDEAS
app.use('/ideas', ideas);

// Registering Users Routes
app.use('/users', users);



/////////////////  PORT INITALIZATION     ////////////////////
// Defining the PORT
const port = 5000;
app.listen(port, () => {
  console.log(`Server Started on PORT ${port}`);
});
