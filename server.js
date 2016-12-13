// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var morgan = require("morgan");
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

app.set('port', process.env.PORT || 3000);


// define controllers
app.use('/', application_controller);

// Database configuration with mongoose
//mongoose.connect("mongodb://localhost/allTheNewsC");


var databaseUri = "mongodb://heroku_6cqm81s4:bud1rrg6idluvk280v727g4epc@ds127998.mlab.com:27998/heroku_6cqm81s4";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);

} else {
  mongoose.connect(databaseUri);
}

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
app.listen(app.get('port'), function() {
  console.log("App running on port 3000!");
});
