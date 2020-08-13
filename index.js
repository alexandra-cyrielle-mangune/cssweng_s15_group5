// imports
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');

// express application
const app = express();
const port = 3000;

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials')
}));

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// homepage
app.get('/', function(req, res) {
  res.render('home', {title: "Lipay"});
});

app.use(express.static('public'));
app.listen(port, function() {
  console.log('App listening at port ' + port);
});