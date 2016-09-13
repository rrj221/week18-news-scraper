$(document).ready(function () {

	var currentURL = window.location.origin;
	var articlesGlobal = [];
	var articleSelected = -1;

	$.get(currentURL+'/articles', function (data) {
		console.log(data);
		data.articles.forEach(function (article, i) {
			articlesGlobal.push(article);
		});
		console.log(articlesGlobal);

		articleSelected++
		displayOneArticle(articlesGlobal[articleSelected], articleSelected);
	});

	$('.previous').on('click', function () {
		navigate(-1);
	});

	$('.next').on('click', function () {
		navigate(1);
	});

	$('.comment').on('click', function () {
		var name = $('#name').val();
		var comment = $('.commentBox').val();
		var articleTitle = $('.title').text();
		
		var commentObj = {
			name: name,
			comment: comment,
			title: articleTitle
		}

		$.post(currentURL+'/comment', commentObj, function (comment) {
			console.log(comment)
			appendComment(comment);
		});

		clearCommentInput();

		return false;
	})

	function displayOneArticle(article, i)  {
			var articleDiv = $('<div>', {
				class: 'articleDiv'
			});
			var number = $('<div>', {
				class: 'number',
				text: i + 1
			});
			var title = $('<h5>', {
				class: 'title',
				text: article.title
			});
			var date = $('<div>', {
				class: 'date',
				text: article.time
			});
			var image = $('<img>', {
				class: 'image',
				src: article.image
			});
			var blurb = $('<div>', {
				class: 'article',
				text: article.blurb
			});
			var br = $('<br>');

			articleDiv.append(number, image, date, title, blurb, br);
			$('.articlesContainer').append(articleDiv);

			$('.comments').val('');
			displayComments(article.comments);
	};

	function navigate(direction) {  // -1 is previous and 1 is next
		if (articleSelected + direction < 0 || articleSelected + direction > 4) {
			return;
		}
		$('.articleDiv').empty();
		articleSelected += direction;
		displayOneArticle(articlesGlobal[articleSelected], articleSelected);
	};

	function displayComments(comments) {
		comments.forEach(function(comment, i) {
			appendComment(comment);
		});
	}

	function appendComment(comment) {
		commentsAlreadyDisplayed = $('.comments').val();
		$('.comments').val(comment.name+": "+comment.comment+'\n'+commentsAlreadyDisplayed);
	}

	function clearCommentInput() {
		$('#name').val(' ');
		$('.commentBox').val(' ');
	}





});