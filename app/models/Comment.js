//require mongoose
var mongoose = require('mongoose');

//create a Schema class with mongoose
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	name: {
		type: String
	},
	comment: {
		type: String
	}
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;