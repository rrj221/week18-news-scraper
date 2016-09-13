var scraperFunctions = {
	retrieveArticlesMongo: function (db, Article, callback) {
		// console.log(Article);
		console.log('function');

		Article.find().populate('comments').sort({timestamp: -1}).exec(function (err, docs) {
			if (err) {
				callback(err, null);
			} else {
				callback(null, docs);
			}
		});

		//this was how I did it with mongojs
		// db.articles.find().sort({timestamp: -1}).limit(5, function (err, docs) {
		// 	callback(docs);
		// })
	},
	checkIfInMongo: function (db, Article, Comment, articleObj, i, articles, callback) {
		Article.find({title: articleObj.title}, function (err, docs) {
			if (err) {
				callback(err, null)
			} else {
				if (docs.length === 0) {
					var newArticle = new Article(articleObj);

					newArticle.save(newArticle, function (err, docs) {
						if (err) {
							callback(err, null)
						} 
					})
				}
				
				//i should only do this check after the last article is saved
				//right now i'm not doing that
				if (i === articles.length -1) {
					scraperFunctions.retrieveArticlesMongo(db, Article, callback);
				}
			}


		});

		//ERROR//this is where it's poopin out now that i'm using mongoose
		// db.articles.find({title: articleObj.title}, function (err, docs) {
		// 	if (docs.length === 0) {
		// 		db.articles.insert(articleObj);
		// 	}

		// 	if (i === articles.length - 1) {
		// 		scraperFunctions.retrieveArticlesMongo(db, callback);
		// 	}
		// })
	},
	getArticles: function (request, cheerio, db, Article, Comment, callback) {
		request('http://www.reuters.com/', function (error, response, html) {
			if (error) {
				throw error;
			} 
			if (response.statusCode !== 200) {
				throw response.statusCode;
			}	
			var articles = []
			var $ = cheerio.load(html);

			var topNews = $('#hp-top-news-low');
			topStoriesObj = topNews.find('.story').each(function (i, element) {
				var title = $(element).find('.story-title').first().text().trim();
				var href = 'http://www.reuters.com' + $(element).find('a').first().attr('href');
				var image = $(element).find('img').eq(0).attr('org-src');
				var blurb = $(element).find('p').first().text().trim();
				var time = $(element).find('.timestamp').first().text().trim();
				var timestamp = Date.now();

				var article = {
					title: title,
					href: href,
					image: image,
					blurb: blurb,
					time: time
					// timestamp: timestamp
				}
				articles.push(article);
			});


			articles.forEach(function (article, i) {
				scraperFunctions.checkIfInMongo(db, Article, Comment, article, i, articles, callback);
			})
		});
	},
	comment: function (Article, Comment, reqBody, callback) {
		var commentObj = {
			name: reqBody.name,
			comment: reqBody.comment
		}
		var title = reqBody.title;
		var newComment = new Comment(commentObj);

		newComment.save(function (err, newComment) {
			if (err) {
				callback(err, null)
			} else {
				Article.findOneAndUpdate({title: title}, {$push: {'comments': newComment._id}}, {new: true}, function (err, article) {
					if (err) {
						callback(err, null)
					} else {
						callback(null, newComment)
					}
				})
			}
		})
	}
}


module.exports.scraperFunctions = scraperFunctions
