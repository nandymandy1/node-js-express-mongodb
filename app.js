////////////////// PACKAGES ////////////////////
const express = require('express');
// Bring the handle bars module
const exphbs  = require('express-handlebars');
// Bring in the mongoose
const mongoose = require('mongoose');
// To get the form data with the help of body parser
const bodyParser = require('body-parser');
// Initializing the Express server
const app = express();
// Flash Session
const flash = require('connect-flash');
// Express session
const session = require('express-session');
// Bring in the mthod-overider
const mOver = require('method-override');

////////////////// PACKAGES ////////////////////



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



////////////////// MODELS ////////////////////

////////////////// LOAD ROUTES  //////////////
// Load Ideas Routes
const ideas = require('./routes/ideas');

////////////////// LOAD ROUTES  //////////////


////////////////// MIDDLEWARES ////////////////////

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

/* How middleware works
app.use((req, res, next) => {
  next();
});
*/

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
////////////////// MIDDLEWARES ////////////////////



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

// LOGIN ROUTE
app.get('/user/login', (req, res) => {
  res.send('login');
});

/// User Registration
app.get('/user/register', (req, res) => {
  res.send('register');
});

// USE Routes
app.use('/ideas', ideas);


/////////////////  ROUTES     ////////////////////

/////////////////  PORT INITALIZATION     ////////////////////
// Defining the PORT
const port = 5000;
app.listen(port, () => {
  console.log(`Server Started on PORT ${port}`);
});
/////////////////  PORT INITALIZATION     ////////////////////
