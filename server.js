//dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var request = require('request');
var cheerio = require('cheerio');
var logger = require('morgan');
var mongoose = require('mongoose');

var scraper = require(path.join(__dirname, '/app/data/scraper.js'));
var routes = require(path.join(__dirname, '/app/routing/routes.js'));



//set up express app
var app = express();
var PORT = process.env.PORT || 3000;


// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

//set up mongodb
// var databaseUrl = "scraper-hw";
// var collections = ["articles"];

// use mongojs to hook the database to the db variable 
// var db = mongojs(databaseUrl, collections);

// Database configuration with mongoose
mongoose.connect('mongodb://localhost/scraper-hw');
var db = mongoose.connection;

// mongoose error logging
db.on('error', function(err) {
  console.log('Database Error:', err);
});

db.once('open', function () {
	console.log('successfully connected to mongoose');
})

//bring in mongoose models
var Article = require(path.join(__dirname, '/app/models/Article.js'));
var Comment = require(path.join(__dirname, '/app/models/Comment.js'));

//set up express to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//set up static files
app.use('/static', express.static(path.join(__dirname, 'app/public')));

//DATA////////////////
var scraperFunctions = scraper.scraperFunctions;



//ROUTES///////////////

routes.runRoutes(app, path, request, cheerio, db, Article, Comment, scraperFunctions);


//LISTEN/////////////
app.listen(PORT, function () {
	console.log('App listening on PORT', PORT);
});








