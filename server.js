// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var methodOverride  = require('method-override');
// Require models
var Article = require("./models/Article.js");
var Comment = require("./models/Comment.js");
var request = require("request");
var cheerio = require("cheerio");


var application_controller = require('./controllers/application_controller.js');

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Make public a static dir
app.use(express.static("public"));

//set up handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// define controllers
app.use('/', application_controller);

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/allTheNews2");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});




// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
