
// set dependencies
var express = require('express');
var router = express.Router();

// Dependencies
var Article = require("../models/Article.js");
var Comment = require("../models/Comment.js");

var request = require("request");
var cheerio = require("cheerio");

// define routes
// Routes

// Simple index route
router.get("/", function(req, res) {

  //scrape data on page load
  request("http://www.echojs.com/", function(error, response, html) {
    // save shorthand
    var $ = cheerio.load(html);
    // grab data
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });

  getArticles();

});

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Create a new comment
router.post("/comment/create/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  var newComment = new Comment(req.body);

  // save to DB
  newComment.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      res.send(doc);
    }
  });
});

// Delete a comment
router.post("/comment/delete/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry

  // delete from DB
  newComment.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      res.send(doc);
    }
  });
});

// export router
module.exports = router;
