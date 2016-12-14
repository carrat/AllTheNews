
var articleNum = 1;

function getArticles() {
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      for (var i = 0; i < data.length; i++) {
        $("#articles").append('<div class="article-container" data-id=' + data[i]._id +  '><div class="article-content">' +
        '<h5 class="article-title">' + data[i].title + '</h5><button type="button" class="btn-secondary" data-id="1">Next Article</button>'+ 
        '<p class="article-text">' + data[i].body + '</p></div></div>');
      }
    }
  }); 
}


// click hander to advance article
$(".nextUp").on("click", loadNext);

function loadNext() {
  // Empty the comments
  articleNum = articleNum + 1;
  console.log(articleNum);
  $(".comment-container").empty();
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/next/" + articleNum
  })
    // With that done, add the note information to the page
  .done(function(data) {
      console.log(data);
      $("#articles").html('<div class="article-container" data-id=' + articleNum +  '><div class="article-content">' +
        '<h5 class="article-title">' + data.articles.articleObject[0].title + '</h5><button type="button" class="btn-secondary nextUp">Next Article</button>'+ 
        '<p class="article-text">' + data.articles.articleObject[0].body + '</p><a href="' + data.articles.articleObject[0].link + '">Read More</a></div></div>');

      for (i=0; i<data.comments.commentObject.length; i++) {
        var commentsDiv = document.createElement("div");
        $(commentsDiv).attr("class", "comment-content");
        var commentString = '<h5 class="comment-title">' + data.comments.commentObject[i].title + '</h5>';
        var commentDelete = '<button type="button" class="btn-delete" data-comment="' + data.comments.commentObject[i]._id + '">X</button>';
        $(commentsDiv).append(commentString);
        $(commentsDiv).append(commentDelete);
        $(".comment-container").append(commentsDiv);
      }  

      $(".nextUp").on("click", loadNext);
      $(".btn-delete").on("click", deleteNote);
  });

};

function deleteNote() {

  var thisId = $(this).attr("data-comment");

  $.ajax({
    method: "POST",
    url: "/comment/delete/" + thisId
  })
    // With that done
  .done(function(data) {
      $(".comment-container").empty();

      for (i=0; i<data.comments.commentObject.length; i++) {
        var commentsDiv = document.createElement("div");
        $(commentsDiv).attr("class", "comment-content");
        var commentString = '<h5 class="comment-title">' + data.comments.commentObject[i].title + '</h5>';
        var commentDelete = '<button type="button" class="btn-delete" data-comment="' + data.comments.commentObject[i]._id + '">X</button>';
        $(commentsDiv).append(commentString);
        $(commentsDiv).append(commentDelete);
        $(".comment-container").append(commentsDiv);
      }  

      $(".nextUp").on("click", loadNext);
      $(".btn-delete").on("click", deleteNote);
  })


}

/* When you click the savenote button
$(document).on("click", ".addComment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
  .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
  })
  
  $.ajax({
    method: "GET",
    url: "/notes/" + thisId
  })
  .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
  });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});*/
