function loadTwitterUserTimeLine(screenName, amountOfTweets, container) {
	var url = 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=' + screenName + '&count=' + amountOfTweets + '&callback=?';
	$.getJSON(url, function (data) {
		parseTwitterResultJson(data, container);
	});
}
function parseTwitterResultJson(data, container) {
	var tweet_text;
	var tweet_user;
	var tweet_created_at;
	var tweet_profile_image_url;
	var tweet_user_name;
	var tweet_user_screen_name;
	var tweet_day;
	var tweet_mounth;
	var tweet_year;

	var htmlContent = "";

	$.each(data, function (i, item) {
		tweet_day = item.created_at.split(/ +/)[2];
		tweet_mounth = item.created_at.split(/ +/)[1];
		tweet_year = item.created_at.split(/ +/)[5];
		tweet_created_at = tweet_day + " " + tweet_mounth + " " + tweet_year;

		tweet_text = item.text; //tweet text
		tweet_user = item.user; //tweet user
		
		//console.log(tweet_created_at);
		tweet_profile_image_url = tweet_user.profile_image_url; //user profile image
		tweet_user_name = tweet_user.name; //user name;
		tweet_user_screen_name = tweet_user.user_name; //user user_name;

		tweet_text = linkHyperlinks(tweet_text); // Replace hyperlinks with link
		tweet_text = linkHashtags(tweet_text); // Replace #xxxx with link
		tweet_text = linkChanneltags(tweet_text); // Replace @xxxx with link

		htmlContent += '<article><hgroup><h2>';
		htmlContent += tweet_created_at;
		htmlContent += '</h2></hgroup> <section>';
		htmlContent += '<p>' + tweet_text + '</p>';
		htmlContent += '</section></article>';
	});

	$("section#feed").html(htmlContent);
		
	setupTargetLinks();
}

function linkHyperlinks(text) {
	return text.replace(
		/http:\/\/([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*))/g,
		'<a href="http://$1" rel="external">http://$1</a>'
	);
}
function linkHashtags(text) {
	return text.replace(
		/#([a-zA-Z0-9]+)/g,
		'<a class="hashtag" href="http://twitter.com/#search?q=$1" rel="external">#$1</a>'
	);
}
function linkChanneltags(text) {
	return text.replace(
		/@([a-zA-Z0-9]+)/g,
		'<a class="channeltag" href="http://twitter.com/#!/$1" rel="external">@$1</a>'
	);
}
/* EXTERNAL LINKS IN BLANK WINDOW */
function setupTargetLinks(){
	$('a[rel="external"]').click(function(){
		window.open($(this).attr('href'));
		return false;
	});
}

$(document).ready(function(){

	$.ajax({
		cache: false
	});
	
	loadTwitterUserTimeLine('remybonnaffe', 10, '.twittersearch-result');
	
	setupTargetLinks();
});

$(function() {

	// Create the dropdown base
	$("<select />").appendTo("nav");

	// Create default option "Go to..."
	// $("<option />", {
	//    "selected": "selected",
	//    "value"   : "",
	//    "href"	 : "index.html",
	//    "text"    : "Home"
	// }).appendTo("nav select");

	// Populate dropdown with menu items
	$("nav a").each(function() {

		console.log($(this).parent().attr('class'));
		
		if ( $(this).parent().attr('class') === 'active' ) {
			console.log('true');
			var el = $(this);
			$("<option />", {
				"value"   : el.attr("href"),
				"text"    : el.attr("option")
			}).attr("selected", "selected").appendTo("nav select");
		} else {
			console.log('false');
			var el = $(this);
			$("<option />", {
				"value"   : el.attr("href"),
				"text"    : el.attr("option")
			}).appendTo("nav select");
		}

	});

	$("nav select").change(function() {
		window.location = $(this).find("option:selected").val();
	});
	
});