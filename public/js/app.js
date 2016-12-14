
var articleNum = 0;

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
};

function deleteNote() {

  var thisId = $(this).attr("data-comment");
  console.log("Delete Id: " + thisId);

  $.ajax({
    method: "POST",
    url: "/comment/delete/" + thisId
  })
    // With that done
  .done(function(data) {
      console.log("After delete");
      console.log(data);
      $("#" + data).remove();

      $(".nextUp").on("click", loadNext);
      $(".btn-delete").on("click", deleteNote);
  })


};


// click hander to advance article
$(".nextUp").on("click", loadNext);

function loadNext() {
  // Empty the comments
  articleNum = articleNum + 1;
  console.log(articleNum);
  $(".comment-container").empty();
  $(".comment-container").html("<h2>Comments</h2>");
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
        '<p class="article-text">' + data.articles.articleObject[0].body + '</p><p><a href="' + data.articles.articleObject[0].link + '">Read More</a></p>' +
        '<input type="text" name="title" id="titleInput"><input type="hidden" name="article" id="articleInput" value="' + data.articles.articleObject[0]._id + 
        '"><button type="button" class="btn btn-primary addComment">Add Comment</button>' + 
        '</div></div>');

      for (i=0; i<data.comments.commentObject.length; i++) {
        var commentsDiv = document.createElement("div");
        $(commentsDiv).attr("class", "comment-content");
        $(commentsDiv).attr("id", data.comments.commentObject[i]._id);
        var commentString = '<h5 class="comment-title">' + data.comments.commentObject[i].title + '</h5>';
        var commentDelete = '<button type="button" class="btn-delete" data-comment="' + data.comments.commentObject[i]._id + '">X</button>';
        $(commentsDiv).append(commentString);
        $(commentsDiv).append(commentDelete);
        $(".comment-container").append(commentsDiv);
      }  

      
  }).done(function() {

  $(".nextUp").on("click", loadNext);
  $(".btn-delete").on("click", deleteNote);
  });

};



// When you click the add comment button
$(document).on("click", ".addComment", function() {

  articleId = $("#articleInput").val();

  $.ajax({
    method: "POST",
    url: "/comment/create/",
    data: {
      title: $("#titleInput").val(),
      article: $("#articleInput").val()
    }
  })
  .done(function(data) {
      console.log(data);
      var commentsDiv = document.createElement("div");
      $(commentsDiv).attr("class", "comment-content");
      $(commentsDiv).attr("id", data._id);
      var commentString = '<h5 class="comment-title">' + data.title + '</h5>';
      var commentDelete = '<button type="button" class="btn-delete" data-comment="' + data._id + '">X</button>';
      $(commentsDiv).append(commentString);
      $(commentsDiv).append(commentDelete);
      $(".comment-container").append(commentsDiv);
  })
  .done(function() {
  // Also, remove the values entered in the input and textarea for note entry
    $("#titleInput").val("");
    $("#articleInput").val("");

  });
});

$(".nextUp").on("click", loadNext);
$(".btn-delete").on("click", deleteNote);
