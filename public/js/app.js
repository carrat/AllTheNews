
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
        '<h5 class="article-title">' + data[i].title + '</h5><button type="button" class="btn-secondary">Next Article</button>'+ 
        '<p class="article-text">' + data[i].body + '</p></div></div>');
      }
    }
  }); 
}


// click hander to advance article
$(".article-container").on("click", function() {
  // Empty the comments
  $("#comments").empty();
  // get the id of the current article
  var thisId = $(this).attr("data-id");
  //get the id of the next article
  var nextId = thisId + 1;
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + nextId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
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
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
