// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Comment schema
var CommentSchema = new Schema({
  title: {
    type: String
  },
  article: {
    type: "String"
  }
});

// Create Comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

// Export
module.exports = Comment;
