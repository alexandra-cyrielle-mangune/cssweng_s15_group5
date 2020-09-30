// imports
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const mongoose = require('./models/connection');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

// express application
const app = express();
const port = 4000;
// const port = envPort || 4000; // for deployment

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials')
}));

// sets handlebars as template
app.set('view engine', 'hbs');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// sessions - server configuration
app.use(session({
  // secret: sessionKey, 
  secret: 'somegibberishsecret',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false, maxAge: 1000 * 60 * 60 * 24 * 7}
}));

// global variable session
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// flash
app.use(flash());

// global variable messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.isAuthenticated = req.session.user ? true : false;
  next();
});

// routes
const userRouter = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRoutes');
const adminRouter = require('./routes/adminRoutes');
const authRouter = require('./routes/authRoutes');

app.use('/', userRouter);
app.use('/', cartRouter);
app.use('/', adminRouter);
app.use('/', authRouter);

app.use(express.static('public'));
app.listen(port, function() {
  console.log('App listening at port ' + port);
});