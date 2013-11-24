'use strict';


// Declare app level module which depends on filters, and services
angular.module('LoLSummoners', [
  'ngRoute',
  'LoLSummoners.filters',
  'LoLSummoners.services',
  'LoLSummoners.directives',
  'LoLSummoners.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: 'ProfileCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);

$(function() {
	// Additional JS functions here
	window.fbAsyncInit = function() {
		FB.init({
			appId	: 643848432313317, // App ID
			status	: true,    // check login status
			cookie	: true,    // enable cookies to allow the
	                            // server to access the session
			xfbml	: true     // parse page for xfbml or html5
	                            // social plugins like login button below
	    });
	};

	// Load the SDK Asynchronously
	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/all.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));



	$('#fb-post').click(function() {
		FB.login(function(response) {
			if (response.authResponse && response.status == 'connected') {
				var token = response.authResponse.accessToken;
				FB.api(
					'https://graph.facebook.com/me/objects/lol-summoners:game',
					'post',
					{
						object: {
							"title":"Ezreal (4/6/12)",
							"url":"http://localhost:8000/app/index.html",
							"image":'http://www.team-ldlc.com/wp-content/uploads/2012/10/Ezreal_Square_0.png',
							"summoner_name":"Terenoth",
							"kills":"4",
							"deaths":"6",
							"assists":"12",
							"champion_name":"Ezreal",
							"map_name":"Howling Abyss"
						},
						privacy: {'value': 'SELF'},
						access_token: token
					},
					function(response) {
						if (!response) {
							alert('Error occurred.');
						} else if (response.error) {
							document.getElementById('fb-post').innerHTML = 'Error: ' + response.error.message;
						} else {
							document.getElementById('fb-post').innerHTML =
							'<a href=\"https://www.facebook.com/me/activity/' +
							response.id + '\">' +
							'Story created.  ID is ' +
							response.id + '</a>';
						}
					}
				);
			}
		});
	});
});
