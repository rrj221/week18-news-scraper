exports.runRoutes = function (app, path, request, cheerio, db, Article, Comment, scraperFunctions) {
	app.get('/', function (req, res) {
		res.sendFile(path.join(__dirname, '/../public/index.html'));
	});

	app.get('/articles', function (req, res) {
		scraperFunctions.getArticles(request, cheerio, db, Article, Comment, function (err, articles) {
			if (err) {
				res.send(err);
			} else {
				console.log('submitting to client');
				res.send({
					articles: articles
				});
			}


		})
	});

	app.post('/comment', function (req, res) {  ///  /comment:title?????
		// console.log(req.body);
		scraperFunctions.comment(Article, Comment, req.body, function (err, newComment) {
			console.log('super')
			res.send(newComment)
		});
	});


}