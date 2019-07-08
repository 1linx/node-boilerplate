require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');

var app = require('express')();
var port = process.env.PORT || 3000;


// set the view engine to ejs
app.set('view engine', 'ejs');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// contact page
app.get('/', function (req, res) {
    res.render('helloworld');
});

//static route for css, javascript, images
// app.use(express.static('./imgs'));
app.use('/static', express.static('./public'));

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});


app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});


// MySQL connection
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

connection.end();
