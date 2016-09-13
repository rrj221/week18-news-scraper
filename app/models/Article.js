//require mongoose
var mongoose = require('mongoose');

//create a Schema class with mongoose
var Schema = mongoose.Schema;

//create an Article schema with the Schema class
var ArticleSchema = new Schema({
	title: {
		type: String
	},
	href: {
		type: String
	},
	image: {
		type: String
	},
	blurb: {
		type: String
	},
	time: {
		type: String
	},
	timestamp: {
		type: Date,
		default: Date.now
	}, 
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;