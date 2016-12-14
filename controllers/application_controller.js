
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
  request("http://www.nytimes.com/pages/technology/index.html?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Tech&WT.nav=page", function(error, response, html) {
    // save shorthand
    var $ = cheerio.load(html);
    // grab data
    $("div.story").each(function(i, element) {
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("h3").text();
      result.body = $(this).children("p").text();
      result.link = $(this).children("h3").children("a").attr("href");

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
          //console.log(doc);
        }
      });

    });
  });

    var art =  {articles: "None", comments: "None"};

  Article.find().limit(1).sort({_id:-1}) 
  .then(function(articleData){
    var articleArr = {articleObject: articleData};
    art.articles = articleArr;
  })
  .then(function(){
      Comment.find({}) 
      .then(function(commentData){
        var commentArr = {commentObject: commentData};
        art.comments = commentArr;
      })
      .then(function(){ 
        res.render('index', art);
      }) 
  }); 

});

router.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find().sort({_id:-1})
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

router.get("/next/:id", function(req, res) {

  newId = parseInt(req.params.id);
  var art =  {articles: [], comments: "None"};

  Article.find({}).skip(newId).limit(1).sort({_id:-1}) 
  .then(function(articleData){
    var articleArr = {articleObject: articleData};
    art.articles = articleArr;
    return articleArr;
  })
  .then(function(data){
      Comment.find({article: art.articles.articleObject[0]._id}) 
      .then(function(commentData){
        var commentArr = {commentObject: commentData};
        art.comments = commentArr;
        return art;
      })
      .then(function(){ 
        res.send(art);
      }) 
  }); 

});
// Create a new comment
router.post("/comment/create", function(req, res) {
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
