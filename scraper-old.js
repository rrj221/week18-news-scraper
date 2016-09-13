var request = require('request');
var cheerio = require('cheerio');



function getTitles() {
	request('http://www.theonion.com/popular-news', function (error, response, html) {
		if (error) {
			throw error;
		} 
		if (response.statusCode !== 200) {
			throw response.statusCode;
		}	
		var articles = []
		var $ = cheerio.load(html);

		//i have to go to each link because the onion only loads the DOM for the other ones after you scroll
		//this is not very performance
		$('div.reading-list-item').each(function (i, element) {
			var link = 'http://'+$(this).data('absolute-url');
			request(link, function (error, response, html) {
				if (!error && response.statusCode === 200) {
					var $ = cheerio.load(html)

					var articleMeta = $('div.reading-list-item').first();
					var title = articleMeta.data('title');
					var article = articleMeta.find('p').first().text();
					var section = articleMeta.find('.content-type').first().text().slice(18).trim();
					var date = articleMeta.find('.content-published').first().text().trim();
					var image = articleMeta.find('img').first().attr('src');

					var article = {
						title: title,
						section: section,
						date: date,
						article: article, 
						image: image
					}

					articles.push(article);

					if (articles.length === 25) {
						articles.forEach(function (article, i) {
							articlePretty = JSON.stringify(article, null, 2);
							console.log(articlePretty);
						});
					}
				}
			})
		})
	});
}
getTitles();
