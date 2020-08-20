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
const moment = require('moment');

// express application
const app = express();
const port = 4000;
// const port = envPort || 4000; // for deployment

// root routes
const indexRouter = require('./routes/indexRoutes');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials')
}));

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// sessions - server configuration
app.use(session({
  // secret: sessionKey, 
  secret: 'somegibberishsecret',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

// flash
app.use(flash());

// global variable messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.isAuthenticated = req.session.user ? true : false;
  next();
});

// homepage(public), catalogue(public), contact us(public)
app.use('/', indexRouter);

// product details
app.use('/', productRouter);

// homepage(private), catalogue(private), contact us(private)
// cart, purchase history, purchase details, settings, billing
app.use('/', userRouter);

// login, register
app.use('/', authRouter);


app.use(express.static('public'));
app.listen(port, function() {
  console.log('App listening at port ' + port);
});